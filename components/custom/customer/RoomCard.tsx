"use client";

import React, { useState, memo, useCallback } from "react";
import Image from "next/image";
import {
  Heart,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Room {
  id: string;
  name: string;
  image: string;
  price: string;
  postedAt: string;
  roomType: string;
  address: string;
  facilities: { icon: LucideIcon; label: string }[];
  verified: boolean;
}

const RoomCard = memo(({ room }: { room: Room }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleSave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsSaved(!isSaved);
    },
    [isSaved],
  );

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
      {/* ── Visual Layer (Badges & Image) ── */}
      <div className="relative aspect-[1.2/1] w-full overflow-hidden">
        <Image
          src={room.image}
          alt={room.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Scrim/Overlay for legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Floating Layer: Top Left (Verified) */}
        {room.verified && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight text-emerald-600 shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 fill-emerald-100" />
            <span>Verified</span>
          </div>
        )}

        {/* Floating Layer: Top Right (Save Button) */}
        <button
          onClick={handleToggleSave}
          className={cn(
            "absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 backdrop-blur-md",
            isSaved
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-black/10 text-white hover:bg-white hover:text-primary",
          )}
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>
      </div>

      {/* ── Content Area (Information) ── */}
      <div className="flex flex-col p-6">
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              {room.roomType}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
              <Clock className="h-3 w-3" />
              {room.postedAt}
            </div>
          </div>
          <h3 className="line-clamp-1 text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
            {room.name}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{room.address}</span>
          </div>
        </div>

        {/* Facilities Row */}
        <div className="mb-6 flex gap-4 border-y border-slate-50 py-4">
          {room.facilities.slice(0, 3).map((fac, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg">
                <fac.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-[8px] font-bold text-primary uppercase">
                {fac.label}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Area */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-slate-900">
              {room.price}
            </span>
            <span className="ml-2 text-md font-medium text-slate-900">
              VND/tháng
            </span>
          </div>
        </div>
      </div>
    </article>
  );
});

RoomCard.displayName = "RoomCard";
export default RoomCard;
