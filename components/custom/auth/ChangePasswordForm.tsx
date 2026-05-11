"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema, type ChangePasswordSchema } from "@/features/auth/schemas";
import { useChangePassword } from "@/features/auth/hooks";

export function ChangePasswordForm() {
  const { changePassword, loading, error, done } = useChangePassword();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({ resolver: zodResolver(changePasswordSchema) });

  const password = watch("newPassword") ?? "";

  if (done) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Password changed!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>
        <Button asChild className="w-full h-10 font-medium">
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 mb-4">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your identity has been verified. Choose a new password for your account.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit((d) => changePassword(d.newPassword, d.confirmPassword))}>
        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-sm font-medium">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="Min. 8 characters"
              className="pl-9 pr-10 h-10"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              className="pl-9 pr-10 h-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        {/* Strength hints */}
        {password.length > 0 && (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {[
              { ok: password.length >= 8, label: "At least 8 characters" },
              { ok: /[A-Z]/.test(password), label: "One uppercase letter" },
              { ok: /\d/.test(password), label: "One number" },
            ].map(({ ok, label }) => (
              <li key={label} className={ok ? "text-green-600 dark:text-green-400" : ""}>
                {ok ? "✓" : "·"} {label}
              </li>
            ))}
          </ul>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating…</> : "Change password"}
        </Button>
      </form>
    </div>
  );
}
