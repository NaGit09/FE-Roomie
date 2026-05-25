"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Sparkles,
  Eye,
  HeartHandshake,
  Calendar,
  Zap,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  X,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";

interface PostItem {
  id: number;
  title: string;
  roomName: string;
  price: number;
  views: number;
  connections: number;
  status: "ACTIVE" | "PENDING" | "EXPIRED";
  createdAt: string;
}

export default function LandlordPostsPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: 1,
      title: "Tìm bạn ở ghép chung phòng studio Đa Kao Q1 rộng rãi thoáng mát",
      roomName: "Phòng 101 - Căn hộ Studio Ban Công",
      price: 6500000,
      views: 1850,
      connections: 12,
      status: "ACTIVE",
      createdAt: "15/05/2026",
    },
    {
      id: 2,
      title: "Căn hộ dịch vụ Điện Biên Phủ đầy đủ nội thất chỉ trống 1 giường",
      roomName: "Phòng 102 - Phòng Ngủ Ấm Cúng",
      price: 4800000,
      views: 1200,
      connections: 4,
      status: "ACTIVE",
      createdAt: "18/05/2026",
    },
    {
      id: 3,
      title: "Duplex cao cấp Cách Mạng Tháng Tám - Đầy đủ tiện nghi tìm roommate văn minh",
      roomName: "Phòng 201 - Phòng Duplex Cao Cấp",
      price: 7200000,
      views: 950,
      connections: 0,
      status: "PENDING",
      createdAt: "22/05/2026",
    },
    {
      id: 4,
      title: "Phòng ghép ký túc xá Võ Văn Ngân Thủ Đức gần các trường ĐH",
      roomName: "Phòng 202 - Phòng Ghép Giá Rẻ",
      price: 3200000,
      views: 2400,
      connections: 15,
      status: "EXPIRED",
      createdAt: "01/04/2026",
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const currentUser = user || {
    full_name: "Nguyễn Văn Landlord",
    email: "landlord@roomie.com",
    role: "LANDLORD"
  };

  // Handle post boosting
  const handleBoost = (id: number, title: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            views: post.views + Math.floor(100 + Math.random() * 150),
          };
        }
        return post;
      })
    );
    
    toast.success(
      <div className="flex flex-col text-xs space-y-1 font-body">
        <strong className="font-bold text-slate-800 flex items-center gap-1.5 uppercase">
          <Zap className="h-4 w-4 text-amber-500 fill-amber-500 animate-bounce" />
          Đẩy tin thành công!
        </strong>
        <span className="text-slate-500">Tin đăng của bạn đã được tối ưu hiển thị hàng đầu trang tìm kiếm.</span>
      </div>
    );
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 shadow-sm animate-pulse">
            <CheckCircle className="h-3 w-3" />
            Đang hiển thị
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400 shadow-sm">
            <Clock className="h-3 w-3 animate-spin-slow" />
            Chờ duyệt tin
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-550/15 border border-slate-700 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
            <AlertCircle className="h-3 w-3" />
            Đã hết hạn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 animate-fade-in text-[#F8FAFC]">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8B5CF6]">
            <FileText className="h-3.5 w-3.5" />
            Truyền thông quảng cáo
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-100">
            Quản lý tin đăng ghép phòng
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium font-body leading-relaxed max-w-xl">
            Đăng tin tìm kiếm roommate, đẩy bài đăng lên vị trí ưu tiên và theo dõi lưu lượng clicks chuyển đổi ghép phòng.
          </p>
        </div>

        <button
          onClick={() => toast.success("Đang chuyển tới trang tạo tin đăng mới...")}
          className="h-12 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-900 text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 shadow-md shadow-[#F59E0B]/10 shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Tạo tin đăng mới
        </button>
      </div>

      {/* Posts Cards Stack */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            className="rounded-3xl border border-white/5 bg-[#0f172a]/60 backdrop-blur-md p-6 sm:p-8 flex flex-col lg:flex-row justify-between lg:items-center gap-6 shadow-xl relative group cursor-pointer"
          >
            {/* Left information card details */}
            <div className="space-y-4 flex-1 text-left">
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(post.status)}
                
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 font-body">
                  <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  Đăng ngày: {post.createdAt}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-md sm:text-lg text-slate-100 leading-snug group-hover:text-[#FBBF24] transition-colors max-w-3xl">
                  {post.title}
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-slate-400 font-body">
                  <span className="flex items-center gap-1 font-semibold text-slate-350">
                    <Compass className="h-4 w-4 text-[#F59E0B]" />
                    {post.roomName}
                  </span>
                  
                  <span className="font-bold text-[#F59E0B] sm:border-l sm:border-white/10 sm:pl-6">
                    {formatVND(post.price)}/tháng
                  </span>
                </div>
              </div>
            </div>

            {/* Middle analytics views */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8 border-y lg:border-y-0 lg:border-x border-dashed border-white/5 py-4 lg:py-0 lg:px-8 text-center shrink-0">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-body flex items-center justify-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-slate-500" /> Lượt xem tin
                </span>
                <span className="text-xl font-black text-slate-100 font-mono tracking-tight">
                  {post.views.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-body flex items-center justify-center gap-1">
                  <HeartHandshake className="h-3.5 w-3.5 text-slate-500" /> Kết nối
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono tracking-tight">
                  {post.connections.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right actions (Đẩy tin, Xem chi tiết) */}
            <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
              {post.status === "ACTIVE" && (
                <button
                  type="button"
                  onClick={() => handleBoost(post.id, post.title)}
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#8B5CF6]/5 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-black uppercase tracking-wider hover:from-[#8B5CF6] hover:to-[#8B5CF6] hover:text-white transition-all cursor-pointer shadow flex items-center gap-1.5"
                >
                  <Zap className="h-4 w-4 fill-current" />
                  Đẩy tin
                </button>
              )}
              
              <button
                type="button"
                onClick={() => toast.success(`Mở trang xem chi tiết tin đăng`)}
                className="h-11 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-350 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
              >
                Chi tiết
                <ArrowUpRight className="h-4 w-4 opacity-60" />
              </button>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}
