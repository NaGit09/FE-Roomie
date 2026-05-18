import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import {
  GetPostsQueryType,
  PostCardType,
  PostDetailType,
  RoomPaginationType,
} from "@/schema/room/post";

export const get5Rooms = (): Promise<ApiResponse<PostCardType[]>> => {
  return axiosInstance.get("/rooms/posts/latest?limit=8");
};

export const getPostDetail = (
  post_id: number,
): Promise<ApiResponse<PostDetailType>> => {
  return axiosInstance.get(`/rooms/posts/${post_id}`);
};

export const getPostPagination = (
  query: GetPostsQueryType,
): Promise<ApiResponse<RoomPaginationType>> => {
  const {
    skip,
    limit,
    province_code,
    district_code,
    ward_code,
    price_from,
    price_to,
    sort_by,
    order,
  } = query;
  return axiosInstance.get("/rooms/posts", {
    params: {
      skip,
      limit,
      province_code,
      district_code,
      ward_code,
      price_from,
      price_to,
      sort_by,
      order,
    },
  });
};
