import React from "react";
import { LocationItem } from "@/stores/roomFilterStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DistrictSelectProps {
  selectedProvinceCode: number | "" | undefined | null;
  selectedDistrictCode: number | "" | undefined | null;
  setSelectedDistrictCode: (code: number | "") => void;
  setSelectedDistrict: (name: string) => void;
  districts: LocationItem[];
  loadingDistricts: boolean;
}

const DistrictSelect = ({
  selectedProvinceCode,
  selectedDistrictCode,
  setSelectedDistrictCode,
  setSelectedDistrict,
  districts,
  loadingDistricts,
}: DistrictSelectProps) => {

  const valueString = (selectedDistrictCode === "" || selectedDistrictCode === undefined || selectedDistrictCode === null)
    ? "all"
    : selectedDistrictCode.toString();

  const handleValueChange = (val: string) => {
    const code = val === "all" ? "" : Number(val);
    setSelectedDistrictCode(code);
    const matched = districts.find((d) => d.code === code);
    setSelectedDistrict(matched ? matched.name : "");
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
        Quận / Huyện
      </label>
      <div className="relative">
        <Select
          value={valueString}
          onValueChange={handleValueChange}
          disabled={!selectedProvinceCode}
        >
          <SelectTrigger className="w-full h-[46px] px-4 py-3 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 font-semibold focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed [&>svg]:text-slate-400">
            <SelectValue placeholder={selectedProvinceCode ? "Tất cả quận/huyện" : "Chọn tỉnh/thành trước"} />
            {loadingDistricts && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-100 shadow-xl max-h-[300px]">
            <SelectItem value="all" className="rounded-xl font-medium focus:bg-primary/5 focus:text-primary">
              Tất cả quận/huyện
            </SelectItem>
            {districts.map((dist) => (
              <SelectItem
                key={dist.code}
                value={dist.code.toString()}
                className="rounded-xl font-medium focus:bg-primary/5 focus:text-primary"
              >
                {dist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DistrictSelect;