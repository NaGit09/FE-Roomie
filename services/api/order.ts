import axiosInstance from "@/services/axiosInstance";

import { ApiResponse } from "@/schema/common/api.type";
import { CreateOrderReq, Order } from "@/schema/user/order";
import { CreatePayment, PaymentRes } from "@/schema/user/payment";

const BASE_URL = "/users/orders";

export const OrderApi = {
  
  get_my_order: async (user_id: string | number) => {
    const response = await axiosInstance.get(`/users/${user_id}/orders`);
    return response.data;
  },
  
  get_all_order: async () => {
    const response = await axiosInstance.get<ApiResponse<Order[]>>(
      `${BASE_URL}`,
    );
    return response.data;
  },

  create_order: async (createReq: CreateOrderReq) => {
    const response = await axiosInstance.post<ApiResponse<Order[]>>(
      `${BASE_URL}`,
      createReq,
    );
    return response.data;
  },

  create_payment: async (targetOrderId: string | number, payment: CreatePayment) => {
    const response = await axiosInstance.post<ApiResponse<PaymentRes>>(
      `${BASE_URL}/${targetOrderId}/payment`,
      payment,
    );
    return response.data;
  },

  confirm_payment: async (targetOrderId: string | number) => {
    const response = await axiosInstance.post<ApiResponse<PaymentRes>>(
      `${BASE_URL}/payment/confirm/${targetOrderId}`,
    );
    return response.data;
  },

  // For admin
  payos_webhook: async () => {},

  update_order: async (targetOrderId: string | number, status: string) => {
    const response = await axiosInstance.patch<ApiResponse<Order>>(
      `${BASE_URL}/${targetOrderId}/payment`,
      { status },
    );
    return response.data;
  },
};
