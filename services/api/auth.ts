import { LoginReqSchema, LoginResSchema } from "@/schema/auth/login";
import { RegisterReqSchema, RegisterResSchema } from "@/schema/auth/register";
import axiosInstance from "@/services/axiosInstance";

import { ApiResponse } from "@/schema/common/api.type";
import { ForgotPasswordSchema } from "@/schema/auth/forgot-password";
import { ChangePasswordSchema } from "@/schema/auth/change-password";

const BASE_URL = "/users/auth";

export const authApi = {
  login: async (data: LoginReqSchema) => {
    const response = await axiosInstance.post<ApiResponse<LoginResSchema>>(
      `${BASE_URL}/login`,
      data,
    );
    return response.data;
  },

  register: async (data: RegisterReqSchema): Promise<void> => {
    await axiosInstance.post<ApiResponse<RegisterResSchema>>(
      `${BASE_URL}/register`,
      data,
    );
  },

  forgotPassword: async (data: ForgotPasswordSchema): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/forgot-password`, data);
  },

  changePassword: async (data: ChangePasswordSchema): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/change-password`, data);
  },

  refreshToken: async (): Promise<ApiResponse<LoginResSchema>> => {
    const res = await axiosInstance.post<ApiResponse<LoginResSchema>>(
      `${BASE_URL}/refresh-token`,
    );
    return res.data;
  },
};
