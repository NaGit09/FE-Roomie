"use client";

import { useState, useEffect } from "react";
import { useRoomStore } from "@/stores/roomStore";

const DetailImage = () => {
  const { currentRoomDetail } = useRoomStore();
  const [activeImage, setActiveImage] = useState<string>("");

  const galleryImages = [
    ...(currentRoomDetail?.image_url ? [currentRoomDetail.image_url] : []),
    ...(currentRoomDetail?.room.images || []),
  ].filter((img, index, self) => self.indexOf(img) === index);

  if (!currentRoomDetail) return null;

  useEffect(() => {
    if (currentRoomDetail) {
      const defaultImg =
        currentRoomDetail.image_url || currentRoomDetail.room.images?.[0] || "";
      setActiveImage(defaultImg);
    }
  }, [currentRoomDetail]);
  return (
    <div className="space-y-4">
      {/* Active Display Panel */}
      <div className="relative w-full overflow-hidden rounded-[2rem] bg-slate-100 border border-slate-100 shadow-inner">
        {activeImage ? (
          <img
            src={activeImage}
            alt={currentRoomDetail.title}
            className="h-[50vh] w-full object-cover transition-all duration-500"
          />
        ) : (
          <div className="flex h-[50vh] w-full items-center justify-center bg-slate-100 text-slate-400 font-semibold text-sm">
            Không có hình ảnh
          </div>
        )}
      </div>

      {/* Thumbnail Navigation Row */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {galleryImages.map((img, idx) => {
            const isActive = img === activeImage;
            return (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  isActive
                    ? "border-primary scale-95 shadow-md shadow-primary/10"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetailImage;
