import { ApiResponse } from "@/schema/common/api.type";
import axiosInstance from "../axiosInstance";
import { Rental } from "@/schema/room/rental";

const BASE_URL = "/rentals";

export const RentalApi = {
  /**
   * Express interest in a room
   */
  expressInterest: async (room_id: number): Promise<ApiResponse<Rental>> => {
    const response = await axiosInstance.post<ApiResponse<Rental>>(
      `${BASE_URL}/interest`,
      { room_id }
    );
    return response.data;
  },

  /**
   * Confirm interest / rental for a renter
   */
  confirmRental: async (
    interest_id: number,
    payload: {
      renter_id: string;
      start_date?: string;
      end_date?: string;
      deposit?: number;
      monthly_rent?: number;
    }
  ): Promise<ApiResponse<Rental>> => {
    const response = await axiosInstance.post<ApiResponse<Rental>>(
      `${BASE_URL}/${interest_id}/confirm`,
      payload
    );
    return response.data;
  },

  /**
   * Get interested users for a room
   */
  getInterestedUsers: async (room_id: number): Promise<ApiResponse<Rental[]>> => {
    const response = await axiosInstance.get<ApiResponse<Rental[]>>(
      `${BASE_URL}/room/${room_id}/interested`
    );
    return response.data;
  },

  /**
   * Get current user's rentals
   */
  getMyRentals: async (): Promise<ApiResponse<Rental[]>> => {
    const response = await axiosInstance.get<ApiResponse<Rental[]>>(`${BASE_URL}/me`);
    return response.data;
  },

  /**
   * End a rental contract
   */
  endRental: async (rental_id: number): Promise<ApiResponse<Rental>> => {
    const response = await axiosInstance.post<ApiResponse<Rental>>(
      `${BASE_URL}/${rental_id}/end`
    );
    return response.data;
  },

  /**
   * Decline interest request
   */
  declineInterest: async (rental_id: number): Promise<ApiResponse<Rental>> => {
    const response = await axiosInstance.post<ApiResponse<Rental>>(
      `${BASE_URL}/${rental_id}/decline`
    );
    return response.data;
  },
};
