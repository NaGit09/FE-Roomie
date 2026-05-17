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
  fullname : String
  email: string;
  password: string;
  role : String
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
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
