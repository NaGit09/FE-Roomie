import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/services/api/auth";
import { toast } from "sonner";
import type { LoginReqSchema } from "@/schema/auth/login";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const login = async (data: LoginReqSchema) => {
    setLoading(true);
    setError(null);

    try {
      const res = await AuthApi.login(data);

      if (res && res.data.access_token) {
        setAuth(res.data);

        if (res.data.role === "ADMIN") {
          router.push("/admin/");

        } else if (res.data.role === "LANDLORD") {
          router.push("/landlord/");

        } else {
          router.push("/");
        }

      } else {
        const errorMsg =
          "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
