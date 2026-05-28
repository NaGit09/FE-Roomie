/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { AddressApi } from "@/services/api/adress";
import { PostApi } from "@/services/api/room";
import { RoomDetail } from "@/schema/room/room";

interface CreateRoomFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Form States
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [newRoomAddress, setNewRoomAddress] = useState("");
  
  // Dynamic address select states
  const [provinces, setProvinces] = useState<{ code: number; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ code: number; name: string }[]>([]);
  const [wards, setWards] = useState<{ code: number; name: string }[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | "">("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | "">("");
  const [selectedWardCode, setSelectedWardCode] = useState<number | "">("");

  const [newRoomCity, setNewRoomCity] = useState("");
  const [newRoomDistrict, setNewRoomDistrict] = useState("");
  const [newRoomWard, setNewRoomWard] = useState("");

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [newRoomPrice, setNewRoomPrice] = useState(4500000);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomArea, setNewRoomArea] = useState(25);
  const [newRoomDeposit, setNewRoomDeposit] = useState(2000000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Wifi",
    "Máy lạnh",
    "Tủ lạnh"
  ]);

  // Load provinces on mount
  useEffect(() => {
    if (!isOpen) return;

    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await AddressApi.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Failed to load provinces:", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố.");
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, [isOpen]);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value ? Number(e.target.value) : "";
    setSelectedProvinceCode(code);
    setSelectedDistrictCode("");
    setSelectedWardCode("");
    setDistricts([]);
    setWards([]);

    const province = provinces.find((p) => p.code === code);
    const cityName = province ? province.name : "";
    setNewRoomCity(cityName);
    setNewRoomDistrict("");
    setNewRoomWard("");

    if (code) {
      setLoadingDistricts(true);
      try {
        const data = await AddressApi.getDistricts(code);
        setDistricts(data);
      } catch (error) {
        console.error("Failed to load districts:", error);
        toast.error("Không thể tải danh sách quận/huyện.");
      } finally {
        setLoadingDistricts(false);
      }
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value ? Number(e.target.value) : "";
    setSelectedDistrictCode(code);
    setSelectedWardCode("");
    setWards([]);

    const district = districts.find((d) => d.code === code);
    const districtName = district ? district.name : "";
    setNewRoomDistrict(districtName);
    setNewRoomWard("");

    if (code) {
      setLoadingWards(true);
      try {
        const data = await AddressApi.getWards(code);
        setWards(data);
      } catch (error) {
        console.error("Failed to load wards:", error);
        toast.error("Không thể tải danh sách phường/xã.");
      } finally {
        setLoadingWards(false);
      }
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value ? Number(e.target.value) : "";
    setSelectedWardCode(code);

    const ward = wards.find((w) => w.code === code);
    const wardName = ward ? ward.name : "";
    setNewRoomWard(wardName);
  };

  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newRoomName.trim() === "" || newRoomAddress.trim() === "") {
      toast.warning("Vui lòng nhập đầy đủ thông tin phòng!");
      return;
    }

    if (!newRoomCity || !newRoomDistrict || !newRoomWard) {
      toast.warning("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã!");
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
        onSuccess();
        
        // Reset Form
        setNewRoomName("");
        setNewRoomDescription("");
        setNewRoomAddress("");
        setSelectedProvinceCode("");
        setSelectedDistrictCode("");
        setSelectedWardCode("");
        setNewRoomCity("");
        setNewRoomDistrict("");
        setNewRoomWard("");
        setNewRoomPrice(4500000);
        setNewRoomArea(25);
        setNewRoomDeposit(2000000);
        setNewRoomCapacity(2);
        setSelectedAmenities(["Wifi", "Máy lạnh", "Tủ lạnh"]);
      } else {
        toast.error(response?.message || "Đã xảy ra lỗi khi tạo phòng.");
      }
    } catch (error: any) {
      console.error("Error creating room:", error);
      toast.error(error?.response?.data?.message || "Không thể tạo phòng mới. Vui lòng thử lại!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Form Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 z-10 text-left text-[#F8FAFC] max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1.5 mb-6">
              <span className="text-[10px] font-black uppercase text-[#F59E0B] tracking-widest block font-heading">
                Add New Apartment Room
              </span>
              <h3 className="text-xl font-black text-slate-100 font-heading">Khai báo phòng thuê mới</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed font-body">
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
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] resize-none"
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
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                  required
                />
              </div>

              {/* Address details: City, District, Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">
                    Tỉnh / Thành phố {loadingProvinces && "..."}
                  </label>
                  <select
                    value={selectedProvinceCode}
                    onChange={handleProvinceChange}
                    className="w-full h-11 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B]"
                    required
                  >
                    <option value="">-- Chọn Tỉnh / Thành --</option>
                    {provinces.map((prov) => (
                      <option key={prov.code} value={prov.code}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">
                    Quận / Huyện {loadingDistricts && "..."}
                  </label>
                  <select
                    value={selectedDistrictCode}
                    onChange={handleDistrictChange}
                    disabled={!selectedProvinceCode}
                    className="w-full h-11 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B] disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">-- Chọn Quận / Huyện --</option>
                    {districts.map((dist) => (
                      <option key={dist.code} value={dist.code}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">
                    Phường / Xã {loadingWards && "..."}
                  </label>
                  <select
                    value={selectedWardCode}
                    onChange={handleWardChange}
                    disabled={!selectedDistrictCode}
                    className="w-full h-11 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#F59E0B] disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">-- Chọn Phường / Xã --</option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
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
                  onClick={onClose}
                  className="h-11 px-5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
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
  );
};
