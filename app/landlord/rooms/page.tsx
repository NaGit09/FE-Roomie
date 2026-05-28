/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Plus, 
  MapPin,
  Compass,
  ChevronRight
} from "lucide-react";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";
import { PostApi } from "@/services/api/room";
import { RoomDetail } from "@/schema/room/room";
import { FilterRoom } from "@/components/custom/landlord/FilterRoom";
import { CreateRoomForm } from "@/components/custom/landlord/CreateRoomForm";

export default function LandlordRoomsPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "VACANT" | "OCCUPIED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Rooms list state
  const [rooms, setRooms] = useState<RoomDetail[]>([]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await PostApi.getMyRoom();
      if (response && response.data && Array.isArray(response.data)) {
        setRooms(response.data);
      } else {
        setRooms([]);
      }
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
      toast.error("Không thể tải danh sách phòng. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRooms();
  }, []);

  if (!mounted) return null;

  // Safe accessor utilities for room properties to support both schemas
  const getRoomFeatures = (room: any) => {
    return room.amenities || room.features || [];
  };

  const getRoomCapacity = (room: any) => {
    if (room.capacity !== undefined) return room.capacity;
    const attr = room.attributes?.find((a: string) => a.startsWith("capacity:"));
    return attr ? parseInt(attr.split(":")[1]) : 2;
  };

  const getRoomOccupied = (room: any) => {
    if (room.occupied !== undefined) return room.occupied;
    const attr = room.attributes?.find((a: string) => a.startsWith("occupied:"));
    return attr ? parseInt(attr.split(":")[1]) : 0;
  };

  const getRoomFullAddress = (room: any) => {
    if (typeof room.address === "string") return room.address;
    if (room.address && typeof room.address === "object") {
      return room.address.full_text || `${room.address.street}, ${room.address.ward || ""}, ${room.address.district || ""}, ${room.address.city || ""}`.replace(/,\s*,/g, ",").trim();
    }
    return "";
  };

  const getRoomDistrict = (room: any) => {
    if (typeof room.address === "string") return room.district || "";
    return room.address?.district || "";
  };

  const isRoomOccupied = (status?: string) => {
    if (!status) return false;
    const s = status.toUpperCase();
    return s === "OCCUPIED" || s === "RENTED";
  };

  const isRoomVacant = (status?: string) => {
    if (!status) return true;
    const s = status.toUpperCase();
    return s === "VACANT" || s === "AVAILABLE";
  };

  // Filtered rooms listing
  const filteredRooms = rooms.filter((room) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "VACANT" && isRoomVacant(room.status)) ||
      (filter === "OCCUPIED" && isRoomOccupied(room.status));
    
    const addressStr = getRoomFullAddress(room);
    const districtStr = getRoomDistrict(room);

    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addressStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      districtStr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-fade-in text-[#F8FAFC]">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#F59E0B]">
            <Home className="h-3.5 w-3.5" />
            Vận hành căn hộ
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-100">
            Quản lý danh sách phòng
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium font-body leading-relaxed max-w-xl">
            Cập nhật trạng thái phòng trống, thiết lập biểu phí phòng, sức chứa tối đa và theo dõi tỷ lệ lấp đầy.
          </p>
        </div>

        {/* Add Room Trigger button */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="h-12 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-900 text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 shadow-md shadow-[#F59E0B]/10 shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Thêm phòng mới
        </button>
      </div>

      {/* Control Panel (Search, Filter Tabs) */}
      <FilterRoom
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Rooms Cards Grid */}
      {isLoading ? (
        /* Loading skeleton state */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-white/5 bg-[#0f172a]/40 p-6 space-y-6 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-white/10 rounded-full" />
                <div className="h-4 w-12 bg-white/10 rounded-md" />
              </div>
              <div className="space-y-3">
                <div className="h-6 w-3/4 bg-white/10 rounded-md" />
                <div className="h-4 w-1/2 bg-white/10 rounded-md" />
              </div>
              <hr className="border-white/5" />
              <div className="flex gap-2">
                <div className="h-5 w-12 bg-white/10 rounded-md" />
                <div className="h-5 w-16 bg-white/10 rounded-md" />
                <div className="h-5 w-14 bg-white/10 rounded-md" />
              </div>
              <div className="pt-4 border-t border-dashed border-white/5 flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-white/10 rounded-md" />
                  <div className="h-5 w-28 bg-white/10 rounded-md" />
                </div>
                <div className="h-8 w-8 bg-white/10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRooms.length === 0 ? (
        /* Empty results state */
        <div className="rounded-[2rem] border border-white/5 bg-[#0f172a]/30 p-12 text-center space-y-4 max-w-md mx-auto">
          <Compass className="h-10 w-10 text-slate-500 animate-pulse mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">Không tìm thấy phòng phù hợp</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-body">
            Vui lòng thay đổi từ khóa tìm kiếm hoặc cập nhật bộ lọc trạng thái phòng trống.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, idx) => (
            <motion.div
              key={room.id || idx}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/5 bg-[#0f172a]/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Header status block */}
                <div className="flex justify-between items-start gap-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                    isRoomOccupied(room.status)
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}>
                    {isRoomOccupied(room.status) ? "Đã lấp đầy" : "Còn trống"}
                  </span>
                  
                  <span className="text-[10px] font-extrabold text-slate-400 font-body">
                    Renter: {getRoomOccupied(room)} / {getRoomCapacity(room)}
                  </span>
                </div>

                {/* Info titles */}
                <div className="space-y-1">
                  <h3 className="font-bold text-md text-slate-100 group-hover:text-[#FBBF24] transition-colors leading-tight">
                    {room.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium font-body leading-relaxed flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                    {getRoomFullAddress(room)}
                  </p>
                </div>

                <hr className="border-white/5" />

                {/* Features listing */}
                <div className="flex flex-wrap gap-1">
                  {getRoomFeatures(room).map((feat: string, fIdx: number) => (
                    <span
                      key={fIdx}
                      className="inline-flex text-[9px] font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Details trigger footer */}
              <div className="mt-6 pt-4 border-t border-dashed border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-body">Biểu phí phòng</span>
                  <span className="text-sm font-black text-[#F59E0B]">
                    {formatVND(room.price)}
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider"> / tháng</span>
                  </span>
                </div>
                
                <button
                  onClick={() => toast.success(`Đang tải chi tiết cho "${room.name}"`)}
                  className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-[#F59E0B] hover:text-slate-900 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD ROOM MODAL PANEL */}
      <CreateRoomForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setIsAddOpen(false);
          fetchRooms();
        }}
      />
    </div>
  );
}
