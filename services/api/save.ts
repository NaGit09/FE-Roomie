import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { SavePost } from "@/schema/user/SavePost";

const BASE_URL = "/users";

export const SaveApi = {

  savePost: async (post_id: string) => {
    const response = await axiosInstance.post(`${BASE_URL}/saved-posts`, {
      post_id,
    });
    return response.data;
  },

  unSavePost: async (id: string) => {
    const response = await axiosInstance.delete(
      `${BASE_URL}/saved-posts/${id}`
    );
    return response.data;
  },

  getListSavePost: async (): Promise<ApiResponse<SavePost[]>> => {
    const response = await axiosInstance.get(`${BASE_URL}/saved-posts`);
    return response.data;
  },
  
};