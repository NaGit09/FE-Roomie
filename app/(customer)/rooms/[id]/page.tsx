"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import {
  Wifi,
  AirVent,
  ParkingSquare,
  BedDouble,
  Waves,
  Sparkles,
  ChevronLeft,
  ShieldCheck,
  MapPin,
  Eye,
  User,
  ArrowLeft,
  AlertCircle,
  Star,
  Phone,
  MessageSquare,
  Calendar,
  Ruler,
  DollarSign,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import formatVND from "@/utils/priceUtils";
import DetailHeader from "@/components/custom/customer/room/RoomDetail/DetailHeader";
import DetailNotFound from "@/components/custom/customer/room/RoomDetail/DetailNotFound";
import DetailLoading from "@/components/custom/customer/room/RoomDetail/DetailLoading";
import DetailImage from "@/components/custom/customer/room/RoomDetail/DetailImage";
import DetailContent from "@/components/custom/customer/room/RoomDetail/DetailContent";
import DetailFeedback from "@/components/custom/customer/room/RoomDetail/DetailFeedback";
import DetailRelated from "@/components/custom/customer/room/RoomDetail/DetailRelated";
import DetailMap from "@/components/custom/customer/room/RoomDetail/DetailMap";

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idStr = typeof params?.id === "string" ? params.id : "";
  const postId = parseInt(idStr, 10);

  const {
    currentRoomDetail,
    isLoading,
    error,
    fetchRoomDetail,
    clearCurrentRoomDetail,
  } = useRoomStore();
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (!isNaN(postId)) {
      fetchRoomDetail(postId);
    }
    return () => {
      clearCurrentRoomDetail();
    };
  }, [postId, fetchRoomDetail, clearCurrentRoomDetail]);

  if (isLoading) {
    return <DetailLoading />
  }

  if (error || isNaN(postId)) {
    return <DetailNotFound />
  }

  if (!currentRoomDetail) return null;

  return (
    <main className="min-h-screen bg-slate-50/50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Navigation Row */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-extrabold text-slate-600 transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Quay lại
          </button>

          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 shadow-sm ${
              isSaved
                ? "bg-primary border-primary text-white"
                : "bg-white border-slate-200 text-slate-400 hover:text-primary"
            }`}
          >
            <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Dynamic Detail Card */}
        <div className="overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-100/30 md:p-10 p-6 space-y-10">
          <DetailHeader />

          {/* 1. IMAGE GALLERY LAYOUT */}
          <DetailImage />

          {/* 2. CONTENT BODY & SIDEBAR CONTAINER */}

          <DetailContent />

          {/* 4. REVIEWS & FEEDBACKS SECTION */}

          <DetailFeedback />
        </div>

        {/* 3. DYNAMIC MAP CONTAINER (Expansive full width below the main card sheet) */}
        <div className="mt-12">
          <DetailMap />
        </div>

        {/* ── 2. Suggested Relative Listings Section (Full-width across bottom) ── */}
        <div className="mt-12">
          <DetailRelated />
        </div>
      </div>
    </main>
  );
}
