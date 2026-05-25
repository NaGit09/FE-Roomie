"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Plus, 
  Sparkles,
  MapPin,
  Coins,
  Users,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  X,
  Compass,
  ArrowRight,
  ClipboardList,
  ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";

interface RoomItem {
  id: number;
  name: string;
  district: string;
  address: string;
  price: number;
  capacity: number;
  occupied: number;
  status: "VACANT" | "OCCUPIED" | "MAINTENANCE";
  features: string[];
}

export default function LandlordRoomsPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "VACANT" | "OCCUPIED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form States
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDistrict, setNewRoomDistrict] = useState("Quận 1");
  const [newRoomAddress, setNewRoomAddress] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState(4500000);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);

  // Mock initial rooms list
  const [rooms, setRooms] = useState<RoomItem[]>([
    {
      id: 1,
      name: "Phòng 101 - Căn hộ Studio Ban Công",
      district: "Quận 1",
      address: "15/4 Nguyễn Thị Minh Khai, Đa Kao",
      price: 6500000,
      capacity: 2,
      occupied: 2,
      status: "OCCUPIED",
      features: ["Wifi", "Máy lạnh", "Ban công", "Bếp riêng", "Tủ lạnh"],
    },
    {
      id: 2,
      name: "Phòng 102 - Phòng Ngủ Ấm Cúng",
      district: "Bình Thạnh",
      address: "240/12 Điện Biên Phủ, Phường 22",
      price: 4800000,
      capacity: 2,
      occupied: 1,
      status: "VACANT",
      features: ["Wifi", "Máy lạnh", "Cửa sổ lớn", "Tủ quần áo"],
    },
    {
      id: 3,
      name: "Phòng 201 - Phòng Duplex Cao Cấp",
      district: "Quận 10",
      address: "452 Cách Mạng Tháng Tám, Phường 11",
      price: 7200000,
      capacity: 3,
      occupied: 0,
      status: "VACANT",
      features: ["Wifi", "Máy lạnh", "Gác lửng", "Tủ lạnh", "Máy giặt riêng"],
    },
    {
      id: 4,
      name: "Phòng 202 - Phòng Ghép Giá Rẻ",
      district: "Thủ Đức",
      address: "12 Võ Văn Ngân, Trường Thọ",
      price: 3200000,
      capacity: 4,
      occupied: 4,
      status: "OCCUPIED",
      features: ["Wifi", "Máy lạnh", "Giường tầng", "Khu giặt chung"],
    },
    {
      id: 5,
      name: "Phòng 301 - Phòng Studio Gác Lửng",
      district: "Quận 7",
      address: "84 Đường số 15, Tân Kiểng",
      price: 5500000,
      capacity: 2,
      occupied: 1,
      status: "VACANT",
      features: ["Wifi", "Máy lạnh", "Gác lửng", "Khu đỗ xe miễn phí"],
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

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newRoomName.trim() === "" || newRoomAddress.trim() === "") {
      toast.warning("Vui lòng nhập đầy đủ thông tin phòng!");
      return;
    }

    const newRoom: RoomItem = {
      id: rooms.length + 1,
      name: newRoomName,
      district: newRoomDistrict,
      address: newRoomAddress,
      price: newRoomPrice,
      capacity: newRoomCapacity,
      occupied: 0,
      status: "VACANT",
      features: ["Wifi", "Máy lạnh", "Đầy đủ nội thất"],
    };

    setRooms([newRoom, ...rooms]);
    setIsAddOpen(false);
    toast.success(`Đã thêm phòng "${newRoomName}" thành công!`);

    // Reset Form
    setNewRoomName("");
    setNewRoomAddress("");
    setNewRoomPrice(4500000);
    setNewRoomCapacity(2);
  };

  // Filtered rooms listing
  const filteredRooms = rooms.filter((room) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "VACANT" && room.status === "VACANT") ||
      (filter === "OCCUPIED" && room.status === "OCCUPIED");
    
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.district.toLowerCase().includes(searchQuery.toLowerCase());

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
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#0f172a]/40 border border-white/5 rounded-2xl p-4">
        
        {/* Search bar input widget */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên phòng, địa chỉ, quận..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#0b0f19] border border-white/5 rounded-xl pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#F59E0B] text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Filter togglers */}
        <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded-xl border border-white/5 self-stretch md:self-auto justify-between md:justify-start">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "VACANT", label: "Còn trống" },
            { id: "OCCUPIED", label: "Đã cho thuê" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                filter === item.id
                  ? "bg-[#F59E0B] text-slate-900 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Cards Grid */}
      {filteredRooms.length === 0 ? (
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
          {filteredRooms.map((room) => (
            <motion.div
              key={room.id}
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
                    room.status === "OCCUPIED"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}>
                    {room.status === "OCCUPIED" ? "Đã lấp đầy" : "Còn trống"}
                  </span>
                  
                  <span className="text-[10px] font-extrabold text-slate-400 font-body">
                    Renter: {room.occupied} / {room.capacity}
                  </span>
                </div>

                {/* Info titles */}
                <div className="space-y-1">
                  <h3 className="font-bold text-md text-slate-100 group-hover:text-[#FBBF24] transition-colors leading-tight">
                    {room.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium font-body leading-relaxed flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                    {room.address}
                  </p>
                </div>

                <hr className="border-white/5" />

                {/* Features listing */}
                <div className="flex flex-wrap gap-1">
                  {room.features.map((feat, fIdx) => (
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
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Form Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-md rounded-[2.5rem] border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 z-10 text-left text-[#F8FAFC]"
            >
              {/* Close button */}
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 mb-6">
                <span className="text-[10px] font-black uppercase text-[#F59E0B] tracking-widest block">
                  Add New Apartment Room
                </span>
                <h3 className="text-xl font-black text-slate-100">Khai báo phòng thuê mới</h3>
                <p className="text-[10px] text-slate-450 leading-relaxed">
                  Điền các thông tin vị trí, giá tiền và sức chứa để đưa phòng vào danh sách quản lý.
                </p>
              </div>

              <form onSubmit={handleAddRoomSubmit} className="space-y-4 font-body">
                {/* Input 1: Room name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Tên phòng hoặc căn hộ</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Phòng 302 - Căn Hộ Penthouse"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>

                {/* Input 2: District */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Khu vực quận/huyện</label>
                  <select
                    value={newRoomDistrict}
                    onChange={(e) => setNewRoomDistrict(e.target.value)}
                    className="w-full h-11 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 3">Quận 3</option>
                    <option value="Quận 10">Quận 10</option>
                    <option value="Bình Thạnh">Bình Thạnh</option>
                    <option value="Quận 7">Quận 7</option>
                    <option value="Thủ Đức">Thủ Đức</option>
                  </select>
                </div>

                {/* Input 3: Address */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 15/4 Nguyễn Thị Minh Khai, Đa Kao"
                    value={newRoomAddress}
                    onChange={(e) => setNewRoomAddress(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>

                {/* Dual Inputs: Price and Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Biểu phí (VNĐ)</label>
                    <input
                      type="number"
                      value={newRoomPrice}
                      onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Sức chứa (Người)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newRoomCapacity}
                      onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="h-11 px-5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-350 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-900 text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-[#F59E0B]/10"
                  >
                    Thêm ngay
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
