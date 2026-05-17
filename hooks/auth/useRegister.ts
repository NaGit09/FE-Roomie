import { useState } from "react";
import { authApi } from "@/services/api/auth";
import { useRouter } from "next/navigation";
import type { RegisterReqSchema } from "@/schema/auth/register";

// ---------- useRegister ----------
export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const register = async (data: RegisterReqSchema) => {
        setLoading(true);
        setError(null);

        try {
            await authApi.register(data);
            router.push("/auth/login");
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