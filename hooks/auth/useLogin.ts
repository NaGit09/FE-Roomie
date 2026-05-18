import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth";
import { toast } from "sonner";
import type { LoginReqSchema } from "@/schema/auth/login";
import { setCookie } from "@/utils/CookieUtils";

// ---------- useLogin ----------
export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setAuth } = useAuthStore();
    const router = useRouter();

    const login = async (data: LoginReqSchema) => {

        setLoading(true);

        setError(null);

        try {

            const res = await authApi.login(data);

            setAuth(res.data);

            router.push("/");

        } catch (err: unknown) {

            const message =
                err instanceof Error ? err.message : "Invalid credentials. Please try again.";
            
            setError(message);

            toast.error(message);
            
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}