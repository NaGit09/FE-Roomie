"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Home, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeSearch() {
  return (
    <section
      id="home-search"
      className="relative w-full overflow-hidden bg-zinc-950 flex items-center justify-center"
      style={{ minHeight: "680px" }}
    >
      {/* ── Background image with deep opacity and priority loading ── */}
      <Image
        src="/hero-bg.png"
        alt="Modern premium apartment interior design"
        fill
        priority
        className="object-cover object-center opacity-65"
        sizes="100vw"
      />

      {/* ── Premium Ambient Dark Overlays ── */}
      <div className="absolute inset-0 bg-zinc-950/60" />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(193,68,14,0.3),transparent_70%)]" />

      {/* ── Aurora Blurring Radial Glow Effects ── */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-primary/25 blur-[160px] rounded-full animate-pulse pointer-events-none opacity-40 mix-blend-screen" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[60%] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none opacity-30 mix-blend-overlay" />

      {/* ── Core Landing Attraction Content ── */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center sm:px-8">
        
        {/* Floating Brand Trust Badge */}
        <div
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4.5 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary backdrop-blur-xl transition-all duration-300 hover:scale-105"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
          Nền tảng tìm phòng số 1 Việt Nam
        </div>

        {/* Epic Large Headline */}
        <h1
          className="mb-6 font-black leading-[1.05] tracking-[-0.03em] text-white"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 8vw, 4.75rem)',
          }}
        >
          Tìm không gian<br />
          <span className="relative inline-block italic text-primary mt-2">
            Sống lý tưởng
            <span className="absolute -bottom-2 left-0 h-2 w-full bg-primary/30 blur-sm rounded-full" />
          </span>
        </h1>

        {/* Brand Attracting Subtitle */}
        <p
          className="mb-12 max-w-2xl text-base md:text-lg font-medium leading-relaxed text-white/60"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Trải nghiệm tìm kiếm và kết nối phòng trọ, căn hộ dịch vụ và studio <span className="text-white font-extrabold underline decoration-primary decoration-2 underline-offset-4">đẳng cấp</span>, <span className="text-white font-extrabold underline decoration-primary decoration-2 underline-offset-4">tiện nghi</span> bậc nhất Việt Nam.
        </p>

        {/* Primary CTA Button Routing to Map Workspace */}
        <div className="mb-16">
          <Link href="/map">
            <Button className="group relative h-14 overflow-hidden rounded-full bg-primary px-10 text-sm font-black tracking-widest text-white shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/40 hover:bg-primary/95 active:scale-95 cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                BẮT ĐẦU TRẢI NGHIỆM NGAY
                <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
              <div className="absolute inset-0 translate-y-full bg-linear-to-t from-black/10 to-transparent transition-transform group-hover:translate-y-0" />
            </Button>
          </Link>
        </div>

        {/* Breathtaking Glass Trust Stats Row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl border border-white/5 bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8">
          
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">10k+</span>
            <span className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest">Phòng cao cấp</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-1 border-x border-white/5 px-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">100%</span>
            <span className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest">Xác minh chính chủ</span>
          </div>

          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <Star className="h-5 w-5 text-primary fill-current" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">4.9★</span>
            <span className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest">Đánh giá hài lòng</span>
          </div>

        </div>

      </div>
    </section>
  );
}