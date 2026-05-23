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
  
  check_subscription: async () => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      `${BASE_URL}/check`,
    );
    return response.data;
  }
};
