/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { PostApi } from "@/services/api/post";
import { PostApi as RoomApi } from "@/services/api/room";
import { GetPostsQueryType, PostCardType, PostDetailType } from "@/schema/room/post";

interface RoomState {
  latestRooms: PostCardType[];
  paginatedRooms: PostCardType[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
  currentRoomDetail: PostDetailType | null;
  isLoading: boolean;
  error: string | null;

  fetchLatestRooms: () => Promise<void>;
  fetchRoomDetail: (postId: number) => Promise<void>;
  fetchRoomPagination: (query: GetPostsQueryType & { city?: string; district?: string }) => Promise<void>;
  clearCurrentRoomDetail: () => void;
  addLocalFeedback: (feedback: any) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  latestRooms: [],
  paginatedRooms: [],
  total: 0,
  page: 1,
  size: 10,
  total_pages: 1,
  currentRoomDetail: null,
  isLoading: false,
  error: null,

  fetchLatestRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await PostApi.getPosts();

      if (response) {
        set({ latestRooms: response.data, isLoading: false });
      } else {
        set({ error: "Failed to fetch rooms", isLoading: false });
      }
    } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
      set({
        error: error?.response?.data?.message || error?.message || "Failed to load rooms",
        isLoading: false,
      });
    }
  },

  fetchRoomDetail: async (postId: number) => {

    set({ isLoading: true, error: null });

    try {
      const response = await PostApi.getPostDetail(postId);

      if (response) {
        set({ currentRoomDetail: response.data, isLoading: false });
      } else {
        set({ error: "Failed to fetch room detail", isLoading: false });
      }
    } catch (err: unknown) {
      const error = err as Error & { response?: { data?: { message?: string } } };
      set({
        error: error?.response?.data?.message || error?.message || "Failed to load room detail",
        isLoading: false,
      });
    }
  },

  fetchRoomPagination: async (query: GetPostsQueryType & { city?: string; district?: string }) => {
    set({ isLoading: true, error: null });
    try {
      let data;
      if (query.city || query.district) {
        const response = await RoomApi.getAllRooms(query.city, query.district);
        const rawData = response.data;
        if (rawData) {
          const mappedItems = (rawData.items || []).map((room: any) => ({
            post_id: room.id,
            title: room.name,
            is_verified: room.status === "AVAILABLE" || true,
            created_at: room.created_at || new Date().toISOString(),
            image_url: room.images && room.images[0] ? room.images[0] : null,
            room: {
              price: room.price,
              area: room.area,
              amenities: room.amenities || [],
              address: {
                district: room.address?.district || "",
                city: room.address?.city || ""
              }
            }
          }));

          data = {
            items: mappedItems,
            total: rawData.total,
            page: rawData.page,
            size: rawData.size,
            total_pages: rawData.total_pages
          };
        }
      } else {
        const response = await PostApi.getPostPagination(query);
        data = response.data;
      }

      if (data) {
        set({
          paginatedRooms: data.items as any,
          total: data.total,
          page: data.page,
          size: data.size,
          total_pages: data.total_pages,
          isLoading: false,
        });
      } else {
        set({ error: "Failed to fetch paginated rooms", isLoading: false });
      }
    } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
      set({
        error: error?.response?.data?.message || error?.message || "Failed to load paginated rooms",
        isLoading: false,
      });
    }
  },

  clearCurrentRoomDetail: () => {   
    set({ currentRoomDetail: null });
  },

  addLocalFeedback: (feedback: any) => {
    set((state) => {
      if (!state.currentRoomDetail) return {};
      return {
        currentRoomDetail: {
          ...state.currentRoomDetail,
          feedbacks: [feedback, ...(state.currentRoomDetail.feedbacks || [])],
        },
      };
    });
  },
}));
