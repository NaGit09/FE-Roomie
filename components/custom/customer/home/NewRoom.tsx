"use client";

import React, { useEffect } from "react";
import {
  Home,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoomStore } from "@/stores/roomStore";
import { mapPostToRoom } from "@/utils/mapper";
import { RoomSkeleton } from "../room/RoomSkeleton";
import RoomCard from "./RoomCard";


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