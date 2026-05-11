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
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      `${BASE_URL}/login`,
      data
    );
    return res.data.result;
  },

  register: async (data: RegisterRequest) => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      `${BASE_URL}/register`,
      data
    );
    return res.data.result;
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

  me: async (): Promise<AuthResponse> => {
    const res = await axiosInstance.get<ApiResponse<AuthResponse>>("/auth/me");
    return res.data.result;
  },
};
