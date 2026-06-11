"use client";

import React, { useState } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { 
  Phone, 
  MessageCircle, 
  Calendar, 
  ShieldCheck, 
  Star, 
  Clock, 
  Building,
  CheckCircle2,
  AlertOctagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportModal from "@/components/custom/common/ReportModal";

export default function DetailOwner() {
  const { currentRoomDetail } = useRoomStore();
  const [viewingRequested, setViewingRequested] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  if (!currentRoomDetail) return null;

  // Mock landlord profile data mapped to the poster ID
  const landlordName = currentRoomDetail.created_by === "admin" 
    ? "Ban Quản Trị Roomie" 
    : "Nguyễn Minh Tuấn";
    
  const landlordPhone = "0987 654 321";
  
  const landlordStats = {
    rating: 4.9,
    reviews: 24,
    responseRate: "100%",
    responseTime: "Dưới 5 phút",
    totalPosts: 8,
    joined: "Tháng 10, 2025"
  };

  const handleRequestViewing = () => {
    setViewingRequested(true);
    setTimeout(() => {
      setViewingRequested(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* ── Landlord Visual Card ── */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100/50 space-y-6">
        
        {/* Landlord Identity Row */}
        <div className="flex items-center gap-4">
          {/* Avatar frame */}
          <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-primary/5 flex items-center justify-center font-extrabold text-primary text-xl">
            {landlordName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
            {/* Online Green dot */}
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-slate-900 text-base">{landlordName}</h4>
              <ShieldCheck className="h-4.5 w-4.5 text-blue-600 fill-blue-50 shrink-0" />
            </div>
            
            <p className="text-xs font-bold text-emerald-600 mt-0.5">Chủ trọ xác minh</p>
            
            <div className="flex items-center gap-1 mt-1 text-xs font-bold text-slate-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{landlordStats.rating}</span>
              <span className="text-slate-300">•</span>
              <span>{landlordStats.reviews} đánh giá</span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Alert */}
        {viewingRequested && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-emerald-800 text-xs font-semibold animate-in fade-in duration-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Yêu cầu xem phòng đã được gửi! Chủ nhà sẽ liên hệ bạn sớm nhất qua số điện thoại đăng ký.</span>
          </div>
        )}

        {/* Action button triggers */}
        <div className="flex flex-col gap-3">
          
          {/* Primary Phone Action */}
          <a href={`tel:${landlordPhone}`} className="w-full">
            <Button className="w-full rounded-full font-bold shadow-md shadow-primary/10 py-5 flex items-center justify-center gap-2 group">
              <Phone className="h-4 w-4 fill-current group-hover:animate-bounce" />
              Gọi điện: {landlordPhone}
            </Button>
          </a>

          {/* Secondary Zalo Message */}
          <a 
            href={`https://zalo.me/${landlordPhone.replace(/\s+/g, "")}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full"
          >
            <Button variant="outline" className="w-full rounded-full font-bold border-slate-200 text-slate-700 hover:bg-slate-50 py-5 flex items-center justify-center gap-2">
              <MessageCircle className="h-4.5 w-4.5 text-sky-500 fill-sky-100" />
              Nhắn tin qua Zalo
            </Button>
          </a>

          {/* Appointment CTA */}
          <Button 
            onClick={handleRequestViewing}
            variant="secondary" 
            className="w-full rounded-full font-bold bg-slate-100 text-slate-700 hover:bg-slate-200/80 py-5 flex items-center justify-center gap-2"
          >
            <Calendar className="h-4 w-4 text-slate-500" />
            Đặt lịch xem phòng
          </Button>

        </div>

        {/* Professional Metrics Divider */}
        <div className="border-t border-slate-100 pt-5 space-y-3 text-xs font-semibold text-slate-500">
          
          {/* Response Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Tỷ lệ phản hồi</span>
            </div>
            <span className="text-slate-800 font-extrabold">{landlordStats.responseRate}</span>
          </div>

          {/* Response speed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Thời gian phản hồi</span>
            </div>
            <span className="text-slate-800 font-extrabold">{landlordStats.responseTime}</span>
          </div>

          {/* Listing counts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-400" />
              <span>Số phòng đã đăng</span>
            </div>
            <span className="text-slate-800 font-extrabold">{landlordStats.totalPosts} phòng</span>
          </div>

          {/* Joined date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Thời gian tham gia</span>
            </div>
            <span className="text-slate-800 font-extrabold">{landlordStats.joined}</span>
          </div>

        </div>

      </div>

      {/* Safety & Security Alert */}
      <div className="rounded-2xl bg-amber-50/50 border border-amber-100/60 p-4 text-[11px] leading-relaxed text-amber-800 font-semibold space-y-1">
        <p className="font-extrabold text-amber-900 uppercase tracking-wider">Lưu ý an toàn giao dịch:</p>
        <p>Không chuyển khoản tiền cọc trước khi đến tận nơi xem phòng thực tế và xác nhận ký hợp đồng hợp lệ với chủ nhà.</p>
      </div>

      {/* Report Listing CTA */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="w-full h-10 border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        <AlertOctagon className="h-4 w-4" />
        Báo cáo tin đăng này
      </button>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="ROOM"
        targetId={String(currentRoomDetail.room?.id || currentRoomDetail.post_id || "")}
      />

    </div>
  );
}
