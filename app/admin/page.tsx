"use client";

import React, { useState, useEffect } from "react";
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
  Sparkles,
  Calendar,
  Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import formatVND from "@/utils/priceUtils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

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
      bg: "bg-primary/10 border-amber-500/20",
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

  // State for chart interactivity
  const [mounted, setMounted] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState<"week" | "month" | "year">("week");
  const [pieMonth, setPieMonth] = useState<"6" | "5" | "4">("6");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock revenue datasets for different periods
  const weeklyRevenueData = [
    { name: "Thứ 2", revenue: 12000000 },
    { name: "Thứ 3", revenue: 15000000 },
    { name: "Thứ 4", revenue: 18000000 },
    { name: "Thứ 5", revenue: 14000000 },
    { name: "Thứ 6", revenue: 22000000 },
    { name: "Thứ 7", revenue: 28000000 },
    { name: "Chủ Nhật", revenue: 26800000 },
  ];

  const monthlyRevenueData = [
    { name: "Tuần 1", revenue: 32000000 },
    { name: "Tuần 2", revenue: 45000000 },
    { name: "Tuần 3", revenue: 38000000 },
    { name: "Tuần 4", revenue: 52000000 },
  ];

  const yearlyRevenueData = [
    { name: "Tháng 1", revenue: 85000000 },
    { name: "Tháng 2", revenue: 92000000 },
    { name: "Tháng 3", revenue: 110000000 },
    { name: "Tháng 4", revenue: 98000000 },
    { name: "Tháng 5", revenue: 125000000 },
    { name: "Tháng 6", revenue: 135800000 },
    { name: "Tháng 7", revenue: 142000000 },
    { name: "Tháng 8", revenue: 138000000 },
    { name: "Tháng 9", revenue: 150000000 },
    { name: "Tháng 10", revenue: 165000000 },
    { name: "Tháng 11", revenue: 180000000 },
    { name: "Tháng 12", revenue: 210000000 },
  ];

  // Mock product category revenue datasets
  const categoryDataM6 = [
    { name: "Gói Landlord VIP", value: 74690000, color: "#EC4899" },
    { name: "Gói Landlord Premium", value: 33950000, color: "#8B5CF6" },
    { name: "Gói Renter VIP", value: 16296000, color: "#3B82F6" },
    { name: "Gói Renter Basic", value: 6790000, color: "#60A5FA" },
    { name: "Đẩy tin / Highlight", value: 4074000, color: "#F59E0B" },
  ];

  const categoryDataM5 = [
    { name: "Gói Landlord VIP", value: 60500000, color: "#EC4899" },
    { name: "Gói Landlord Premium", value: 30250000, color: "#8B5CF6" },
    { name: "Gói Renter VIP", value: 18150000, color: "#3B82F6" },
    { name: "Gói Renter Basic", value: 7260000, color: "#60A5FA" },
    { name: "Đẩy tin / Highlight", value: 4840000, color: "#F59E0B" },
  ];

  const categoryDataM4 = [
    { name: "Gói Landlord VIP", value: 54000050, color: "#EC4899" },
    { name: "Gói Landlord Premium", value: 27551040, color: "#8B5CF6" },
    { name: "Gói Renter VIP", value: 16530620, color: "#3B82F6" },
    { name: "Gói Renter Basic", value: 7714290, color: "#60A5FA" },
    { name: "Đẩy tin / Highlight", value: 4408170, color: "#F59E0B" },
  ];

  const getBarChartData = () => {
    switch (revenuePeriod) {
      case "month":
        return monthlyRevenueData;
      case "year":
        return yearlyRevenueData;
      case "week":
      default:
        return weeklyRevenueData;
    }
  };

  const getPieChartData = () => {
    switch (pieMonth) {
      case "5":
        return categoryDataM5;
      case "4":
        return categoryDataM4;
      case "6":
      default:
        return categoryDataM6;
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[9px] font-black">
        {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""}
      </text>
    );
  };

  return (
    <div className="space-y-10 text-slate-800 font-sans">
      
      {/* 1. Greeting Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3 animate-spin" />
            Hệ thống đang hoạt động ổn định
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 font-heading">
            TỔNG QUAN HỆ THỐNG
          </h2>
          <p className="text-xs text-slate-650 font-medium font-body max-w-xl">
            Báo cáo tóm tắt các hoạt động, thông số người dùng, đơn hàng và các cảnh báo báo cáo mới nhất cần kiểm duyệt trong 24 giờ qua.
          </p>
        </div>
        
        {/* System Health Summary pill */}
        <div className="bg-card border border-slate-200 p-4 rounded-2xl flex items-center gap-3 shrink-0 self-start md:self-center">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 text-left">
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-slate-650 block">
              Trạng thái máy chủ
            </span>
            <span className="text-xs font-bold text-slate-700 block">99.98% Uptime (Bình thường)</span>
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
              className="rounded-3xl border border-slate-200 bg-card/80 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase text-slate-650 tracking-wider">
                    {stat.label}
                  </span>
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <h3 className="text-2xl font-black text-slate-800">
                    {stat.format === "vnd" ? formatVND(stat.value as number) : stat.value}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-650 font-body">
                    {stat.sub}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{stat.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Splitted Bento Panels - Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Bento: Bar Chart for Revenue by time period (7 Cols) */}
        <div className="lg:col-span-7 rounded-[2rem] border border-slate-200 bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest block">
                Store Revenue Analytics
              </span>
              <h3 className="font-heading text-sm font-bold text-slate-700 uppercase tracking-wide">
                BIỂU ĐỒ DOANH THU CỬA HÀNG
              </h3>
              <p className="text-[10px] text-slate-650 font-medium font-body leading-none">
                Doanh số giao dịch qua hệ thống Roomie theo chu kỳ thời gian.
              </p>
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 p-1 self-start sm:self-center shrink-0">
              <button
                onClick={() => setRevenuePeriod("week")}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  revenuePeriod === "week"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-slate-650 hover:text-slate-700 border border-transparent"
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setRevenuePeriod("month")}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  revenuePeriod === "month"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-slate-650 hover:text-slate-700 border border-transparent"
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setRevenuePeriod("year")}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  revenuePeriod === "year"
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-slate-650 hover:text-slate-700 border border-transparent"
                }`}
              >
                Năm
              </button>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 w-full text-xs font-semibold">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getBarChartData()} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D9D9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B6560" 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#6B6560" 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#F5EDE0", borderColor: "#D9D9D9", borderRadius: "1rem", color: "#0D1117" }}
                    labelStyle={{ color: "#6B6560", fontWeight: "bold", fontSize: "10px" }}
                    itemStyle={{ color: "#10B981", fontWeight: "bold" }}
                    formatter={(value: any) => [formatVND(value), "Doanh thu"]}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10B981" 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-650">
                Đang tải biểu đồ doanh thu...
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-slate-200 pt-4 flex items-center justify-between text-[10px] text-slate-650 font-medium font-body">
            <span>Thống kê cập nhật tự động theo thời gian thực</span>
            <button
              onClick={() => router.push("/admin/order")}
              className="text-primary font-black uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer"
            >
              Chi tiết giao dịch
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right Bento: Pie Chart showing store revenue for a month by product category (5 Cols) */}
        <div className="lg:col-span-5 rounded-[2rem] border border-slate-200 bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-black uppercase text-pink-400 tracking-widest block">
                Category Breakdown
              </span>
              <h3 className="font-heading text-sm font-bold text-slate-700 uppercase tracking-wide">
                PHÂN BỔ GÓI DỊCH VỤ
              </h3>
            </div>
            
            {/* Month selector dropdown */}
            <div className="relative shrink-0">
              <select
                value={pieMonth}
                onChange={(e) => setPieMonth(e.target.value as any)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-700 outline-none cursor-pointer focus:border-pink-500/55 transition-all"
              >
                <option value="6" className="bg-card text-slate-700">Tháng 6 / 2026</option>
                <option value="5" className="bg-card text-slate-700">Tháng 5 / 2026</option>
                <option value="4" className="bg-card text-slate-700">Tháng 4 / 2026</option>
              </select>
            </div>
          </div>

          {/* Pie Chart Display */}
          <div className="h-44 w-full relative flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPieChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    innerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {getPieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#F5EDE0", borderColor: "#D9D9D9", borderRadius: "0.75rem", color: "#0D1117" }}
                    itemStyle={{ fontWeight: "bold" }}
                    formatter={(value: any) => [formatVND(value), "Doanh thu"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-650">
                Đang tải biểu đồ phân bổ...
              </div>
            )}
            <div className="absolute text-center select-none pointer-events-none font-sans">
              <span className="text-[8px] font-bold text-slate-650 block uppercase tracking-widest">Tổng thu</span>
              <span className="text-xs font-black text-slate-800 block mt-0.5">
                {formatVND(getPieChartData().reduce((sum, item) => sum + item.value, 0))}
              </span>
            </div>
          </div>

          {/* Custom legends listing */}
          <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-650 border-t border-dashed border-slate-200 pt-3">
            {getPieChartData().map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate text-slate-650" title={item.name}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Bottom Data Row: Reports (8 columns) and Signups (4 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Reports Verification Desk (8 Columns) */}
        <div className="lg:col-span-8 rounded-[2rem] border border-slate-200 bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-lg space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <h3 className="font-heading text-sm font-bold text-slate-700 uppercase tracking-wide">
                  YÊU CẦU BÁO CÁO CẦN DUYỆT
                </h3>
                <p className="text-[10px] text-slate-650 font-medium font-body leading-none">
                  Danh sách tin đăng hoặc người dùng bị cắm cờ cảnh báo mới nhất từ renters.
                </p>
              </div>

              <div className="flex gap-2">
                <div className="inline-flex items-center gap-1 text-[8px] font-mono tracking-widest font-black uppercase bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full">
                  <Clock className="h-3 w-3 animate-pulse" />
                  <span>Chờ xử lý: {recentReports.filter(r => r.status === "PENDING").length}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[8px] font-mono tracking-widest font-black uppercase bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Đã xử lý: {recentReports.filter(r => r.status === "RESOLVED").length}</span>
                </div>
              </div>
            </div>

            {/* Reports Grid Table */}
            <div className="overflow-x-auto pr-1">
              <table className="w-full text-left border-collapse min-w-[550px] text-xs font-body">
                <thead>
                  <tr className="border-b border-slate-200 text-[9px] font-black uppercase tracking-wider text-slate-650 pb-3">
                    <th className="py-3 px-3 pl-0">Mã Báo cáo</th>
                    <th className="py-3 px-3">Người tố cáo</th>
                    <th className="py-3 px-3">Đối tượng</th>
                    <th className="py-3 px-3">Lý do</th>
                    <th className="py-3 px-3 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium text-slate-350">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 px-3 pl-0 font-mono font-bold text-slate-600">{report.id}</td>
                      <td className="py-3 px-3 font-bold text-slate-700">{report.reporter}</td>
                      <td className="py-3 px-3 text-slate-650 truncate max-w-[120px]" title={report.target}>{report.target}</td>
                      <td className="py-3 px-3 italic text-slate-650 truncate max-w-[150px]" title={report.reason}>{report.reason}</td>
                      <td className="py-3 px-3 text-right shrink-0">
                        <span className={`inline-flex items-center gap-0.5 text-[8px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded-md ${
                          report.status === "PENDING"
                            ? "bg-red-500/10 border border-red-500/20 text-red-400"
                            : "bg-primary/10 border border-primary/20 text-primary"
                        }`}>
                          {report.status === "PENDING" ? "Chờ xử lý" : "Đã xử lý"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => router.push("/admin/report")}
            className="w-full h-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-white/10 text-slate-700 text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 mt-4"
          >
            Xử lý trung tâm báo cáo
          </button>
        </div>

        {/* Recent Signups (4 Columns) */}
        <div className="lg:col-span-4 rounded-[2rem] border border-slate-200 bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-1 text-left">
            <h3 className="font-heading text-sm font-bold text-slate-700 uppercase tracking-wide">
              THÀNH VIÊN ĐĂNG KÝ MỚI
            </h3>
            <p className="text-[10px] text-slate-650 font-medium font-body leading-none">
              Danh sách tài khoản vừa đăng ký trên cổng Roomie.
            </p>
          </div>

          <div className="divide-y divide-white/5 space-y-3">
            {recentUsers.map((userItem, idx) => (
              <div key={idx} className="flex justify-between items-center pt-3 first:pt-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-xl bg-slate-200 border border-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center shadow-inner shrink-0">
                    {userItem.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="space-y-0.5 text-left min-w-0">
                    <span className="text-xs font-bold text-slate-700 block truncate">{userItem.name}</span>
                    <span className="text-[9px] text-slate-650 font-medium font-body block truncate">{userItem.email}</span>
                  </div>
                </div>
                
                <div className="text-right space-y-0.5 shrink-0 ml-2">
                  <span className={`inline-flex items-center gap-0.5 text-[7px] font-mono tracking-widest font-black uppercase px-1.5 py-0.5 rounded ${
                    userItem.role === "LANDLORD" 
                      ? "bg-primary/10 border border-amber-500/20 text-primary" 
                      : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                  }`}>
                    {userItem.role}
                  </span>
                  <span className="text-[7px] font-bold text-slate-600 block">
                    {userItem.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/admin/user")}
            className="w-full h-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-white/10 text-slate-700 text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            Quản lý thành viên
          </button>
        </div>

      </div>

    </div>
  );
}
