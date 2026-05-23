/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressSelectProps {
  provinces: { code: number; name: string }[];
  districts: { code: number; name: string }[];
  selectedProvinceCode: number | "";
  loadingProvinces: boolean;
  loadingDistricts: boolean;
  watchDistrict: string;
  handleProvinceChange: (provinceCodeString: string) => void;
  setValue: (name: any, value: any, options?: any) => void;
  errors: any;
}

const AddressSelect: React.FC<AddressSelectProps> = ({
  provinces,
  districts,
  selectedProvinceCode,
  loadingProvinces,
  loadingDistricts,
  watchDistrict,
  handleProvinceChange,
  setValue,
  errors,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Province Select */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body">
          Tỉnh / Thành phố
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10" />
          <Select
            value={selectedProvinceCode ? selectedProvinceCode.toString() : ""}
            onValueChange={handleProvinceChange}
          >
            <SelectTrigger className="w-full h-11 pl-9 pr-4 rounded-xl border border-border/80 bg-background/50 hover:bg-background text-slate-700 font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300">
              <SelectValue placeholder="Chọn Tỉnh/Thành" />
              {loadingProvinces && (
                <div className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-[250px] bg-background">
              {provinces.map((prov) => (
                <SelectItem
                  key={prov.code}
                  value={prov.code.toString()}
                  className="rounded-lg font-medium focus:bg-primary/5 focus:text-primary cursor-pointer"
                >
                  {prov.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* District Select */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body">
          Quận / Huyện
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10" />
          <Select
            value={watchDistrict || ""}
            onValueChange={(val) =>
              setValue("district", val, { shouldValidate: true })
            }
            disabled={!selectedProvinceCode || loadingDistricts}
          >
            <SelectTrigger className="w-full h-11 pl-9 pr-4 rounded-xl border border-border/80 bg-background/50 hover:bg-background text-slate-700 font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <SelectValue
                placeholder={
                  selectedProvinceCode
                    ? "Chọn Quận/Huyện"
                    : "Chọn Tỉnh/Thành trước"
                }
              />
              {loadingDistricts && (
                <div className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-[250px] bg-background">
              {districts.map((dist) => (
                <SelectItem
                  key={dist.code}
                  value={dist.name}
                  className="rounded-lg font-medium focus:bg-primary/5 focus:text-primary cursor-pointer"
                >
                  {dist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.district && (
          <p className="text-xs text-red-500 font-medium mt-1">
            {errors.district.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddressSelect;
