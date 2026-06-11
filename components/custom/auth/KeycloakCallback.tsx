"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { toast } from "sonner";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
}

function KeycloakCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const hasExecuted = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || hasExecuted.current) return;

    hasExecuted.current = true;

    const exchangeCode = async () => {
      const toastId = toast.loading("Đang đăng nhập bằng Google...");

      try {
        const tokenUrl =
          process.env.NEXT_PUBLIC_KEYCLOAK_TOKEN_URL ||
          "http://localhost:8088/realms/roomie/protocol/openid-connect/token";
        const clientId =
          process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "frontend-app";
        const redirectUri =
          process.env.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI ||
          "http://localhost:3000/";

        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", clientId);
        params.append("code", code);
        params.append("redirect_uri", redirectUri);

        const response = await axios.post(tokenUrl, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const { access_token, refresh_token, token_type, expires_in } =
          response.data;

        if (!access_token) {
          throw new Error("Không nhận được Access Token từ máy chủ.");
        }

        const decoded = parseJwt(access_token);
        const userId = decoded?.sub || "";
        const roles = decoded?.realm_access?.roles || [];

        let role: "RENTER" | "LANDLORD" | "ADMIN" = "RENTER";
        if (roles.some((r: string) => r.toUpperCase() === "ADMIN")) {
          role = "ADMIN";
        } else if (roles.some((r: string) => r.toUpperCase() === "LANDLORD")) {
          role = "LANDLORD";
        }

        setAuth({
          access_token,
          refresh_token: refresh_token || "",
          token_type: token_type || "Bearer",
          expires_in: expires_in || 3600,
          user_id: userId,
          role,
        });

        toast.success("Đăng nhập thành công!", { id: toastId });

        // Clean up the URL
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        // Redirect based on role
        if (role === "ADMIN") {
          router.push("/admin/");
        } else if (role === "LANDLORD") {
          router.push("/landlord/");
        } else {
          router.push("/");
        }
      } catch (error: unknown) {
        console.error("OAuth token exchange failed:", error);
        
        let errorMessage = "Có lỗi xảy ra trong quá trình xác thực.";
        if (axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data?.error_description || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        toast.error(`Đăng nhập thất bại: ${errorMessage}`, { id: toastId });
        
        // Clean up url anyway
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    };

    exchangeCode();
  }, [searchParams, router, setAuth]);

  return null;
}

export function KeycloakCallback() {
  return (
    <Suspense fallback={null}>
      <KeycloakCallbackContent />
    </Suspense>
  );
}
