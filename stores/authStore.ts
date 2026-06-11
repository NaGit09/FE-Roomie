import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setCookie, removeCookie } from "@/utils/CookieUtils";
import { LoginResSchema } from "@/schema/auth/login";
import { UserProfile } from "@/schema/user/profile";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (data: LoginResSchema) => void;
  setUser: (user: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (data) => {
        if (!data || !data.access_token) {
          console.warn("setAuth invoked with empty or undefined data:", data);
          return;
        }

        const normalizedRole = data.role?.toUpperCase() as "RENTER" | "LANDLORD" | "ADMIN";

        setCookie("jwt", data.access_token, data.expires_in);
        setCookie("user_id", data.user_id);
        setCookie("role", normalizedRole);

        if (data.refresh_token) {
          setCookie("refresh_token", data.refresh_token, 7);
        }

        // Avoid using a stale user profile (e.g. from a previous login session of a different user)
        const currentUser = get().user;
        const userState = currentUser && currentUser.id === data.user_id ? {
          ...currentUser,
          role: currentUser.role?.toUpperCase() as "RENTER" | "LANDLORD" | "ADMIN"
        } : null;

        set({ accessToken: data.access_token, isAuthenticated: true, user: userState });
      },

      setUser: (user) => {
        const normalizedUser = user ? {
          ...user,
          role: user.role?.toUpperCase() as "RENTER" | "LANDLORD" | "ADMIN"
        } : null;
        set({ user: normalizedUser });
      },

      clearAuth: () => {
        removeCookie("jwt");
        removeCookie("user_id");
        removeCookie("role");
        removeCookie("refresh_token");
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "roomie-auth",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
