"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRegister } from "@/hooks/auth/useRegister";
import {
  type RegisterReqSchema,
  registerReqSchema,
} from "@/schema/auth/register";

export function RegisterForm() {
  const { registerAccount, loading, error } = useRegister();
  const [role, setRole] = useState<"RENTER" | "LANDLORD">("RENTER");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterReqSchema>({ resolver: zodResolver(registerReqSchema) });

  const onSubmit = (data: RegisterReqSchema) => {
    registerAccount(data, role === "LANDLORD");
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join Roomie and find your perfect space
        </p>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full h-10 gap-2.5 font-medium text-sm"
      >
        <svg
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground">or</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Role Selector Card Group */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">I want to register as a</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("RENTER")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 gap-2 cursor-pointer text-center relative overflow-hidden ${
                role === "RENTER"
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-muted bg-card hover:bg-muted/10 text-muted-foreground"
              }`}
            >
              <div className={`p-2.5 rounded-full ${role === "RENTER" ? "bg-primary/10" : "bg-muted"}`}>
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm">Renter</span>
                <span className="text-[11px] opacity-80 leading-snug">Find rooms & roommates</span>
              </div>
              {role === "RENTER" && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setRole("LANDLORD")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 gap-2 cursor-pointer text-center relative overflow-hidden ${
                role === "LANDLORD"
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-muted bg-card hover:bg-muted/10 text-muted-foreground"
              }`}
            >
              <div className={`p-2.5 rounded-full ${role === "LANDLORD" ? "bg-primary/10" : "bg-muted"}`}>
                <Key className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm">Landlord</span>
                <span className="text-[11px] opacity-80 leading-snug">List & manage properties</span>
              </div>
              {role === "LANDLORD" && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-sm font-medium">
              Full name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="full_name"
                placeholder="John"
                className="pl-9 h-10"
                {...register("full_name")}
              />
            </div>
            {errors.full_name && (
              <p className="text-xs text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
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
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              className="pl-9 h-10"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          className="w-full h-10 font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
