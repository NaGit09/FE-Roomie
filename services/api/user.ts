import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { UserProfile } from "@/schema/user/profile";

const BASE_URL = "/users";

export const UserApi = {
  
  getMe: async () => {
    const response = await axiosInstance.get<ApiResponse<UserProfile>>(
      `${BASE_URL}/me`,
    );
    return response.data;
  },

  updateMe: async (full_name: string) => {
    const response = await axiosInstance.put<ApiResponse<UserProfile>>(
      `${BASE_URL}/me`,
      { full_name },
    );
    return response.data;
  },

  getAllUsers: async (params?: { skip?: number; limit?: number; status?: string; role?: string }) => {
    const response = await axiosInstance.get<ApiResponse<{ items: UserProfile[]; total: number; page: number; size: number; total_pages: number }>>(
      `${BASE_URL}`,
      { params }
    );
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string) => {
    const response = await axiosInstance.put<ApiResponse<UserProfile>>(
      `${BASE_URL}/${userId}/status`,
      { status }
    );
    return response.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await axiosInstance.put<ApiResponse<UserProfile>>(
      `${BASE_URL}/${userId}/role`,
      { role }
    );
    return response.data;
  },
  
};
