"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { registerSchema, type RegisterSchema } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks";

export function RegisterForm() {
  const { register: registerUser, loading, error } = useRegister();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
        <p className="text-sm text-muted-foreground">Join Roomie and find your perfect space</p>
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

      <form className="space-y-4" onSubmit={handleSubmit(registerUser)}>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input id="firstName" placeholder="John" className="pl-9 h-10" {...register("firstName")} />
            </div>
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input id="lastName" placeholder="Doe" className="pl-9 h-10" {...register("lastName")} />
            </div>
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-9 h-10" {...register("email")} />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input id="password" type="password" placeholder="Min. 8 characters" className="pl-9 h-10" {...register("password")} />
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={watch("terms") === true}
            onCheckedChange={(v) => setValue("terms", v === true ? true : (false as never))}
            className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer select-none leading-snug">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline underline-offset-4">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline underline-offset-4">Privacy Policy</Link>
          </label>
        </div>
        {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</> : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
