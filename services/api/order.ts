import axiosInstance from "@/services/axiosInstance";

import { ApiResponse } from "@/schema/common/api.type";
import { CreateOrderReq, Order } from "@/schema/user/order";

const BASE_URL = "/users/orders";

export const OrderApi = {
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

  create_payment_COD: async () => {},
  create_payment_PAYOS: async () => {},
  confirm_payment: async () => {},
  payos_webhook: async () => {},
  update_order: async () => {},
};
