/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Settings,
  LogOut,
  X,
  Building,
  Bell,
  Wallet,
  Menu,
  ShieldCheck
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import Link from "next/link";
import { UserApi } from "@/services/api/user";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = useNextPathname();
  const router = useNextRouter();
  const { user, isAuthenticated, clearAuth, setUser } = useAuthStore();
  
  // Mounted state for SSR safety
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "system">("profile");

  // Admin Mock states
  const [adminName, setAdminName] = useState("Hệ thống Roomie Admin");
  const [adminRole, setAdminRole] = useState("SUPER_ADMIN");
  const [systemAlerts, setSystemAlerts] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch profile if authenticated but user is null (resolves deadlock)
  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && !user) {
        try {
          const res = await UserApi.getMe();
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user profile in admin layout:", error);
          clearAuth();
          toast.error("Không thể tải thông tin tài khoản. Vui lòng đăng nhập lại!");
        }
      }
    };
    fetchProfile();
  }, [isAuthenticated, user, setUser, clearAuth]);

  // Secure Route Guard
  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập với tài khoản quản trị viên.");
        router.push("/auth/login");
      }
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center font-sans text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-fuchsia-500 border-t-transparent" />
          <p className="text-xs uppercase tracking-widest font-black text-slate-400">
            Đang tải trung tâm điều hành...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    clearAuth();
    toast.success("Đăng xuất quản trị viên thành công!");
    router.push("/auth/login");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cấu hình hệ thống admin thành công!");
    setIsSettingsOpen(false);
  };

  // Sidebar Menu Items for Admin
  const menuItems = [
    {
      href: "/admin/subscription",
      label: "Quản lý gói cước",
      icon: Layers,
    }
  ];

  const currentUser = user || {
    full_name: "Roomie Admin",
    email: "admin@roomie.vn",
    role: "ADMIN"
  };

  const initials = currentUser.full_name
    ? currentUser.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <div className="bg-[#0b0f19] text-[#F8FAFC] min-h-screen md:h-screen font-sans antialiased overflow-x-hidden md:overflow-hidden relative flex flex-col md:flex-row">
      {/* Background radial glowing effects */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Mobile Top Bar */}
      <div className="md:hidden h-16 border-b border-white/5 bg-[#0f172a]/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40 w-full">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <Building className="h-4.5 w-4.5 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-xs uppercase tracking-widest text-fuchsia-400 block leading-none">
              ROOMIE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl border border-white/5 bg-[#0f172a]/40 text-slate-450 hover:text-white transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-fuchsia-500" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl border border-white/5 bg-[#0f172a]/40 text-slate-450 hover:text-white transition-all cursor-pointer"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
            />

            {/* Sidebar drawer content */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/5 bg-[#0f172a]/95 backdrop-blur-2xl p-6 flex flex-col justify-between overflow-y-auto md:hidden"
            >
              {/* Header inside drawer */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                      <Building className="h-5 w-5 text-white stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm uppercase tracking-widest text-fuchsia-400 block leading-none">
                        ROOMIE
                      </span>
                      <span className="text-[10px] font-black uppercase text-slate-405 tracking-wider block mt-1 font-body">
                        System Admin
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl border border-white/5 bg-white/5 text-slate-450 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-6 px-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-500/20 to-fuchsia-500/5 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-black shadow-inner">
                    {initials}
                  </div>
                  <div className="flex flex-col space-y-0.5 overflow-hidden">
                    <span className="text-sm font-black text-slate-105 truncate">
                      {currentUser.full_name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-455 truncate block font-body">
                      {currentUser.email}
                    </span>
                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-fuchsia-400">
                      Admin Pro
                    </span>
                  </div>
                </div>

                {/* Navigation links */}
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                          active
                            ? "bg-gradient-to-r from-fuchsia-600/15 to-fuchsia-600/5 border border-fuchsia-500/30 text-fuchsia-400 shadow-lg shadow-fuchsia-500/5"
                            : "text-slate-400 hover:bg-white/5 hover:text-slate-205 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-fuchsia-400" : "text-slate-500"}`} />
                          <span>{item.label}</span>
                        </div>
                        {active && (
                          <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Actions inside drawer */}
              <div className="border-t border-white/5 pt-6 space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-slate-205 transition-all cursor-pointer border border-transparent"
                >
                  <Settings className="h-4.5 w-4.5 text-slate-500" />
                  <span>Cấu hình tổng</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-305 transition-all cursor-pointer border border-transparent"
                >
                  <LogOut className="h-4.5 w-4.5 text-red-500/60" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Layout */}
      <div className="w-full relative z-10 min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row">
        
        {/* COLUMN 1: Sidebar Nav Menu (Desktop) */}
        <aside className="hidden md:flex border-r border-white/5 bg-[#0f172a]/60 backdrop-blur-xl p-6 flex-col justify-between w-[280px] h-full shrink-0 overflow-y-auto">
          
          {/* Top Branding & Profile Summary */}
          <div className="space-y-8">
            {/* Header branding */}
            <div className="flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                <Building className="h-5 w-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-sm uppercase tracking-widest text-fuchsia-400 block leading-none">
                  ROOMIE
                </span>
                <span className="text-[10px] font-black uppercase text-slate-405 tracking-wider block mt-1 font-body">
                  System Admin
                </span>
              </div>
            </div>

            {/* Profile card summary */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-6 px-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-500/20 to-fuchsia-500/5 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-black shadow-inner">
                {initials}
              </div>
              <div className="flex flex-col space-y-0.5 overflow-hidden">
                <span className="text-sm font-black text-slate-105 truncate">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] font-semibold text-slate-455 truncate block font-body">
                  {currentUser.email}
                </span>
                <span className="mt-1 inline-flex w-fit items-center rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-fuchsia-400">
                  Admin Pro
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-fuchsia-600/15 to-fuchsia-600/5 border border-fuchsia-500/30 text-fuchsia-400 shadow-lg shadow-fuchsia-500/5"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-205 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-fuchsia-400" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && (
                      <motion.div
                        layoutId="sidebarActiveIndicatorAdmin"
                        className="h-1.5 w-1.5 rounded-full bg-fuchsia-500"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom actions */}
          <div className="border-t border-white/5 pt-6 space-y-1">
            {/* Setting (Popup trigger) */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-slate-255 transition-all cursor-pointer border border-transparent"
            >
              <Settings className="h-4.5 w-4.5 text-slate-500" />
              <span>Cấu hình tổng</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-305 transition-all cursor-pointer border border-transparent"
            >
              <LogOut className="h-4.5 w-4.5 text-red-500/60" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* COLUMN 2: Content pane */}
        <main className="flex-1 min-w-0 p-8 sm:p-12 flex flex-col justify-start overflow-y-auto md:h-screen">
          {children}
        </main>
      </div>

      {/* SETTINGS POPUP MODAL */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 z-10 text-left text-[#F8FAFC]"
            >
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 mb-6">
                <span className="text-[10px] font-black uppercase text-fuchsia-500 tracking-widest block font-body">
                  Admin System Parameters
                </span>
                <h3 className="text-xl font-black text-slate-101">Cấu hình Hệ thống Admin</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-body">
                  Thiết lập tham số hoạt động chung, gửi thông báo cảnh báo và phân quyền quản trị viên.
                </p>
              </div>

              <div className="flex gap-2 border-b border-white/5 pb-4 mb-6">
                {[
                  { id: "profile", label: "Hồ sơ Admin", icon: ShieldCheck },
                  { id: "system", label: "Hệ thống", icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = settingsTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSettingsTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                        active
                          ? "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400"
                          : "border-transparent text-slate-400 hover:text-slate-205"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                {settingsTab === "profile" ? (
                  <div className="space-y-3 font-body">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-404 uppercase tracking-widest block">Tên hiển thị Admin</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-fuchsia-500 text-slate-200"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-404 uppercase tracking-widest block">Cấp bậc Quản trị</label>
                      <input
                        type="text"
                        value={adminRole}
                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none text-slate-450 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 font-body">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5 max-w-[340px]">
                        <span className="text-[10px] font-bold text-slate-200 block">Thông báo cảnh báo giao dịch</span>
                        <p className="text-[9px] text-slate-455 leading-relaxed">
                          Gửi cảnh báo đến nhóm bảo mật khi phát hiện lượng thanh toán bất thường hoặc lỗi cổng VNPay.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSystemAlerts(!systemAlerts)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-all duration-300 cursor-pointer ${
                          systemAlerts ? "bg-fuchsia-500" : "bg-slate-700"
                        }`}
                      >
                        <span className={`block h-4.5 w-4.5 rounded-full bg-[#0F172A] transition-all duration-300 ${
                          systemAlerts ? "translate-x-4.5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-350 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-fuchsia-950/20"
                  >
                    Lưu cấu hình
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
