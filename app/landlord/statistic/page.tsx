"use client";

import { useEffect, useState } from "react";
import { RoomApi } from "@/services/api/room";
import { toast } from "sonner";
import { 
  Building2, 
  Users, 
  Eye, 
  CheckCircle,
  Activity,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import formatVND from "@/utils/priceUtils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function StatisticPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await RoomApi.getLandlordStats();
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Không thể tải thông tin báo cáo thống kê.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const occupancyRate = stats?.total_rooms > 0 
    ? Math.round((stats.rented_rooms / stats.total_rooms) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-fade-in p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            <Activity className="h-3.5 w-3.5" />
            Báo cáo thống kê
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
            Hiệu suất kinh doanh
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1 max-w-2xl">
            Theo dõi dòng tiền, tỷ lệ lấp đầy phòng và các chỉ số tương tác quan trọng của bài đăng.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tỷ lệ lấp đầy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Tỷ lệ lấp đầy</p>
              <h3 className="text-3xl font-black text-slate-800">{occupancyRate}%</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4 relative z-10">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${occupancyRate}%` }} />
          </div>
          <p className="text-xs font-medium text-slate-500 mt-3 relative z-10">
            Đã cho thuê {stats?.rented_rooms || 0} / {stats?.total_rooms || 0} phòng
          </p>
          <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-blue-50 rounded-full opacity-50 blur-2xl" />
        </motion.div>

        {/* Lượt đánh giá */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Lượt đánh giá phòng</p>
              <h3 className="text-3xl font-black text-slate-800">{stats?.total_reviews || 0}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-7 relative z-10">
            Tổng số phản hồi từ khách thuê
          </p>
          <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-primary/10 rounded-full opacity-50 blur-2xl" />
        </motion.div>

        {/* Lượt xem bài viết */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Lượt xem tin đăng</p>
              <h3 className="text-3xl font-black text-slate-800">{stats?.total_post_views || 0}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Eye className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-7 relative z-10">
            Độ phủ sóng tiếp cận khách thuê
          </p>
          <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-emerald-50 rounded-full opacity-50 blur-2xl" />
        </motion.div>

        {/* Khách đang quan tâm */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Mức độ quan tâm</p>
              <h3 className="text-3xl font-black text-slate-800">{stats?.total_interested_renters || 0}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-7 relative z-10">
            Số lượt yêu cầu ghép đôi mới nhất
          </p>
          <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-amber-50 rounded-full opacity-50 blur-2xl" />
        </motion.div>
      </div>

      {/* ── Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interested Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-800">Xu hướng người quan tâm (6 tháng)</h3>
          </div>
          <div className="flex-1 w-full h-[300px] min-h-[300px]">
            {stats?.interested_chart_data && stats.interested_chart_data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.interested_chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInterested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    formatter={((value: number) => [`${value} lượt`, 'Người quan tâm']) as any}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interested" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorInterested)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                Chưa có dữ liệu người quan tâm
              </div>
            )}
          </div>
        </motion.div>

        {/* Views Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <Eye className="h-5 w-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-800">Lượt xem tin đăng (7 ngày)</h3>
          </div>
          <div className="flex-1 w-full h-[300px] min-h-[300px]">
            {stats?.views_chart_data && stats.views_chart_data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.views_chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    formatter={((value: number) => [`${value} lượt`, 'Lượt xem']) as any}
                    labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar 
                    dataKey="views" 
                    fill="#10b981" 
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                Chưa có dữ liệu lượt xem
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Interested Rooms */}
      {stats?.top_interested_rooms && stats.top_interested_rooms.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="bg-card border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Top phòng được quan tâm nhiều nhất</h3>
          </div>
          <div className="space-y-4">
            {stats.top_interested_rooms.map((room: any, index: number) => (
              <div key={room.room_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : index === 2 ? 'bg-amber-700' : 'bg-primary/40'}`}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{room.room_name}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">ID: {room.room_id}</p>
                  </div>
                </div>
                <div className="inline-flex flex-col items-end px-4">
                  <span className="text-lg font-black text-slate-800">{room.interest_count}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Lượt quan tâm</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Danh sách quan tâm gần đây */}
      {stats?.recent_interested_renters && stats.recent_interested_renters.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-card border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-slate-800">Khách hàng quan tâm mới nhất</h3>
          </div>
          <div className="space-y-4">
            {stats.recent_interested_renters.map((renter: any) => (
              <div key={renter.user_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {renter.user_name ? renter.user_name.substring(0, 1).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{renter.user_name || "Người dùng ẩn danh"}</p>
                    <p className="text-sm text-slate-500">Phòng: {renter.room_name}</p>
                  </div>
                </div>
                {renter.match_percentage > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold shrink-0">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Khớp {Math.round(renter.match_percentage)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
