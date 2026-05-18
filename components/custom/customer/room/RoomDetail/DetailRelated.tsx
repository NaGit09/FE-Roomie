"use client";

import React, { useEffect } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { mapPostToRoom } from "@/utils/mapper";
import RoomCard from "@/components/custom/customer/home/RoomCard";

export default function DetailRelated() {
  const { latestRooms, fetchLatestRooms, currentRoomDetail } = useRoomStore();

  useEffect(() => {
    if (latestRooms.length === 0) {
      fetchLatestRooms();
    }
  }, [latestRooms, fetchLatestRooms]);

  // Filter out the active post being viewed to prevent self-recommendation
  const relatedRooms = latestRooms
    .filter((post) => post.post_id !== currentRoomDetail?.post_id)
    .slice(0, 3);

  if (relatedRooms.length === 0) return null;

  return (
    <div className="border-t border-slate-100 pt-10 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-slate-900">
          Gợi ý phòng trọ liên quan
        </h3>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Tin đăng mới nhất
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedRooms.map((post) => {
          const mappedRoom = mapPostToRoom(post);
          return <RoomCard key={mappedRoom.id} room={mappedRoom} />;
        })}
      </div>
    </div>
  );
}