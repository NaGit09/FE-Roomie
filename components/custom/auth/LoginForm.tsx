"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { loginSchema, type LoginSchema } from "@/features/auth/schemas";
import { useLogin } from "@/hooks/auth/useLogin";

export function LoginForm() {
  const { login, loading, error } = useLogin();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
        <p className="text-sm text-muted-foreground">Enter your email and password to continue</p>
      </div>

      <Button variant="outline" type="button" className="w-full h-10 gap-2.5 font-medium text-sm">
        <svg className="h-4 w-4 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><Separator /></div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(login)}>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-9 h-10"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9 h-10"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={watch("remember") ?? false}
            onCheckedChange={(v) => setValue("remember", v === true)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
            Remember me
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline underline-offset-4">
          Create account
        </Link>
      </p>
    </div>
  );
}
