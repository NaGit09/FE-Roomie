"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/schema/auth/change-password";
import { useChangePassword } from "@/hooks/auth/useChangePassword";

export function ChangePasswordForm() {
  const { changePassword, loading, error, done } = useChangePassword();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const password = useWatch({
    control,
    name: "new_password",
    defaultValue: "",
  });

  useEffect(() => {
    if (done) {
      toast.success("Thay đổi mật khẩu thành công!");
    }
  }, [done]);

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading text-base font-black text-slate-800">
            Đổi mật khẩu thành công
          </h3>
          <p className="text-sm font-semibold text-slate-500 max-w-sm">
            Mật khẩu của bạn đã được cập nhật thành công. Vui lòng sử dụng mật
            khẩu mới cho các lần đăng nhập tiếp theo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <form className="space-y-5" onSubmit={handleSubmit(changePassword)}>
        {/* Mật khẩu cũ */}
        <div className="space-y-2">
          <label
            htmlFor="old_password"
            className="text-xs font-black uppercase tracking-wider text-slate-400"
          >
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="h-4.5 w-4.5 text-slate-300" />
            </div>
            <input
              id="old_password"
              type={showOld ? "text" : "password"}
              placeholder="Nhập mật khẩu hiện tại"
              className={`
                w-full pl-11 pr-11 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                ${
                  errors.old_password
                    ? "border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 text-slate-800 bg-white"
                    : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-800 bg-white"
                }
              `}
              {...register("old_password")}
            />
            <button
              type="button"
              onClick={() => setShowOld((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showOld ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          {errors.old_password && (
            <p className="text-xs font-semibold text-red-500">
              {errors.old_password.message}
            </p>
          )}
        </div>

        {/* Mật khẩu mới */}
        <div className="space-y-2">
          <label
            htmlFor="new_password"
            className="text-xs font-black uppercase tracking-wider text-slate-400"
          >
            Mật khẩu mới
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="h-4.5 w-4.5 text-slate-300" />
            </div>
            <input
              id="new_password"
              type={showNew ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              className={`
                w-full pl-11 pr-11 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                ${
                  errors.new_password
                    ? "border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 text-slate-800 bg-white"
                    : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-800 bg-white"
                }
              `}
              {...register("new_password")}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showNew ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          {errors.new_password && (
            <p className="text-xs font-semibold text-red-500">
              {errors.new_password.message}
            </p>
          )}
        </div>

        {/* Strength indicators */}
        {password.length > 0 && (
          <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100/80 space-y-2.5 mt-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Độ mạnh mật khẩu
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${password.length >= 8 ? "bg-emerald-500" : "bg-slate-200"}`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${/[A-Z]/.test(password) ? "bg-emerald-500" : "bg-slate-200"}`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${/\d/.test(password) ? "bg-emerald-500" : "bg-slate-200"}`}
              />
            </div>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-500">
              {[
                { ok: password.length >= 8, label: "Tối thiểu 8 ký tự" },
                {
                  ok: /[A-Z]/.test(password),
                  label: "Chứa ít nhất 1 chữ in hoa (A-Z)",
                },
                {
                  ok: /\d/.test(password),
                  label: "Chứa ít nhất 1 chữ số (0-9)",
                },
              ].map(({ ok, label }) => (
                <li key={label} className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-slate-300"}`}
                  />
                  <span
                    className={
                      ok ? "text-emerald-600 font-bold" : "text-slate-400"
                    }
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Global errors */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
            {error === "Failed to update password. Please try again."
              ? "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ."
              : error}
          </div>
        )}

        {/* Nút gửi */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/95 px-5 py-3 text-sm font-black text-white hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          Thay đổi mật khẩu
        </button>
      </form>
    </div>
  );
}
