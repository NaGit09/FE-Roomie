/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { PostApi } from "@/services/api/room";
import { RoomDetail } from "@/schema/room/room";

export default function LandlordRoomsPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "VACANT" | "OCCUPIED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDistrict, setNewRoomDistrict] = useState("Quận 1");
  const [newRoomAddress, setNewRoomAddress] = useState("");
  const [newRoomPrice, setNewRoomPrice] = useState(4500000);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomArea, setNewRoomArea] = useState(25);
  const [newRoomDeposit, setNewRoomDeposit] = useState(2000000);
  const [newRoomWard, setNewRoomWard] = useState("Phường Đa Kao");
  const [newRoomCity, setNewRoomCity] = useState("Hồ Chí Minh");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Wifi",
    "Máy lạnh",
    "Tủ lạnh"
  ]);

  // Rooms list state
  const [rooms, setRooms] = useState<RoomDetail[]>([]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await PostApi.getAllRooms();
      if (response && response.data && Array.isArray(response.data.items)) {
        setRooms(response.data.items);
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

  const currentUser = user || {
    full_name: "Nguyễn Văn Landlord",
    email: "landlord@roomie.com",
    role: "LANDLORD"
  };

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

  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newRoomName.trim() === "" || newRoomAddress.trim() === "") {
      toast.warning("Vui lòng nhập đầy đủ thông tin phòng!");
      return;
    }

    const newRoomPayload: RoomDetail = {
      name: newRoomName,
      description: newRoomDescription || "Không có mô tả chi tiết cho phòng này.",
      price: newRoomPrice,
      area: newRoomArea,
      deposit: newRoomDeposit,
      status: "VACANT",
      amenities: selectedAmenities,
      attributes: [`capacity:${newRoomCapacity}`, `occupied:0`],
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"],
      address: {
        street: newRoomAddress,
        ward: newRoomWard,
        district: newRoomDistrict,
        city: newRoomCity,
        country: "Vietnam",
        latitude: 10.762622,
        longitude: 106.660172,
        full_text: `${newRoomAddress}, ${newRoomWard}, ${newRoomDistrict}, ${newRoomCity}`
      }
    };

    try {
      const response = await PostApi.createNewRoom(newRoomPayload);
      if (response && (response.code === 200 || response.code === 201)) {
        toast.success(`Đã thêm phòng "${newRoomName}" thành công!`);
        setIsAddOpen(false);
        // Refresh list
        fetchRooms();
        
        // Reset Form
        setNewRoomName("");
        setNewRoomDescription("");
        setNewRoomAddress("");
        setNewRoomWard("Phường Đa Kao");
        setNewRoomDistrict("Quận 1");
        setNewRoomPrice(4500000);
        setNewRoomArea(25);
        setNewRoomDeposit(2000000);
        setSelectedAmenities(["Wifi", "Máy lạnh", "Tủ lạnh"]);
      } else {
        toast.error(response?.message || "Đã xảy ra lỗi khi tạo phòng.");
      }
    } catch (error: any) {
      console.error("Error creating room:", error);
      toast.error(error?.response?.data?.message || "Không thể tạo phòng mới. Vui lòng thử lại!");
    }
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
              className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 z-10 text-left text-[#F8FAFC]"
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
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Điền các thông tin vị trí, giá tiền, sức chứa và các tiện nghi phòng để đồng bộ trực tiếp lên hệ thống Roomie.
                </p>
              </div>

              <form onSubmit={handleAddRoomSubmit} className="space-y-5 font-body">
                {/* Input 1: Room name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Tên phòng hoặc căn hộ</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Phòng 302 - Căn Hộ Penthouse Ban Công"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 placeholder-slate-655 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>

                {/* Input 2: Description */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Mô tả chi tiết phòng</label>
                  <textarea
                    placeholder="Nhập thông tin mô tả chi tiết về phòng, giờ giấc tự do, điện nước, vv..."
                    value={newRoomDescription}
                    onChange={(e) => setNewRoomDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-semibold text-slate-200 placeholder-slate-655 focus:outline-none focus:border-[#F59E0B] resize-none"
                    required
                  />
                </div>

                {/* Input 3: Detailed Street Address */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Địa chỉ chi tiết (Số nhà, tên đường)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 15/4 Nguyễn Thị Minh Khai"
                    value={newRoomAddress}
                    onChange={(e) => setNewRoomAddress(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 placeholder-slate-655 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>

                {/* Address details: Ward, District, City */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Phường/Xã</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Đa Kao"
                      value={newRoomWard}
                      onChange={(e) => setNewRoomWard(e.target.value)}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Quận/Huyện</label>
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
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Thành phố</label>
                    <input
                      type="text"
                      placeholder="Hồ Chí Minh"
                      value={newRoomCity}
                      onChange={(e) => setNewRoomCity(e.target.value)}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                </div>

                {/* Price, Deposit, Area, Capacity */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Giá thuê (VNĐ)</label>
                    <input
                      type="number"
                      value={newRoomPrice}
                      onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Tiền cọc (VNĐ)</label>
                    <input
                      type="number"
                      value={newRoomDeposit}
                      onChange={(e) => setNewRoomDeposit(Number(e.target.value))}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Diện tích (m²)</label>
                    <input
                      type="number"
                      min={5}
                      value={newRoomArea}
                      onChange={(e) => setNewRoomArea(Number(e.target.value))}
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

                {/* Amenities checklist grid */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">Tiện nghi có sẵn</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["Wifi", "Máy lạnh", "Ban công", "Bếp riêng", "Tủ lạnh", "Máy giặt", "Khu để xe", "Cửa sổ lớn", "Tủ quần áo"].map((amenity) => {
                      const isSelected = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                            } else {
                              setSelectedAmenities([...selectedAmenities, amenity]);
                            }
                          }}
                          className={`h-9 rounded-xl border text-[10px] font-black uppercase tracking-wider px-3 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B] shadow"
                              : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
                          }`}
                        >
                          {isSelected && <CheckCircle className="h-3.5 w-3.5 text-[#F59E0B]" />}
                          {amenity}
                        </button>
                      );
                    })}
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
                    Đăng phòng ngay
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
