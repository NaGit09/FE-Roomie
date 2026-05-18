"use client";

import React, { useEffect } from "react";
import { 
  Wifi, 
  AirVent, 
  ParkingSquare, 
  BedDouble,
  Waves,
  Sparkles,
  Home,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomCard, { Room } from "./RoomCard";
import { useRoomStore } from "@/stores/roomStore";
import { PostCardType } from "@/schema/room/post";

// ─────────────────────────────────────────────
// Helper Utilities
// ─────────────────────────────────────────────
function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return diffMins <= 0 ? "Vừa xong" : `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  } catch (e) {
    return "Mới đây";
  }
}

const mapPostToRoom = (post: PostCardType): Room => {
  // Infer roomType from title
  let roomType = "Phòng trọ";
  const titleLower = post.title.toLowerCase();
  if (titleLower.includes("căn hộ") || titleLower.includes("apartment")) {
    roomType = "Căn hộ";
  } else if (titleLower.includes("chung cư mini") || titleLower.includes("mini")) {
    roomType = "Chung cư mini";
  } else if (titleLower.includes("chung cư") || titleLower.includes("condo")) {
    roomType = "Chung cư";
  } else if (titleLower.includes("nhà nguyên căn") || titleLower.includes("nhà")) {
    roomType = "Nhà nguyên căn";
  } else if (titleLower.includes("studio")) {
    roomType = "Studio";
  }

  // Map amenities to Lucide Icons
  const facilities = (post.room.amenities || []).map((amenity) => {
    const normalized = amenity.toLowerCase().trim();
    let icon = Sparkles;
    
    if (normalized.includes("wifi") || normalized.includes("internet") || normalized.includes("mạng")) {
      icon = Wifi;
    } else if (normalized.includes("lạnh") || normalized.includes("điều hòa") || normalized.includes("air")) {
      icon = AirVent;
    } else if (normalized.includes("xe") || normalized.includes("parking") || normalized.includes("đỗ")) {
      icon = ParkingSquare;
    } else if (normalized.includes("bơi") || normalized.includes("pool")) {
      icon = Waves;
    } else if (normalized.includes("giường") || normalized.includes("bed") || normalized.includes("pn") || normalized.includes("ngủ")) {
      icon = BedDouble;
    }
    
    return {
      icon,
      label: amenity,
    };
  });

  // Fallback to ensure visual layer is always beautiful
  const finalFacilities = facilities.length > 0 ? facilities : [
    { icon: Wifi, label: "Wifi" },
    { icon: AirVent, label: "Máy lạnh" },
  ];

  return {
    id: post.post_id.toString(),
    name: post.title,
    image: post.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    price: post.room.price.toLocaleString("vi-VN"),
    postedAt: formatRelativeTime(post.created_at),
    roomType,
    address: `${post.room.address.district}, ${post.room.address.city}`,
    verified: post.is_verified,
    facilities: finalFacilities,
  };
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
const RoomSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-100 p-0 animate-pulse">
    <div className="relative aspect-[1.2/1] w-full bg-slate-200" />
    <div className="flex flex-col p-7">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-4 w-20 bg-slate-200 rounded-full" />
          <div className="h-3 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-7 w-3/4 bg-slate-200 rounded-lg mt-2" />
        <div className="h-4 w-1/2 bg-slate-200 rounded-lg mt-3" />
      </div>
      <div className="mb-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <div className="h-8 w-16 bg-slate-200 rounded-xl" />
        <div className="h-8 w-20 bg-slate-200 rounded-xl" />
        <div className="h-8 w-16 bg-slate-200 rounded-xl" />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="h-8 w-32 bg-slate-200 rounded-lg" />
        <div className="h-10 w-10 bg-slate-200 rounded-full" />
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shadow-xs">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 animate-bounce">
      <Home className="h-8 w-8" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-1">Không có phòng mới nào</h3>
    <p className="text-sm text-slate-500 max-w-sm">Hiện tại chưa có phòng mới nào được đăng tải. Vui lòng quay lại sau!</p>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-red-50/50 backdrop-blur-md rounded-[2.5rem] border border-red-100 shadow-xs">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
      <AlertCircle className="h-8 w-8" />
    </div>
    <h3 className="text-xl font-bold text-red-800 mb-1">Đã xảy ra lỗi</h3>
    <p className="text-sm text-red-500 max-w-sm mb-4">{message}</p>
    <Button 
      onClick={onRetry}
      variant="destructive"
      className="rounded-full px-6 py-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all duration-300"
    >
      Thử lại
    </Button>
  </div>
);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function NewRoom() {
  const { latestRooms, isLoading, error, fetchLatestRooms } = useRoomStore();

  useEffect(() => {
    fetchLatestRooms();
  }, [fetchLatestRooms]);

  return (
    <section id="new-room" className="w-full bg-slate-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <RoomSkeleton key={i} />)
          ) : error ? (
            <ErrorState message={error} onRetry={fetchLatestRooms} />
          ) : latestRooms.length === 0 ? (
            <EmptyState />
          ) : (
            latestRooms.map((post) => {
              const room = mapPostToRoom(post);
              return <RoomCard key={room.id} room={room} />;
            })
          )}
        </div>

      </div>
    </section>
  );
}