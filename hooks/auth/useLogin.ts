import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth";
import { userApi } from "@/services/api/user";
import { toast } from "sonner";
import type { LoginReqSchema } from "@/schema/auth/login";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, setUser } = useAuthStore();
  const router = useRouter();

  const login = async (data: LoginReqSchema) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(data);

      if (res && res.access_token) {
        setAuth(res);

        try {
          const userProfile = await userApi.getMe();
          setUser(userProfile);
          
          const displayName = userProfile.firstName 
            ? `${userProfile.firstName} ${userProfile.lastName}`.trim() 
            : userProfile.email;
            
          toast.success(`Đăng nhập thành công! Chào mừng trở lại, ${displayName}.`);
        } catch (profileErr) {
          console.warn("Failed to fetch user profile immediately after login:", profileErr);
          toast.success("Đăng nhập thành công!");
        }

        // 4. Forward user to home explorer page
        router.push("/");
      } else {
        const errorMsg = "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}