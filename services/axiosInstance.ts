import axios from "axios";
import { getCookie, removeCookie } from "@/utils/CookieUtils";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    else {
      // call api refresh token
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        removeCookie("jwt");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
      const message = error.response.data?.message ?? "An error occurred";
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(new Error("Network error — could not connect to the server"));
    }
    return Promise.reject(new Error(error.message));
  },
);

export default axiosInstance;
