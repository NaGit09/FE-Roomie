import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";

export interface FeedbackResponse {
  id: number;
  post_id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export const FeedbackApi = {
  getPostFeedbacks: async (post_id: number) => {
    const res = await axiosInstance.get<ApiResponse<FeedbackResponse[]>>(`/feedback/post/${post_id}`);
    return res.data;
  },
};
