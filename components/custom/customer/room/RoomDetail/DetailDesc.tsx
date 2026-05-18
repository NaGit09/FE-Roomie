import { useRoomStore } from '@/stores/roomStore';
import React from 'react'

const DetailDesc = () => {
  const { currentRoomDetail } = useRoomStore();

  return (
    <div className="space-y-8">
      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Mô tả chi tiết</h3>
        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
          {currentRoomDetail?.room?.description || "Chưa có mô tả."}
        </div>
      </div>
    </div>
  )
}

export default DetailDesc