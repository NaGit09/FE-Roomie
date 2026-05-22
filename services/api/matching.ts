import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";

const BASE_URL = "/roommates";

export const matchingApi = {
  getMatches: async () => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      `${BASE_URL}/me`,
    );
    return response.data;
  },

  getMatchDetails: async (matchId: string) => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      `${BASE_URL}/match-details/${matchId}`,
    );
    return response.data;
  },
};
