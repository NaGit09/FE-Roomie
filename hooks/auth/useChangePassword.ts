import { useState } from "react";
import { authApi } from "@/services/api/auth";

export function useChangePassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const changePassword = async (newPassword: string, confirmPassword: string) => {
        setLoading(true);
        setError(null);
        try {
            await authApi.changePassword({ newPassword, confirmPassword });
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
