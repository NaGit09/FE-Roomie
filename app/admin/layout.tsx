"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  Coins,
  Zap,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Lock,
  Compass,
  ArrowLeft,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Rehydrate auth store on mount to ensure persistent state is loaded
    useAuthStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const handleLogout = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          clearAuth();
          router.push("/auth/login");
          resolve(true);
        }, 1000);
      }),
      {
        loading: "Đang đăng xuất khỏi tài khoản admin...",
        success: "Đã đăng xuất thành công!",
        error: "Đăng xuất thất bại.",
      }
    );
  };

  const navItems = [
    { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { name: "Người dùng", href: "/admin/user", icon: Users },
    { name: "Phòng trọ", href: "/admin/room", icon: Home },
    { name: "Tin đăng", href: "/admin/post", icon: FileText },
    { name: "Đơn hàng", href: "/admin/order", icon: Coins },
    { name: "Gói cước", href: "/admin/subscription", icon: Zap },
    { name: "Báo cáo", href: "/admin/report", icon: AlertTriangle },
  ];

  // While checking hydration, render a premium dashboard load indicator
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center font-sans">
        <Compass className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase font-mono">
          Khởi tạo hệ thống quản trị...
        </span>
      </div>
    );
  }

  // Auth Guard check: If not authenticated or not ADMIN role
  const isUserAdmin = isAuthenticated && user?.role === "ADMIN";

  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-[#020617] text-[#FAF7F2] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 text-center space-y-8 shadow-2xl relative z-10"
        >
          {/* Lock icon */}
          <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="h-10 w-10" />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-red-400 font-extrabold uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 inline-block">
              Truy cập bị từ chối
            </span>
            <h2 className="text-2xl font-bold text-slate-100 font-heading">
              Bạn không có quyền hạn
            </h2>
            <p className="text-xs text-slate-400 font-medium font-body leading-relaxed">
              Trang web quản trị này chỉ dành riêng cho Quản trị viên hệ thống. Vui lòng đăng nhập bằng tài khoản Admin hợp lệ hoặc quay lại trang chủ.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full h-13 font-bold uppercase tracking-wider text-[10px] bg-red-650 hover:bg-red-700 bg-red-600 text-white rounded-2xl active:scale-95 transition-all shadow-lg shadow-red-600/10 cursor-pointer flex items-center justify-center gap-2"
            >
              Đăng nhập Admin
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full h-13 font-bold uppercase tracking-wider text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-2xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Quay về Trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Get active menu title based on current path
  const currentNav = navItems.find((item) => item.href === pathname) || { name: "Hệ thống quản trị" };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex overflow-hidden">
      
      {/* 1. FIXED DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-[#080d1a] shadow-xl z-20 transition-all duration-300">
        
        {/* Sidebar Header Brand Logo */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-white/5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg shadow-inner">
            R
          </div>
          <div className="space-y-0.5 text-left">
            <span className="font-heading font-black text-sm tracking-widest text-slate-100 block uppercase">
              ROOMIE
            </span>
            <span className="text-[9px] font-mono font-black text-emerald-400 tracking-widest uppercase block">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={idx}
                onClick={() => router.push(item.href)}
                className={`w-full h-11 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                  isActive 
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-emerald-400 animate-pulse" : "text-slate-400 group-hover:text-slate-200"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Settings & Logout Bottom Footer */}
        <div className="p-4 border-t border-white/5 bg-[#050912]/50 space-y-1.5 shrink-0">
          <button
            onClick={() => router.push("/admin/setting")}
            className={`w-full h-11 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 group cursor-pointer ${
              pathname === "/admin/setting"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            <Settings className="h-4.5 w-4.5 text-slate-400 group-hover:text-slate-200" />
            <span>Cài đặt hệ thống</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full h-11 px-4 rounded-xl text-left text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 text-red-400" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE COLLAPSIBLE DRAWER SIDEBAR */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/85 lg:hidden"
            />
            {/* Sliding Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed left-0 top-0 h-screen w-64 border-r border-white/5 bg-[#080d1a] shadow-2xl z-40 lg:hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
                      R
                    </div>
                    <span className="font-heading font-black text-sm tracking-widest text-slate-100 block uppercase">
                      ROOMIE
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-full border border-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <nav className="px-4 py-6 space-y-1.5 overflow-y-auto">
                  {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          router.push(item.href);
                        }}
                        className={`w-full h-11 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                          isActive 
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4.5 w-4.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-white/5 bg-[#050912]/50 space-y-1.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/admin/setting");
                  }}
                  className={`w-full h-11 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-3 group cursor-pointer ${
                    pathname === "/admin/setting"
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Settings className="h-4.5 w-4.5 text-slate-400" />
                  <span>Cài đặt hệ thống</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full h-11 px-4 rounded-xl text-left text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-red-400" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. RIGHT HAND VIEW PORT */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300">
        
        {/* Top Header Panel */}
        <header className="h-20 border-b border-white/5 bg-[#020617]/50 backdrop-blur-md sticky top-0 flex items-center justify-between px-6 sm:px-8 z-10">
          
          {/* Header Left: Menu trigger & Page title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-white/5 text-slate-400 hover:text-white cursor-pointer hover:bg-white/5 active:scale-95 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block space-y-0.5 text-left">
              <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-500">
                <span>Roomie Admin</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-emerald-500 font-extrabold">{currentNav.name}</span>
              </div>
              <h1 className="font-heading text-lg font-black text-slate-100 tracking-tight leading-none uppercase">
                {currentNav.name}
              </h1>
            </div>
          </div>

          {/* Header Right: Admin profile, notification and search placeholder */}
          <div className="flex items-center gap-4">
            
            {/* Search Panel */}
            <div className="hidden md:flex items-center gap-2 h-10 w-64 bg-slate-900/60 rounded-xl px-3.5 border border-white/5 text-xs text-slate-500 font-medium">
              <Search className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Tìm kiếm tác vụ...</span>
            </div>

            {/* Notification Bell */}
            <button className="h-10 w-10 rounded-xl border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 relative cursor-pointer active:scale-95 transition-all">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-emerald-500 rounded-full" />
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-white/5" />

            {/* Admin profile detail block */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center shadow-inner uppercase shrink-0">
                {user?.full_name?.substring(0, 2) || "AD"}
              </div>
              <div className="hidden sm:block space-y-0.5 text-left shrink-0">
                <span className="text-xs font-bold text-slate-200 block">{user?.full_name || "Hệ thống"}</span>
                <span className="inline-flex items-center gap-0.5 text-[8px] font-mono tracking-widest font-black uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded leading-none">
                  ADMIN PORTAL
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic page children component injection */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}
