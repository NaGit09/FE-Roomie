import React from "react";
import formatVND from "@/utils/priceUtils";
import { FACILITIES_LIST } from "@/constant/facilites";
import FacilityItem from "./FacilityItem";

interface PriceRangeProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedFacilities: string[];
  handleToggleFacility: (value: string) => void;
}

const PriceRange = ({
  priceRange,
  setPriceRange,
  selectedFacilities,
  handleToggleFacility,
}: PriceRangeProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-100 pt-6">
      {/* Budget Range (Takes 4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Khoảng ngân sách
          </label>
          <span className="text-xs font-black text-primary bg-primary/5 px-2.5 py-1 rounded-full">
            {formatVND(priceRange[0])} - {formatVND(priceRange[1])}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Min Price Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Tối thiểu</span>
              <span className="text-slate-700 font-extrabold">
                {formatVND(priceRange[0])}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={15000000}
                step={500000}
                value={priceRange[0]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= priceRange[1]) {
                    setPriceRange([val, priceRange[1]]);
                  }
                }}
                className="h-1.5 w-full appearance-none rounded-full bg-slate-100 accent-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Tối đa</span>
              <span className="text-slate-700 font-extrabold">
                {formatVND(priceRange[1])}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={15000000}
                step={500000}
                value={priceRange[1]}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= priceRange[0]) {
                    setPriceRange([priceRange[0], val]);
                  }
                }}
                className="h-1.5 w-full appearance-none rounded-full bg-slate-100 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">
          <span>0 đ</span>
          <span>15 Tr</span>
        </div>
      </div>

      {/* Facilities Checklist (Takes 8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-3">
        <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          Tiện ích mong muốn
        </label>
        <div className="flex flex-wrap gap-2.5">
          {FACILITIES_LIST.map(({ value, label, icon: Icon }) => {
            const isChecked = selectedFacilities.includes(value);
            return (
              <FacilityItem
                key={value}
                value={value}
                handleToggleFacility={handleToggleFacility}
                label={label}
                icon={Icon}
                isChecked={isChecked}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceRange;
