/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, memo, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { SaveApi } from "@/services/api/save";
import { toast } from "sonner";

export interface Room {
  id: string;
  name: string;
  image: string;
  price: string;
  postedAt: string;
  address: string;
  facilities: { icon: LucideIcon; label: string }[];
  verified: boolean;
}

// ── Smart Shared De-duplicated Request Cache ──
let savedIdsCache: string[] | null = null;
let savedIdsPromise: Promise<string[]> | null = null;

const fetchSavedIds = async (isAuthenticated: boolean): Promise<string[]> => {
  if (!isAuthenticated) return [];
  if (savedIdsCache) return savedIdsCache;
  if (savedIdsPromise) return savedIdsPromise;

  savedIdsPromise = (async () => {
    try {
      const response = await SaveApi.getListSavePost();
      // Handle both raw list array and nested envelopes
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      savedIdsCache = list
        .map((item: any) => {
          const id = item?.post_id || item?.post?.post_id || item?.id || item;
          return id ? id.toString() : "";
        })
        .filter(Boolean);

      return savedIdsCache || [];
    } catch (err) {
      console.warn("Failed to fetch saved posts list:", err);
      return [];
    } finally {
      savedIdsPromise = null;
    }
  })();

  return savedIdsPromise;
};

const RoomCard = memo(({ room }: { room: Room }) => {
  const { isAuthenticated } = useAuthStore();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync initial save state cleanly
  useEffect(() => {
    if (!isAuthenticated) {
      setIsSaved(false);
      savedIdsCache = null;
      return;
    }

    const initSavedState = async () => {
      const savedIds = await fetchSavedIds(true);
      if (savedIds.includes(room.id)) {
        setIsSaved(true);
      }
    };
    initSavedState();
  }, [room.id, isAuthenticated]);

  const handleToggleSave = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để lưu tin đăng!");
        return;
      }

      if (loading) return;
      setLoading(true);

      try {
        if (isSaved) {
          await SaveApi.unSavePost(room.id);
          setIsSaved(false);
          // Update cache locally
          if (savedIdsCache) {
            savedIdsCache = savedIdsCache.filter((id) => id !== room.id);
          }
          toast.success("Đã bỏ lưu tin đăng!");
        } else {
          await SaveApi.savePost(room.id);
          setIsSaved(true);
          // Update cache locally
          if (savedIdsCache && !savedIdsCache.includes(room.id)) {
            savedIdsCache.push(room.id);
          }
          toast.success("Đã lưu tin đăng thành công!");
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Thao tác thất bại. Vui lòng thử lại.",
        );
      } finally {
        setLoading(false);
      }
    },
    [isSaved, isAuthenticated, loading, room.id],
  );

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer"
    >
      {/* ── Visual Layer (Badges & Image) ── */}
      <div className="relative aspect-[1.2/1] w-full overflow-hidden">
        <Image
          src={room.image}
          alt={room.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
          disabled={loading}
          className={cn(
            "absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer",
            isSaved
              ? "bg-primary text-white shadow-lg shadow-primary/30"
              : "bg-black/10 text-white hover:bg-white hover:text-primary",
            loading && "opacity-50 pointer-events-none",
          )}
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
          )}
        </button>
      </div>

      {/* ── Content Area (Information) ── */}
      <div className="flex flex-col p-7">
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
              <Clock className="h-3.5 w-3.5" />
              {room.postedAt}
            </div>
          </div>
          <h3 className="line-clamp-1 text-2xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors duration-300">
            {room.name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate">{room.address}</span>
          </div>
        </div>

        {/* Facilities Row */}
        <div className="mb-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {room.facilities.map((fac, i) => (
            <div
              key={i}
              className="group/facility flex items-center gap-1.5 rounded-xl bg-slate-50/50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 px-2.5 py-1.5 transition-all duration-300"
            >
              <fac.icon className="h-4 w-4 text-slate-500 group-hover/facility:text-primary transition-colors duration-300" />
              <span className="text-xs font-semibold text-slate-600 group-hover/facility:text-primary transition-colors duration-300">
                {fac.label}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Area */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              {room.price}
            </span>
            <span className="ml-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              VND / tháng
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
});

RoomCard.displayName = "RoomCard";
export default RoomCard;
