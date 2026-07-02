/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoomStore } from "@/stores/roomStore";
import { useAuthStore } from "@/stores/authStore";
import { ChevronLeft, Heart, Sparkles } from "lucide-react";
import { SaveApi } from "@/services/api/save";
import { toast } from "sonner";
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

  const { user, isAuthenticated } = useAuthStore();

  const {
    currentRoomDetail,
    isLoading,
    error,
    fetchRoomDetail,
    clearCurrentRoomDetail,
  } = useRoomStore();
  
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isNaN(postId)) {
      fetchRoomDetail(postId);
    }
    return () => {
      clearCurrentRoomDetail();
    };
  }, [postId, fetchRoomDetail, clearCurrentRoomDetail]);

  useEffect(() => {
    if (currentRoomDetail) {
      setIsSaved(currentRoomDetail.is_saved);
    }
  }, [currentRoomDetail]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu tin đăng!");
      return;
    }

    if (loading || isNaN(postId)) return;
    setLoading(true);

    try {
      if (isSaved) {
        await SaveApi.unSavePost(idStr);
        setIsSaved(false);
        toast.success("Đã bỏ lưu tin đăng!");
      } else {
        await SaveApi.savePost(idStr);
        setIsSaved(true);
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
  };

  if (isLoading) {
    return <DetailLoading />;
  }

  if (error || isNaN(postId)) {
    return <DetailNotFound />;
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
            onClick={handleToggleSave}
            disabled={loading}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 shadow-sm cursor-pointer ${
              isSaved
                ? "bg-white border-rose-100 text-rose-500 shadow-rose-500/10"
                : "bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-slate-350"
            } ${loading && "opacity-50 pointer-events-none"}`}
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
            ) : (
              <Heart className={`h-5 w-5 transition-colors duration-300 ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
            )}
          </button>
        </div>

        {/* Landlord Owner Quick Dashboard Banner */}
        {user?.id === currentRoomDetail.created_by && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 backdrop-blur-md shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-600">
                <Sparkles className="h-3.5 w-3.5 fill-amber-200 animate-pulse" />
                Góc chủ nhà
              </div>
              <h2 className="text-xl font-black text-slate-800 leading-tight">
                Chào {user?.full_name || "Chủ nhà"}, đây là bài đăng của bạn!
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-650">
                <span className="flex items-center gap-1">
                  Trạng thái duyệt:{" "}
                  {currentRoomDetail.is_verified ? (
                    <span className="text-emerald-600 font-bold">Đã duyệt</span>
                  ) : (
                    <span className="text-amber-500 font-bold">Đang chờ duyệt</span>
                  )}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 hidden sm:block" />
                <span className="flex items-center gap-1">
                  Đo lường hiển thị:{" "}
                  {currentRoomDetail.is_featured ? (
                    <span className="text-amber-500 font-bold">Đang được Đẩy Tin nổi bật ⭐</span>
                  ) : (
                    <span className="text-slate-500 font-bold">Tin thường</span>
                  )}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 hidden sm:block" />
                <span className="text-slate-650 font-bold">{currentRoomDetail.views || 0} lượt xem</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto">
              <button
                onClick={() => router.push("/landlord/posts")}
                className="flex-1 sm:flex-none h-11 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
              >
                Quản lý tin đăng
              </button>
            </div>
          </div>
        )}

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
