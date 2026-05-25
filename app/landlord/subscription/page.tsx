"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Crown, 
  Sparkles,
  CheckCircle,
  Calendar,
  Zap,
  Info,
  Download,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";

interface BillingInvoice {
  id: string;
  date: string;
  planName: string;
  amount: number;
  paymentMethod: string;
  status: "SUCCESS" | "PENDING";
}

export default function LandlordSubscriptionPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Mock Invoice logs
  const [invoices] = useState<BillingInvoice[]>([
    {
      id: "INV-894218",
      date: "25/05/2026",
      planName: "Gói Hội Viên Chủ Nhà Pro (12 Tháng)",
      amount: 1668000,
      paymentMethod: "Chuyển khoản VietQR",
      status: "SUCCESS",
    },
    {
      id: "INV-104928",
      date: "25/05/2025",
      planName: "Gói Bạc (Silver) - Trải nghiệm Chủ nhà",
      amount: 199000,
      paymentMethod: "Thẻ Visa •••• 4242",
      status: "SUCCESS",
    }
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

  const handleDownloadInvoice = (id: string) => {
    toast.success(`Đang tải hóa đơn tài chính ${id} về máy...`);
  };

  return (
    <div className="space-y-10 animate-fade-in text-[#F8FAFC]">
      
      {/* Header Title */}
      <div className="space-y-1.5 border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#F59E0B]">
          <CreditCard className="h-3.5 w-3.5" />
          Quản lý gói dịch vụ
        </div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-100">
          Gói hội viên đã đăng ký
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium font-body leading-relaxed max-w-xl">
          Quản lý tình trạng đăng ký hội viên Pro, chu kỳ thanh toán tự động, lịch sử nạp xu và in hóa đơn tài chính.
        </p>
      </div>

      {/* Dynamic Active Membership Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[3rem] bg-gradient-to-tr from-[#0F172A] via-[#1e293b]/70 to-[#0F172A] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between lg:items-center gap-8"
      >
        {/* Glow */}
        <div className="absolute top-[-50%] right-[-10%] w-[45%] h-[120%] rounded-full bg-gradient-to-br from-[#F59E0B]/20 via-[#FBBF24]/5 to-transparent blur-[90px] pointer-events-none animate-[pulse_10s_infinite]" />

        <div className="space-y-6 flex-1">
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[9px] font-black uppercase bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] px-3 py-1 rounded-full shadow-sm animate-pulse flex items-center gap-1">
                <Crown className="h-3 w-3 fill-current text-[#F59E0B]" /> Active Member
              </span>
              <span className="text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full shadow-sm">
                Đã thanh toán
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight">
              Gói Hội Viên Chủ Nhà Pro <span className="text-[#FBBF24] italic font-display">(12 Tháng)</span>
            </h2>
            
            <p className="text-xs text-slate-400 font-body max-w-xl leading-relaxed">
              Tài khoản của bạn đã được nâng cấp thành công lên quyền hội viên cao cấp nhất dành cho chủ nhà, được hưởng toàn quyền ưu tiên đề xuất và đăng phòng không hạn mức.
            </p>
          </div>

          <hr className="border-white/5" />

          {/* Pricing detail list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-left">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-body">Biểu phí thanh toán</span>
              <span className="text-sm font-black text-[#F59E0B]">{formatVND(1668000)} / Năm</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-body">Chu kỳ tiếp theo</span>
              <span className="text-sm font-black text-slate-200">25/05/2027</span>
            </div>
            
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-body">Hình thức thụ hưởng</span>
              <span className="text-sm font-black text-slate-200">Ví Momo/VietQR</span>
            </div>
          </div>
        </div>

        {/* Action Panel Trigger */}
        <div className="flex flex-col gap-2.5 shrink-0 w-full lg:w-fit self-stretch lg:self-center justify-center">
          <button
            onClick={() => toast.success("Đang chuyển tới cổng thay đổi phương thức thanh toán...")}
            className="h-12 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-slate-250 text-xs font-black uppercase tracking-wider cursor-pointer border border-white/5 transition-all text-center"
          >
            Đổi phương thức
          </button>
          
          <button
            onClick={() => toast.warning("Đang liên hệ bộ phận hỗ trợ hủy gia hạn tự động...")}
            className="h-12 px-6 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider cursor-pointer border border-red-500/10 transition-all text-center"
          >
            Hủy gia hạn tự động
          </button>
        </div>
      </motion.div>

      {/* Premium Features List */}
      <div className="space-y-4">
        <h3 className="font-heading text-md font-bold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="h-4.5 w-4.5 text-[#F59E0B] animate-pulse" />
          Đặc quyền Chủ nhà Pro đang sở hữu
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body leading-relaxed">
          {[
            "Đẩy tin đăng phòng tự động lên đầu bảng tin tìm kiếm hàng tuần.",
            "Xác thực uy tín căn hộ (Tăng 200% lượt tin cậy của khách thuê).",
            "Mở khóa không giới hạn số lượng phòng hoạt động đăng ký tin.",
            "Nhận đề xuất 1-1 ghép đôi Renter tương thích cao (>90%) từ hệ thống AI.",
            "Bộ công cụ thống kê doanh thu và báo cáo xuất file tài chính chuyên nghiệp.",
            "Đường dây nóng hỗ trợ kỹ thuật và CSKH VIP 24/7."
          ].map((feat, idx) => (
            <div key={idx} className="flex gap-3 items-start bg-[#0f172a]/30 border border-white/5 rounded-2xl p-4">
              <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
              <span className="text-slate-350 font-medium">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices List Ledger */}
      <div className="space-y-4">
        <h3 className="font-heading text-md font-bold text-slate-200">Lịch sử hóa đơn</h3>
        
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#0f172a]/30 shadow-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-450 font-body">
                <th className="py-4 px-6">Mã hóa đơn</th>
                <th className="py-4 px-6">Ngày thanh toán</th>
                <th className="py-4 px-6">Gói hội viên</th>
                <th className="py-4 px-6">Hình thức</th>
                <th className="py-4 px-6">Số tiền</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center">Tải về</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 font-mono text-slate-500 font-bold">{inv.id}</td>
                  <td className="py-4 px-6 text-slate-400 font-medium">{inv.date}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-200">{inv.planName}</td>
                  <td className="py-4 px-6 text-slate-450 font-medium">{inv.paymentMethod}</td>
                  <td className="py-4 px-6 font-black text-[#FBBF24] text-sm">
                    {formatVND(inv.amount)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-400">
                      Thành công
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 hover:bg-[#F59E0B] hover:text-slate-900 text-slate-400 flex items-center justify-center mx-auto cursor-pointer transition-all active:scale-90"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
