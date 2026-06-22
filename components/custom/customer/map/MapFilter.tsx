/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { useRoomFilterStore } from "@/stores/roomFilterStore";
import { useRoomStore } from "@/stores/roomStore";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  SlidersHorizontal, 
  Wifi, 
  AirVent, 
  ParkingSquare, 
  Waves, 
  BedDouble, 
  RotateCcw,
  ArrowUpDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MapFilter() {
  const {
    keyword,
    setKeyword,
    selectedProvince,
    setSelectedProvince,
    selectedProvinceCode,
    setSelectedProvinceCode,
    selectedDistrict,
    setSelectedDistrict,
    selectedDistrictCode,
    setSelectedDistrictCode,
    priceRange,
    setPriceRange,
    selectedFacilities,
    handleToggleFacility,
    sortBy,
    setSortBy,
    provinces,
    districts,
    loadProvinces,
    handleClearFilters
  } = useRoomFilterStore();

  const { fetchRoomPagination } = useRoomStore();

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  // Sync results when filter variables change
  useEffect(() => {
    const provinceNum = selectedProvinceCode ? Number(selectedProvinceCode) : undefined;
    const districtNum = selectedDistrictCode ? Number(selectedDistrictCode) : undefined;
    
    fetchRoomPagination({
      skip: 0,
      limit: 50, // Retrieve up to 50 rooms to provide a rich dataset for local keyword/amenity filtering
      province_code: provinceNum,
      district_code: districtNum,
      city: selectedProvince || undefined,
      district: selectedDistrict || undefined,
      price_from: priceRange[0],
      price_to: priceRange[1],
      sort_by: sortBy === "newest" ? "created_at" : "price",
      order: sortBy === "priceAsc" ? "asc" : "desc"
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedProvinceCode, 
    selectedDistrictCode, 
    selectedProvince,
    selectedDistrict,
    priceRange[0],
    priceRange[1],
    sortBy, 
    keyword,
    selectedFacilities.join(","),
    fetchRoomPagination
  ]);

  // Available amenities filter options list
  const amenitiesList = [
    { id: "wifi", label: "Wifi", icon: Wifi },
    { id: "điều hòa", label: "Máy lạnh", icon: AirVent },
    { id: "đỗ xe", label: "Bãi đỗ xe", icon: ParkingSquare },
    { id: "hồ bơi", label: "Hồ bơi", icon: Waves },
    { id: "giường", label: "Giường ngủ", icon: BedDouble },
  ];

  return (
    <div className="space-y-6">
      
      {/* ── 1. Keyword Search ── */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Từ khóa tìm kiếm
        </span>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm tên đường, khu vực..."
            className="pl-11 rounded-2xl border-slate-200 focus-visible:ring-primary font-semibold text-sm h-11"
          />
        </div>
      </div>

      {/* ── 2. Province Dropdown ── */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Tỉnh / Thành phố
        </span>
        <select
          value={selectedProvinceCode}
          onChange={(e) => {
            const val = e.target.value;
            const code = val ? Number(val) : "";
            setSelectedProvinceCode(code);
            const found = provinces.find((p) => p.code === code);
            setSelectedProvince(found ? found.name : "");
          }}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <option value="">Tất cả các tỉnh</option>
          {provinces.map((prov) => (
            <option key={prov.code} value={prov.code}>
              {prov.name}
            </option>
          ))}
        </select>
      </div>

      {/* ── 3. District Dropdown (Conditional) ── */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Quận / Huyện
        </span>
        <select
          value={selectedDistrictCode}
          onChange={(e) => {
            const val = e.target.value;
            const code = val ? Number(val) : "";
            setSelectedDistrictCode(code);
            const found = districts.find((d) => d.code === code);
            setSelectedDistrict(found ? found.name : "");
          }}
          disabled={!selectedProvinceCode}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <option value="">Tất cả các quận</option>
          {districts.map((dist) => (
            <option key={dist.code} value={dist.code}>
              {dist.name}
            </option>
          ))}
        </select>
      </div>

      {/* ── 4. Price Limit Ranges ── */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5 text-primary" />
          Giới hạn giá (VND)
        </span>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Giá tối thiểu</span>
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              placeholder="0"
              className="rounded-xl border-slate-200 text-xs font-bold"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Giá tối đa</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              placeholder="15,000,000"
              className="rounded-xl border-slate-200 text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* ── 5. Sorting Controls ── */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
          Sắp xếp theo
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          <option value="newest">Mới nhất</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
        </select>
      </div>

      {/* ── 6. Amenities Badges ── */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          Tiện nghi đi kèm
        </span>
        <div className="flex flex-wrap gap-2">
          {amenitiesList.map((amenity) => {
            const IconComp = amenity.icon;
            const isSelected = selectedFacilities.includes(amenity.id);

            return (
              <button
                type="button"
                key={amenity.id}
                onClick={() => handleToggleFacility(amenity.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <IconComp className="h-3.5 w-3.5" />
                <span>{amenity.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 7. Reset Clear Action Button ── */}
      <Button
        onClick={handleClearFilters}
        variant="outline"
        className="w-full rounded-full border-dashed border-slate-200 hover:bg-slate-50 text-xs font-extrabold uppercase tracking-wider text-slate-500 py-5 flex items-center justify-center gap-2 mt-4"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Xóa tất cả bộ lọc
      </Button>

    </div>
  );
}