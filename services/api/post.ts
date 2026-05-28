import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import {
  CreatePost,
  GetPostsQueryType,
  PostCardType,
  PostDetailType,
} from "@/schema/room/post";
import { Pagination } from "@/schema/common/pagination";

const BASE_URL = "/posts";

export const PostApi = {
  getPosts: async (total: number = 6) => {
    const res = await axiosInstance.get<ApiResponse<PostCardType[]>>(
      `${BASE_URL}/latest?limit=${total}`,
    );

    return res.data;
  },

  getPostDetail: async (post_id: number) => {
    const res = await axiosInstance.get<ApiResponse<PostDetailType>>(
      `${BASE_URL}/${post_id}`,
    );
    return res.data;
  },

  getPostPagination: async (query: GetPostsQueryType) => {
    const res = await axiosInstance.get<ApiResponse<Pagination<PostCardType>>>(
      `${BASE_URL}`,
      {
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
      },
    );

    return res.data;
  },

  getMyPost: async (skip: number, limit: number) => {
    const response = await axiosInstance.get<
      ApiResponse<Pagination<PostCardType>>
    >(`${BASE_URL}/me`, {
      params: {
        skip,
        limit,
      },
    });
    return response.data;
  },

  createpPost: async (createPost: CreatePost) => {
    const response = await axiosInstance.post<ApiResponse<PostDetailType>>(
      `${BASE_URL}`,
      createPost,
    );

    return response.data;
  },
};
