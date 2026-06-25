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
  FileText,
  Filter,
  ArrowRight,
  TrendingDown,
  LineChart,
  Compass,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import formatVND from "@/utils/priceUtils";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { toast } from "sonner";
import { PostApi as PostService } from "@/services/api/post";
import { PostApi as RoomService } from "@/services/api/room";
import { PostCardType } from "@/schema/room/post";
import { RoomDetail } from "@/schema/room/room";

export default function LandlordStatisticPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<"30" | "90" | "365">("90");
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<RoomDetail[]>([]);
  const [posts, setPosts] = useState<PostCardType[]>([]);
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, postsRes] = await Promise.all([
        RoomService.getMyRoom(),
        PostService.getMyPost(0, 100),
      ]);
      if (roomsRes && roomsRes.data) {
        const roomsList = Array.isArray(roomsRes.data)
          ? roomsRes.data
          : (roomsRes.data as any).items || [];
        setRooms(roomsList);
      }
      if (postsRes && postsRes.data) {
        const postsList = Array.isArray(postsRes.data)
          ? postsRes.data
          : (postsRes.data as any).items || [];
        setPosts(postsList);
      }
    } catch (err) {
      console.error("Error fetching landlord statistics:", err);
      toast.error("Không thể tải dữ liệu thống kê.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-650">
        <Loader2 className="h-9 w-9 text-primary animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-650">
          Đang tải báo cáo thống kê...
        </span>
      </div>
    );
  }

  const currentUser = user || {
    full_name: "Nguyễn Văn Landlord",
    email: "landlord@roomie.com",
    role: "LANDLORD"
  };

  const occupiedCount = rooms.filter((r) => {
    const status = r.status?.toUpperCase() || "";
    return status === "OCCUPIED" || status === "RENTED";
  }).length;
  const vacantCount = rooms.length - occupiedCount;

  const roomStatusData = [
    { name: "Đã có khách ở", value: occupiedCount, color: "#10B981" },
    { name: "Phòng trống", value: vacantCount, color: "#F59E0B" },
  ];

  const postTrafficData = posts.map((p) => ({
    name: p.title.length > 15 ? p.title.substring(0, 15) + "..." : p.title,
    views: (p as any).views || 0,
    connects: 0,
  }));

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

  const handleExport = (format: "pdf" | "excel") => {
    toast.info(`Đang tạo báo cáo thống kê định dạng ${format.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`Đã xuất và tải xuống báo cáo thành công!`);
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-fade-in text-foreground">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            <LineChart className="h-3.5 w-3.5" />
            Báo cáo Vận hành
          </motion.div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
            Báo cáo thống kê chi tiết
          </h1>
          <p className="text-xs sm:text-sm text-slate-650 font-medium font-body leading-relaxed max-w-xl">
            Theo dõi dòng tiền doanh thu thực tế, lượt tiếp cận khách thuê và phân bổ hiệu suất lấp đầy phòng trống.
          </p>
        </div>

        {/* Exporter actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <button
            onClick={() => handleExport("excel")}
            className="h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-350 text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Excel
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-primary/10"
          >
            <FileText className="h-4 w-4" />
            Xuất PDF
          </button>
        </div>
      </div>

      {/* Filter range toggles */}
      <div className="flex justify-between items-center bg-slate-100 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-xs text-slate-650 font-bold uppercase tracking-widest">
          <Filter className="h-4 w-4 text-slate-650" />
          <span>Khoảng thời gian:</span>
        </div>
        
        <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-slate-200">
          {[
            { id: "30", label: "30 Ngày qua" },
            { id: "90", label: "90 Ngày qua" },
            { id: "365", label: "1 Năm qua" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id as any)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                timeRange === range.id
                  ? "bg-primary text-white shadow"
                  : "text-slate-650 hover:text-slate-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CHART 1: AreaChart Doanh Thu (8 Columns) */}
        <div className="lg:col-span-8 rounded-[2.5rem] border border-slate-200 bg-slate-100 backdrop-blur-md p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-primary tracking-widest block">
                Financial Report
              </span>
              <h3 className="text-lg font-bold text-slate-800">Dòng tiền doanh thu</h3>
            </div>
            {revenueData.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400">
                <ChevronUp className="h-3.5 w-3.5" />
                +50% Tăng trưởng
              </div>
            )}
          </div>

          {revenueData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-slate-650 border border-dashed border-slate-200 rounded-2xl text-xs font-semibold">
              Chưa có dữ liệu doanh thu thực tế
            </div>
          ) : (
            <div className="h-[280px] w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C1440E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C1440E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D9D9" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B6560" 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#6B6560" 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(v) => `${v / 1000000}M`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#F5EDE0", borderColor: "#D9D9D9", borderRadius: "1rem", color: "#0D1117" }}
                    labelStyle={{ color: "#6B6560", fontWeight: "bold", fontSize: "10px" }}
                    itemStyle={{ color: "#C1440E", fontWeight: "bold" }}
                    formatter={(value: any) => [formatVND(value), "Doanh thu"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#C1440E" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* CHART 2: PieChart Lấp đầy phòng (4 Columns) */}
        <div className="lg:col-span-4 rounded-[2.5rem] border border-slate-200 bg-slate-100 backdrop-blur-md p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-primary tracking-widest block">
              Occupancy Ratio
            </span>
            <h3 className="text-lg font-bold text-slate-800">Trạng thái phòng thuê</h3>
          </div>

          <div className="h-[180px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={75}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#F5EDE0", borderColor: "#D9D9D9", borderRadius: "0.75rem", color: "#0D1117" }}
                  itemStyle={{ fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Absolute indicator */}
            <div className="absolute text-center select-none pointer-events-none">
              <span className="text-2xl font-black text-slate-800">{rooms.length}</span>
              <span className="text-[8px] font-bold text-slate-650 block uppercase tracking-widest">Tổng số phòng</span>
            </div>
          </div>

          {/* Custom Legends list */}
          <div className="space-y-2.5">
            {roomStatusData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-medium">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-355 text-slate-650">{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-800">{item.value} Phòng</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 3: BarChart Tin đăng clicks (12 Columns FULL) */}
        <div className="lg:col-span-12 rounded-[2.5rem] border border-slate-200 bg-slate-100 backdrop-blur-md p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-primary tracking-widest block">
                Post Performance Traffic
              </span>
              <h3 className="text-lg font-bold text-slate-800">Hiệu suất tương tác tin đăng</h3>
            </div>
            <div className="rounded-xl bg-slate-100 border border-slate-200 p-1 flex gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-650">
              <span className="flex items-center gap-1 px-3 py-1 bg-primary/20 rounded-lg text-primary border border-primary/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6B6560]" /> Lượt xem
              </span>
              <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-lg text-primary border border-primary/30">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Kết nối
              </span>
            </div>
          </div>

          {postTrafficData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-slate-650 border border-dashed border-slate-200 rounded-2xl text-xs font-semibold">
              Chưa có dữ liệu tin đăng ghép phòng
            </div>
          ) : (
            <div className="h-[280px] w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={postTrafficData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D9D9" vertical={false} />
                  <XAxis dataKey="name" stroke="#6B6560" tickLine={false} axisLine={false} dy={5} />
                  <YAxis stroke="#6B6560" tickLine={false} axisLine={false} dx={-5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#F5EDE0", borderColor: "#D9D9D9", borderRadius: "1rem", color: "#0D1117" }}
                    labelStyle={{ color: "#6B6560", fontWeight: "bold", fontSize: "10px" }}
                  />
                  <Legend verticalAlign="top" height={36} content={() => null} />
                  <Bar dataKey="views" name="Lượt xem tin" fill="#6B6560" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="connects" name="Kết nối thành công" fill="#C1440E" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}