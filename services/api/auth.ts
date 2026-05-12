import axiosInstance from "@/services/axiosInstance";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
  AuthResponse,
  ApiResponse,
} from "@/features/auth/types";

const BASE_URL = "/users/auth";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>(
      `${BASE_URL}/login`,
      data
    );
    return res.data;
  },

  register: async (data: RegisterRequest) => {
    await axiosInstance.post<AuthResponse>(
      `${BASE_URL}/register`,
      data
    );
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/logout`);
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/forgot-password`, data);
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/verify-otp`, data);
  },

  resendOtp: async (email: string): Promise<void> => {
    await axiosInstance.post("/auth/resend-otp", { email });
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post("/auth/change-password", data);
  },

  me: async (): Promise<AuthResponse> => {
    const res = await axiosInstance.get<ApiResponse<AuthResponse>>("/auth/me");
    return res.data.result;
  },
};
