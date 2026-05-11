import { useState } from "react";
import { authApi } from "@/services/api/auth";

// ---------- useForgotPassword ----------
export function useForgotPassword() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const forgotPassword = async (email: string) => {

        setLoading(true);
        setError(null);

        try {
            await authApi.forgotPassword({ email });
            setSent(true);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => setSent(false);

    return { forgotPassword, loading, error, sent, reset };
}