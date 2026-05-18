"use client";

import React from "react";
import { useRoomStore } from "@/stores/roomStore";
import { useRoomFilterStore } from "@/stores/roomFilterStore";
import { mapPostToRoom } from "@/utils/mapper";
import RoomCardCompact from "@/components/custom/customer/map/RoomCardCompact";
import { Sparkles, Inbox } from "lucide-react";

export default function MapResult() {
  const { paginatedRooms, isLoading } = useRoomStore();
  const { 
    keyword, 
    priceRange, 
    selectedFacilities,
    sortBy 
  } = useRoomFilterStore();

  // ── 1. Apply Dynamic Hybrid Filtering Waterfall ──
  const filteredRooms = paginatedRooms
    .map((post) => mapPostToRoom(post))
    .filter((room) => {
      
      // A. Keyword Filter (Case-insensitive check across Title, Address, and Ward)
      if (keyword) {
        const kw = keyword.toLowerCase().trim();
        const matchesName = room.name.toLowerCase().includes(kw);
        const matchesAddress = room.address.toLowerCase().includes(kw);
        const matchesWard = room.ward?.toLowerCase().includes(kw) || false;
        
        if (!matchesName && !matchesAddress && !matchesWard) {
          return false;
        }
      }

      // B. Price Limit Filter
      if (room.rawPrice < priceRange[0] || room.rawPrice > priceRange[1]) {
        return false;
      }

      // C. Amenities/Facilities Filter
      if (selectedFacilities.length > 0) {
        const roomFacLabels = room.facilities.map((f) => f.label.toLowerCase());
        
        const hasAllFacilities = selectedFacilities.every((selectedFac) => {
          const normSel = selectedFac.toLowerCase();
          
          return roomFacLabels.some((label) => {
            if (normSel === "wifi" && label.includes("wifi")) return true;
            if (normSel === "điều hòa" && (label.includes("lạnh") || label.includes("điều hòa"))) return true;
            if (normSel === "đỗ xe" && (label.includes("xe") || label.includes("parking") || label.includes("đỗ"))) return true;
            if (normSel === "hồ bơi" && (label.includes("bơi") || label.includes("pool"))) return true;
            if (normSel === "giường" && (label.includes("giường") || label.includes("bed") || label.includes("ngủ"))) return true;
            return label.includes(normSel);
          });
        });

        if (!hasAllFacilities) return false;
      }

      return true;
    });

  // ── 2. Apply Local Fast Sorting for Perfect UI Responsiveness ──
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === "priceAsc") {
      return a.rawPrice - b.rawPrice;
    }
    if (sortBy === "priceDesc") {
      return b.rawPrice - a.rawPrice;
    }
    return 0; // default order from API
  });

  return (
    <div className="flex-1 flex flex-col space-y-5">
      {/* ── 3. Accompanying Search Results Deck ── */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-extrabold text-slate-900">
            Phòng tìm thấy trong khu vực
          </h3>
          <span className="bg-primary/10 text-primary text-xs font-black px-2.5 py-1 rounded-full">
            {sortedRooms.length} phòng
          </span>
        </div>
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Cập nhật trực tiếp
        </span>
      </div>

      {/* List Layout with scroll control */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6 min-h-[300px]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-white border border-slate-100 rounded-3xl h-[160px] animate-pulse">
                <div className="w-[140px] h-full bg-slate-200 rounded-2xl shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-md mb-4 border border-slate-100">
              <Inbox className="h-7 w-7 text-slate-300" />
            </div>
            <h5 className="font-extrabold text-slate-700 text-sm">
              Không tìm thấy kết quả phù hợp
            </h5>
            <p className="text-xs font-semibold text-slate-400 text-center max-w-sm mt-1">
              Vui lòng mở rộng giới hạn giá, bỏ chọn các tiện nghi, hoặc chọn quận huyện khác để tìm thêm phòng trọ.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRooms.map((room) => (
              <RoomCardCompact key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}