import { LoginReqSchema, LoginResSchema } from "@/schema/auth/login";
import { RegisterReqSchema, RegisterResSchema } from "@/schema/auth/register";
import axiosInstance from "@/services/axiosInstance";
import type {
  ForgotPasswordRequest,
  ChangePasswordRequest,
} from "@/features/auth/types";


const BASE_URL = "/users/auth";

export const authApi = {
  login: async (data: LoginReqSchema): Promise<LoginResSchema> => {
    const res = await axiosInstance.post<LoginResSchema>(
      `${BASE_URL}/login`,
      data
    );
    return res.data;
  },

  register: async (data: RegisterReqSchema): Promise<void> => {
    await axiosInstance.post<RegisterResSchema>(
      `${BASE_URL}/register`,
      data
    );
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/forgot-password`, data);
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/change-password`, data);
  },
};

