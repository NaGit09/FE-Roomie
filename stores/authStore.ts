import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/features/auth/types";
import { setCookie, removeCookie } from "@/utils/CookieUtils";
import { LoginResSchema } from "@/schema/auth/login";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (data: LoginResSchema) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (data) => {
        setCookie("jwt", data.access_token, data.expires_in);
        set({ accessToken: data.access_token, isAuthenticated: true });
      },

      clearAuth: () => {
        removeCookie("jwt");
        set({ accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "roomie-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
      skipHydration: true,
    },
  ),
);
