"use client";

import React, { useEffect, useState } from "react";
import { 
  History, 
  Home, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  MapPin,
  Maximize2
} from "lucide-react";
import { RentalApi } from "@/services/api/rental";
import { Rental } from "@/schema/room/rental";
import { toast } from "sonner";
import formatVND from "@/utils/priceUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HistoryRentPage() {
  const [mounted, setMounted] = useState(false);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingEnd, setIsSubmittingEnd] = useState<number | null>(null);
  const [activeRentalToEnd, setActiveRentalToEnd] = useState<Rental | null>(null);

  const fetchRentalHistory = async () => {
    try {
      setIsLoading(true);
      const response = await RentalApi.getMyRentals();
      if (response && response.code === 200) {
        setRentals(response.data || []);
      } else {
        toast.error("Không thể tải lịch sử thuê phòng.");
      }
    } catch (error) {
      console.error("Error fetching rentals:", error);
      toast.error("Lỗi khi tải lịch sử thuê phòng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndRental = async (rentalId: number) => {
    try {
      setIsSubmittingEnd(rentalId);
      const response = await RentalApi.endRental(rentalId);
      if (response && response.code === 200) {
        toast.success("Đã gửi yêu cầu kết thúc hợp đồng thuê phòng thành công!");
        fetchRentalHistory();
      } else {
        toast.error(response.message || "Không thể kết thúc hợp đồng.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Gặp lỗi khi kết thúc hợp đồng. Vui lòng thử lại!");
    } finally {
      setIsSubmittingEnd(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRentalHistory();
  }, []);

  if (!mounted) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-650 shadow-sm animate-pulse">
            <CheckCircle className="h-3 w-3" />
            Đang thuê (Active)
          </span>
        );
      case "INTERESTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-650 shadow-sm">
            <Clock className="h-3 w-3" />
            Đang quan tâm (Interested)
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500 shadow-sm">
            <CheckCircle className="h-3 w-3" />
            Đã kết thúc (Completed)
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-250 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-650 shadow-sm">
            <XCircle className="h-3 w-3" />
            Đã hủy (Cancelled)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500 shadow-sm">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-md space-y-8 text-left w-full">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <History className="h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-black text-slate-800">Lịch sử thuê phòng</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Theo dõi tất cả lịch sử yêu cầu thuê trọ, phòng đang thuê và trạng thái hợp đồng.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <span className="text-xs font-semibold">Đang tải lịch sử của bạn...</span>
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl space-y-3">
            <Home className="h-8 w-8 text-slate-350 mx-auto" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-700">Chưa có lịch sử thuê phòng</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Bạn chưa bày tỏ sự quan tâm hay thực hiện thuê căn hộ nào trên Roomie.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {rentals.map((rental) => (
              <div
                key={rental.rental_id}
                className="rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-lg hover:border-slate-200/80 transition-all duration-300 overflow-hidden flex flex-col h-full group"
              >
                <div className="flex gap-4 p-5 flex-1">
                  {/* Room Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
                    {rental.room?.images && rental.room.images.length > 0 ? (
                      <img 
                        src={rental.room.images[0]} 
                        alt={rental.room.name || "Room cover"} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 text-[10px] font-bold gap-1 bg-slate-50">
                        <Home className="h-5 w-5 stroke-[1.5]" />
                        <span>No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content details next to image */}
                  <div className="flex-1 flex flex-col min-w-0 justify-between text-left space-y-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(rental.status)}
                      </div>
                      
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug truncate mt-1" title={rental.room?.name || `Phòng số #${rental.room_id}`}>
                        {rental.room?.name || `Phòng số #${rental.room_id}`}
                      </h3>

                      {rental.room?.address && (
                        <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 truncate">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          {rental.room.address.district}, {rental.room.address.city}
                        </p>
                      )}
                    </div>

                    {/* Metadata and Dates */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold font-body">
                        {rental.room?.area && (
                          <span className="flex items-center gap-0.5">
                            <Maximize2 className="h-3 w-3" />
                            {rental.room.area} m²
                          </span>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" />
                          Tạo: {new Date(rental.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      
                      {rental.status === "ACTIVE" && rental.start_date && (
                        <p className="text-[10px] font-bold text-slate-500 font-body">
                          Hạn: {new Date(rental.start_date).toLocaleDateString('vi-VN')} - {rental.end_date ? new Date(rental.end_date).toLocaleDateString('vi-VN') : "Không thời hạn"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-slate-50/50 px-5 py-4 border-t border-slate-50 flex items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">Tiền thuê</span>
                    <span className="text-xs sm:text-sm font-black text-primary">
                      {rental.monthly_rent ? `${formatVND(rental.monthly_rent)}/th` : "Chưa cập nhật"}
                    </span>
                  </div>

                  {rental.status === "ACTIVE" ? (
                    <button
                      type="button"
                      disabled={isSubmittingEnd === rental.rental_id}
                      onClick={() => setActiveRentalToEnd(rental)}
                      className="h-9 px-4 rounded-full border border-red-200 hover:bg-red-50 text-red-500 hover:text-red-650 disabled:opacity-50 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm active:scale-95 shrink-0"
                    >
                      {isSubmittingEnd === rental.rental_id && <Loader2 className="h-3 w-3 animate-spin" />}
                      Kết thúc thuê
                    </button>
                  ) : rental.deposit ? (
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider font-body">Tiền cọc</span>
                      <span className="text-xs font-bold text-slate-650">{formatVND(rental.deposit)}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Confirm End Rental Alert Dialog */}
      <AlertDialog 
        open={!!activeRentalToEnd} 
        onOpenChange={(open) => !open && setActiveRentalToEnd(null)}
      >
        <AlertDialogContent className="bg-slate-900 border border-white/10 text-slate-100 max-w-md rounded-2xl p-6">
          <AlertDialogHeader className="text-left space-y-2">
            <AlertDialogTitle className="text-lg font-black text-slate-100 flex items-center gap-2">
              Xác nhận kết thúc thuê
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-sm leading-relaxed">
              Bạn có chắc chắn muốn kết thúc hợp đồng thuê cho căn hộ{" "}
              <span className="font-extrabold text-amber-400">
                "{activeRentalToEnd?.room?.name || `Phòng #${activeRentalToEnd?.room_id}`}"
              </span>{" "}
              không? Trạng thái sẽ được chuyển thành **Đã kết thúc (Completed)** và phòng trọ sẽ tự động quay trở về trạng thái trống (Available) để hiển thị tìm kiếm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
            <AlertDialogCancel className="border-white/10 text-slate-300 hover:bg-white/5 h-10 px-4 rounded-xl cursor-pointer">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (activeRentalToEnd) {
                  handleEndRental(activeRentalToEnd.rental_id);
                }
              }}
              className="bg-red-650 hover:bg-red-750 text-white font-bold h-10 px-4 rounded-xl cursor-pointer"
            >
              Xác nhận kết thúc
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
