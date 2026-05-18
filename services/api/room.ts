import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import {
  GetPostsQueryType,
  PostCardType,
  PostDetailType,
  RoomPaginationType,
} from "@/schema/room/post";

const BASE_URL = "/rooms/posts";

export const roomApi = {
  getRooms: async (total: number = 6): Promise<ApiResponse<PostCardType[]>> => {
    const res = await axiosInstance.get(`${BASE_URL}/latest?limit=${total}`);
    return res as unknown as ApiResponse<PostCardType[]>;
  },

  getPostDetail: async (post_id: number): Promise<ApiResponse<PostDetailType>> => {
    const res = await axiosInstance.get(`${BASE_URL}/${post_id}`);
    return res as unknown as ApiResponse<PostDetailType>;
  },

  getPostPagination: async (query: GetPostsQueryType): Promise<ApiResponse<RoomPaginationType>> => {
    const res = await axiosInstance.get(`${BASE_URL}`, {
      params: {
        skip: query.skip,
        limit: query.limit,
        province_code: query.province_code,
        district_code: query.district_code,
        ward_code: query.ward_code,
        price_from: query.price_from,
        price_to: query.price_to,
        sort_by: query.sort_by,
        order: query.order,
      },
    });
    return res as unknown as ApiResponse<RoomPaginationType>;
  },
};
