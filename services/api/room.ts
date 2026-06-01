import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { Pagination } from "@/schema/common/pagination";
import { RoomDetail } from "@/schema/room/room";

const BASE_URL = "/rooms";

export const PostApi = {
  
  getAllRooms: async () => {
    const res = await axiosInstance.get<ApiResponse<Pagination<RoomDetail>>>(
      `${BASE_URL}`,
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
  }
};
