// Auth-related TypeScript types shared across the app

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "landlord" | "admin";
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Request payloads
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

// API responses
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
