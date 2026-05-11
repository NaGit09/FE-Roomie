import { useState } from "react";
import { authApi } from "@/services/api/auth";
import { useRouter } from "next/navigation";

// ---------- useVerifyOtp ----------
export function useVerifyOtp() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const verifyOtp = async (email: string, otp: string) => {

        setLoading(true);
        setError(null);

        try {

            await authApi.verifyOtp({ email, otp });
            router.push("/auth/change-password");

        } catch (err: unknown) {

            const message =
                err instanceof Error ? err.message : "Invalid or expired code. Please try again.";
            setError(message);
            
        } finally {
            setLoading(false);
        }
    };

    const resend = async (email: string) => {
        try {
            await authApi.resendOtp(email);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to resend OTP. Please try again.";
            setError(message);
        }
    };

    return { verifyOtp, resend, loading, error };
}