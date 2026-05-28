import { LoginReqSchema, LoginResSchema } from "@/schema/auth/login";
import { RegisterReqSchema } from "@/schema/auth/register";
import axiosInstance from "@/services/axiosInstance";

import { ApiResponse } from "@/schema/common/api.type";
import { ForgotPasswordSchema } from "@/schema/auth/forgot-password";
import { ChangePasswordSchema } from "@/schema/auth/change-password";

const BASE_URL = "/auth";

export const AuthApi = {
  
  login: async (data: LoginReqSchema) => {
    const response = await axiosInstance.post<ApiResponse<LoginResSchema>>(
      `${BASE_URL}/login`,
      data,
    );
    return response.data;
  },

  register: async (data: RegisterReqSchema) => {
    await axiosInstance.post<ApiResponse<boolean>>(
      `${BASE_URL}/register`,
      data,
    );
  },

  register_landlord: async (data: RegisterReqSchema) => {
    await axiosInstance.post<ApiResponse<boolean>>(
      `${BASE_URL}/register/landlord`,
      data,
    );
  },

  forgotPassword: async (data: ForgotPasswordSchema) => {
    await axiosInstance.post(`${BASE_URL}/forgot-password`, data);
  },

  changePassword: async (data: ChangePasswordSchema) => {
    await axiosInstance.post(`${BASE_URL}/change-password`, data);
  },

  refreshToken: async () => {
    const res = await axiosInstance.post<ApiResponse<LoginResSchema>>(
      `${BASE_URL}/refresh`,
    );
    return res.data;
  },

  logout: async () => {
    await axiosInstance.post(`${BASE_URL}/logout`);
  },
};
