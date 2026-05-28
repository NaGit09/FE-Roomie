import { useState } from "react";
import { AuthApi } from "@/services/api/auth";
import { useRouter } from "next/navigation";
import type { RegisterReqSchema } from "@/schema/auth/register";

// ---------- useRegister ----------
export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const registerAccount = async (data: RegisterReqSchema, isLandlord: boolean) => {
        setLoading(true);
        setError(null);

        try {
            if (isLandlord) {
                await AuthApi.register_landlord(data);
            } else {
                await AuthApi.register(data);
            }
            router.push("/auth/login");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Registration failed. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { registerAccount, loading, error };
}