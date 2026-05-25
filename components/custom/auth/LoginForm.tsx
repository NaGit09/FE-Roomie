"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/auth/useLogin";
import { loginReqSchema , type LoginReqSchema } from "@/schema/auth/login";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export function LoginForm() {
  const { login, loading, error } = useLogin();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginReqSchema>({ resolver: zodResolver(loginReqSchema) });

  const handleDemoLogin = (role: "LANDLORD" | "RENTER") => {
    const mockUser = {
      email: role === "LANDLORD" ? "landlord@roomie.com" : "renter@roomie.com",
      full_name: role === "LANDLORD" ? "Nguyễn Văn Landlord" : "Lê Nguyễn Anh Hùng",
      id: "11111111-1111-1111-1111-111111111111",
      profile_id: "22222222-2222-2222-2222-222222222222",
      role: role,
      free_usage_count: 5,
      status: "ACTIVE" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    useAuthStore.getState().setAuth({
      access_token: "mock-jwt-token-demo",
      refresh_token: "mock-refresh-token-demo",
      token_type: "Bearer",
      expires_in: 86400,
      user_id: mockUser.id
    });
    
    useAuthStore.getState().setUser(mockUser);
    
    toast.success(`Đăng nhập Demo thành công: ${mockUser.full_name}`);
    
    if (role === "LANDLORD") {
      router.push("/landlord");
    } else {
      router.push("/matching");
    }
  };

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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : "Sign in"}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><Separator /></div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground uppercase tracking-widest font-black text-[9px]">Demo Quick Access</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDemoLogin("LANDLORD")}
          className="h-10 border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider gap-1.5 cursor-pointer transition-all duration-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Chủ nhà Demo
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => handleDemoLogin("RENTER")}
          className="h-10 border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-500/5 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-wider gap-1.5 cursor-pointer transition-all duration-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Khách thuê Demo
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline underline-offset-4">
          Create account
        </Link>
      </p>
    </div>
  );
}
