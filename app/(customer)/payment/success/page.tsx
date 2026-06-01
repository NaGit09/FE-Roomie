/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Receipt,
  HelpCircle,
  Compass,
  ArrowRight,
  ChevronRight,
  Info
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { toast } from "sonner";
import { OrderApi } from "@/services/api/order";
import { SubscriptionApi } from "@/services/api/subcription";
import formatVND from "@/utils/priceUtils";
import { Subscription } from "@/schema/user/subcription";
import { useAuthStore } from "@/stores/authStore";

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query params from payOS redirect
  const orderId = searchParams.get("order_id") || "";
  const code = searchParams.get("code") || "";
  const txId = searchParams.get("id") || "";
  const cancelParam = searchParams.get("cancel") || "";
  const statusParam = searchParams.get("status") || "";
  const orderCode = searchParams.get("orderCode") || "";

  const { completeCheckout, checkoutPlan } = useSubscriptionStore();
  const { user } = useAuthStore();
  
  // Loading & Verification States
  const [verifying, setVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [matchedPlanDetails, setMatchedPlanDetails] = useState<Subscription | null>(null);

  const handleGoBack = () => {
    if (user?.role === "LANDLORD") {
      router.push("/landlord/");
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    // Set document title
    document.title = "Trạng thái thanh toán | Roomie";

    if (!orderId) {
      setVerifying(false);
      setIsSuccess(false);
      setErrorMessage("Không tìm thấy mã đơn hàng cần xác thực.");
      return;
    }

    const verifyTransaction = async () => {
      try {
        const isCancelled = cancelParam === "true" || statusParam === "CANCELLED" || code !== "00";
        
        if (isCancelled) {
          setIsSuccess(false);
          setErrorMessage("Giao dịch đã bị hủy hoặc không thành công.");
          setVerifying(false);
          return;
        }

        // Call backend API to confirm the payment status
        const confirmRes = await OrderApi.confirm_payment(orderId);
        
        if (confirmRes && confirmRes.code === 200) {
          setIsSuccess(true);
          
          // Complete local store state synchronization if local checkoutPlan exists
          if (checkoutPlan) {
            completeCheckout("Cổng payOS");
          }

          // Fetch the details of the confirmed order to display on receipt
          try {
            if (user?.id) {
              const myOrders = await OrderApi.get_my_order(user.id);
              if (myOrders && myOrders.code === 200 && Array.isArray(myOrders.data)) {
                const matchedOrder = myOrders.data.find((o: any) => String(o.id) === String(orderId));
                if (matchedOrder) {
                  setOrderDetails(matchedOrder);

                  // Fetch subscriptions to display matched plan details
                  const renterPlans = await SubscriptionApi.get_all_renter_subscriptions();
                  const landlordPlans = await SubscriptionApi.get_all_landlord_subscriptions();
                  
                  let allPlans: Subscription[] = [];
                  if (renterPlans && renterPlans.code === 200 && Array.isArray(renterPlans.data)) {
                    allPlans = [...allPlans, ...renterPlans.data];
                  }
                  if (landlordPlans && landlordPlans.code === 200 && Array.isArray(landlordPlans.data)) {
                    allPlans = [...allPlans, ...landlordPlans.data];
                  }

                  const foundPlan = allPlans.find((p: Subscription) => p.id === matchedOrder.item_id);
                  if (foundPlan) {
                    setMatchedPlanDetails(foundPlan);
                  }
                }
              }
            }
          } catch (fetchErr) {
            console.error("Error loading order or plan details for success page:", fetchErr);
          }
        } else {
          setIsSuccess(false);
          setErrorMessage(confirmRes?.message || "Không thể xác nhận giao dịch thanh toán từ hệ thống.");
        }
      } catch (err: any) {
        console.error("Payment confirmation failed:", err);
        setIsSuccess(false);
        setErrorMessage(
          err?.response?.data?.message || 
          "Lỗi kết nối hệ thống trong quá trình xác thực giao dịch."
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyTransaction();
  }, [orderId, code, txId, cancelParam, statusParam, orderCode, checkoutPlan, completeCheckout, user]);

  if (verifying) {
    return (
      <div className="min-h-[80vh] bg-[#FAF7F2] flex flex-col items-center justify-center font-sans px-4">
        <div className="relative flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="h-16 w-16 text-primary flex items-center justify-center"
          >
            <Compass className="h-12 w-12 text-[#C1440E]" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#C1440E]/30"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h3 className="font-heading text-xl font-bold text-[#0D1117]">Đang xác thực giao dịch</h3>
          <p className="text-sm text-[#6B6560] max-w-xs mx-auto">
            Hệ thống đang kết nối với cổng thanh toán payOS để kiểm tra trạng thái hóa đơn của bạn. Vui lòng không đóng trình duyệt.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          /* SUCCESS CASE SCREEN */
          <motion.div
            key="success-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full relative z-10"
          >
            {/* Celebration Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
              {[...Array(24)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{
                    opacity: 0,
                    x: "50%",
                    y: "100%",
                    scale: Math.random() * 0.4 + 0.6,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: [`${50 + (Math.random() * 80 - 40)}%`, `${50 + (Math.random() * 120 - 60)}%`],
                    y: [`${80 - Math.random() * 40}%`, `${10 - Math.random() * 50}%`],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: Math.random() * 2.5 + 2.5,
                    repeat: Infinity,
                    delay: Math.random() * 1.5,
                  }}
                  className={`absolute w-3 h-3 rounded-full ${
                    idx % 3 === 0 ? "bg-amber-400" : idx % 3 === 1 ? "bg-emerald-500" : "bg-[#C1440E]"
                  }`}
                />
              ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#D9D9D9]/50 shadow-xl overflow-hidden p-8 sm:p-12 text-center space-y-8">
              {/* Success Badge Banner */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                  className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-400 text-emerald-600 flex items-center justify-center shadow-inner"
                >
                  <CheckCircle className="h-12 w-12" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="h-8 w-8 text-amber-500" />
                </motion.div>
              </div>

              {/* Status Header */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 inline-block font-heading">
                  Thanh toán thành công!
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight text-[#0D1117] leading-tight">
                  Chào mừng hội viên mới
                </h2>
                <p className="text-sm text-[#6B6560] leading-relaxed max-w-md mx-auto">
                  Tuyệt vời! Giao dịch của bạn đã được đối soát thành công. Tài khoản Roomie đã sẵn sàng với các đặc quyền Premium cao cấp nhất.
                </p>
              </div>

              {/* Receipt Breakdowns */}
              <div className="rounded-[1.75rem] border border-[#D9D9D9]/60 bg-[#FAF7F2]/60 p-6 sm:p-8 text-left space-y-4 max-w-md mx-auto">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-dashed border-[#D9D9D9]">
                  <span className="text-[#6B6560] font-semibold uppercase tracking-wider">Hội viên</span>
                  <span className="font-extrabold text-[#0D1117] font-sans">
                    {matchedPlanDetails?.sub_title || checkoutPlan?.sub_title || "Roomie Premium Active"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6B6560] font-semibold uppercase tracking-wider">Mã đơn hàng</span>
                  <span className="font-extrabold text-[#0D1117] font-mono break-all max-w-[200px] text-right">
                    {orderCode || orderDetails?.order_code || "RM-PAYOS-OK"}
                  </span>
                </div>

                {txId && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#6B6560] font-semibold uppercase tracking-wider">Mã giao dịch</span>
                    <span className="font-extrabold text-[#0D1117] font-mono break-all max-w-[200px] text-right">
                      {txId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6B6560] font-semibold uppercase tracking-wider">Phương thức</span>
                  <span className="font-extrabold text-[#0D1117]">Cổng payOS</span>
                </div>

                <div className="flex justify-between items-center text-xs pb-3 border-b border-dashed border-[#D9D9D9]">
                  <span className="text-[#6B6560] font-semibold uppercase tracking-wider">Ngày thanh toán</span>
                  <span className="font-extrabold text-[#0D1117]">
                    {new Date().toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#6B6560] font-black uppercase tracking-wider text-xs">Tổng thanh toán</span>
                  <span className="font-black text-[#C1440E] text-lg font-sans">
                    {orderDetails?.total_amount 
                      ? formatVND(orderDetails.total_amount) 
                      : (checkoutPlan?.sub_price ? formatVND(checkoutPlan.sub_price) : "Liên hệ hỗ trợ")}
                  </span>
                </div>
              </div>

              {/* Security trust notice */}
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-500/5 py-3 px-4 rounded-xl border border-emerald-500/10 max-w-md mx-auto">
                <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
                Giao dịch được bảo vệ và bảo mật tuyệt đối.
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
                <button
                  onClick={handleGoBack}
                  className="w-full h-14 font-bold uppercase tracking-wider text-[11px] bg-[#0D1117] hover:bg-[#C1440E] text-white hover:text-white rounded-2xl cursor-pointer hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Quay lại
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => router.push(user?.role === "LANDLORD" ? "/landlord/subscription" : "/user/history-subscription")}
                  className="w-full h-14 font-bold uppercase tracking-wider text-[11px] bg-white border border-[#D9D9D9] hover:bg-[#FAF7F2] text-[#0D1117] rounded-2xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Receipt className="h-4 w-4" /> Lịch sử đăng ký
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* FAILED / CANCELED CASE SCREEN */
          <motion.div
            key="failure-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full relative z-10"
          >
            <div className="bg-white rounded-[2.5rem] border border-[#D9D9D9]/50 shadow-xl overflow-hidden p-8 sm:p-10 text-center space-y-8">
              {/* Failure Badge */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: 30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                  className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-400 text-amber-600 flex items-center justify-center shadow-inner"
                >
                  <XCircle className="h-12 w-12" />
                </motion.div>
              </div>

              {/* Status Header */}
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200 inline-block font-heading">
                  Giao dịch chưa hoàn tất
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#0D1117]">Thanh toán bị gián đoạn</h3>
                <p className="text-sm text-[#6B6560] leading-relaxed font-body">
                  {errorMessage || "Bạn đã hủy thanh toán hoặc giao dịch của bạn không thể thực hiện thành công tại thời điểm này."}
                </p>
              </div>

              {/* Info Guide Card */}
              <div className="bg-[#FAF7F2]/80 border border-[#D9D9D9]/60 rounded-2xl p-5 text-left text-xs font-body text-[#6B6560] space-y-3">
                <div className="flex gap-2.5 items-start">
                  <Info className="h-4.5 w-4.5 text-[#C1440E] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Đừng lo lắng, tài khoản ngân hàng của bạn sẽ không bị khấu trừ tiền nếu giao dịch bị hủy bỏ trước khi quét mã thành công.
                  </span>
                </div>
                <div className="flex gap-2.5 items-start border-t border-[#D9D9D9]/40 pt-2.5">
                  <HelpCircle className="h-4.5 w-4.5 text-[#C1440E] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Nếu bạn đã quét mã nhưng hóa đơn vẫn hiển thị lỗi, vui lòng lưu lại mã hóa đơn <strong className="text-[#0D1117] font-mono font-semibold">{orderCode || "RM-ERROR-PAY"}</strong> và liên hệ CSKH để được kích hoạt.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => router.push("/order")}
                  className="w-full h-13 font-bold uppercase tracking-wider text-[10px] bg-[#C1440E] hover:bg-[#a63a0c] text-white rounded-xl cursor-pointer hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Thử thanh toán lại
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={handleGoBack}
                  className="w-full h-13 font-bold uppercase tracking-wider text-[10px] bg-white border border-[#D9D9D9] hover:bg-[#FAF7F2] text-[#0D1117] rounded-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Quay lại
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <Compass className="h-10 w-10 text-[#C1440E] animate-spin" />
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
