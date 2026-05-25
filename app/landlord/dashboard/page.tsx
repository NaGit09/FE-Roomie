"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  FileText, 
  Coins, 
  Users, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Zap,
  ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import formatVND from "@/utils/priceUtils";
import Link from "next/link";

export default function LandlordDashboardOverview() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentUser = user || {
    full_name: "Nguyễn Văn Landlord",
    email: "landlord@roomie.com",
    role: "LANDLORD"
  };

  // Mock statistics data
  const stats = [
    {
      label: "Doanh thu tháng này",
      value: 28500000,
      format: "vnd",
      change: "+12.5% so với tháng trước",
      icon: Coins,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      link: "/landlord/statistic"
    },
    {
      label: "Tỷ lệ lấp đầy phòng",
      value: "80%",
      sub: "12 / 15 phòng đã cho thuê",
      change: "Còn trống 3 phòng",
      icon: Home,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      link: "/landlord/rooms"
    },
    {
      label: "Lượt xem tin đăng",
      value: "4,528 Lượt",
      change: "+18% lượng truy cập mới",
      icon: FileText,
      color: "text-sky-500",
      bg: "bg-sky-500/10 border-sky-500/20",
      link: "/landlord/posts"
    },
    {
      label: "Yêu cầu ghép đôi mới",
      value: "8 Renter",
      sub: "Đang chờ bạn phản hồi",
      change: "4 yêu cầu mới hôm nay",
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10 border-violet-500/20",
      pulse: true,
      link: "/landlord/dashboard"
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in text-[#F8FAFC]">
      
      {/* Editorial Header Greeting */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#F59E0B]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Khu vực Chủ nhà Pro
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 leading-tight"
        >
          Xin chào, <span className="bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#8B5CF6] bg-clip-text text-transparent italic font-display">{currentUser.full_name}</span>
        </motion.h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium font-body max-w-2xl leading-relaxed">
          Chào mừng bạn quay lại hệ thống quản trị Roomie Landlord. Dưới đây là thông số vận hành kinh doanh và tình hình khai thác phòng của bạn trong 30 ngày qua.
        </p>
      </div>

      {/* Grid Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={idx} href={stat.link} className="block">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/5 bg-[#0f172a]/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group cursor-pointer h-full"
              >
                {/* Pulse effect */}
                {stat.pulse && (
                  <span className="absolute top-6 right-6 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      {stat.label}
                    </span>
                    <div className={`p-3 rounded-2xl ${stat.bg} transition-transform group-hover:scale-110`}>
                      <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-100">
                      {stat.format === "vnd" ? formatVND(stat.value as number) : stat.value}
                    </h3>
                    {stat.sub && (
                      <p className="text-[10px] font-bold text-slate-400 font-body">
                        {stat.sub}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-[#FBBF24]">
                  <span>{stat.change}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Subscription Status Banner Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-[2.5rem] bg-gradient-to-tr from-[#0F172A] via-[#1E293B]/60 to-[#0F172A] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute top-[-50%] right-[-10%] w-[30%] h-[100%] rounded-full bg-[#F59E0B]/10 blur-[80px] pointer-events-none" />

        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#F59E0B]/20 to-[#FBBF24]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shadow-inner shrink-0">
            <Zap className="h-8 w-8 text-[#F59E0B] animate-pulse" />
          </div>
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] px-2 py-0.5 rounded">
                Active Member
              </span>
              <span className="text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-0.5">
                <ShieldCheck className="h-3 w-3" /> Auto Verified
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-100">Gói Hội Viên Chủ Nhà Pro (12 Tháng)</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-body flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              Đăng ký ngày 25/05/2026. Hạn sử dụng tiếp theo: <strong className="text-slate-200">25/05/2027</strong>.
            </p>
          </div>
        </div>

        <button className="h-12 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-900 text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md shadow-[#F59E0B]/10 cursor-pointer flex items-center gap-1.5 shrink-0 self-start md:self-center">
          Quản lý đăng ký
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Box 1: Recent connect requests */}
        <div className="rounded-[2rem] border border-white/5 bg-[#0f172a]/30 backdrop-blur-md p-8 space-y-6">
          <h3 className="font-heading text-md font-bold text-slate-200">Kết nối khách thuê mới nhất</h3>
          <div className="divide-y divide-white/5 space-y-4">
            {[
              { name: "Lê Nguyễn Anh Hùng", match: 94, budget: 4500000, time: "2 giờ trước" },
              { name: "Phạm Minh Hoàng", match: 88, budget: 5000000, time: "Hôm qua" },
              { name: "Nguyễn Thu Thảo", match: 91, budget: 4000000, time: "2 ngày trước" },
            ].map((renter, idx) => (
              <div key={idx} className="flex justify-between items-center pt-4 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#8B5CF6]/5 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-black flex items-center justify-center">
                    {renter.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">{renter.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium font-body block">
                      Ngân sách: {formatVND(renter.budget)}/tháng • {renter.time}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full">
                  {renter.match}% Khớp
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: Quick Links */}
        <div className="rounded-[2rem] border border-white/5 bg-[#0f172a]/30 backdrop-blur-md p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-heading text-md font-bold text-slate-200">Thao tác nhanh</h3>
            <p className="text-xs text-slate-400 font-medium font-body leading-relaxed">
              Bạn có thể dễ dàng thêm phòng mới, cập nhật bảng giá tiện ích, hoặc đẩy tin đăng để thu hút thêm nhiều renter tương thích nhất.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5">
              Đăng phòng mới
            </button>
            <button className="h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5">
              Đẩy tin nổi bật
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}