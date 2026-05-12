"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface LocationItem {
  id: string;
  name: string;
  image: string;
  roomCount: number;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const LOCATIONS: LocationItem[] = [
  {
    id: "l1",
    name: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1676019266474-3538f3f19e6b?q=80&w=1200&auto=format&fit=crop",
    roomCount: 124,
  },
  {
    id: "l2",
    name: "Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200&auto=format&fit=crop",
    roomCount: 86,
  },
  {
    id: "l3",
    name: "Đà Lạt",
    image:
      "https://images.unsplash.com/photo-1571850092964-9c124bb78e48?q=80&w=1200&auto=format&fit=crop",
    roomCount: 215,
  },
  {
    id: "l4",
    name: "Hội An",
    image:
      "https://images.unsplash.com/photo-1660562925534-3f6948ac654f?q=80&w=1200&auto=format&fit=crop",
    roomCount: 158,
  },
];

// ─────────────────────────────────────────────
// Location Card
// ─────────────────────────────────────────────
const LocationCard = ({
  item,
  className,
}: {
  item: LocationItem;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "group relative h-[260px] w-full overflow-hidden rounded-[2rem] bg-slate-200",
        "transition-all duration-700",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20",
        className,
      )}
    >
      {/* ── Image ── */}
      <Image
        src={item.image}
        alt={item.name}
        fill
        priority
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />

      {/* ── Overlay ── */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />

      {/* ── Top Badge ── */}
      <div className="absolute left-5 top-5 z-10">
        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-md">
          <MapPin className="h-4 w-4 text-primary" />

          <span className="text-xs font-semibold uppercase tracking-wider">
            {item.roomCount} phòng trống
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm text-white/70">
              Khám phá địa điểm nổi bật
            </p>

            <h3
              className="text-3xl font-bold tracking-tight text-white md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {item.name}
            </h3>
          </div>

          {/* Arrow Button */}
          <button
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              "border border-white/20 bg-white/10 text-white backdrop-blur-md",
              "transition-all duration-500",
              "group-hover:translate-x-1 group-hover:-translate-y-1",
              "group-hover:border-primary group-hover:bg-primary",
            )}
          >
            <ArrowUpRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Hover Accent */}
      <div className="absolute left-0 top-0 h-1 w-0 bg-primary transition-all duration-700 group-hover:w-full" />
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function Location() {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {LOCATIONS.map((item, index) => (
            <LocationCard
              key={item.id}
              item={item}
              className={cn(
                index === 0 && "sm:col-span-2 sm:h-[320px]",
                index === 3 && "sm:col-span-2 sm:h-[320px]",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
