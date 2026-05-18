import { create } from "zustand";
import { roomApi } from "@/services/api/room";
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
  fetchRoomPagination: (query: GetPostsQueryType) => Promise<void>;
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
      const response = await roomApi.getRooms();
      if (response && response.data) {
        set({ latestRooms: response.data, isLoading: false });
      } else {
        set({ error: "Failed to fetch rooms", isLoading: false });
      }
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || err?.message || "Failed to load rooms",
        isLoading: false,
      });
    }
  },

  fetchRoomDetail: async (postId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await roomApi.getPostDetail(postId);
      if (response && response.data) {
        set({ currentRoomDetail: response.data, isLoading: false });
      } else {
        set({ error: "Failed to fetch room detail", isLoading: false });
      }
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || err?.message || "Failed to load room detail",
        isLoading: false,
      });
    }
  },

  fetchRoomPagination: async (query: GetPostsQueryType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await roomApi.getPostPagination(query);
      if (response && response.data) {
        set({
          paginatedRooms: response.data.items,
          total: response.data.total,
          page: response.data.page,
          size: response.data.size,
          total_pages: response.data.total_pages,
          isLoading: false,
        });
      } else {
        set({ error: "Failed to fetch paginated rooms", isLoading: false });
      }
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || err?.message || "Failed to load paginated rooms",
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
