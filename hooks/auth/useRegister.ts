import { useState } from "react";
import { authApi } from "@/services/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import type { RegisterSchema } from "@/features/auth/schemas";

// ---------- useRegister ----------
export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setAuth } = useAuthStore();
    const router = useRouter();

    const register = async (data: RegisterSchema) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authApi.register({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            });
            setAuth(res.access_token);
            router.push("/");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Registration failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
}