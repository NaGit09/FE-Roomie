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

export const defaultPlans: Subscription[] = [
  {
    id: 1,
    sub_title: "Gói Bạc (Silver)",
    sub_description: "Phù hợp để trải nghiệm tìm roommate cơ bản với bộ lọc cơ học thông thường.",
    sub_price: 49000,
    sub_time: "1 Tháng",
    sub_type: "SILVER",
    sub_exception: "Tối đa 50 lượt vuốt ghép đôi mỗi tháng, lọc theo quận/huyện cơ bản.",
  },
  {
    id: 2,
    sub_title: "Gói Vàng (Gold)",
    sub_description: "Mở khóa thuật toán AI so khớp phong cách sống nâng cao và kết nối trực tiếp không rào cản.",
    sub_price: 99000,
    sub_time: "1 Tháng",
    sub_type: "GOLD",
    sub_exception: "Không giới hạn lượt vuốt, AI so khớp chuyên sâu, huy hiệu vàng nổi bật, hỗ trợ chat bảo mật.",
  },
  {
    id: 3,
    sub_title: "Gói Kim Cương (Diamond)",
    sub_description: "Đặc quyền tối thượng cho người tìm kiếm roommate nghiêm túc nhất. Tiết kiệm lên tới 33%.",
    sub_price: 199000,
    sub_time: "3 Tháng",
    sub_type: "DIAMOND",
    sub_exception: "Mọi quyền lợi của Gói Vàng trong 3 tháng, ưu tiên hiển thị hồ sơ đầu tiên, tư vấn viên hỗ trợ 1-1.",
  },
];

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isSubscribed: false,
      activeSubscription: null,
      checkoutPlan: null,
      transactionHistory: [],
      hasDismissedPopup: false,
      plans: defaultPlans,

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
          planId: checkoutPlan.id,
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
          if (response && response.code === 200 && Array.isArray(response.data) && response.data.length > 0) {
            set({ plans: response.data });
          }
        } catch (err) {
          console.warn("Failed to fetch renter subscriptions from API, using default mock plans:", err);
        }
      },
    }),
    {
      name: "roomie-subscription",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
