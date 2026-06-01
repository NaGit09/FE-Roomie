/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  MapPin,
  Compass,
  X,
  Save,
  Loader2,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { PostApi } from "@/services/api/room";
import { RoomDetail } from "@/schema/room/room";
import formatVND from "@/utils/priceUtils";

export default function AdminRoomsPage() {
  const [mounted, setMounted] = useState(false);
  const [rooms, setRooms] = useState<RoomDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // CRUD Modal States
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomDetail | null>(null);
  const [formMode, setFormMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formArea, setFormArea] = useState(0);
  const [formDeposit, setFormDeposit] = useState(0);
  const [formStatus, setFormStatus] = useState("VACANT");
  const [formAmenities, setFormAmenities] = useState<string[]>([]);
  const [formStreet, setFormStreet] = useState("");
  const [formWard, setFormWard] = useState("");
  const [formDistrict, setFormDistrict] = useState("");
  const [formCity, setFormCity] = useState("");

  const amenityOptions = ["Wifi", "Máy giặt", "Điều hòa", "Tủ lạnh", "Nội thất", "Chỗ để xe", "Bảo vệ 24/7", "WC riêng", "Tự do ra vào"];

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await PostApi.getAllRooms();
      let extractedRooms: RoomDetail[] = [];
      
      if (response && response.code === 200) {
        if (response.data && Array.isArray((response.data as any).items)) {
          extractedRooms = (response.data as any).items;
        } else if (Array.isArray(response.data)) {
          extractedRooms = response.data;
        }
      }
      setRooms(extractedRooms);
    } catch (err: any) {
      console.error("Error loading all rooms for admin:", err);
      toast.error("Lỗi khi tải danh sách phòng từ máy chủ.");
    } finally {
      setLoading(false);
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
    return "Chưa cập nhật";
  };

  // Filter Rooms
  const filteredRooms = rooms.filter((room) => {
    const addressStr = getRoomFullAddress(room);
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      addressStr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "VACANT" && room.status === "VACANT") ||
      (statusFilter === "OCCUPIED" && room.status === "OCCUPIED") ||
      (statusFilter === "PENDING" && room.status === "PENDING") ||
      (statusFilter === "APPROVED" && room.status === "APPROVED");

    return matchesSearch && matchesStatus;
  });

  // Calculate Operational Metrics
  const totalRoomsCount = rooms.length;
  const vacantRoomsCount = rooms.filter(r => r.status === "VACANT").length;
  const occupiedRoomsCount = rooms.filter(r => r.status === "OCCUPIED" || r.status === "RENTED").length;
  const pendingRoomsCount = rooms.filter(r => r.status === "PENDING").length;

  const handleOpenDetail = (room: RoomDetail) => {
    setSelectedRoom(room);
    setIsDetailOpen(true);
  };

  const handleOpenCreate = () => {
    setFormMode("CREATE");
    setFormName("");
    setFormDesc("");
    setFormPrice(3000000);
    setFormArea(25);
    setFormDeposit(3000000);
    setFormStatus("VACANT");
    setFormAmenities([]);
    setFormStreet("");
    setFormWard("");
    setFormDistrict("");
    setFormCity("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (room: RoomDetail) => {
    setSelectedRoom(room);
    setFormMode("EDIT");
    setFormName(room.name);
    setFormDesc(room.description || "");
    setFormPrice(room.price);
    setFormArea(room.area);
    setFormDeposit(room.deposit || room.price);
    setFormStatus(room.status);
    setFormAmenities(room.amenities || []);
    setFormStreet(room.address?.street || "");
    setFormWard(room.address?.ward || "");
    setFormDistrict(room.address?.district || "");
    setFormCity(room.address?.city || "");
    setIsFormOpen(true);
  };

  const handleToggleAmenity = (name: string) => {
    if (formAmenities.includes(name)) {
      setFormAmenities(formAmenities.filter(item => item !== name));
    } else {
      setFormAmenities([...formAmenities, name]);
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formStreet.trim() || !formCity.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên phòng và địa chỉ.");
      return;
    }

    setSaving(true);
    const payload: RoomDetail = {
      name: formName,
      description: formDesc,
      price: Number(formPrice),
      area: Number(formArea),
      deposit: Number(formDeposit),
      status: formStatus,
      amenities: formAmenities,
      attributes: selectedRoom?.attributes || ["capacity:2", "occupied:0"],
      images: selectedRoom?.images || [],
      address: {
        street: formStreet,
        ward: formWard,
        district: formDistrict,
        city: formCity,
        country: selectedRoom?.address?.country || "Vietnam",
        latitude: selectedRoom?.address?.latitude || 10.762622,
        longitude: selectedRoom?.address?.longitude || 106.660172,
        full_text: `${formStreet}, ${formWard}, ${formDistrict}, ${formCity}`.replace(/,\s*,/g, ",").trim()
      }
    };

    try {
      if (formMode === "CREATE") {
        const res = await PostApi.createNewRoom(payload);
        if (res && res.code === 200) {
          toast.success(`Tạo mới phòng "${formName}" thành công!`);
          setIsFormOpen(false);
          fetchRooms();
        } else {
          toast.error(res?.message || "Tạo mới phòng thất bại.");
        }
      } else if (formMode === "EDIT" && selectedRoom?.id) {
        const res = await PostApi.updateRoom(selectedRoom.id, payload);
        if (res && res.code === 200) {
          toast.success(`Cập nhật phòng "${formName}" thành công!`);
          setIsFormOpen(false);
          fetchRooms();
        } else {
          toast.error(res?.message || "Cập nhật thất bại.");
        }
      }
    } catch (err: any) {
      console.error("Failed to save room details:", err);
      toast.error("Lỗi liên kết máy chủ khi lưu phòng.");
    } finally {
      setSaving(false);
    }
  };

  const handleApproveRoom = async (room: RoomDetail) => {
    if (!room.id) return;
    const payload: RoomDetail = {
      ...room,
      status: "VACANT"
    };

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const res = await PostApi.updateRoom(room.id!, payload);
          if (res && res.code === 200) {
            fetchRooms();
            resolve(true);
          } else {
            reject(new Error(res?.message || "Không thể duyệt."));
          }
        } catch (err) {
          reject(err);
        }
      }),
      {
        loading: `Đang phê duyệt phòng "${room.name}"...`,
        success: `Phê duyệt phòng "${room.name}" thành công!`,
        error: "Lỗi hệ thống khi duyệt phòng.",
      }
    );
  };

  const handleDeleteRoom = async (room: RoomDetail) => {
    if (!room.id) return;
    
    if (!confirm(`Bạn có chắc chắn muốn xóa phòng "${room.name}"? Tác vụ này không thể phục hồi.`)) {
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const res = await PostApi.deleteRoom(room.id!);
          if (res && res.code === 200) {
            fetchRooms();
            resolve(true);
          } else {
            reject(new Error(res?.message || "Xóa thất bại."));
          }
        } catch (err) {
          reject(err);
        }
      }),
      {
        loading: `Đang xử lý yêu cầu xóa phòng "${room.name}"...`,
        success: `Xóa phòng "${room.name}" thành công khỏi hệ thống!`,
        error: "Lỗi hệ thống khi xóa phòng.",
      }
    );
  };

  return (
    <div className="space-y-10 text-slate-100 font-sans">
      
      {/* 1. Header & Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <Activity className="h-3.5 w-3.5" />
            Hệ thống kiểm duyệt phòng trọ
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 font-heading">
            QUẢN LÝ CĂN HỘ & PHÒNG TRỌ
          </h2>
          <p className="text-xs text-slate-400 font-medium font-body max-w-xl">
            Toàn quyền phê duyệt, xem chi tiết, chỉnh sửa thông tin hoặc gỡ bỏ các phòng trọ đăng tải trên hệ thống từ các landlords.
          </p>
        </div>

        {/* Add room directly by Admin */}
        <button
          onClick={handleOpenCreate}
          className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-955 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Tạo phòng Admin
        </button>
      </div>

      {/* 2. Mini Summary Metrics Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Tổng phòng", value: totalRoomsCount, sub: "Đăng tải hệ thống", color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Còn trống", value: vacantRoomsCount, sub: "Sẵn sàng đón renter", color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Đang thuê", value: occupiedRoomsCount, sub: "Hợp đồng hoạt động", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Chờ duyệt", value: pendingRoomsCount, sub: "Cần kiểm duyệt gấp", color: "text-red-500", bg: "bg-red-500/10", pulse: pendingRoomsCount > 0 },
        ].map((m, idx) => (
          <div key={idx} className="rounded-2xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md p-4 text-left space-y-1.5 shadow-md relative">
            {m.pulse && (
              <span className="absolute top-4 right-4 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-slate-500 block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-body">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search & Quick Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#080d1a]/40 border border-white/5">
        {/* Search */}
        <div className="flex items-center gap-2 h-11 bg-slate-900/60 rounded-xl px-3.5 border border-white/5 text-xs text-slate-400 w-full sm:max-w-xs focus-within:border-emerald-500/50 transition-colors">
          <Search className="h-4.5 w-4.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Tìm theo tên phòng, địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 font-medium"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { label: "Tất cả", value: "ALL" },
            { label: "Còn trống", value: "VACANT" },
            { label: "Đang thuê", value: "OCCUPIED" },
            { label: "Chờ duyệt", value: "PENDING" },
            { label: "Đã duyệt", value: "APPROVED" }
          ].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setStatusFilter(tab.value)}
              className={`h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                statusFilter === tab.value
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10"
                  : "bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Rooms Grid Desktop layout */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Compass className="h-9 w-9 text-emerald-500 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-body">
            Đang tải hồ sơ căn hộ...
          </span>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="rounded-[2.5rem] border border-white/5 bg-[#080d1a]/30 p-16 text-center space-y-4 max-w-md mx-auto">
          <Compass className="h-10 w-10 text-slate-600 animate-pulse mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">Không tìm thấy phòng phù hợp</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-body">
            Vui lòng thay đổi từ khóa tìm kiếm hoặc cập nhật bộ lọc trạng thái phòng kiểm duyệt.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, idx) => (
            <motion.div
              key={room.id || idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Header tags */}
                <div className="flex justify-between items-start gap-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                    room.status === "PENDING"
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : room.status === "APPROVED" || room.status === "VACANT"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  }`}>
                    {room.status === "PENDING" ? "Chờ duyệt" : room.status === "OCCUPIED" ? "Đã lấp đầy" : "Sẵn sàng"}
                  </span>
                  
                  <span className="text-[10px] font-extrabold text-slate-500 font-body">
                    Sức chứa: {getRoomCapacity(room)} Renter
                  </span>
                </div>

                {/* Info and title */}
                <div className="space-y-1.5 text-left">
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors leading-tight line-clamp-1">
                    {room.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium font-body leading-relaxed flex items-start gap-1 line-clamp-2">
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                    {getRoomFullAddress(room)}
                  </p>
                </div>

                <hr className="border-white/5" />

                {/* Dynamic Amenities tags */}
                <div className="flex flex-wrap gap-1.5">
                  {getRoomFeatures(room).slice(0, 3).map((feat: string, fIdx: number) => (
                    <span
                      key={fIdx}
                      className="inline-flex text-[9px] font-semibold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded"
                    >
                      {feat}
                    </span>
                  ))}
                  {getRoomFeatures(room).length > 3 && (
                    <span className="inline-flex text-[8px] font-black text-slate-500 px-2 py-0.5 rounded font-body">
                      +{getRoomFeatures(room).length - 3} đặc quyền
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons & price footer */}
              <div className="mt-6 pt-4 border-t border-dashed border-white/5 flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block font-body">Biểu phí tháng</span>
                  <span className="text-sm font-black text-[#FBBF24] font-sans">
                    {formatVND(room.price)}
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider"> / th</span>
                  </span>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-1.5 shrink-0">
                  
                  {/* Approve Option (Only show for PENDING rooms) */}
                  {room.status === "PENDING" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApproveRoom(room); }}
                      className="h-8 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 flex items-center justify-center cursor-pointer transition-all active:scale-90 text-[8px] font-black uppercase tracking-wider gap-1"
                      title="Phê duyệt phòng"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Duyệt
                    </button>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenDetail(room); }}
                    className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(room); }}
                    className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-[#FBBF24]/20 hover:text-[#FBBF24] hover:border-[#FBBF24]/30 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Cập nhật"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room); }}
                    className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Xóa phòng"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 5. DYNAMIC VIEW DETAILS MODAL SHEET */}
      <AnimatePresence>
        {isDetailOpen && selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#0f172a] shadow-2xl p-6 sm:p-10 z-10 text-left space-y-6"
            >
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 text-left border-b border-white/5 pb-4">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                  selectedRoom.status === "PENDING" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}>
                  Trạng thái: {selectedRoom.status}
                </span>
                <h3 className="text-xl font-bold text-slate-100 font-heading">{selectedRoom.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-body flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                  {getRoomFullAddress(selectedRoom)}
                </p>
              </div>

              {/* Grid content details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">Chủ sở hữu (Owner ID)</span>
                    <span className="font-mono font-bold text-slate-350 text-slate-300 break-all">{selectedRoom.owner_id || "Quản trị viên"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">Giá thuê phòng</span>
                      <span className="font-extrabold text-[#FBBF24] text-sm">{formatVND(selectedRoom.price)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">Đặt cọc</span>
                      <span className="font-extrabold text-slate-200 text-sm">{formatVND(selectedRoom.deposit || selectedRoom.price)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">Diện tích</span>
                      <span className="font-extrabold text-slate-200">{selectedRoom.area} m²</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">Sức chứa thực tế</span>
                      <span className="font-extrabold text-slate-200">{getRoomOccupied(selectedRoom)} / {getRoomCapacity(selectedRoom)} Renter</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px] mb-1.5">Tiện ích đặc quyền</span>
                    <div className="flex flex-wrap gap-1.5">
                      {getRoomFeatures(selectedRoom).map((feat: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">Mô tả chi tiết</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-body font-medium italic mt-1 max-h-24 overflow-y-auto pr-1">
                      {selectedRoom.description || "Chủ nhà không cung cấp thêm thông tin chi tiết nào khác cho phòng trọ này" }
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                {selectedRoom.status === "PENDING" && (
                  <button
                    onClick={() => { setIsDetailOpen(false); handleApproveRoom(selectedRoom); }}
                    className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    <CheckCircle className="h-4 w-4" /> Phê duyệt
                  </button>
                )}
                <button
                  onClick={() => { setIsDetailOpen(false); handleOpenEdit(selectedRoom); }}
                  className="h-11 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                >
                  Cập nhật phòng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. DYNAMIC FORM MODAL SHEET (CREATE / EDIT) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#0f172a] shadow-2xl p-6 sm:p-10 z-10 text-left space-y-6"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 text-left border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono tracking-widest font-black uppercase text-emerald-400 block">
                  {formMode === "CREATE" ? "Tạo phòng mới" : "Chỉnh sửa phòng"}
                </span>
                <h3 className="text-xl font-bold text-slate-100 font-heading">
                  {formMode === "CREATE" ? "Thiết lập thông tin phòng trọ" : `Cập nhật thông tin phòng #${selectedRoom?.id}`}
                </h3>
              </div>

              {/* Form body */}
              <form onSubmit={handleSaveRoom} className="space-y-5 text-xs text-left max-h-[60vh] overflow-y-auto pr-1 font-body font-semibold">
                
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Tên căn hộ/phòng trọ</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ví dụ: Phòng trọ cao cấp lầu 2"
                      required
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Trạng thái phòng trống</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                    >
                      <option value="VACANT">VACANT (Trống)</option>
                      <option value="OCCUPIED">OCCUPIED (Đã lấp đầy)</option>
                      <option value="PENDING">PENDING (Chờ duyệt)</option>
                      <option value="APPROVED">APPROVED (Sẵn sàng)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Mô tả phòng chi tiết</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Mô tả các chi tiết thêm về giờ giấc, quy định chung..."
                    rows={3}
                    className="w-full border border-white/5 bg-slate-900 rounded-xl p-4 text-slate-200 outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>

                {/* Financials & Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Giá thuê (VND/tháng)</label>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      required
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Tiền đặt cọc (VND)</label>
                    <input
                      type="number"
                      value={formDeposit}
                      onChange={(e) => setFormDeposit(Number(e.target.value))}
                      required
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Diện tích (m²)</label>
                    <input
                      type="number"
                      value={formArea}
                      onChange={(e) => setFormArea(Number(e.target.value))}
                      required
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                {/* Address Info */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-slate-400 block text-[9px] uppercase tracking-wider font-extrabold text-emerald-400">Thiết lập địa chỉ phòng trọ</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-500 block text-[8px] uppercase tracking-wider">Số nhà, tên đường</label>
                      <input
                        type="text"
                        value={formStreet}
                        onChange={(e) => setFormStreet(e.target.value)}
                        placeholder="Ví dụ: 123 Nguyễn Thị Minh Khai"
                        required
                        className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-500 block text-[8px] uppercase tracking-wider">Phường/Xã</label>
                      <input
                        type="text"
                        value={formWard}
                        onChange={(e) => setFormWard(e.target.value)}
                        placeholder="Ví dụ: Phường Đa Kao"
                        className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-500 block text-[8px] uppercase tracking-wider">Quận/Huyện</label>
                      <input
                        type="text"
                        value={formDistrict}
                        onChange={(e) => setFormDistrict(e.target.value)}
                        placeholder="Ví dụ: Quận 1"
                        className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-500 block text-[8px] uppercase tracking-wider">Tỉnh/Thành phố</label>
                      <input
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="Ví dụ: Hồ Chí Minh"
                        required
                        className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities checklist selection */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Chọn đặc quyền & tiện ích</label>
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    {amenityOptions.map((item, idx) => {
                      const isSelected = formAmenities.includes(item);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleAmenity(item)}
                          className={`h-9 rounded-lg text-[9px] font-bold transition-all border text-center cursor-pointer active:scale-95 flex items-center justify-center ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-slate-900 border-white/5 text-slate-400 hover:text-slate-350"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Buttons footer */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="h-11 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-11 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Lưu thông tin
                      </>
                    )}
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
