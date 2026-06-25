"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Home,
  User,
  Calendar,
  Check,
  X,
  Loader2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  DollarSign
} from "lucide-react";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";
import { PostApi as RoomApi } from "@/services/api/room";
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
import { RentalApi } from "@/services/api/rental";

interface RentalRequest {
  rental_id: number;
  room_id: number;
  room_name: string;
  room_price: number;
  room_deposit: number;
  renter_id: string; // user_id
  created_at: string;
  status: string;
}

export default function LandlordRentalsPage() {
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Approval Modal state
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);

  // Decline dialog state
  const [declineRequestTarget, setDeclineRequestTarget] = useState<RentalRequest | null>(null);

  const fetchRentalRequests = async () => {
    try {
      setIsLoading(true);
      // 1. Fetch landlord's rooms
      const roomsResponse = await RoomApi.getMyRoom();
      const rooms = roomsResponse.data?.items || [];
      
      if (rooms.length === 0) {
        setRequests([]);
        return;
      }

      // 2. Fetch interested renters for each room
      const allRequests: RentalRequest[] = [];
      const fetchPromises = rooms.map(async (room) => {
        try {
          const rentalResponse = await RentalApi.getInterestedUsers(room.id);
          const rentals = rentalResponse.data || [];
          rentals.forEach((rental) => {
            allRequests.push({
              rental_id: rental.rental_id,
              room_id: room.id,
              room_name: room.name,
              room_price: room.price,
              room_deposit: room.deposit || 0,
              renter_id: rental.user_id,
              created_at: rental.created_at,
              status: rental.status,
            });
          });
        } catch (err) {
          console.error(`Error fetching interest for room ${room.id}:`, err);
        }
      });

      await Promise.all(fetchPromises);
      
      // Sort requests by newest created_at first
      allRequests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRequests(allRequests);
    } catch (error) {
      console.error("Error loading rental requests:", error);
      toast.error("Không thể tải danh sách yêu cầu thuê phòng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineRequest = async (rentalId: number) => {
    try {
      const response = await RentalApi.declineInterest(rentalId);
      if (response && response.code === 200) {
        toast.success("Đã từ chối yêu cầu thuê phòng.");
        fetchRentalRequests();
      } else {
        toast.error(response.message || "Từ chối yêu cầu thất bại.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Không thể từ chối yêu cầu. Vui lòng thử lại!");
    }
  };

  const openApprovalModal = (req: RentalRequest) => {
    setSelectedRequest(req);
    setMonthlyRent(req.room_price);
    setDeposit(req.room_deposit);
    
    // Set default dates
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    
    setStartDate(today.toISOString().split("T")[0]);
    setEndDate(nextYear.toISOString().split("T")[0]);
  };

  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      setIsSubmittingApproval(true);
      const payload = {
        renter_id: selectedRequest.renter_id,
        start_date: startDate ? new Date(startDate).toISOString() : undefined,
        end_date: endDate ? new Date(endDate).toISOString() : undefined,
        monthly_rent: monthlyRent || undefined,
        deposit: deposit || undefined,
      };

      const response = await RentalApi.confirmRental(selectedRequest.rental_id, payload);
      if (response && response.code === 200) {
        toast.success("Phê duyệt yêu cầu và kích hoạt hợp đồng thuê thành công!");
        setSelectedRequest(null);
        fetchRentalRequests();
      } else {
        toast.error(response.message || "Duyệt yêu cầu thuê phòng thất bại.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Không thể phê duyệt yêu cầu. Vui lòng thử lại!");
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRentalRequests();
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-10 animate-fade-in text-foreground">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Quản lý hợp đồng & Yêu cầu
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
            Danh sách yêu cầu thuê phòng
          </h1>
          <p className="text-xs sm:text-sm text-slate-650 font-medium font-body leading-relaxed max-w-xl">
            Xem và phê duyệt các yêu cầu thuê phòng từ khách hàng đang bày tỏ sự quan tâm đến căn hộ của bạn.
          </p>
        </div>
      </div>

      {/* Requests stack list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-650 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-semibold">Đang tải danh sách yêu cầu...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-100 backdrop-blur-md p-16 text-center text-slate-650 space-y-4">
            <AlertCircle className="h-10 w-10 text-slate-650 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-md font-bold text-slate-350">Không có yêu cầu thuê nào</h3>
              <p className="text-xs text-slate-650">
                Các phòng trọ của bạn hiện chưa có khách thuê nào gửi yêu cầu quan tâm.
              </p>
            </div>
          </div>
        ) : (
          requests.map((req) => (
            <motion.div
              key={req.rental_id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-slate-200 bg-card/60 backdrop-blur-md p-6 sm:p-8 flex flex-col lg:flex-row justify-between lg:items-center gap-6 shadow-xl relative group"
            >
              {/* Left Details */}
              <div className="space-y-4 flex-1 text-left">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
                    <Clock className="h-3 w-3" />
                    Chờ phê duyệt
                  </span>
                  
                  <span className="text-[10px] text-slate-650 font-bold uppercase tracking-wider flex items-center gap-1 font-body">
                    <Calendar className="h-3.5 w-3.5 text-slate-650 shrink-0" />
                    Yêu cầu: {new Date(req.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-md sm:text-lg text-slate-800 leading-snug group-hover:text-[#FBBF24] transition-colors flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary shrink-0" />
                    {req.room_name}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-slate-650 font-body">
                    <span className="flex items-center gap-1 font-bold text-slate-350">
                      <User className="h-4 w-4 text-emerald-400" />
                      Mã khách thuê: <span className="font-mono text-[11px] text-slate-700">{req.renter_id}</span>
                    </span>
                    
                    <span className="font-bold text-primary sm:border-l sm:border-slate-200 sm:pl-6">
                      Giá thuê: {formatVND(req.room_price)}/tháng
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-3 shrink-0 self-end lg:self-center">
                <button
                  type="button"
                  onClick={() => setDeclineRequestTarget(req)}
                  className="h-11 px-5 rounded-xl bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <X className="h-4 w-4 stroke-[2.5]" />
                  Từ chối
                </button>

                <button
                  type="button"
                  onClick={() => openApprovalModal(req)}
                  className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-primary/10 active:scale-95"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  Phê duyệt
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Approval Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-200 bg-card p-8 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-400" />
                  Xác nhận duyệt cho thuê
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="rounded-lg p-1.5 text-slate-650 hover:bg-slate-100 hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmApproval} className="space-y-5">
                <div className="rounded-2xl bg-slate-100 p-4 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-650 font-medium">Căn hộ:</span>
                    <span className="text-slate-700 font-extrabold">{selectedRequest.room_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-650 font-medium">Mã khách thuê:</span>
                    <span className="text-slate-700 font-mono">{selectedRequest.renter_id.slice(0, 18)}...</span>
                  </div>
                </div>

                {/* Dates input */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-650">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs font-semibold focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-650">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs font-semibold focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>

                {/* Price and Deposit input */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-650">
                      Tiền thuê / Tháng (đ)
                    </label>
                    <input
                      type="number"
                      required
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs font-semibold focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-650">
                      Tiền đặt cọc (đ)
                    </label>
                    <input
                      type="number"
                      required
                      value={deposit}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 text-xs font-semibold focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-5 mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-350 text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApproval}
                    className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 active:scale-95"
                  >
                    {isSubmittingApproval && <Loader2 className="h-4 w-4 animate-spin" />}
                    Kích hoạt cho thuê
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Decline Confirmation Alert Dialog */}
      <AlertDialog 
        open={!!declineRequestTarget} 
        onOpenChange={(open) => !open && setDeclineRequestTarget(null)}
      >
        <AlertDialogContent className="bg-background border border-slate-200 text-slate-800 max-w-md rounded-2xl p-6">
          <AlertDialogHeader className="text-left space-y-2">
            <AlertDialogTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
              Xác nhận từ chối yêu cầu
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-650 text-sm leading-relaxed">
              Bạn có chắc chắn muốn từ chối yêu cầu thuê phòng từ khách thuê có mã{" "}
              <span className="font-mono text-emerald-400 text-[10px] font-bold break-all">
                "{declineRequestTarget?.renter_id}"
              </span>{" "}
              cho căn hộ <span className="font-extrabold text-primary">"{declineRequestTarget?.room_name}"</span> không? Trạng thái yêu cầu sẽ được chuyển thành Từ chối (Cancelled).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-3 mt-6 border-t border-slate-200 pt-4">
            <AlertDialogCancel className="border-slate-200 text-slate-600 hover:bg-slate-100 h-10 px-4 rounded-xl cursor-pointer">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (declineRequestTarget) {
                  handleDeclineRequest(declineRequestTarget.rental_id);
                  setDeclineRequestTarget(null);
                }
              }}
              className="bg-red-500 hover:bg-red-650 text-white font-bold h-10 px-4 rounded-xl cursor-pointer"
            >
              Xác nhận từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
