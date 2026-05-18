import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationItem } from "@/stores/roomFilterStore";

interface ProvinceSelectProps {
  selectedProvinceCode: number | "" | undefined | null;
  setSelectedProvinceCode: (code: number | "") => void;
  setSelectedProvince: (name: string) => void;
  provinces: LocationItem[];
  loadingProvinces: boolean;
}

const ProvinceSelect = ({
  selectedProvinceCode,
  setSelectedProvinceCode,
  setSelectedProvince,
  provinces,
  loadingProvinces,
}: ProvinceSelectProps) => {
  const valueString = (selectedProvinceCode === "" || selectedProvinceCode === undefined || selectedProvinceCode === null)
    ? "all"
    : selectedProvinceCode.toString();

  const handleValueChange = (val: string) => {
    const code = val === "all" ? "" : Number(val);
    setSelectedProvinceCode(code);
    const matched = provinces.find((p) => p.code === code);
    setSelectedProvince(matched ? matched.name : "");
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
        Thành phố / Tỉnh
      </label>
      <div className="relative">
        <Select value={valueString} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full h-[46px] px-4 py-3 rounded-2xl border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700 font-semibold focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-300 [&>svg]:text-slate-400">
            <SelectValue placeholder="Tất cả thành phố" />
            {loadingProvinces && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-100 shadow-xl max-h-[300px]">
            <SelectItem value="all" className="rounded-xl font-medium focus:bg-primary/5 focus:text-primary">
              Tất cả thành phố
            </SelectItem>
            {provinces.map((prov) => (
              <SelectItem
                key={prov.code}
                value={prov.code.toString()}
                className="rounded-xl font-medium focus:bg-primary/5 focus:text-primary"
              >
                {prov.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProvinceSelect;
