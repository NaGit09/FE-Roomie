import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { Subscription } from "@/schema/user/subcription";

const BASE_URL = "/subscription";

export const SubscriptionApi = {
  get_all_subscription: async () => {
    const response = await axiosInstance.get<ApiResponse<Subscription[]>>(
      `${BASE_URL}/all`,
    );
    return response.data;
  },
  
  get_all_renter_subscriptions: async () => {
    const response = await axiosInstance.get<ApiResponse<Subscription[]>>(
      `${BASE_URL}/all_renter`,
    );
    return response.data;
  },
    get_all_landlord_subscriptions: async () => {
    const response = await axiosInstance.get<ApiResponse<Subscription[]>>(
      `${BASE_URL}/all_landlord`,
    );
    return response.data;
  }
};
