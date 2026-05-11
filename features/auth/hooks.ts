import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth";
import { useAuthStore } from "@/stores/authStore";
import type { LoginSchema } from "@/features/auth/schemas";
import type { RegisterSchema } from "@/features/auth/schemas";

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
      setAuth(res.user, res.accessToken);
      // Redirect based on role
      const redirectMap: Record<string, string> = {
        admin: "/admin",
        landlord: "/landlord",
        customer: "/customer",
      };
      router.push(redirectMap[res.user.role] ?? "/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

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
      setAuth(res.user, res.accessToken);
      router.push("/customer");
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
    } catch {
      // silently fail resend
    }
  };

  return { verifyOtp, resend, loading, error };
}

// ---------- useChangePassword ----------
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
