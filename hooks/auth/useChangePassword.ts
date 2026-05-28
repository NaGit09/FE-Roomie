import { useState } from "react";
import { AuthApi } from "@/services/api/auth";
import type { ChangePasswordSchema } from "@/schema/auth/change-password";

export function useChangePassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const changePassword = async (data: ChangePasswordSchema) => {
        setLoading(true);
        setError(null);
        try {
            await AuthApi.changePassword(data);
            setDone(true);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to update password. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading, error, done };
}
