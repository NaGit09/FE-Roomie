import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";

export interface FeedbackResponse {
  feedback_id: number;
  post_id: number;
  user_id: string;
  content: string;
  images?: string[];
  created_at: string;
  reply?: string | null;
  replied_at?: string | null;
  ratings?: Array<{
    id: number;
    rating_type: string;
    rating_value: number;
  }>;
}

export const FeedbackApi = {
  getPostFeedbacks: async (post_id: number) => {
    const res = await axiosInstance.get<ApiResponse<FeedbackResponse[]>>(`/feedback/post/${post_id}`);
    return res.data;
  },
  replyToFeedback: async (feedback_id: number, reply: string) => {
    const res = await axiosInstance.post<ApiResponse<any>>(`/feedback/${feedback_id}/reply`, { reply });
    return res.data;
  },
  createFeedback: async (payload: {
    post_id: number;
    content: string;
    image_urls: string[];
    ratings: Array<{ rating_type: string; rating_value: number }>;
  }) => {
    const res = await axiosInstance.post<ApiResponse<any>>(`/feedback`, payload);
    return res.data;
  },
};

