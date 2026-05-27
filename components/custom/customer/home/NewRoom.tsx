"use client";

import { useEffect } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { mapPostToRoom } from "@/utils/mapper";
import { RoomSkeleton } from "../room/RoomSkeleton";
import RoomCard from "./RoomCard";
import StateContainer from "../../common/StateContainer";

export default function NewRoom() {

  const { latestRooms, isLoading, error, fetchLatestRooms } = useRoomStore();

  useEffect(() => {
    fetchLatestRooms();
  }, [fetchLatestRooms]);

  const state = isLoading 
    ? "loading" 
    : error 
      ? "error" 
      : latestRooms.length === 0 
        ? "empty" 
        : "success";

  return (
    <section id="new-room" className="w-full bg-slate-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <StateContainer
          state={state}
          error={error}
          onRetry={fetchLatestRooms}
          loadingComponent={
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 col-span-full w-full">
              {Array.from({ length: 4 }).map((_, i) => (
                <RoomSkeleton key={i} />
              ))}
            </div>
          }
          emptyProps={{
            title: "Không có phòng mới nào",
            description: "Hiện tại chưa có phòng mới nào được đăng tải. Vui lòng quay lại sau!"
          }}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestRooms.map((post) => {
              const room = mapPostToRoom(post);
              return <RoomCard key={room.id} room={room} />;
            })}
          </div>
        </StateContainer>
      </div>
    </section>
  );
}
