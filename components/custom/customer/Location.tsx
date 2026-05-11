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
    name: "Hà nội",
    image:
      "https://images.unsplash.com/photo-1676019266474-3538f3f19e6b?q=80&w=2446&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    roomCount: 124,
  },
  {
    id: "l2",
    name: "Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop",
    roomCount: 86,
  },
  {
    id: "l3",
    name: "Đà lạt",
    image:
      "https://images.unsplash.com/photo-1571850092964-9c124bb78e48?q=80&w=3268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    roomCount: 215,
  },
  {
    id: "l4",
    name: "Hội An",
    image:
      "https://images.unsplash.com/photo-1660562925534-3f6948ac654f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    roomCount: 158,
  },
];

// ─────────────────────────────────────────────
// LocationCard Sub-component
// ─────────────────────────────────────────────
const LocationCard = ({ item }: { item: LocationItem }) => {
  return (
    <div className="group max-h-[250px] relative aspect-square w-full cursor-pointer overflow-hidden rounded-[2.5rem] bg-slate-200 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20">
      {/* ── Image ── */}
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      
      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
      
      {/* ── Content ── */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="mb-2 flex items-center gap-2 text-white/70">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest">xem ngay {item.roomCount} phòng đang trống</span>
        </div>
        
        <div className="flex items-end justify-between gap-4">
          <h3 
            className="text-3xl font-bold tracking-tight text-white md:text-4xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {item.name}
          </h3>
          
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:bg-primary group-hover:border-primary group-hover:translate-x-1 group-hover:-translate-y-1">
            <ArrowUpRight className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Decorative accent */}
      <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function Location() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {LOCATIONS.map((item) => (
          <LocationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}