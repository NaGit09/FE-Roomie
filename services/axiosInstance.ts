/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "@/utils/CookieUtils";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("CORS hoặc Network Error - Không thể kết nối tới Server");
      error.message = "Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng!";
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Sanitize the error message to avoid showing raw HTTP status codes (e.g. 500, 400) or axios internal codes (e.g. ERR_BAD_REQUEST)
    const serverMessage = data?.message || data?.error || data?.detail;
    if (serverMessage) {
      error.message = serverMessage;
    } else if (status === 401) {
      error.message = "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!";
    } else if (status === 403) {
      error.message = "Bạn không có quyền truy cập vào tài nguyên này!";
    } else {
      error.message = "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!";
    }

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/logout") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshToken = getCookie("refresh_token");
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const newAuthData = refreshResponse.data?.data;
        if (newAuthData && newAuthData.access_token) {
          useAuthStore.getState().setAuth(newAuthData);

          processQueue(null, newAuthData.access_token);

          originalRequest.headers.Authorization = `Bearer ${newAuthData.access_token}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Invalid refresh token response structure");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        if (refreshError && typeof refreshError === "object") {
          (refreshError as any).message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("Backend Error:", data);
    return Promise.reject(error);
  },
);

export default axiosInstance;
