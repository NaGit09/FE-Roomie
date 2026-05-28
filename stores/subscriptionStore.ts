import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Subscription } from "@/schema/user/subcription";
import { SubscriptionApi } from "@/services/api/subcription";

export interface Transaction {
  id: string;
  planId: number;
  planTitle: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
}

interface SubscriptionState {
  isSubscribed: boolean;
  activeSubscription: {
    plan: Subscription;
    startDate: string;
    endDate: string;
  } | null;
  checkoutPlan: Subscription | null;
  transactionHistory: Transaction[];
  hasDismissedPopup: boolean;
  plans: Subscription[];

  setCheckoutPlan: (plan: Subscription | null) => void;
  setDismissedPopup: (dismissed: boolean) => void;
  completeCheckout: (paymentMethod: string) => void;
  cancelSubscription: () => void;
  fetchPlans: () => Promise<void>;
}

export const defaultPlans: Subscription[] = [];

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isSubscribed: false,
      activeSubscription: null,
      checkoutPlan: null,
      transactionHistory: [],
      hasDismissedPopup: false,
      plans: [],

      setCheckoutPlan: (plan) => set({ checkoutPlan: plan }),
      
      setDismissedPopup: (hasDismissedPopup) => set({ hasDismissedPopup }),

      completeCheckout: (paymentMethod) => {
        const { checkoutPlan } = get();
        if (!checkoutPlan) return;

        const now = new Date();
        const endDate = new Date();
        if (checkoutPlan.sub_type === "DIAMOND") {
          endDate.setMonth(now.getMonth() + 3);
        } else {
          endDate.setMonth(now.getMonth() + 1);
        }

        const newTransaction: Transaction = {
          id: `RM-${Math.floor(100000 + Math.random() * 900000)}`,
          planId: checkoutPlan.id ?? 0,
          planTitle: checkoutPlan.sub_title,
          amount: checkoutPlan.sub_price,
          paymentMethod,
          createdAt: now.toISOString(),
          status: "SUCCESS",
        };

        set((state) => ({
          isSubscribed: true,
          activeSubscription: {
            plan: checkoutPlan,
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
          },
          checkoutPlan: null,
          transactionHistory: [newTransaction, ...state.transactionHistory],
        }));
      },

      cancelSubscription: () => {
        set({
          isSubscribed: false,
          activeSubscription: null,
        });
      },

      fetchPlans: async () => {
        try {
          const response = await SubscriptionApi.get_all_renter_subscriptions();
          if (response && response.code === 200 && Array.isArray(response.data)) {
            set({ plans: response.data });
          }
        } catch (err) {
          console.warn("Failed to fetch renter subscriptions from API:", err);
        }
      },
    }),
    {
      name: "roomie-subscription",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
