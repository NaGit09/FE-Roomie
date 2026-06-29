import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { Pagination } from "@/schema/common/pagination";
import { RoomDetail } from "@/schema/room/room";

export enum RoomStatus {
  VACANT = "VACANT",
  OCCUPIED = "OCCUPIED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

const BASE_URL = "/rooms";

export const RoomApi = {
  
  getAllRooms: async (city?: string, district?: string) => {
    const res = await axiosInstance.get<ApiResponse<Pagination<RoomDetail>>>(
      `${BASE_URL}`,
      {
        params: {
          city,
          district,
        },
      },
    );
    console.log(res.data)
    return res.data;
  },

  getMyRoom: async () => {
    const res = await axiosInstance.get<ApiResponse<Pagination<RoomDetail>>>(
      `${BASE_URL}/me`,
    );
    return res.data;
  },

  createNewRoom: async (create: RoomDetail) => {
    const res = await axiosInstance.post<ApiResponse<RoomDetail>>(
      `${BASE_URL}`,
      create,
    );
    return res.data;
  },

  updateRoom : async (room_id : number,update : RoomDetail) => {
    const res = await axiosInstance.put<ApiResponse<RoomDetail>>(
      `${BASE_URL}/${room_id}/request-update`,
      update,
    );
    return res.data;
  },

  deleteRoom : async (room_id : number) => {
        const res = await axiosInstance.post<ApiResponse<RoomDetail>>(
      `${BASE_URL}/${room_id}/request-delete`,
    );
    return res.data;
  },

  getPendingRequests: async () => {
    const res = await axiosInstance.get<ApiResponse<RoomRequest[]>>(
      `/requests/pending`
    );
    return res.data;
  },

  approveRoomRequest: async (requestId: number, approved: boolean) => {
    const endpoint = approved ? `/requests/${requestId}/approve` : `/requests/${requestId}/reject`;
    const res = await axiosInstance.post<ApiResponse<any>>(
      endpoint,
      null
    );
    return res.data;
  }
};

export interface RoomRequest {
  id: number;
  room_id: number;
  action_type: "CREATE" | "UPDATE" | "DELETE";
  proposed_data: Partial<RoomDetail>;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_by: string;
  reviewed_by: string | null;
  created_at: string;
}
