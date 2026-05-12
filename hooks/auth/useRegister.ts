import { useState } from "react";
import { authApi } from "@/services/api/auth";
import { useRouter } from "next/navigation";
import type { RegisterSchema } from "@/features/auth/schemas";

// ---------- useRegister ----------
export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const register = async (data: RegisterSchema) => {

        setLoading(true);

        setError(null);

        const fullname = data.firstName + data.lastName;

        try {
            await authApi.register({
                fullname: fullname,
                email: data.email,
                password: data.password,
                role: "RENTER"
            });

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