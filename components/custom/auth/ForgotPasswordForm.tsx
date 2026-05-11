"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/features/auth/schemas";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

export function ForgotPasswordForm() {
  const { forgotPassword, loading, error, sent, reset } = useForgotPassword();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({ resolver: zodResolver(forgotPasswordSchema) });

  if (sent) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>.
            <br />
            Enter it on the next screen to reset your password.
          </p>
        </div>
        <Button asChild className="w-full h-10 font-medium">
          <Link href="/auth/confirm-otp">Enter code</Link>
        </Button>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          No worries. Enter your email and we&apos;ll send you a reset code.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit((d) => forgotPassword(d.email))}>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-9 h-10" {...register("email")} />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : "Send reset code"}
        </Button>
      </form>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
