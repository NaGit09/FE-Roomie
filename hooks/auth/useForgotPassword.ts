import { useState } from "react";
import { AuthApi } from "@/services/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ---------- useForgotPassword ----------
export function useForgotPassword() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const router = useRouter();

    const forgotPassword = async (email: string) => {

        setLoading(true);

        setError(null);

        try {
            await AuthApi.forgotPassword({ email });

            setSent(true);
            
            toast.success("Password reset email sent! Check your inbox.");

            router.push("/auth/login");
        } catch (err: unknown) {

            const message =
                err instanceof Error ? err.message : "Something went wrong. Please try again.";
            
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => setSent(false);

    return { forgotPassword, loading, error, sent, reset };
}