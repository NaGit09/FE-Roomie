"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Home,
  FileText,
  Coins,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import formatVND from "@/utils/priceUtils";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Mock operational statistics
  const stats = [
    {
      label: "Tổng người dùng",
      value: "12,458",
      sub: "8,520 Renters • 3,938 Landlords",
      change: "+15.2% mới trong tháng",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Tổng phòng trọ",
      value: "4,829",
      sub: "3,612 Phòng đã duyệt • 1,217 Trống",
      change: "+8.4% so với tháng trước",
      icon: Home,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Lượt tin đăng",
      value: "2,458",
      sub: "1,890 Hoạt động • 568 Chờ duyệt",
      change: "+12.1% lượng truy cập mới",
      icon: FileText,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Tổng doanh thu",
      value: 135800000,
      sub: "Doanh số Premium & VIP",
      change: "+22.5% tăng trưởng doanh số",
      icon: Coins,
      format: "vnd",
      color: "text-pink-500",
      bg: "bg-pink-500/10 border-pink-500/20",
    },
  ];

  // Mock recent reports
  const recentReports = [
    { id: "REP-9821", reporter: "Đỗ Anh Hào", target: "Phòng trọ Q10 giá tốt", reason: "Tin đăng ảo, không liên lạc được", time: "10 phút trước", status: "PENDING" },
    { id: "REP-9819", reporter: "Lê Nguyễn Anh", target: "Căn hộ dịch vụ cao cấp Bình Thạnh", reason: "Thông tin sai lệch diện tích thực tế", time: "2 giờ trước", status: "PENDING" },
    { id: "REP-9812", reporter: "Nguyễn Văn Hùng", target: "Chủ nhà Lâm Thị Nga", reason: "Ngôn từ thô tục, quấy rối qua chat", time: "1 ngày trước", status: "RESOLVED" },
  ];

  // Mock recent user signups
  const recentUsers = [
    { name: "Phạm Hoàng Sơn", email: "son.pham@gmail.com", role: "RENTER", time: "5 phút trước" },
    { name: "Trương Mỹ Dung", email: "dung.truong@landlord.vn", role: "LANDLORD", time: "18 phút trước" },
    { name: "Vũ Hữu Phước", email: "phuoc.vu99@gmail.com", role: "RENTER", time: "1 giờ trước" },
    { name: "Lê Minh Khoa", email: "khoa.le@gmail.com", role: "RENTER", time: "3 giờ trước" },
  ];

  // Mock weekly revenue bars
  const weeklyRevenue = [
    { day: "Thứ 2", value: 12000000 },
    { day: "Thứ 3", value: 15000000 },
    { day: "Thứ 4", value: 18000000 },
    { day: "Thứ 5", value: 14000000 },
    { day: "Thứ 6", value: 22000000 },
    { day: "Thứ 7", value: 28000000 },
    { day: "Chủ Nhật", value: 26800000 },
  ];

  return (
    <div className="space-y-10 text-slate-100 font-sans">
      
      {/* 1. Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <Sparkles className="h-3 w-3 animate-spin" />
            Hệ thống đang hoạt động ổn định
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 font-heading">
            TỔNG QUAN HỆ THỐNG
          </h2>
          <p className="text-xs text-slate-400 font-medium font-body max-w-xl">
            Báo cáo tóm tắt các hoạt động, thông số người dùng, đơn hàng và các cảnh báo báo cáo mới nhất cần kiểm duyệt trong 24 giờ qua.
          </p>
        </div>
        
        {/* System Health Summary pill */}
        <div className="bg-[#080d1a] border border-white/5 p-4 rounded-2xl flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 text-left">
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-slate-500 block">
              Trạng thái máy chủ
            </span>
            <span className="text-xs font-bold text-slate-200 block">99.98% Uptime (Bình thường)</span>
          </div>
        </div>
      </div>

      {/* 2. Operational Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="rounded-3xl border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    {stat.label}
                  </span>
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <h3 className="text-2xl font-black text-slate-100">
                    {stat.format === "vnd" ? formatVND(stat.value as number) : stat.value}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 font-body">
                    {stat.sub}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dashed border-white/5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{stat.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Splitted Bento Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Bento: Weekly Revenue mock graphic (7 Cols) */}
        <div className="lg:col-span-7 rounded-[2rem] border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-left">
              <h3 className="font-heading text-sm font-bold text-slate-200 uppercase tracking-wide">
                BIỂU ĐỒ DOANH THU TUẦN NÀY
              </h3>
              <p className="text-[10px] text-slate-400 font-medium font-body leading-none">
                Doanh số giao dịch qua PayOS và VietQR được thống kê theo ngày.
              </p>
            </div>
            <span className="text-xs font-black text-emerald-400 font-mono">+12.8M xu</span>
          </div>

          {/* Simple custom flex charts utilizing Tailwind layout (No external package dependencies!) */}
          <div className="h-48 flex items-end justify-between gap-2.5 pt-4 px-2">
            {weeklyRevenue.map((item, idx) => {
              const maxHeight = 160;
              const maxVal = Math.max(...weeklyRevenue.map((v) => v.value));
              const height = (item.value / maxVal) * maxHeight;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative flex flex-col justify-end items-center h-[160px]">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-[calc(100%+8px)] bg-slate-900 border border-white/10 text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-200 shadow-xl pointer-events-none whitespace-nowrap z-10 font-mono">
                      {formatVND(item.value)}
                    </div>
                    {/* Graph bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}px` }}
                      transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                      className="w-full rounded-t-lg bg-linear-to-t from-emerald-600/30 via-emerald-500/80 to-emerald-400 group-hover:brightness-110 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 font-body leading-none">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-dashed border-white/5 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-medium font-body">
            <span>Đối soát hệ thống tuần tự 24/7</span>
            <button
              onClick={() => router.push("/admin/order")}
              className="text-[#FBBF24] font-black uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer"
            >
              Chi tiết giao dịch
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right Bento: Recent Sign-ups (5 Cols) */}
        <div className="lg:col-span-5 rounded-[2rem] border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-1 text-left">
            <h3 className="font-heading text-sm font-bold text-slate-200 uppercase tracking-wide">
              THÀNH VIÊN ĐĂNG KÝ MỚI
            </h3>
            <p className="text-[10px] text-slate-400 font-medium font-body leading-none">
              Danh sách tài khoản vừa đăng ký trên cổng Roomie.
            </p>
          </div>

          <div className="divide-y divide-white/5 space-y-3.5">
            {recentUsers.map((userItem, idx) => (
              <div key={idx} className="flex justify-between items-center pt-3.5 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-800 border border-white/5 text-slate-300 text-xs font-black flex items-center justify-center shadow-inner">
                    {userItem.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-bold text-slate-200 block">{userItem.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium font-body block">{userItem.email}</span>
                  </div>
                </div>
                
                <div className="text-right space-y-0.5 shrink-0">
                  <span className={`inline-flex items-center gap-0.5 text-[8px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded ${
                    userItem.role === "LANDLORD" 
                      ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" 
                      : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                  }`}>
                    {userItem.role}
                  </span>
                  <span className="text-[8px] font-bold text-slate-600 font-body block">
                    {userItem.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/admin/user")}
            className="w-full h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            Quản lý thành viên
          </button>
        </div>

      </div>

      {/* 4. Recent Reports verification desk */}
      <div className="rounded-[2.5rem] border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <h3 className="font-heading text-sm font-bold text-slate-200 uppercase tracking-wide">
              YÊU CẦU BÁO CÁO CẦN DUYỆT
            </h3>
            <p className="text-[10px] text-slate-400 font-medium font-body leading-none">
              Danh sách tin đăng hoặc người dùng bị cắm cờ cảnh báo mới nhất từ renters.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="inline-flex items-center gap-1 text-[8px] font-mono tracking-widest font-black uppercase bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full">
              <Clock className="h-3 w-3 animate-pulse" />
              <span>Chờ xử lý: {recentReports.filter(r => r.status === "PENDING").length}</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[8px] font-mono tracking-widest font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="h-3 w-3" />
              <span>Đã xử lý: {recentReports.filter(r => r.status === "RESOLVED").length}</span>
            </div>
          </div>
        </div>

        {/* Reports Grid Table */}
        <div className="overflow-x-auto pr-1">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs font-body">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-slate-500 pb-3">
                <th className="py-3 px-4 pl-0">Mã Báo cáo</th>
                <th className="py-3 px-4">Người báo cáo</th>
                <th className="py-3 px-4">Đối tượng bị tố cáo</th>
                <th className="py-3 px-4">Lý do</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-slate-350">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-4 pl-0 font-mono font-bold text-slate-300">{report.id}</td>
                  <td className="py-4 px-4 font-bold text-slate-200">{report.reporter}</td>
                  <td className="py-4 px-4 text-slate-400">{report.target}</td>
                  <td className="py-4 px-4 italic text-slate-450">{report.reason}</td>
                  <td className="py-4 px-4 text-slate-500">{report.time}</td>
                  <td className="py-4 px-4 text-right shrink-0">
                    <span className={`inline-flex items-center gap-0.5 text-[8px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded-md ${
                      report.status === "PENDING"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    }`}>
                      {report.status === "PENDING" ? "Chờ xử lý" : "Đã giải quyết"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => router.push("/admin/report")}
          className="w-full h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          Xử lý trung tâm báo cáo
        </button>
      </div>

    </div>
  );
}
