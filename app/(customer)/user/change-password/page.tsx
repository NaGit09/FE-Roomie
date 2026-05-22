import React from "react";
import { ChangePasswordForm } from "@/components/custom/auth/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="max-w-2xl mx-auto rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
      <h1 className="font-heading text-xl md:text-2xl font-black text-slate-800 border-b border-slate-50 pb-4 mb-6">
        Bảo mật & Đổi mật khẩu
      </h1>
      <p className="text-sm font-semibold text-slate-400 mb-6 -mt-4">
        Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để cập nhật bảo mật cho tài khoản của bạn.
      </p>
      <ChangePasswordForm />
    </div>
  );
}
