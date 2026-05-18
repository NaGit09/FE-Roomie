import { create } from "zustand";
import { get5Rooms, getPostDetail } from "@/services/api/room";
import { PostCardType, PostDetailType } from "@/schema/room/post";

interface RoomState {
  latestRooms: PostCardType[];
  currentRoomDetail: PostDetailType | null;
  isLoading: boolean;
  error: string | null;

  fetchLatestRooms: () => Promise<void>;
  fetchRoomDetail: (postId: number) => Promise<void>;
  clearCurrentRoomDetail: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  latestRooms: [],
  currentRoomDetail: null,
  isLoading: false,
  error: null,

  fetchLatestRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await get5Rooms();
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
      const response = await getPostDetail(postId);
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

  clearCurrentRoomDetail: () => {
    set({ currentRoomDetail: null });
  },
}));
