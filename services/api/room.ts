import { ApiResponse } from "@/schema/Api/api.type";
import axiosInstance from "../axiosInstance";
import { PostCardType, PostDetailType } from "@/schema/room/post";

export const get5Rooms = (): Promise<ApiResponse<PostCardType[]>> => {
  return axiosInstance.get("/rooms/posts/latest?limit=8");
};

export const getPostDetail = (post_id: number): Promise<ApiResponse<PostDetailType>> => {
  return axiosInstance.get(`/rooms/posts/${post_id}`);
};

