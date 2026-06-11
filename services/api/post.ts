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

  createPost: async (createPost: CreatePost) => {
    const response = await axiosInstance.post<ApiResponse<PostDetailType>>(
      `${BASE_URL}`,
      createPost,
    );

    return response.data;
  },

  createpPost: async (createPost: CreatePost) => {
    return PostApi.createPost(createPost);
  },

  updatePost: async (post_id: number, createPost: CreatePost) => {
    const response = await axiosInstance.put<ApiResponse<PostDetailType>>(
      `${BASE_URL}/${post_id}`,
      createPost,
    );

    return response.data;
  },
  
  deletePost: async (post_id: number) => {
    const response = await axiosInstance.delete<ApiResponse<PostDetailType>>(
      `${BASE_URL}/${post_id}`,
    );

    return response.data;
  },

  getVerificationRequests: async (skip: number = 0, limit: number = 10) => {
    const res = await axiosInstance.get<ApiResponse<{ items: PostCardType[]; total: number; page: number; size: number; total_pages: number }>>(
      `/admin/posts/verification-requests`,
      {
        params: { skip, limit }
      }
    );
    return res.data;
  },

  verifyPost: async (postId: number, approved: boolean) => {
    const res = await axiosInstance.post<ApiResponse<PostDetailType>>(
      `/admin/posts/${postId}/verify`,
      null,
      {
        params: { approved }
      }
    );
    return res.data;
  },

  approveDeletePost: async (postId: number, approved: boolean) => {
    const res = await axiosInstance.post<ApiResponse<PostDetailType>>(
      `/admin/posts/${postId}/approve-delete`,
      null,
      {
        params: { approved }
      }
    );
    return res.data;
  },
};
