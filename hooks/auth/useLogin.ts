import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth";
import type { LoginSchema } from "@/features/auth/schemas";
import { toast } from "sonner";

// ---------- useLogin ----------
export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setAuth } = useAuthStore();
    const router = useRouter();

    const login = async (data: LoginSchema) => {

        setLoading(true);

        setError(null);

        try {

            const res = await authApi.login({
                email: data.email,
                password: data.password,
                remember: data.remember,
            });

            setAuth(res.access_token);

            // navigate to home
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