import { Button } from "@/components/ui/button";
import { useRoomFilter } from "@/hooks/useRoomFilter";
import { Home } from "lucide-react";

const NotFoundRoom = () => {
  const { handleClearFilters } = useRoomFilter();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-5 animate-bounce">
        <Home className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        Không tìm thấy phòng trọ phù hợp
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 font-semibold">
        Chúng tôi không tìm thấy kết quả nào khớp với yêu cầu lọc của bạn. Hãy
        thử thay đổi địa điểm hoặc bớt các tiện ích ưu tiên!
      </p>
      <Button
        onClick={handleClearFilters}
        className="rounded-full px-6 py-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
      >
        Xóa bộ lọc để thử lại
      </Button>
    </div>
  );
}

export default NotFoundRoom