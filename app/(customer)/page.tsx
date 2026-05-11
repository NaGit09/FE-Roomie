"use client";

import dynamic from "next/dynamic";
import HomeSearch from "@/components/custom/customer/HomeSearch";
import NewRoom from "@/components/custom/customer/NewRoom";
import Location from "@/components/custom/customer/Location";
import QNA from "@/components/custom/customer/QNA";
import { ArrowRight, Map as MapIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Dynamic Imports
// ─────────────────────────────────────────────
const MapView = dynamic(() => import("@/components/custom/customer/MapView"), {
  ssr: false,
  loading: () => (
    <div className="group relative flex h-[600px] w-full items-center justify-center overflow-hidden rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-bounce rounded-full bg-primary/10 flex items-center justify-center">
          <MapIcon className="text-primary h-6 w-6" />
        </div>
        <p className="font-bold uppercase tracking-widest text-slate-400 text-[10px]">
          Đang khởi tạo bản đồ...
        </p>
      </div>
    </div>
  ),
});

// ─────────────────────────────────────────────
// Reusable Section Header
// ─────────────────────────────────────────────
interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description?: string;
  dark?: boolean;
  centered?: boolean;
}

const SectionHeader = ({
  subtitle,
  title,
  description,
  dark = false,
  centered = false,
}: SectionHeaderProps) => (
  <div className={cn("mb-16", centered ? "text-center flex flex-col items-center" : "text-left")}>
    <div className={cn("mb-6 flex items-center gap-3", centered && "justify-center")}>
      <Sparkles className={cn("h-4 w-4", dark ? "text-white/40" : "text-primary")} />
      <span className={cn("text-[10px] font-black uppercase tracking-[0.4em]", dark ? "text-white/60" : "text-primary")}>
        {subtitle}
      </span>
    </div>
    <h2 className={cn("max-w-3xl text-4xl font-black tracking-tighter md:text-6xl leading-[1.1] font-heading", dark ? "text-white" : "text-slate-900")}>
      {title}
    </h2>
    {description && (
      <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed font-medium", dark ? "text-white/60" : "text-slate-500/80")}>
        {description}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export default function CustomerHomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative">
        <HomeSearch />
      </section>

      {/* 2. EXPLORE BY LOCATION (Sidebar + Grid Layout) */}
      <section className="container mx-auto px-6 py-24 lg:py-40">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <SectionHeader
              subtitle="The Neighborhoods"
              title="Tìm theo khu vực"
              description="Khám phá những không gian sống tiềm năng nhất tại TP. Hồ Chí Minh, từ sự năng động của Quận 1 đến nét bình yên của Thủ Đức."
            />
            <button className="group flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-primary hover:shadow-2xl hover:shadow-primary/20 active:scale-95">
              Xem tất cả khu vực
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="lg:col-span-8">
            <Location />
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROOMS (Editorial Grid) */}
      <section className="relative overflow-hidden bg-slate-50 py-5 lg:py-10">
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 opacity-[0.02] pointer-events-none select-none">
          <h1 className="text-[25rem] font-black italic">SMART</h1>
        </div>

        <div className="container mx-auto px-6">
          <SectionHeader
            subtitle="Curated Selection"
            title="Phòng mới nhất"
            description="Những căn hộ vừa được lên sàn với đầy đủ tiện nghi và mức giá tốt nhất trong tháng này."
            centered
          />
          <NewRoom />
        </div>
      </section>

      {/* 4. INTERACTIVE MAP AREA (Split Discovery) */}
      <section className="container mx-auto px-6 py-5 lg:py-10">
        {/*  */}
        <SectionHeader
          subtitle="Interactive Map"
          title="Tìm phòng quanh bạn?"
          description="Sử dụng bản đồ tương tác để xác định chính xác khoảng cách đến trường học hoặc nơi làm việc của bạn."
          centered
        />
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
          <div className="lg:col-span-9 relative">
            <div className="overflow-hidden rounded-[3rem] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]">
              <MapView />
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="rounded-[2.5rem] bg-primary p-10 text-white shadow-2xl shadow-primary/30">
              <h4 className="mb-4 text-2xl font-bold tracking-tight leading-tight font-heading">
                Tìm phòng quanh bạn?
              </h4>
              <p className="mb-8 text-sm text-white/80 leading-relaxed font-medium">
                Sử dụng bản đồ tương tác để xác định chính xác khoảng cách đến
                trường học hoặc nơi làm việc của bạn.
              </p>
              <button className="w-full rounded-2xl bg-white/10 py-4 text-[10px] font-black uppercase tracking-widest backdrop-blur-md transition-all hover:bg-white hover:text-primary">
                Bật định vị ngay
              </button>
            </div>
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 group hover:border-primary/20 transition-colors">
              <div className="text-5xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">
                500+
              </div>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Vị trí đã xác thực
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION (Trust & Clarity) */}
      <section className="bg-slate-900 py-5 lg:py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            <div className="lg:w-1/3">
              <SectionHeader
                subtitle="Câu hỏi thường gặp"
                title="Giải đáp thắc mắc về SmartRoom"
                dark
              />
            </div>
            <div className="lg:w-2/3 w-full">
              <QNA />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
