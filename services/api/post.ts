import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import {
  CreatePost,
  GetMapPostsQueryType,
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
          city: query.city,
          district: query.district,
          price_from: query.price_from,
          price_to: query.price_to,
          min_price: query.min_price,
          max_price: query.max_price,
          sort_by: query.sort_by,
          order: query.order,
        },
      },
    );

    return res.data;
  },

  getMapPosts: async (query: GetMapPostsQueryType) => {
    const res = await axiosInstance.get<ApiResponse<Pagination<PostCardType>>>(
      `${BASE_URL}/map`,
      {
        params: {
          latitude: query.latitude,
          longitude: query.longitude,
          radius: query.radius,
          min_price: query.min_price,
          max_price: query.max_price,
          amenities: query.amenities,
          skip: query.skip,
          limit: query.limit,
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

  deletePostByAdmin: async (post_id: number) => {
    const response = await axiosInstance.delete<ApiResponse<PostDetailType>>(
      `/admin/posts/${post_id}`,
    );

    return response.data;
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

  getVerificationRequests: async (skip: number = 0, limit: number = 10) => {
    const res = await axiosInstance.get<ApiResponse<{ items: PostCardType[]; total: number; page: number; size: number; total_pages: number }>>(
      `/admin/posts/pending`,
      {
        params: { skip, limit }
      }
    );
    return res.data;
  },

  verifyPost: async (postId: number, approved: boolean) => {
    const endpoint = approved ? `/admin/posts/${postId}/approve` : `/admin/posts/${postId}/reject`;
    const res = await axiosInstance.post<ApiResponse<any>>(
      endpoint,
      null
    );
    return res.data;
  },
};
