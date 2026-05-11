import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/features/auth/types";
import { setCookie, removeCookie } from "@/utils/CookieUtils";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (accessToken) => {
        setCookie("jwt", accessToken, 7);
        set({ accessToken, isAuthenticated: true });
      },

      clearAuth: () => {
        removeCookie("jwt");
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "roomie-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      skipHydration: true,
    },
  ),
);
