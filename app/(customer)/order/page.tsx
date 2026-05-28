/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Lock, 
  Sparkles, 
  CheckCircle, 
  ChevronRight, 
  Info,
  Tag,
  Loader2,
  Compass,
  AlertCircle
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { toast } from "sonner";
import { OrderApi } from "@/services/api/order";
import formatVND from "@/utils/priceUtils";
import { Subscription } from "@/schema/user/subcription";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSubId = searchParams.get("subscription_id");

  const { checkoutPlan, completeCheckout, setCheckoutPlan } = useSubscriptionStore();
  const [mounted, setMounted] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Transaction States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !paramSubId) return;

    const loadPlan = async () => {
      setLoadingPlan(true);
      try {
        const SubscriptionApi = (await import("@/services/api/subcription")).SubscriptionApi;
        let plans: Subscription[] = [];
        
        // Load landlord plans
        const landlordRes = await SubscriptionApi.get_all_landlord_subscriptions();
        if (landlordRes && landlordRes.code === 200 && Array.isArray(landlordRes.data)) {
          plans = [...plans, ...landlordRes.data];
        }
        
        // Load renter plans
        const renterRes = await SubscriptionApi.get_all_renter_subscriptions();
        if (renterRes && renterRes.code === 200 && Array.isArray(renterRes.data)) {
          plans = [...plans, ...renterRes.data];
        }

        const matched = plans.find(p => String(p.id) === String(paramSubId));
        if (matched) {
          setCheckoutPlan(matched);
        } else {
          toast.error("Không tìm thấy gói hội viên tương ứng.");
        }
      } catch (error) {
        console.error("Failed to load subscription plan:", error);
        toast.error("Lỗi khi tải thông tin gói cước.");
      } finally {
        setLoadingPlan(false);
      }
    };

    loadPlan();
  }, [mounted, paramSubId]);

  if (!mounted || loadingPlan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Compass className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  // If no plan is selected
  if (!checkoutPlan && !isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl text-center space-y-6"
        >
          <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-xl font-bold text-slate-900">Không tìm thấy đơn hàng</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bạn chưa chọn gói hội viên nào để thanh toán. Vui lòng quay lại trang Tìm bạn ở ghép để lựa chọn gói phù hợp.
            </p>
          </div>
          <button
            onClick={() => router.push("/matching")}
            className="w-full h-12 font-bold uppercase tracking-wider text-[10px] bg-slate-900 text-white hover:bg-primary rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại trang so khớp
          </button>
        </motion.div>
      </div>
    );
  }

  // Coupon handling
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "ROOMIE50") {
      setDiscountPercent(50);
      setAppliedCoupon(code);
      toast.success("Áp dụng mã giảm giá ROOMIE50 giảm 50% thành công!");
    } else if (code === "WELCOME") {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      toast.success("Áp dụng mã giảm giá WELCOME giảm 10% thành công!");
    } else {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
    }
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setAppliedCoupon(null);
    toast.info("Đã hủy áp dụng mã giảm giá");
  };

  // Recalculations
  const originalPrice = checkoutPlan?.sub_price || 0;
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = originalPrice - discountAmount;

  // Checkout submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkoutPlan) {
      toast.error("Không tìm thấy gói hội viên!");
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        item_type: "SUBSCRIPTION",
        item_id: String(checkoutPlan.id) as any,
        total_amount: finalPrice,
      };

      const response = await OrderApi.create_order(orderPayload);
      if (response && response.code === 200) {
        const order = Array.isArray(response.data) ? response.data[0] : response.data;
        const orderId = order.id;

        const paymentRes = await OrderApi.create_payment(orderId as any, {
          payment_method: "PAYOS",
          metadata: {}
        });

        if (paymentRes && paymentRes.code === 200 && paymentRes.data?.checkout_url) {
          toast.success("Đang chuyển hướng sang cổng thanh toán payOS...");
          completeCheckout("Cổng payOS");
          window.location.href = paymentRes.data.checkout_url;
        } else {
          toast.error(paymentRes?.message || "Không thể tạo liên kết thanh toán payOS.");
          setIsProcessing(false);
        }
      } else {
        toast.error(response?.message || "Không thể tạo đơn hàng. Vui lòng thử lại!");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Checkout failed:", err);
      toast.error(err?.response?.data?.message || "Lỗi khi tạo đơn hàng thanh toán. Vui lòng thử lại!");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <AnimatePresence>
        {isSuccess ? (
          /* PAYMENT SUCCESS SCREEN */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4 sm:p-6"
          >
            {/* Celebration particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{
                    opacity: 0,
                    x: "50vw",
                    y: "100vh",
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: `${Math.random() * 80 + 10}vw`,
                    y: `${Math.random() * 60 + 10}vh`,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  className={`absolute w-3 h-3 rounded-full ${
                    idx % 3 === 0 ? "bg-amber-400" : idx % 3 === 1 ? "bg-indigo-500" : "bg-primary"
                  }`}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="max-w-xl w-full text-center space-y-8 z-10"
            >
              {/* Success Badge */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-400 text-emerald-500 flex items-center justify-center"
                >
                  <CheckCircle className="h-12 w-12" />
                </motion.div>
                <Sparkles className="h-6 w-6 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block">
                  Đăng ký thành công!
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Chào mừng bạn đến với <br />
                  <span className="text-primary font-display italic font-medium">Roomie Premium</span>
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Tài khoản của bạn đã được nâng cấp thành công. Giờ đây bạn đã có thể bắt đầu sử dụng toàn bộ quyền lợi cao cấp không giới hạn.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 max-w-sm mx-auto text-left space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Hội viên</span>
                  <span className="font-extrabold text-slate-800">
                    Premium Active
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Hình thức</span>
                  <span className="font-extrabold text-slate-800">Cổng payOS</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-dashed border-slate-200 pt-3">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Tổng thanh toán</span>
                  <span className="font-black text-primary text-sm">
                    {formatVND(finalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/matching")}
                className="w-full max-w-xs h-14 font-black uppercase tracking-widest text-[10px] bg-slate-900 text-white hover:bg-primary rounded-2xl cursor-pointer hover:shadow-lg active:scale-95 transition-all mx-auto flex items-center justify-center gap-2"
              >
                Bắt đầu tìm Roommate ngay
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* STANDARD CHECKOUT LAYOUT */
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header / Nav Link */}
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-6">
              <button
                onClick={() => router.push("/matching")}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Quay lại trang so khớp
              </button>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Thanh toán an toàn
              </div>
            </div>

            {/* Split content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Payment details (8 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-2xl font-black text-slate-900">Thiết lập thanh toán</h1>

                {/* Form Wrapper */}
                <form onSubmit={handleCheckout} className="space-y-6">
                  {/* Method Panel details */}
                  <div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm">
                    {/* payOS PANEL DETAILS */}
                    <div className="text-center space-y-6 py-6">
                      <div className="inline-flex h-12 w-12 rounded-xl bg-blue-600 text-white items-center justify-center font-bold text-sm shadow-md">
                        payOS
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-heading text-lg font-bold text-slate-900">
                          Thanh toán an toàn qua cổng payOS
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto font-body">
                          Hệ thống sẽ chuyển hướng bạn đến giao diện thanh toán an toàn của cổng payOS để quét mã VietQR hoặc sử dụng thẻ ngân hàng của bạn.
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                        Liên kết thanh toán bảo mật 256-bit SSL
                      </div>
                    </div>
                  </div>

                  {/* Security trust notice */}
                  <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-4 flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    <p className="text-[11px] text-emerald-800 font-medium leading-relaxed font-body">
                      Mọi giao dịch thanh toán trên cổng Roomie đều được bảo mật bằng giao thức SSL và mã hóa AES-256 bit tiêu chuẩn quân đội, cam kết tuyệt đối bảo mật thông tin khách hàng.
                    </p>
                  </div>

                  {/* Primary Checkout Action Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] transition-all hover:shadow-xl hover:shadow-primary/10 active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-slate-400"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Đang xác minh giao dịch...
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        Thanh toán an toàn {formatVND(finalPrice)}
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* RIGHT COLUMN: Invoice checkout summary (4 Cols) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
                <h2 className="text-2xl font-black text-slate-900">Chi tiết đơn hàng</h2>

                <div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                  {/* Selected Plan Details */}
                  <div className="flex justify-between items-start gap-4 pb-6 border-b border-slate-100">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md border border-amber-400/20">
                        Hội viên Premium
                      </span>
                      <h4 className="font-extrabold text-md text-slate-800 font-heading">
                        {checkoutPlan?.sub_title || ""}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium font-body leading-relaxed max-w-[200px]">
                        {checkoutPlan?.sub_description || ""}
                      </p>
                    </div>
                    <div className="text-right space-y-0.5 shrink-0">
                      <div className="font-black text-slate-900 text-sm">
                        {formatVND(originalPrice)}
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                        Chu kỳ: {checkoutPlan?.sub_time || ""}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-body">
                        Mã giảm giá
                      </span>
                      {appliedCoupon && (
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-[9px] font-black uppercase text-red-500 hover:underline cursor-pointer font-heading"
                        >
                          Gỡ bỏ
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Mã KM (Ví dụ: ROOMIE50)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon}
                        className="flex-1 h-11 border border-slate-200 rounded-xl px-4 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponCode.trim().length === 0 || !!appliedCoupon}
                        className="h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider transition-all disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        Áp dụng
                      </button>
                    </div>

                    <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 flex gap-2 items-start text-[10px] font-body text-slate-400 font-medium">
                      <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>Nhập mã <strong className="text-slate-600 font-heading">ROOMIE50</strong> để được giảm ngay 50% tổng giá trị hóa đơn trải nghiệm Premium!</span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Pricing Breakdown Invoice details */}
                  <div className="space-y-3.5 text-xs font-body">
                    <div className="flex justify-between items-center text-slate-500 font-semibold">
                      <span>Tạm tính</span>
                      <span className="font-bold text-slate-800">{formatVND(originalPrice)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-emerald-600 font-semibold">
                        <span className="flex items-center gap-1">
                          Khuyến mãi ({appliedCoupon})
                        </span>
                        <span className="font-extrabold">- {formatVND(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-slate-500 font-semibold">
                      <span>Phí dịch vụ bảo mật SSL</span>
                      <span className="font-bold text-emerald-500 uppercase tracking-widest text-[9px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        Miễn phí
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-500 font-semibold">
                      <span>Thuếu VAT (10%)</span>
                      <span className="font-bold text-slate-400 line-through">Đã giảm thuế</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-800 font-black border-t border-dashed border-slate-200 pt-4 text-sm">
                      <span>Tổng cộng thanh toán</span>
                      <span className="text-primary text-md">
                        {formatVND(finalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Guaranteed Trust Footer Box */}
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-body">
                      Quyền lợi đi kèm
                    </span>
                    <ul className="space-y-2 text-[11px] text-slate-500 font-medium font-body leading-relaxed">
                      <li className="flex gap-2 items-start">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        AI So Khớp tương thích thói quen sinh hoạt
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        Gửi lời mời ở ghép trực tiếp không giới hạn
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        Mở rộng hiển thị ưu tiên tiếp cận 15,000+ thành viên
                      </li>
                      <li className="flex gap-2 items-start">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        Kênh trò chuyện bảo mật mã hóa đầu cuối
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
