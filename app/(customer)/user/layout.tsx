"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Heart,
  History,
  Coins,
  Settings,
  LogOut,
  ShieldCheck,
  Flag,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // 1. Guard against SSR Hydration Mismatches
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // 2. Protect routes: redirect to login if unauthenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục.");
      router.push("/auth/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-slate-400">
            Đang kiểm tra bảo mật...
          </p>
        </div>
      </div>
    );
  }

  // Generate initials cleanly from user's full_name
  const initials = user.full_name
    ? user.full_name
        .trim()
        .split(/\s+/)
        .map((n: string) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  // Upper main navigation links
  const menuItems = [
    {
      href: "/user/profile",
      label: "Thông tin cá nhân",
      icon: User,
    },
    {
      href: "/user/change-password",
      label: "Bảo mật tài khoản",
      icon: ShieldCheck,
    },
    {
      href: "/user/save-post",
      label: "Tin đã lưu",
      icon: Heart,
    },
    {
      href: "/user/history-rent",
      label: "Lịch sử thuê phòng",
      icon: History,
    },
    {
      href: "/user/history-subscription",
      label: "Lịch sử gói đăng ký",
      icon: Coins,
    },
    {
      href: "/user/report",
      label: "Báo cáo & Hỗ trợ",
      icon: Flag,
    },
  ];

  const handleLogout = () => {
    clearAuth();
    toast.success("Đăng xuất tài khoản thành công!");
    router.push("/auth/login");
  };

  return (
    <div className="bg-slate-50/50 min-h-[calc(100vh-68px)]">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-10 max-w-none">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
          {/* ── Left Sidebar ── */}
          <aside className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:sticky md:top-23 md:h-[calc(100vh-140px)] md:min-h-140">
            {/* Top Container */}
            <div className="space-y-6">
              {/* Profile Card Summary */}
              <div className="flex items-center gap-3 border-b border-slate-50 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xs font-black select-none">
                  {initials}
                </div>
                <div className="flex flex-col space-y-0.5 overflow-hidden">
                  <span className="text-sm font-black text-slate-800 truncate">
                    {user.full_name}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 truncate">
                    {user.email}
                  </span>

                  {/* Unified Role Badge */}
                  <span
                    className={`
                    mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider
                    ${
                      user.role === "LANDLORD"
                        ? "bg-amber-100 text-amber-700"
                        : user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                    }
                  `}
                  >
                    {user.role === "LANDLORD"
                      ? "Chủ nhà"
                      : user.role === "ADMIN"
                        ? "Quản trị"
                        : "Người thuê"}
                  </span>
                </div>
              </div>

              {/* Main Navigation Links */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer
                        ${
                          active
                            ? "bg-primary/10 text-primary font-black shadow-sm"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }
                      `}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-slate-400"}`}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions Container */}
            <div className="mt-8 border-t border-slate-50 pt-5 space-y-1">
              {/* Settings Item */}
              <Link
                href="/user/setting"
                className={`
                  flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${
                    pathname === "/user/setting"
                      ? "bg-primary/10 text-primary font-black shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }
                `}
              >
                <Settings
                  className={`h-4 w-4 shrink-0 ${pathname === "/user/setting" ? "text-primary" : "text-slate-400"}`}
                />
                Cài đặt tài khoản
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50/50 hover:text-red-600 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="h-4 w-4 shrink-0 text-red-400" />
                Đăng xuất tài khoản
              </button>
            </div>
          </aside>

          {/* ── Right Content Pane ── */}
          <main className="min-w-0 flex items-center justify-center flex-col gap-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
