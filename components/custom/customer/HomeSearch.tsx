"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Building2,
  BedDouble,
  Banknote,
  Wifi,
  AirVent,
  ParkingSquare,
  Dumbbell,
  ShieldCheck,
  Waves,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────
const CITIES = [
  "Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
];

const PROVINCES: Record<string, string[]> = {
  "Hồ Chí Minh": [
    "Quận 1",
    "Quận 3",
    "Quận 7",
    "Bình Thạnh",
    "Thủ Đức",
    "Gò Vấp",
  ],
  "Hà Nội": ["Hoàn Kiếm", "Ba Đình", "Đống Đa", "Cầu Giấy", "Tây Hồ"],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn"],
  "Cần Thơ": ["Ninh Kiều", "Bình Thuỷ", "Cái Răng"],
  "Bình Dương": ["Thủ Dầu Một", "Dĩ An", "Thuận An"],
  "Đồng Nai": ["Biên Hoà", "Long Khánh", "Nhơn Trạch"],
};

const ROOM_TYPES = [
  { value: "phong-tro", label: "Phòng trọ" },
  { value: "chung-cu", label: "Chung cư mini" },
  { value: "nha-nguyen-can", label: "Nhà nguyên căn" },
  { value: "studio", label: "Studio" },
  { value: "officetel", label: "Officetel" },
  { value: "biet-thu", label: "Biệt thự" },
];

const FACILITIES = [
  { value: "wifi", label: "Wi-Fi", icon: Wifi },
  { value: "dieu-hoa", label: "Điều hoà", icon: AirVent },
  { value: "bai-xe", label: "Bãi xe", icon: ParkingSquare },
  { value: "gym", label: "Phòng gym", icon: Dumbbell },
  { value: "bao-ve", label: "Bảo vệ 24/7", icon: ShieldCheck },
  { value: "ho-boi", label: "Hồ bơi", icon: Waves },
];

const BUDGET_PRESETS = [
  { label: "Dưới 3 triệu", min: 0, max: 3_000_000 },
  { label: "3–5 triệu", min: 3_000_000, max: 5_000_000 },
  { label: "5–10 triệu", min: 5_000_000, max: 10_000_000 },
  { label: "Trên 10 triệu", min: 10_000_000, max: 50_000_000 },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatVND(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
  return `${(value / 1_000).toFixed(0)}k`;
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Filters {
  city: string;
  province: string;
  roomType: string;
  budgetMin: number;
  budgetMax: number;
  facilities: string[];
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
interface SelectFieldProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}

function SelectField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40"
      >
        <Icon className="h-3 w-3" />
        {label}
      </label>
      <div className="relative group">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="
            w-full appearance-none rounded-xl border border-white/10 bg-white/5
            px-4 py-3.5 text-[0.9rem] font-medium text-white/90
            focus:border-primary/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-primary/10
            disabled:cursor-not-allowed disabled:opacity-20
            transition-all duration-300
          "
        >
          <option value="" className="bg-zinc-900 text-white/50">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-zinc-900 text-white">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 group-focus-within:text-primary/70 transition-colors" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function HomeSearch() {
  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    city: "",
    province: "",
    roomType: "",
    budgetMin: 0,
    budgetMax: 20_000_000,
    facilities: [],
  });

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleFacility = (val: string) =>
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(val)
        ? prev.facilities.filter((f) => f !== val)
        : [...prev.facilities, val],
    }));

  const handleCityChange = (city: string) => {
    setFilter("city", city);
    setFilter("province", "");
  };

  const activeFilterCount = [
    filters.city,
    filters.province,
    filters.roomType,
    filters.budgetMin > 0 || filters.budgetMax < 20_000_000 ? "budget" : "",
    ...filters.facilities,
  ].filter(Boolean).length;

  const clearAll = () => {
    setKeyword("");
    setFilters({
      city: "",
      province: "",
      roomType: "",
      budgetMin: 0,
      budgetMax: 20_000_000,
      facilities: [],
    });
  };

  const handleSearch = () => {
    console.log("Search:", { keyword, ...filters });
  };

  const provinceOptions = (PROVINCES[filters.city] ?? []).map((p) => ({
    value: p,
    label: p,
  }));

  return (
    <section
      id="home-search"
      className="relative w-full overflow-hidden bg-zinc-950"
      style={{ minHeight: "560px" }}
    >
      {/* ── Background image ── */}
      <Image
        src="/hero-bg.png"
        alt="Modern apartment"
        fill
        priority
        className="object-cover object-center opacity-80"
        sizes="100vw"
      />

      {/* ── Premium Overlays ── */}
      <div className="absolute inset-0 bg-zinc-950/50" />
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(193,68,14,0.25),transparent_60%)]" />

      {/* ── Aurora Animated Elements ── */}
      <div className="absolute top-[-30%] left-[-20%] w-[70%] h-[80%] bg-primary/30 blur-[160px] rounded-full animate-pulse pointer-events-none opacity-40 mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] bg-blue-600/20 blur-[140px] rounded-full animate-pulse delay-1000 pointer-events-none opacity-30 mix-blend-overlay" />
      <div className="absolute top-[20%] right-[-15%] w-[40%] h-[40%] bg-orange-400/10 blur-[100px] rounded-full animate-pulse delay-500 pointer-events-none opacity-20" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-16 sm:px-8 lg:px-12">

        {/* Floating Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md transition-transform hover:scale-105"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
          Nền tảng tìm phòng #1 Việt Nam
        </div>

        {/* Epic Headline */}
        <h1
          className="mb-5 text-center font-bold leading-[1.05] tracking-[-0.03em] text-white"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
          }}
        >
          Tìm không gian<br />
          <span className="relative inline-block italic text-primary">
            Sống lý tưởng
            <span className="absolute -bottom-1.5 left-0 h-1.5 w-full bg-primary/30 blur-sm rounded-full" />
          </span>
        </h1>

        {/* Refined Subtitle */}
        <p
          className="mb-10 max-w-xl text-center text-base md:text-lg font-medium leading-relaxed text-white/50"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Trải nghiệm tìm phòng trọ <span className="text-white/80">đẳng cấp</span> và <span className="text-white/80">nhanh chóng</span> nhất.
        </p>

        {/* ── Glass Search Card ── */}
        <div className="group/card w-full max-w-4xl rounded-[3rem] border border-white/20 bg-white/5 p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] backdrop-blur-3xl transition-all duration-700 hover:border-primary/30 hover:shadow-primary/10">
          <div className="overflow-hidden rounded-[2.75rem] bg-zinc-900/40 transition-all duration-500 group-hover/card:bg-zinc-900/60">

            {/* Search Input Area */}
            <div className="flex items-center gap-4 px-8 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-[0_0_15px_rgba(193,68,14,0.25)] transition-transform group-hover/card:scale-105">
                <Search className="h-6 w-6" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Khu vực, dự án hoặc từ khóa..."
                className="flex-1 bg-transparent text-xl font-semibold text-white placeholder:text-white/10 focus:outline-none"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              {(keyword || activeFilterCount > 0) && (
                <button
                  onClick={clearAll}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
                </button>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between border-t border-white/5 bg-white/5 px-8 py-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all
                  ${showFilters
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(193,68,14,0.4)]"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }
                `}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Tùy chỉnh bộ lọc
                {activeFilterCount > 0 && (
                  <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-white px-2 text-[11px] font-black text-primary">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <Button
                onClick={handleSearch}
                className="group relative h-12 overflow-hidden rounded-xl bg-primary px-8 text-sm font-black text-white shadow-2xl transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-95"
              >
                <div className="relative z-10 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  BẮT ĐẦU TÌM KIẾM
                </div>
                <div className="absolute inset-0 translate-y-full bg-linear-to-t from-black/20 to-transparent transition-transform group-hover:translate-y-0" />
              </Button>
            </div>

            {/* ── Filter Panel ── */}
            {showFilters && (
              <div className="animate-in fade-in slide-in-from-top-4 border-t border-white/5 bg-black/40 px-8 py-8 duration-500">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <SelectField
                    id="filter-city"
                    label="Khu vực thành phố"
                    icon={MapPin}
                    value={filters.city}
                    onChange={handleCityChange}
                    options={CITIES.map((c) => ({ value: c, label: c }))}
                    placeholder="Tất cả thành phố"
                  />
                  <SelectField
                    id="filter-province"
                    label="Quận / Huyện"
                    icon={MapPin}
                    value={filters.province}
                    onChange={(v) => setFilter("province", v)}
                    options={provinceOptions}
                    placeholder={filters.city ? "Chọn quận/huyện" : "Hãy chọn thành phố"}
                    disabled={!filters.city}
                  />
                  <SelectField
                    id="filter-room-type"
                    label="Loại hình không gian"
                    icon={Building2}
                    value={filters.roomType}
                    onChange={(v) => setFilter("roomType", v)}
                    options={ROOM_TYPES}
                    placeholder="Mọi loại hình"
                  />
                </div>

                {/* Budget Section */}
                <div className="mt-8 rounded-[2rem] border border-white/5 bg-white/5 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      <Banknote className="h-4 w-4" />
                      Mức ngân sách dự kiến
                    </label>
                    <div className="flex gap-4 text-xs font-black text-white/90">
                      <span>{formatVND(filters.budgetMin)}</span>
                      <span className="text-white/20">—</span>
                      <span>{formatVND(filters.budgetMax)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {BUDGET_PRESETS.map((preset) => {
                      const active = filters.budgetMin === preset.min && filters.budgetMax === preset.max;
                      return (
                        <button
                          key={preset.label}
                          onClick={() => {
                            setFilter("budgetMin", preset.min);
                            setFilter("budgetMax", preset.max);
                          }}
                          className={`
                            rounded-xl px-5 py-2.5 text-xs font-bold transition-all
                            ${active
                              ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                              : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                            }
                          `}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-6">
                      <span className="w-12 text-[10px] font-black text-white/20 uppercase tracking-tighter">Từ</span>
                      <input
                        type="range" min={0} max={20000000} step={500000}
                        value={filters.budgetMin}
                        onChange={(e) => setFilter("budgetMin", Math.min(Number(e.target.value), filters.budgetMax - 500000))}
                        className="h-1 w-full appearance-none rounded-full bg-white/10 accent-primary cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="w-12 text-[10px] font-black text-white/20 uppercase tracking-tighter">Đến</span>
                      <input
                        type="range" min={0} max={20000000} step={500000}
                        value={filters.budgetMax}
                        onChange={(e) => setFilter("budgetMax", Math.max(Number(e.target.value), filters.budgetMin + 500000))}
                        className="h-1 w-full appearance-none rounded-full bg-white/10 accent-primary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="mt-8">
                  <label className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Tiện ích ưu tiên
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {FACILITIES.map(({ value, label, icon: Icon }) => {
                      const active = filters.facilities.includes(value);
                      return (
                        <button
                          key={value}
                          onClick={() => toggleFacility(value)}
                          className={`
                            flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-xs font-bold transition-all
                            ${active
                              ? "border-primary bg-primary/20 text-primary"
                              : "border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:bg-white/10 hover:text-white"
                            }
                          `}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-10"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Xu hướng tìm kiếm</span>
          <div className="flex gap-3">
            {["Quận 1", "Studio Cao Cấp", "Gần Trung Tâm", "Bình Thạnh"].map((tag) => (
              <button
                key={tag}
                onClick={() => setKeyword(tag)}
                className="rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs font-bold text-white/50 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:-translate-y-1"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}