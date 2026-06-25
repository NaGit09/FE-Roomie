/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Home, 
  Plus, 
  MapPin,
  Compass,
  ChevronRight,
  Eye,
  Edit2,
  Trash2
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
  const [editingRoom, setEditingRoom] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rooms list state
  const [rooms, setRooms] = useState<RoomDetail[]>([]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await PostApi.getMyRoom();
      if (response && response.data) {
        const roomsList = Array.isArray(response.data)
          ? response.data
          : (response.data as any).items || [];
        setRooms(roomsList);
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

  const handleDeleteRoom = async (roomId: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa phòng "${name}" không?`)) {
      try {
        const response = await PostApi.deleteRoom(roomId);
        if (response && (response.code === 200 || response.code === 201)) {
          toast.success(`Đã xóa phòng "${name}" thành công!`);
          fetchRooms();
        } else {
          toast.error(response?.message || "Không thể xóa phòng.");
        }
      } catch (error: any) {
        console.error("Error deleting room:", error);
        toast.error("Không thể xóa phòng. Vui lòng thử lại!");
      }
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
    <div className="space-y-10 animate-fade-in text-foreground">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Home className="h-3.5 w-3.5" />
            Vận hành căn hộ
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
            Quản lý danh sách phòng
          </h1>
          <p className="text-xs sm:text-sm text-slate-650 font-medium font-body leading-relaxed max-w-xl">
            Cập nhật trạng thái phòng trống, thiết lập biểu phí phòng, sức chứa tối đa và theo dõi tỷ lệ lấp đầy.
          </p>
        </div>

        {/* Add Room Trigger button */}
        <button
          onClick={() => { setEditingRoom(null); setIsAddOpen(true); }}
          className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 shadow-md shadow-primary/10 shrink-0 self-start sm:self-center"
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
              className="rounded-3xl border border-slate-200 bg-slate-100 p-6 space-y-6 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-white/10 rounded-full" />
                <div className="h-4 w-12 bg-white/10 rounded-md" />
              </div>
              <div className="space-y-3">
                <div className="h-6 w-3/4 bg-white/10 rounded-md" />
                <div className="h-4 w-1/2 bg-white/10 rounded-md" />
              </div>
              <hr className="border-slate-200" />
              <div className="flex gap-2">
                <div className="h-5 w-12 bg-white/10 rounded-md" />
                <div className="h-5 w-16 bg-white/10 rounded-md" />
                <div className="h-5 w-14 bg-white/10 rounded-md" />
              </div>
              <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
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
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-12 text-center space-y-4 max-w-md mx-auto">
          <Compass className="h-10 w-10 text-slate-650 animate-pulse mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Không tìm thấy phòng phù hợp</h3>
          <p className="text-xs text-slate-650 leading-relaxed font-body">
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
              className="rounded-3xl border border-slate-200 bg-card/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Header status block */}
                <div className="flex justify-between items-start gap-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                    isRoomOccupied(room.status)
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-primary/10 border-primary/30 text-primary"
                  }`}>
                    {isRoomOccupied(room.status) ? "Đã lấp đầy" : "Còn trống"}
                  </span>
                  
                  <span className="text-[10px] font-extrabold text-slate-650 font-body">
                    Renter: {getRoomOccupied(room)} / {getRoomCapacity(room)}
                  </span>
                </div>

                {/* Info titles */}
                <div className="space-y-1">
                  <h3 className="font-bold text-md text-slate-800 group-hover:text-[#FBBF24] transition-colors leading-tight">
                    {room.name}
                  </h3>
                  <p className="text-[10px] text-slate-650 font-medium font-body leading-relaxed flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                    {getRoomFullAddress(room)}
                  </p>
                </div>

                <hr className="border-slate-200" />

                {/* Features listing */}
                <div className="flex flex-wrap gap-1">
                  {getRoomFeatures(room).map((feat: string, fIdx: number) => (
                    <span
                      key={fIdx}
                      className="inline-flex text-[9px] font-bold text-slate-650 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Details trigger footer */}
              <div className="mt-6 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black text-slate-650 uppercase tracking-widest block font-body">Biểu phí phòng</span>
                  <span className="text-sm font-black text-primary">
                    {formatVND(room.price)}
                    <span className="text-[9px] text-slate-650 font-bold uppercase tracking-wider"> / tháng</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); toast.success(`Xem chi tiết phòng "${room.name}"`); }}
                    className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-650 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingRoom(room); setIsAddOpen(true); }}
                    className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 hover:bg-primary/10 hover:text-primary hover:border-primary/20 text-slate-650 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Cập nhật"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (room.id) handleDeleteRoom(room.id, room.name); }}
                    className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-650 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD ROOM MODAL PANEL */}
      <CreateRoomForm
        isOpen={isAddOpen}
        editingRoom={editingRoom}
        onClose={() => {
          setIsAddOpen(false);
          setEditingRoom(null);
        }}
        onSuccess={() => {
          setIsAddOpen(false);
          setEditingRoom(null);
          fetchRooms();
        }}
      />
    </div>
  );
}
