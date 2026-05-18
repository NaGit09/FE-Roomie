"use client";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DetailNotFound = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md">
      <div className="h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 flex mb-4 border border-red-100 shadow-sm">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">
        Không tìm thấy phòng
      </h3>
      <p className="text-slate-500 mb-6 text-sm font-semibold">
        Phòng bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.
      </p>
      <Button
        onClick={() => router.push("/rooms")}
        className="rounded-full px-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
      </Button>
    </div>
  );
}

export default DetailNotFound