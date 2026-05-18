import axiosInstance from "../axiosInstance";

const BASE_URL = "/users/users";

export const userApi = {
  getMe: async () => {
    const response = await axiosInstance.get(`${BASE_URL}/me`);
    return response.data;
  },
  updateMe: async (data: any) => {
    const response = await axiosInstance.put(`${BASE_URL}/me`, data);
    return response.data;
  }
};