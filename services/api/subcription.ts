import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import {
  Subscription,
  SubscriptionDetail,
  UpgradeSubscription,
} from "@/schema/user/subcription";

const BASE_URL = "/subscription";

export const SubscriptionApi = {
  
  check_subscription: async () => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      `${BASE_URL}/check`,
    );
    return response.data;
  },

  // For customer , landlord register new subscription
  subscribe: async (sub_id: number) => {
    const response = await axiosInstance.post(`${BASE_URL}/user/subscribe`, {
      sub_id,
    });
    return response.data;
  },
  
  upgrade_subscription: async () => {
    const response = await axiosInstance.get<ApiResponse<UpgradeSubscription>>(
      `${BASE_URL}/user/upgrade/check`,
    );
    return response.data;
  },
  
  // For customer , landlord cancel subscription
  cancel_subscription: async (user_subscription_id: number) => {
    const response = await axiosInstance.put(`${BASE_URL}/user/cancel/${user_subscription_id}`);
    return response.data;
  },

  // For customer , landlord get all subscription have been subscribed
  get_user_subscription: async () => {
    const response = await axiosInstance.get<ApiResponse<SubscriptionDetail[]>>(
      `${BASE_URL}/user/all`,
    );
    return response.data;
  },

  // For customer , landlord get subcription package that they can subscribe
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
  },

  // For admin
  get_all_subscription: async () => {
    const response = await axiosInstance.get<ApiResponse<Subscription[]>>(
      `${BASE_URL}/all`,
    );
    return response.data;
  },

  create_subscription: async (subscription: Subscription) => {
    const response = await axiosInstance.post<ApiResponse<Subscription>>(
      `${BASE_URL}/create`,
      subscription,
    );
    return response.data;
  },

  update_subscription: async (
    subscription: Subscription,
    subscription_id: number,
  ) => {
    const response = await axiosInstance.put<ApiResponse<Subscription>>(
      `${BASE_URL}/update/${subscription_id}`,
      subscription,
    );
    return response.data;
  },

  delete_subscription: async (subscription_id: number) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `${BASE_URL}/delete/${subscription_id}`,
    );
    return response.data;
  },
};