"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema, type ChangePasswordSchema } from "@/schema/auth/change-password";
import { useChangePassword } from "@/hooks/auth/useChangePassword";


export function ChangePasswordForm() {
  const { changePassword, loading, error, done } = useChangePassword();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({ resolver: zodResolver(changePasswordSchema) });

  const password = watch("new_password") ?? "";

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
        <h1 className="text-2xl font-semibold tracking-tight">Change password</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Please enter your current password and your new password to update.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(changePassword)}>
        <div className="space-y-1.5">
          <Label htmlFor="old_password" className="text-sm font-medium">Current password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="old_password"
              type={showOld ? "text" : "password"}
              placeholder="Enter your current password"
              className="pl-9 pr-10 h-10"
              {...register("old_password")}
            />
            <button
              type="button"
              onClick={() => setShowOld((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
            >
              {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.old_password && <p className="text-xs text-destructive">{errors.old_password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="new_password" className="text-sm font-medium">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="new_password"
              type={showNew ? "text" : "password"}
              placeholder="Enter your new password"
              className="pl-9 pr-10 h-10"
              {...register("new_password")}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.new_password && <p className="text-xs text-destructive">{errors.new_password.message}</p>}
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

        <Button type="submit" className="w-full h-10 font-medium cursor-pointer" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating…</> : "Change password"}
        </Button>
      </form>
    </div>
  );
}
