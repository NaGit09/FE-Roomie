/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Home,
  FileText,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  User,
  ShieldCheck,
  X,
  Building,
  Bell,
  Wallet,
  Lock,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import Link from "next/link";

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  
  // Mounted state for SSR safety
  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "payout" | "config">("profile");

  // Mock Settings state
  const [businessName, setBusinessName] = useState("Căn Hộ Roomie SG");
  const [taxCode, setTaxCode] = useState("0315482930");
  const [phone, setPhone] = useState("0909 123 456");
  const [bankAccount, setBankAccount] = useState("NGUYEN VAN LANDLORD");
  const [bankNumber, setBankNumber] = useState("19001008888");
  const [bankName, setBankName] = useState("MB BANK");
  const [autoApprove, setAutoApprove] = useState(true);
  const [notifyNewRenter, setNotifyNewRenter] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Secure Route Guard
  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập với tài khoản chủ nhà để truy cập.");
        router.push("/auth/login");
      } 
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center font-sans text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F59E0B] border-t-transparent" />
          <p className="text-xs uppercase tracking-widest font-black text-slate-400">
            Đang xác thực thông tin...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    clearAuth();
    toast.success("Đăng xuất tài khoản Chủ nhà thành công!");
    router.push("/auth/login");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cập nhật cài đặt chủ nhà thành công!");
    setIsSettingsOpen(false);
  };

  // Sidebar Menu Items
  const menuItems = [
    {
      href: "/landlord/dashboard",
      label: "Bảng tổng quan",
      icon: LayoutDashboard,
    },
    {
      href: "/landlord/rooms",
      label: "Quản lý phòng",
      icon: Home,
    },
    {
      href: "/landlord/posts",
      label: "Quản lý tin đăng",
      icon: FileText,
    },
    {
      href: "/landlord/statistic",
      label: "Báo cáo thống kê",
      icon: TrendingUp,
    },
    {
      href: "/landlord/subscription",
      label: "Gói cước đã mua",
      icon: CreditCard,
    },
  ];

  return (
    <div className="bg-[#0b0f19] text-[#F8FAFC] min-h-screen md:h-screen font-sans antialiased overflow-x-hidden md:overflow-hidden relative flex">
      {/* Background radial glowing effects */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] rounded-full bg-[#F59E0B]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[#8B5CF6]/5 blur-[100px] pointer-events-none" />

      {/* Grid Layout: 1 Row, 2 Columns */}
      <div className="w-full grid grid-cols-1 md:grid-cols-[280px_1fr] relative z-10 min-h-screen md:h-screen md:overflow-hidden">
        
        {/* COLUMN 1: Sidebar Nav Menu */}
        <aside className="border-r border-white/5 bg-[#0f172a]/60 backdrop-blur-xl p-6 flex flex-col justify-between h-fit md:h-full md:sticky md:top-0 overflow-y-auto shrink-0">
          
          {/* Top Branding & Profile Summary */}
          <div className="space-y-8">
            {/* Header branding */}
            <div className="flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] flex items-center justify-center shadow-lg shadow-[#F59E0B]/20">
                <Building className="h-5 w-5 text-slate-900 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-sm uppercase tracking-widest text-[#F59E0B] block leading-none">
                  ROOMIE
                </span>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mt-1">
                  Landlord Hub
                </span>
              </div>
            </div>

            {/* Profile card summary */}
            {/* <div className="flex items-center gap-3 border-b border-white/5 pb-6 px-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/20 to-[#8B5CF6]/5 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-black shadow-inner">
                {initials}
              </div>
              <div className="flex flex-col space-y-0.5 overflow-hidden">
                <span className="text-sm font-black text-slate-100 truncate">
                  {user.full_name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 truncate block">
                  {user.email}
                </span>
                <span className="mt-1 inline-flex w-fit items-center rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-[#F59E0B]">
                  Chủ nhà Pro
                </span>
              </div>
            </div> */}

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
                        ? "bg-gradient-to-r from-[#F59E0B]/15 to-[#F59E0B]/5 border border-[#F59E0B]/30 text-[#F59E0B] shadow-lg shadow-[#F59E0B]/5"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-[#F59E0B]" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && (
                      <motion.div
                        layoutId="sidebarActiveIndicator"
                        className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]"
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
              className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all cursor-pointer border border-transparent"
            >
              <Settings className="h-4.5 w-4.5 text-slate-500" />
              <span>Cài đặt hệ thống</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer border border-transparent"
            >
              <LogOut className="h-4.5 w-4.5 text-red-500/60" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* COLUMN 2: Content pane */}
        <main className="min-w-0 p-8 sm:p-12 flex flex-col justify-start md:overflow-y-auto md:h-screen">
          {children}
        </main>
      </div>

      {/* SETTINGS POPUP MODAL */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#0f172a]/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 z-10 text-left text-[#F8FAFC]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="space-y-1 mb-8">
                <span className="text-[10px] font-black uppercase text-[#F59E0B] tracking-widest block">
                  Landlord Configurations
                </span>
                <h3 className="text-2xl font-black text-slate-100">Cấu hình tài khoản Chủ nhà</h3>
                <p className="text-xs text-slate-400">
                  Thiết lập thông tin đại diện kinh doanh, tài khoản ngân hàng thụ hưởng và cấu hình tự động.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-white/5 pb-4 mb-6">
                {[
                  { id: "profile", label: "Hồ sơ kinh doanh", icon: Building },
                  { id: "payout", label: "Tài khoản thụ hưởng", icon: Wallet },
                  { id: "config", label: "Cấu hình tự động", icon: Bell },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = settingsTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSettingsTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                        active
                          ? "bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Tab 1: Profile */}
                {settingsTab === "profile" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        Tên thương hiệu kinh doanh
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] text-slate-100"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                          Mã số thuế doanh nghiệp
                        </label>
                        <input
                          type="text"
                          value={taxCode}
                          onChange={(e) => setTaxCode(e.target.value)}
                          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] text-slate-100"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                          Số điện thoại liên hệ
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] text-slate-100"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Payout */}
                {settingsTab === "payout" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        Tên chủ tài khoản ngân hàng
                      </label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value.toUpperCase())}
                        className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] text-slate-100"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                          Số tài khoản
                        </label>
                        <input
                          type="text"
                          value={bankNumber}
                          onChange={(e) => setBankNumber(e.target.value.replace(/\D/g, ""))}
                          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] text-slate-100"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                          Ngân hàng thụ hưởng
                        </label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value.toUpperCase())}
                          className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B] text-slate-100"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Config */}
                {settingsTab === "config" && (
                  <div className="space-y-4">
                    {/* Config 1 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5 max-w-[420px]">
                        <span className="text-[11px] font-bold text-slate-200 block">Tự động duyệt ghép đôi</span>
                        <p className="text-[10px] text-slate-450 leading-relaxed font-body">
                          Khi có renter gửi kết nối, hệ thống sẽ tự động duyệt kết nối và tạo phòng chat.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutoApprove(!autoApprove)}
                        className={`w-12 h-6.5 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                          autoApprove ? "bg-[#F59E0B]" : "bg-slate-700"
                        }`}
                      >
                        <span className={`block h-4.5 w-4.5 rounded-full bg-[#0F172A] transition-all duration-300 ${
                          autoApprove ? "translate-x-5.5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Config 2 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="space-y-0.5 max-w-[420px]">
                        <span className="text-[11px] font-bold text-slate-200 block">Thông báo khi có kết nối mới</span>
                        <p className="text-[10px] text-slate-450 leading-relaxed font-body">
                          Gửi email thông báo ngay lập tức cho bạn khi có renter quan tâm và muốn ghép nối.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotifyNewRenter(!notifyNewRenter)}
                        className={`w-12 h-6.5 rounded-full p-1 transition-all duration-300 cursor-pointer ${
                          notifyNewRenter ? "bg-[#F59E0B]" : "bg-slate-700"
                        }`}
                      >
                        <span className={`block h-4.5 w-4.5 rounded-full bg-[#0F172A] transition-all duration-300 ${
                          notifyNewRenter ? "translate-x-5.5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Save Button */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="h-11 px-5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-900 text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-[#F59E0B]/10"
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