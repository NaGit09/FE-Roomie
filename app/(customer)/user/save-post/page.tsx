/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { SaveApi } from "@/services/api/save";
import { PostApi } from "@/services/api/post";
import { mapPostToRoom } from "@/utils/mapper";
import RoomCard, { Room } from "@/components/custom/customer/home/RoomCard";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { RoomSkeleton } from "@/components/custom/customer/room/RoomSkeleton";
import { PostCardType } from "@/schema/room/post";

export default function SavePostPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPosts = async () => {
    try {
      const response = await SaveApi.getListSavePost();
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      const resolvedDetails = await Promise.all(
        list.map(async (item: any) => {
          try {
            const postId = item.post_id;
            if (!postId) return null;

            const detailResponse = await PostApi.getPostDetail(postId);
            const detail = detailResponse.data;
            if (!detail || !detail.room) return null;

            const postCardCompatible: PostCardType = {
              post_id: detail.post_id,
              title: detail.title,
              is_verified: detail.is_verified,
              created_at: detail.created_at,
              image_url: detail.image_url,
              room: {
                price: detail.room.price,
                area: detail.room.area,
                amenities: detail.room.amenities,
                address: {
                  district: detail.room.address.district,
                  city: detail.room.address.city,
                },
              },
            };

            const roomObj = mapPostToRoom(postCardCompatible);
            return {
              ...roomObj,
              isSaved: true,
            };
          } catch (itemErr) {
            console.warn(
              `Failed to resolve details for saved post ${item?.post_id}:`,
              itemErr,
            );
            return null;
          }
        }),
      );

      // Filter out unresolved or deleted posts gracefully
      const filteredRooms = resolvedDetails.filter(Boolean) as Room[];
      setRooms(filteredRooms);
    } catch (err: any) {
      console.warn("Error fetching saved posts list:", err);
      toast.error("Không thể tải danh sách tin đã lưu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="font-heading text-2xl font-black text-slate-800 flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          Tin đăng đã lưu
        </h1>
        <p className="mt-1.5 text-sm font-semibold text-slate-400">
          Danh sách các phòng trọ bạn đã lưu để xem lại hoặc so sánh.
        </p>
      </div>

      {/* Content Pane */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <RoomSkeleton key={i} />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        /* Stunning Premium Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-sm min-h-[400px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-6 animate-pulse">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="font-heading text-lg font-black text-slate-800 mb-1">
            Chưa có tin đăng nào được lưu
          </h3>
          <p className="text-sm font-semibold text-slate-400 max-w-sm mb-6 leading-relaxed">
            Khám phá hàng ngàn phòng trọ chất lượng, verified 100% và lưu lại
            những căn phòng bạn ưng ý nhất!
          </p>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary hover:bg-primary/95 text-white font-black text-xs uppercase tracking-wider px-6 py-3 cursor-pointer shadow-md shadow-primary/10 hover:scale-[1.02] transition-all duration-200"
          >
            Khám phá ngay
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Saved Rooms Grid Deck */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
