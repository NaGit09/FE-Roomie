"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import { 
  Wifi, 
  AirVent, 
  ParkingSquare, 
  BedDouble, 
  Waves, 
  Sparkles, 
  ChevronLeft, 
  ShieldCheck, 
  MapPin, 
  Eye, 
  User, 
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = typeof params?.id === "string" ? params.id : "";
  const postId = parseInt(idStr, 10);
  
  const { currentRoomDetail, isLoading, error, fetchRoomDetail, clearCurrentRoomDetail } = useRoomStore();

  useEffect(() => {
    if (!isNaN(postId)) {
      fetchRoomDetail(postId);
    }
    return () => {
      clearCurrentRoomDetail();
    };
  }, [postId, fetchRoomDetail, clearCurrentRoomDetail]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded-lg mb-4" />
        <div className="h-[400px] w-full max-w-4xl bg-slate-200 rounded-[2rem] mb-6" />
        <div className="h-6 w-96 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  if (error || isNaN(postId)) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 flex mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy phòng</h3>
        <p className="text-slate-500 mb-6 max-w-sm">Phòng bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Button onClick={() => router.push("/")} className="rounded-full px-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại trang chủ
        </Button>
      </div>
    );
  }

  if (!currentRoomDetail) return null;

  return (
    <main className="min-h-screen bg-slate-50/50 py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <button 
          onClick={() => router.back()} 
          className="group mb-8 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Quay lại
        </button>

        <div className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-10">
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[2rem] mb-8 bg-slate-100">
            {currentRoomDetail.image_url ? (
              <img 
                src={currentRoomDetail.image_url} 
                alt={currentRoomDetail.title} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                Không có hình ảnh
              </div>
            )}
            {currentRoomDetail.is_verified && (
              <div className="absolute top-6 left-6 flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-600 shadow-lg backdrop-blur-md">
                <ShieldCheck className="h-4 w-4 fill-emerald-100" />
                <span>Verified</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-3 leading-tight">{currentRoomDetail.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {currentRoomDetail.room.address.full_text || `${currentRoomDetail.room.address.street}, ${currentRoomDetail.room.address.ward}, ${currentRoomDetail.room.address.district}, ${currentRoomDetail.room.address.city}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-slate-400" />
                  {currentRoomDetail.views} lượt xem
                </span>
              </div>
            </div>
            
            <div className="shrink-0 flex flex-col items-start md:items-end">
              <span className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Mức giá</span>
              <div className="flex items-baseline text-primary">
                <span className="text-3xl font-black">{currentRoomDetail.room.price.toLocaleString("vi-VN")}</span>
                <span className="ml-1.5 text-sm font-bold">VND/tháng</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Mô tả chi tiết</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">{currentRoomDetail.content}</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 font-heading">Tiện ích phòng</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentRoomDetail.room.amenities.map((amenity, index) => {
                    const normalized = amenity.toLowerCase().trim();
                    let icon = Sparkles;
                    
                    if (normalized.includes("wifi") || normalized.includes("internet") || normalized.includes("mạng")) {
                      icon = Wifi;
                    } else if (normalized.includes("lạnh") || normalized.includes("điều hòa") || normalized.includes("air")) {
                      icon = AirVent;
                    } else if (normalized.includes("xe") || normalized.includes("parking") || normalized.includes("đỗ")) {
                      icon = ParkingSquare;
                    } else if (normalized.includes("bơi") || normalized.includes("pool")) {
                      icon = Waves;
                    } else if (normalized.includes("giường") || normalized.includes("bed") || normalized.includes("pn") || normalized.includes("ngủ")) {
                      icon = BedDouble;
                    }

                    const IconComp = icon;

                    return (
                      <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100 text-primary shadow-xs">
                          <IconComp className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 capitalize">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50/30 p-6 md:p-8 space-y-6">
                <h4 className="text-base font-bold text-slate-900">Thông tin chi tiết</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm py-2.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Diện tích</span>
                    <span className="font-bold text-slate-800">{currentRoomDetail.room.area} m²</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Tiền đặt cọc</span>
                    <span className="font-bold text-slate-800">{currentRoomDetail.room.deposit.toLocaleString("vi-VN")} VND</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Trạng thái</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {currentRoomDetail.room.status === "available" ? "Còn trống" : currentRoomDetail.room.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2.5">
                    <span className="text-slate-500 font-medium">Người đăng</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 font-sans">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {currentRoomDetail.created_by}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
