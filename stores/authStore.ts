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
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (data) => {
        
        if (!data || !data.access_token) {
          console.warn("setAuth invoked with empty or undefined data:", data);
          return;
        }

        setCookie("jwt", data.access_token, data.expires_in);

        setCookie("user_id", data.user_id);

        set({ accessToken: data.access_token, isAuthenticated: true });
      },

      setUser: (user) => {
        set({ user });
      },

      clearAuth: () => {
        removeCookie("jwt");
        removeCookie("user_id");
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
