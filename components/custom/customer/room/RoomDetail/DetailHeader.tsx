"use client";

import React from "react";
import { useRoomStore } from "@/stores/roomStore";
import formatRelativeTime from "@/utils/timeUtils";
import { ShieldCheck, MapPin, Clock, Eye } from "lucide-react";

export default function DetailHeader() {
  const { currentRoomDetail } = useRoomStore();

  const address = currentRoomDetail?.room.address
    ? [
        currentRoomDetail.room.address.street,
        currentRoomDetail.room.address.ward,
        currentRoomDetail.room.address.district,
        currentRoomDetail.room.address.city,
      ]
        .filter(Boolean)
        .join(", ")
    : "Đang cập nhật địa chỉ...";

  const isAvailable = currentRoomDetail?.room.status?.toLowerCase() === "available";

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight md:text-4xl">
        {currentRoomDetail?.title}
      </h1>

      {/* Unified Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-2 text-xs md:text-sm font-semibold">
        {/* Availability Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Đang cho thuê
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/50 px-3 py-1 text-xs font-bold text-rose-700 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Tạm dừng
            </span>
          )}

          {currentRoomDetail?.is_verified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/50 px-3 py-1 text-xs font-bold text-blue-700 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-blue-600 fill-blue-100" />
              Đã xác minh
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
          <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <span>{currentRoomDetail?.room.address.full_text || address}</span>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
          <span>
            Đăng {formatRelativeTime(currentRoomDetail?.created_at || "")}
          </span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider">
          <Eye className="h-4 w-4 text-slate-400 shrink-0" />
          <span>{currentRoomDetail?.views || 0} lượt xem</span>
        </div>
      </div>
    </div>
  );
}
