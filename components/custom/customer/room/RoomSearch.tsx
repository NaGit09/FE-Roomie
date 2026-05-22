"use client";

import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { useRoomFilter } from "@/hooks/room/useRoomFilter";
import InputSearch from "./InputSearch";
import ProvinceSelect from "./ProvinceSelect";
import DistrictSelect from "./DistrictSelect";
import PriceRange from "./PriceRange";

export default function RoomSearch() {
  const {
    keyword,
    selectedProvinceCode,
    selectedDistrictCode,
    selectedFacilities,
    priceRange,
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
    setKeyword,
    setSelectedProvinceCode,
    setSelectedProvince,
    setSelectedDistrictCode,
    setSelectedDistrict,
    setPriceRange,
    handleToggleFacility,
    handleClearFilters,
  } = useRoomFilter();

  return (
    <aside className="w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/40 p-8">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold text-slate-800">
            Bộ lọc tìm kiếm
          </span>
        </div>
        <button
          onClick={handleClearFilters}
          className="group flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors duration-300"
        >
          <RotateCcw className="h-3.5 w-3.5 group-hover:-rotate-45 transition-transform duration-300" />
          Đặt lại
        </button>
      </div>

      <div className="space-y-6">
        {/* Row 1: Keyword & Location Dropdowns & Room Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Keyword Search */}
          <InputSearch keyword={keyword} setKeyword={setKeyword} />

          {/* Province Select */}
          <ProvinceSelect
            selectedProvinceCode={selectedProvinceCode}
            setSelectedProvinceCode={setSelectedProvinceCode}
            setSelectedProvince={setSelectedProvince}
            provinces={provinces}
            loadingProvinces={loadingProvinces}
          />

          {/* District Select */}
          <DistrictSelect
            selectedProvinceCode={selectedProvinceCode}
            selectedDistrictCode={selectedDistrictCode}
            setSelectedDistrictCode={setSelectedDistrictCode}
            setSelectedDistrict={setSelectedDistrict}
            districts={districts}
            loadingDistricts={loadingDistricts}
          />
        </div>

        {/* Row 2: Price range (Left) & Facilities checklist (Right) */}
        <PriceRange
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedFacilities={selectedFacilities}
          handleToggleFacility={handleToggleFacility}
        />
      </div>
    </aside>
  );
}
