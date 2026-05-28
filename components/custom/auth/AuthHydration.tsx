"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getCookie } from "@/utils/CookieUtils";
import { AuthApi } from "@/services/api/auth";

export function AuthHydration() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();

    const checkAndRefreshToken = async () => {
      const { isAuthenticated, setAuth, clearAuth } = useAuthStore.getState();
      const jwt = getCookie("jwt");

      if (isAuthenticated && !jwt) {
        try {
          console.log(
            "Access token expired, performing silent refresh on app load...",
          );
          const res = await AuthApi.refreshToken();
          if (res && res.data && res.data.access_token) {
            setAuth(res.data);
            console.log("Silent refresh successful on app load.");
          } else {
            clearAuth();
          }
        } catch (error) {
          console.warn("Silent refresh failed on app load:", error);
          clearAuth();
        }
      }
    };

    checkAndRefreshToken();
  }, []);

  return null;
}
