/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  ChevronUp,
  Download,
  Calendar,
  Filter,
  ArrowRight,
  Coins,
  Package,
  CreditCard,
  CheckCircle2,
  TrendingDown,
  Loader2,
  RefreshCw
} from "lucide-react";
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
import { toast } from "sonner";

export default function AdminStatisticPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState<"week" | "month" | "year">("month");
  const [pieMonth, setPieMonth] = useState<"6" | "5" | "4">("6");

  // Fetch / Loading simulator
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Mock revenue datasets
  const weeklyRevenueData = [
    { name: "Thứ 2", revenue: 12000000, txCount: 8 },
    { name: "Thứ 3", revenue: 15000000, txCount: 11 },
    { name: "Thứ 4", revenue: 18000000, txCount: 13 },
    { name: "Thứ 5", revenue: 14000000, txCount: 9 },
    { name: "Thứ 6", revenue: 22000000, txCount: 15 },
    { name: "Thứ 7", revenue: 28000000, txCount: 20 },
    { name: "Chủ Nhật", revenue: 26800000, txCount: 18 },
  ];

  const monthlyRevenueData = [
    { name: "Tuần 1", revenue: 32000000, txCount: 24 },
    { name: "Tuần 2", revenue: 45000000, txCount: 35 },
    { name: "Tuần 3", revenue: 38000000, txCount: 29 },
    { name: "Tuần 4", revenue: 52000000, txCount: 42 },
  ];

  const yearlyRevenueData = [
    { name: "Tháng 1", revenue: 85000000, txCount: 75 },
    { name: "Tháng 2", revenue: 92000000, txCount: 82 },
    { name: "Tháng 3", revenue: 110000000, txCount: 95 },
    { name: "Tháng 4", revenue: 98000000, txCount: 80 },
    { name: "Tháng 5", revenue: 125000000, txCount: 110 },
    { name: "Tháng 6", revenue: 135800000, txCount: 124 },
    { name: "Tháng 7", revenue: 142000000, txCount: 130 },
    { name: "Tháng 8", revenue: 138000000, txCount: 125 },
    { name: "Tháng 9", revenue: 150000000, txCount: 140 },
    { name: "Tháng 10", revenue: 165000000, txCount: 155 },
    { name: "Tháng 11", revenue: 180000000, txCount: 168 },
    { name: "Tháng 12", revenue: 210000000, txCount: 190 },
  ];

  // Category distributions per month
  const categoryDataM6 = [
    { name: "Gói Landlord VIP", value: 74690000, count: 50, color: "#EC4899" },
    { name: "Gói Landlord Premium", value: 33950000, count: 34, color: "#8B5CF6" },
    { name: "Gói Renter VIP", value: 16296000, count: 82, color: "#3B82F6" },
    { name: "Gói Renter Basic", value: 6790000, count: 68, color: "#60A5FA" },
    { name: "Đẩy tin / Highlight", value: 4074000, count: 135, color: "#F59E0B" },
  ];

  const categoryDataM5 = [
    { name: "Gói Landlord VIP", value: 60500000, count: 40, color: "#EC4899" },
    { name: "Gói Landlord Premium", value: 30250000, count: 30, color: "#8B5CF6" },
    { name: "Gói Renter VIP", value: 18150000, count: 91, color: "#3B82F6" },
    { name: "Gói Renter Basic", value: 7260000, count: 73, color: "#60A5FA" },
    { name: "Đẩy tin / Highlight", value: 4840000, count: 161, color: "#F59E0B" },
  ];

  const categoryDataM4 = [
    { name: "Gói Landlord VIP", value: 54000050, count: 36, color: "#EC4899" },
    { name: "Gói Landlord Premium", value: 27551040, count: 27, color: "#8B5CF6" },
    { name: "Gói Renter VIP", value: 16530620, count: 83, color: "#3B82F6" },
    { name: "Gói Renter Basic", value: 7714290, count: 77, color: "#60A5FA" },
    { name: "Đẩy tin / Highlight", value: 4408170, count: 147, color: "#F59E0B" },
  ];

  const getBarChartData = () => {
    switch (revenuePeriod) {
      case "week":
        return weeklyRevenueData;
      case "year":
        return yearlyRevenueData;
      case "month":
      default:
        return monthlyRevenueData;
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

  const getActiveMonthLabel = () => {
    switch (pieMonth) {
      case "5": return "Tháng 5 / 2026";
      case "4": return "Tháng 4 / 2026";
      case "6":
      default:
        return "Tháng 6 / 2026";
    }
  };

  const handleExport = (format: "pdf" | "excel") => {
    toast.info(`Đang kết xuất báo cáo thống kê định dạng ${format.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`Đã xuất báo cáo doanh thu hệ thống thành công!`);
    }, 1500);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Dữ liệu thống kê đã được làm mới.");
    }, 600);
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-black">
        {percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""}
      </text>
    );
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-9 w-9 text-emerald-500 animate-spin" />
        <span className="text-[10px] font-mono tracking-widest font-black uppercase text-slate-500">
          Đang tính toán dữ liệu thống kê tài chính...
        </span>
      </div>
    );
  }

  // Calculate current active metrics
  const activePieData = getPieChartData();
  const totalMonthRevenue = activePieData.reduce((sum, item) => sum + item.value, 0);
  const totalMonthTransactions = activePieData.reduce((sum, item) => sum + item.count, 0);
  const landlordVipRevenue = activePieData.find(d => d.name.includes("Landlord VIP"))?.value || 0;
  const renterVipRevenue = activePieData.find(d => d.name.includes("Renter VIP"))?.value || 0;

  return (
    <div className="space-y-10 text-slate-100 font-sans">
      
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            Báo cáo tài chính Roomie
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 font-heading uppercase">
            THỐNG KÊ DOANH THU & GIAO DỊCH
          </h2>
          <p className="text-xs text-slate-400 font-medium font-body max-w-2xl">
            Báo cáo phân tích doanh thu từ các gói VIP/Premium của Landlords, gói VIP Renters và phí đẩy tin quảng cáo nổi bật trên toàn hệ thống Roomie.
          </p>
        </div>

        {/* Action triggers */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleExport("pdf")}
            className="h-11 px-4.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Download className="h-4 w-4" />
            Xuất PDF
          </button>

          <button
            onClick={() => handleExport("excel")}
            className="h-11 px-4.5 rounded-xl bg-emerald-600/25 border border-emerald-500/30 hover:bg-emerald-600/35 text-emerald-400 text-xs font-bold flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Download className="h-4 w-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="rounded-3xl border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                Doanh thu ({getActiveMonthLabel()})
              </span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Coins className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1 text-left">
              <h3 className="text-2xl font-black text-slate-100">
                {formatVND(totalMonthRevenue)}
              </h3>
              <p className="text-[9px] font-bold text-slate-400">
                Tổng doanh số các dịch vụ đã thanh toán
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-white/5 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-400">
            <ChevronUp className="h-3.5 w-3.5" />
            <span>+14.5% so với tháng trước</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-3xl border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                Doanh thu Chủ nhà VIP
              </span>
              <div className="p-2.5 rounded-xl bg-pink-550/10 bg-pink-500/10 border border-pink-500/20 text-pink-400 font-sans">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1 text-left">
              <h3 className="text-2xl font-black text-slate-100">
                {formatVND(landlordVipRevenue)}
              </h3>
              <p className="text-[9px] font-bold text-slate-400">
                Doanh số từ gói Landlord VIP nâng cao
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-white/5 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-400">
            <ChevronUp className="h-3.5 w-3.5" />
            <span>+18.2% tăng trưởng gói</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-3xl border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                Doanh thu Người tìm phòng
              </span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1 text-left">
              <h3 className="text-2xl font-black text-slate-100">
                {formatVND(renterVipRevenue)}
              </h3>
              <p className="text-[9px] font-bold text-slate-400">
                Doanh số dịch vụ VIP hỗ trợ Renter
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-white/5 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-400">
            <ChevronUp className="h-3.5 w-3.5" />
            <span>+8.7% tài khoản VIP mới</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-3xl border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                Số lượng giao dịch
              </span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1 text-left">
              <h3 className="text-2xl font-black text-slate-100">
                {totalMonthTransactions} đơn hàng
              </h3>
              <p className="text-[9px] font-bold text-slate-400">
                Số hóa đơn thanh toán thành công
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-white/5 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-400">
            <ChevronUp className="h-3.5 w-3.5" />
            <span>98.6% Tỷ lệ thanh toán thành công</span>
          </div>
        </div>

      </div>

      {/* 3. Detailed Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Bar Chart: Store Revenue by Time Period (7 Columns) */}
        <div className="lg:col-span-7 rounded-[2rem] border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest block">
                Revenue Over Time
              </span>
              <h3 className="font-heading text-sm font-bold text-slate-200 uppercase tracking-wide">
                BIỂU ĐỒ DOANH THU CỬA HÀNG THEO CHU KỲ
              </h3>
              <p className="text-[10px] text-slate-400 font-medium font-body leading-none">
                Doanh số các gói subscription và dịch vụ phụ trợ trên hệ thống.
              </p>
            </div>

            {/* Selector controls */}
            <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/5 p-1 self-start sm:self-center shrink-0">
              <button
                onClick={() => setRevenuePeriod("week")}
                className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  revenuePeriod === "week"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                Hằng ngày (Tuần này)
              </button>
              <button
                onClick={() => setRevenuePeriod("month")}
                className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  revenuePeriod === "month"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                Hằng tuần (Tháng này)
              </button>
              <button
                onClick={() => setRevenuePeriod("year")}
                className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  revenuePeriod === "year"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                Hằng tháng (Năm nay)
              </button>
            </div>
          </div>

          {/* Recharts BarChart rendering */}
          <div className="h-[280px] w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getBarChartData()} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  tickLine={false} 
                  axisLine={false}
                  dy={5}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  dx={-5}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "1rem" }}
                  labelStyle={{ color: "rgba(255,255,255,0.4)", fontWeight: "bold", fontSize: "10px" }}
                  itemStyle={{ color: "#10B981", fontWeight: "bold" }}
                  formatter={(value: any) => [formatVND(value), "Doanh thu"]}
                />
                <Bar 
                  dataKey="revenue" 
                  name="Doanh thu"
                  fill="url(#colorRevenueGrad)" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Product Category Distribution (5 Columns) */}
        <div className="lg:col-span-5 rounded-[2rem] border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-black uppercase text-pink-400 tracking-widest block">
                Subscription Share
              </span>
              <h3 className="font-heading text-sm font-bold text-slate-200 uppercase tracking-wide">
                PHÂN BỔ THEO DÀN GÓI SẢN PHẨM
              </h3>
            </div>

            {/* Dropdown switcher */}
            <div className="relative shrink-0">
              <select
                value={pieMonth}
                onChange={(e) => setPieMonth(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[9px] font-black uppercase tracking-wider text-slate-200 outline-none cursor-pointer focus:border-pink-500/55 transition-all"
              >
                <option value="6" className="bg-[#080d1a]">Tháng 6 / 2026</option>
                <option value="5" className="bg-[#080d1a]">Tháng 5 / 2026</option>
                <option value="4" className="bg-[#080d1a]">Tháng 4 / 2026</option>
              </select>
            </div>
          </div>

          {/* Recharts PieChart container */}
          <div className="h-[200px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {activePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "0.75rem" }}
                  itemStyle={{ fontWeight: "bold" }}
                  formatter={(value: any) => [formatVND(value), "Doanh thu"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center select-none pointer-events-none font-sans">
              <span className="text-[8px] font-bold text-slate-500 block uppercase tracking-widest">Doanh số</span>
              <span className="text-sm font-black text-slate-100 block">
                {formatVND(totalMonthRevenue)}
              </span>
            </div>
          </div>

          {/* Detailed legends with count statistics */}
          <div className="divide-y divide-white/5 space-y-2 pt-2 text-[10px] font-semibold text-slate-400">
            {activePieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-slate-300">{item.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-100 block">{formatVND(item.value)}</span>
                  <span className="text-[8px] text-slate-500 block font-normal">{item.count} lượt bán ({((item.value / totalMonthRevenue) * 100).toFixed(0)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Detailed Data Grid Table: Product package share list */}
      <div className="rounded-[2.5rem] border border-white/5 bg-[#080d1a]/80 backdrop-blur-md p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <h3 className="font-heading text-sm font-bold text-slate-200 uppercase tracking-wide">
              CHI TIẾT PHÂN KHÚC GÓI SẢN PHẨM ({getActiveMonthLabel()})
            </h3>
            <p className="text-[10px] text-slate-400 font-medium font-body leading-none">
              Thống kê lượng bán và tỷ lệ chuyển đổi đóng góp doanh thu của từng sản phẩm.
            </p>
          </div>
          
          <div className="inline-flex items-center gap-1.5 text-[8px] font-mono tracking-widest font-black uppercase bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] px-3.5 py-1.5 rounded-full">
            <span>Sản phẩm bán chạy nhất: Gói Landlord VIP</span>
          </div>
        </div>

        {/* Share list table */}
        <div className="overflow-x-auto pr-1">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs font-body">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-wider text-slate-500 pb-3">
                <th className="py-3.5 px-4 pl-0">Tên Gói dịch vụ</th>
                <th className="py-3.5 px-4">Lượt mua</th>
                <th className="py-3.5 px-4">Đơn giá định lượng</th>
                <th className="py-3.5 px-4">Tổng doanh thu thực nhận</th>
                <th className="py-3.5 px-4">Tỷ trọng đóng góp</th>
                <th className="py-3.5 px-4 text-right">Xuuyên hướng mua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-slate-300">
              {activePieData.map((item, idx) => {
                // Mock individual prices
                let priceStr = "Miễn phí";
                if (item.name.includes("Landlord VIP")) priceStr = "1,500,000 VND / 30 ngày";
                else if (item.name.includes("Landlord Premium")) priceStr = "1,000,000 VND / 30 ngày";
                else if (item.name.includes("Renter VIP")) priceStr = "200,000 VND / 30 ngày";
                else if (item.name.includes("Renter Basic")) priceStr = "100,000 VND / 30 ngày";
                else if (item.name.includes("Đẩy tin")) priceStr = "30,000 VND / lượt";

                const isVip = item.name.includes("VIP");

                return (
                  <tr key={idx} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-4 pl-0">
                      <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-slate-100">{item.name}</span>
                        {isVip && (
                          <span className="inline-flex items-center gap-0.5 text-[7px] font-mono tracking-widest font-black uppercase text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1.5 py-0.5 rounded">
                            VIP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-350">{item.count} lượt đăng ký</td>
                    <td className="py-4 px-4 text-slate-400">{priceStr}</td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-400">{formatVND(item.value)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 border border-white/5 overflow-hidden shrink-0">
                          <div className="h-full rounded-full" style={{ width: `${((item.value / totalMonthRevenue) * 105)}%`, maxWidth: "100%", backgroundColor: item.color }} />
                        </div>
                        <span className="font-bold text-slate-400 text-[10px]">{((item.value / totalMonthRevenue) * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right shrink-0">
                      {idx % 2 === 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-mono tracking-widest font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <ChevronUp className="h-3 w-3" /> Tăng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-mono tracking-widest font-black uppercase text-slate-500 bg-slate-550/10 px-2 py-0.5 rounded border border-white/5">
                          Ổn định
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
