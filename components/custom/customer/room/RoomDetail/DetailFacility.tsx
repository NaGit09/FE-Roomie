"use client";

import React from "react";
import { useRoomStore } from "@/stores/roomStore";
import { FACILITIES_LIST } from "@/constant/facilites";
import { Sparkles } from "lucide-react";

export default function DetailFacility() {
  const { currentRoomDetail } = useRoomStore();
  const amenities = currentRoomDetail?.room?.amenities || [];

  if (amenities.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">Tiện ích nổi bật</h3>
        <p className="text-sm font-semibold text-slate-400 italic">Không có tiện ích nổi bật nào được liệt kê.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-extrabold text-slate-900">Tiện ích nổi bật</h3>
      
      <div className="flex flex-wrap gap-3">
        {amenities.map((item: string) => {
          const trimmed = item.trim().toLowerCase();
          
          // Match matching facility item in FACILITIES_LIST (case-insensitive)
          const matched = FACILITIES_LIST.find(
            (fac) =>
              fac.value.toLowerCase() === trimmed ||
              fac.label.toLowerCase() === trimmed
          );

          // Use the matched icon or fallback to Sparkles
          const IconComponent = matched ? matched.icon : Sparkles;
          const displayLabel = matched ? matched.label : item;

          return (
            <div
              key={item}
              className="inline-flex items-center gap-3 rounded-full border border-slate-100 bg-slate-50/50 pl-2.5 pr-4 py-2 transition-all duration-300 hover:bg-white hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] cursor-default shadow-xs"
            >
              {/* Inner Circle Icon Badge */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary shadow-2xs">
                <IconComponent className="h-4.5 w-4.5" />
              </div>
              
              {/* Label */}
              <span className="text-xs md:text-sm font-bold text-slate-700 capitalize">
                {displayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}