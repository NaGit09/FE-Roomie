import axiosInstance from "@/services/axiosInstance";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ChangePasswordRequest,
  AuthResponse,
} from "@/features/auth/types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post<AuthResponse>("/auth/register", data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post("/auth/forgot-password", data);
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<void> => {
    await axiosInstance.post("/auth/verify-otp", data);
  },

  resendOtp: async (email: string): Promise<void> => {
    await axiosInstance.post("/auth/resend-otp", { email });
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post("/auth/change-password", data);
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const res = await axiosInstance.get<AuthResponse["user"]>("/auth/me");
    return res.data;
  },
};
