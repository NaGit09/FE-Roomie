"use client";

import { useEffect, useState } from "react";
import { RoomApi } from "@/services/api/room";
import { toast } from "sonner";
import { 
  Building2, 
  Users, 
  Eye, 
  CheckCircle,
  TrendingUp,
  Activity,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import formatVND from "@/utils/priceUtils";

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

        {/* Doanh thu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Doanh thu tháng này</p>
              <h3 className="text-3xl font-black text-slate-800">{formatVND(stats?.revenue_this_month || 0)}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-7 relative z-10">
            Tổng dòng tiền ước tính từ các phòng đang cho thuê
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

      {/* Danh sách quan tâm gần đây */}
      {stats?.recent_interested_renters && stats.recent_interested_renters.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
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
