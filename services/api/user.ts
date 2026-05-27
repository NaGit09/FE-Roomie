import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { UserProfile } from "@/schema/user/profile";

const BASE_URL = "/users";

export const userApi = {
  
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
  
};
