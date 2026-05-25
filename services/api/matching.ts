import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { UserPreference } from "@/schema/matching/UserPreference";
import { UserMatching } from "@/schema/matching/UserMatching";

const BASE_URL = "/roommates";

export const MatchingApi = {
  getPreferenceProfile: async () => {
    const response = await axiosInstance.get<ApiResponse<UserPreference>>(
      `${BASE_URL}/me`,
    );
    return response.data;
  },

  getMatches: async () => {
    const response = await axiosInstance.get<ApiResponse<UserMatching[]>>(
      `${BASE_URL}/match`,
    );
    return response.data;
  },

  getMatchDetails: async (matchId: string) => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      `${BASE_URL}/match-details/${matchId}`,
    );
    return response.data;
  },

  create_preference: async (data: UserPreference) => {
    const response = await axiosInstance.post<ApiResponse<UserPreference>>(
      `${BASE_URL}/create`,
      data,
    );
    return response.data;
  },

  update_preference: async (data: UserPreference) => {
    const response = await axiosInstance.put<ApiResponse<UserPreference>>(
      `${BASE_URL}/update`,
      data,
    );
    return response.data;
  },
};
