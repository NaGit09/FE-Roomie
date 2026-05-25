"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Lock, 
  CreditCard, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  ChevronRight, 
  Info,
  QrCode,
  Tag,
  Loader2,
  Compass,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { checkoutPlan, completeCheckout } = useSubscriptionStore();
  const [mounted, setMounted] = useState(false);

  // Form States
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo" | "bank">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

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

  if (!mounted) {
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
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "card") {
      if (cardNumber.length < 16 || cardName.trim().length === 0 || cardExpiry.length < 4 || cardCvv.length < 3) {
        toast.warning("Vui lòng điền đầy đủ thông tin thẻ tín dụng!");
        return;
      }
    }

    setIsProcessing(true);

    // Simulate 2s validation spinner
    setTimeout(() => {
      completeCheckout(
        paymentMethod === "card" ? "Thẻ tín dụng" : paymentMethod === "momo" ? "Ví MoMo" : "Chuyển khoản Ngân hàng"
      );
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Thanh toán đơn hàng thành công!");
    }, 2500);
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
                  <span className="font-extrabold text-slate-800">{paymentMethod === "card" ? "Thẻ tín dụng" : paymentMethod === "momo" ? "Ví MoMo" : "Chuyển khoản"}</span>
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
                  {/* Payment method selection cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Method 1: Credit Card */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`rounded-2xl border p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <CreditCard className={`h-6 w-6 ${paymentMethod === "card" ? "text-primary" : "text-slate-400"}`} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                        Thẻ tín dụng
                      </span>
                    </div>

                    {/* Method 2: MoMo */}
                    <div
                      onClick={() => setPaymentMethod("momo")}
                      className={`rounded-2xl border p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === "momo"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-lg font-black text-[9px] flex items-center justify-center border text-white ${
                        paymentMethod === "momo" ? "bg-[#A50064] border-[#A50064]" : "bg-slate-400 border-slate-400"
                      }`}>
                        MOMO
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                        Ví MoMo
                      </span>
                    </div>

                    {/* Method 3: Bank Transfer */}
                    <div
                      onClick={() => setPaymentMethod("bank")}
                      className={`rounded-2xl border p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === "bank"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <QrCode className={`h-6 w-6 ${paymentMethod === "bank" ? "text-primary" : "text-slate-400"}`} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                        Ngân hàng QR
                      </span>
                    </div>
                  </div>

                  {/* Method Panel details */}
                  <div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm">
                    {paymentMethod === "card" && (
                      /* CREDIT CARD FORM & CARD INTERACTIVE DISPLAY */
                      <div className="space-y-8">
                        {/* Interactive Card Graphic preview */}
                        <div className="flex justify-center">
                          <motion.div
                            initial={false}
                            animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full max-w-[340px] h-[190px] rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 text-white p-6 shadow-xl flex flex-col justify-between relative"
                            style={{ transformStyle: "preserve-3d" }}
                          >
                            {/* Card Front face */}
                            <div
                              className="absolute inset-0 p-6 flex flex-col justify-between"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                                  ROOMIE GOLD CARD
                                </span>
                                <div className="h-8 w-12 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold italic">
                                  VISA
                                </div>
                              </div>
                              <div className="space-y-4">
                                {/* Card Number display */}
                                <div className="text-xl font-bold tracking-[0.2em] font-mono h-6">
                                  {cardNumber.padEnd(16, "•").replace(/(.{4})/g, "$1 ")}
                                </div>
                                <div className="flex justify-between items-end">
                                  <div className="space-y-0.5">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                      Card Holder
                                    </span>
                                    <div className="text-[11px] font-bold tracking-wider uppercase truncate max-w-[180px]">
                                      {cardName || "TEN CHU THE"}
                                    </div>
                                  </div>
                                  <div className="space-y-0.5 text-right">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                      Expires
                                    </span>
                                    <div className="text-[11px] font-bold tracking-wider">
                                      {cardExpiry ? `${cardExpiry.slice(0, 2)}/${cardExpiry.slice(2, 4)}` : "MM/YY"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Back face */}
                            <div
                              className="absolute inset-0 p-6 flex flex-col justify-between rotateY-180"
                              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                              <div className="w-full bg-slate-950 h-10 absolute left-0 top-6" />
                              <div className="space-y-4 pt-10">
                                <div className="flex justify-end items-center gap-2">
                                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                    CVV Code
                                  </span>
                                  <div className="w-14 bg-white text-slate-900 font-mono text-sm px-2.5 py-1 text-center font-bold rounded">
                                    {cardCvv || "•••"}
                                  </div>
                                </div>
                                <p className="text-[7px] text-slate-400 leading-normal text-right">
                                  Thẻ này được bảo mật thông tin và được mã hóa bởi Roomie Inc. Vui lòng bảo mật mã CVV của bạn.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Card Inputs Form */}
                        <div className="space-y-4">
                          {/* Input 1: Card Number */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-body">
                              Số thẻ tín dụng
                            </label>
                            <input
                              type="text"
                              maxLength={16}
                              placeholder="1234 5678 1234 5678"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                              onFocus={() => setIsCardFlipped(false)}
                              className="w-full h-11 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              required
                            />
                          </div>

                          {/* Input 2: Card Name */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-body">
                              Tên in trên thẻ
                            </label>
                            <input
                              type="text"
                              placeholder="NGUYEN VAN A"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value.toUpperCase())}
                              onFocus={() => setIsCardFlipped(false)}
                              className="w-full h-11 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              required
                            />
                          </div>

                          {/* Dual inputs: Expiry and CVV */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-body">
                                Ngày hết hạn (MMYY)
                              </label>
                              <input
                                type="text"
                                maxLength={4}
                                placeholder="1228"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, ""))}
                                onFocus={() => setIsCardFlipped(false)}
                                className="w-full h-11 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-body">
                                Mã bảo mật CVV
                              </label>
                              <input
                                type="password"
                                maxLength={3}
                                placeholder="•••"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                onFocus={() => setIsCardFlipped(true)}
                                onBlur={() => setIsCardFlipped(false)}
                                className="w-full h-11 border border-slate-200 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "momo" && (
                      /* MOMO SCAN SIMULATOR */
                      <div className="text-center space-y-6">
                        <div className="inline-flex h-12 w-12 rounded-xl bg-[#A50064] text-white items-center justify-center font-bold text-sm shadow-md">
                          Momo
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-heading text-lg font-bold text-slate-900">
                            Thanh toán nhanh qua ví MoMo
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                            Hệ thống sẽ tạo mã QR tự động. Hãy mở ứng dụng MoMo trên điện thoại và quét mã QR bên dưới để thanh toán.
                          </p>
                        </div>

                        {/* QR Code Container */}
                        <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-inner inline-block mx-auto relative group">
                          {/* Custom Simulated QR Code SVG */}
                          <svg className="h-44 w-44 text-slate-900 mx-auto" viewBox="0 0 100 100">
                            <rect width="100" height="100" fill="#f8fafc" />
                            {/* Anchor corners */}
                            <rect x="5" y="5" width="25" height="25" fill="#A50064" />
                            <rect x="8" y="8" width="19" height="19" fill="#f8fafc" />
                            <rect x="11" y="11" width="13" height="13" fill="#A50064" />

                            <rect x="70" y="5" width="25" height="25" fill="#A50064" />
                            <rect x="73" y="8" width="19" height="19" fill="#f8fafc" />
                            <rect x="76" y="11" width="13" height="13" fill="#A50064" />

                            <rect x="5" y="70" width="25" height="25" fill="#A50064" />
                            <rect x="8" y="73" width="19" height="19" fill="#f8fafc" />
                            <rect x="11" y="76" width="13" height="13" fill="#A50064" />
                            {/* Decorative random dots to look like QR */}
                            <path d="M35 10h5v5h-5z M45 5h10v5H45z M60 10h5v10h-5z M35 25h15v5H35z M55 25h10v5H55z M40 35h5v10h-5z M50 35h15v5H50z M10 40h10v5H10z M25 45h5v15h-5z M5 55h15v5H5z M35 55h10v5H35z M50 50h5v10h-5z M60 55h15v5H60z M80 35h15v5H80z M85 45h10v10H85z M35 70h5v15h-5z M45 80h15v5H45z M65 70h10v10H65z M80 70h15v5H80z M85 80h10v10H85z" fill="#1e293b" />
                          </svg>
                          <div className="absolute inset-0 bg-[#A50064]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                            <span className="bg-white/95 px-3 py-1.5 rounded-full text-[9px] font-black uppercase text-[#A50064] tracking-wider shadow border border-slate-100">
                              Quét Ngay
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                          Đang chờ tín hiệu thanh toán...
                        </div>
                      </div>
                    )}

                    {paymentMethod === "bank" && (
                      /* BANK TRANSFER QR CODE AND ACCOUNT INFO */
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="font-heading text-lg font-bold text-slate-900">
                            Chuyển khoản Ngân hàng (QR Code)
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                            Vui lòng quét mã VietQR bằng ứng dụng Mobile Banking ngân hàng của bạn, thông tin tài khoản và số tiền sẽ được tự động điền.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          {/* VietQR code */}
                          <div className="border border-slate-100 rounded-2xl bg-white p-4 text-center shadow-inner">
                            <svg className="h-44 w-44 text-slate-900 mx-auto" viewBox="0 0 100 100">
                              <rect width="100" height="100" fill="#f8fafc" />
                              <rect x="5" y="5" width="25" height="25" fill="#004A95" />
                              <rect x="8" y="8" width="19" height="19" fill="#f8fafc" />
                              <rect x="11" y="11" width="13" height="13" fill="#004A95" />

                              <rect x="70" y="5" width="25" height="25" fill="#004A95" />
                              <rect x="73" y="8" width="19" height="19" fill="#f8fafc" />
                              <rect x="76" y="11" width="13" height="13" fill="#004A95" />

                              <rect x="5" y="70" width="25" height="25" fill="#004A95" />
                              <rect x="8" y="73" width="19" height="19" fill="#f8fafc" />
                              <rect x="11" y="76" width="13" height="13" fill="#004A95" />
                              {/* QR visual detail bank branded */}
                              <rect x="40" y="40" width="20" height="20" fill="#E21B26" />
                              <rect x="43" y="43" width="14" height="14" fill="#f8fafc" />
                              <path d="M47 47h6v6h-6z" fill="#E21B26" />
                              <path d="M35 10h5v5h-5z M45 5h10v5H45z M60 10h5v10h-5z M35 25h15v5H35z M55 25h10v5H55z M40 35h5v10h-5z M50 35h15v5H50z M10 40h10v5H10z M25 45h5v15h-5z M5 55h15v5H5z M35 55h10v5H35z M50 50h5v10h-5z M60 55h15v5H60z M80 35h15v5H80z M85 45h10v10H85z M35 70h5v15h-5z M45 80h15v5H45z M65 70h10v10H65z M80 70h15v5H80z M85 80h10v10H85z" fill="#1e293b" />
                            </svg>
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mt-2">
                              VietQR Standard / NAPAS247
                            </span>
                          </div>

                          {/* Bank details info */}
                          <div className="space-y-4 text-xs font-body">
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Ngân hàng</span>
                              <span className="font-extrabold text-slate-800">MB Bank (Ngân hàng Quân Đội)</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Số tài khoản</span>
                              <span className="font-extrabold text-slate-800 tracking-wider">190010099999</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Tên tài khoản</span>
                              <span className="font-extrabold text-slate-800">CONG TY ROOMIE SMARTROOM</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Nội dung chuyển khoản</span>
                              <span className="font-extrabold text-primary select-all">
                                RM SUB {checkoutPlan?.sub_type || ""} {Math.floor(1000 + Math.random() * 9000)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                      <h4 className="font-extrabold text-md text-slate-800">
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
                          className="text-[9px] font-black uppercase text-red-500 hover:underline cursor-pointer"
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
                      <span>Nhập mã <strong className="text-slate-600">ROOMIE50</strong> để được giảm ngay 50% tổng giá trị hóa đơn trải nghiệm Premium!</span>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Pricing Breakdown Invoice details */}
                  <div className="space-y-3.5 text-xs">
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
                      <span>Thuế VAT (10%)</span>
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
