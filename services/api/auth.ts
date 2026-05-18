import { LoginReqSchema, LoginResSchema } from "@/schema/auth/login";
import { RegisterReqSchema, RegisterResSchema } from "@/schema/auth/register";
import axiosInstance from "@/services/axiosInstance";
import type {
  ForgotPasswordRequest,
  ChangePasswordRequest,
  ApiResponse,
} from "@/features/auth/types";

const BASE_URL = "/users/auth";

export const authApi = {
  login: async (data: LoginReqSchema): Promise<LoginResSchema> => {
    const response = await axiosInstance.post(`${BASE_URL}/login`, data);
    return response.data as unknown as LoginResSchema;
  },

  register: async (data: RegisterReqSchema): Promise<void> => {
    await axiosInstance.post<RegisterResSchema>(`${BASE_URL}/register`, data);
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/forgot-password`, data);
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/change-password`, data);
  },

  refreshToken: async (): Promise<ApiResponse<LoginResSchema>> => {
    const res = await axiosInstance.post<ApiResponse<LoginResSchema>>(
      `${BASE_URL}/refresh-token`,
    );
    return res.data;
  },

};
