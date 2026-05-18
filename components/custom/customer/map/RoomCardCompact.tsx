"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Heart, ShieldCheck, MapPin, Clock } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { saveApi } from "@/services/api/save";
import { toast } from "sonner";

export interface CompactRoom {
  id: string;
  name: string;
  image: string;
  price: string;
  postedAt: string;
  address: string;
  verified: boolean;
  facilities: { icon: any; label: string }[];
  ward?: string;
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
      const response = await saveApi.getListSavePost();
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

export default function RoomCardCompact({ room }: { room: CompactRoom }) {
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
          await saveApi.unSavePost(room.id);
          setIsSaved(false);
          // Update cache locally
          if (savedIdsCache) {
            savedIdsCache = savedIdsCache.filter((id) => id !== room.id);
          }
          toast.success("Đã bỏ lưu tin đăng!");
        } else {
          await saveApi.savePost(room.id);
          setIsSaved(true);
          // Update cache locally
          if (savedIdsCache && !savedIdsCache.includes(room.id)) {
            savedIdsCache.push(room.id);
          }
          toast.success("Đã lưu tin đăng thành công!");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || "Thao tác thất bại. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [isSaved, isAuthenticated, loading, room.id]
  );

  return (
    <div className="block">
      <a
        href={`/rooms/${room.id}`}
        className="flex gap-4 p-3 bg-white border border-slate-100 rounded-3xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer h-[160px] overflow-hidden"
      >
        {/* Left Thumbnail Image */}
        <div className="relative w-[140px] h-full rounded-2xl overflow-hidden shrink-0 bg-slate-50">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Verified Badge */}
          {room.verified && (
            <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
              <ShieldCheck className="h-4 w-4 text-primary fill-primary/10" />
            </div>
          )}
        </div>

        {/* Right Details Block */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0 pr-1">
          
          <div className="space-y-2">
            {/* Title and Heart Icon */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-extrabold text-slate-800 text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors pr-1">
                {room.name}
              </h4>
              
              <button
                type="button"
                onClick={handleToggleSave}
                disabled={loading}
                className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                  isSaved
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                    : "bg-white border-slate-100 text-slate-400 hover:text-primary hover:border-slate-200"
                } ${loading && "opacity-50 pointer-events-none"}`}
              >
                {loading ? (
                  <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                ) : (
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                )}
              </button>
            </div>

            {/* Address Row */}
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="text-xs font-semibold truncate leading-none">
                {room.ward ? `${room.ward}, ` : ""}{room.address}
              </span>
            </div>

            {/* Facs Badges list */}
            <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-[26px]">
              {room.facilities.slice(0, 2).map((fac, idx) => {
                const IconComp = fac.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 shrink-0"
                  >
                    <IconComp className="h-3 w-3 text-slate-400" />
                    <span>{fac.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing & Time Posted Row */}
          <div className="flex items-center justify-between border-t border-slate-50 pt-2 shrink-0">
            <div className="flex items-baseline gap-0.5">
              <span className="text-base lg:text-lg font-black text-primary">
                {room.price}
              </span>
              <span className="text-[10px] font-bold text-slate-400">đ/tháng</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{room.postedAt}</span>
            </div>
          </div>

        </div>
      </a>
    </div>
  );
}
