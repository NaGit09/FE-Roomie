"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  Sparkles, 
  Crown, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Heart,
  Gift
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { Subscription } from "@/schema/user/subcription";
import formatVND from "@/utils/priceUtils";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const router = useRouter();
  const setCheckoutPlan = useSubscriptionStore((state) => state.setCheckoutPlan);
  const plans = useSubscriptionStore((state) => state.plans);
  const fetchPlans = useSubscriptionStore((state) => state.fetchPlans);
  
  // Billing cycle state: "monthly" or "yearly"
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<number>(2); // Default to Gold Plan (Most popular)

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen, fetchPlans]);

  // Handle plan select and compute custom pricing for yearly options
  const handleSelectPlan = (basePlan: Subscription) => {
    let finalPlan = { ...basePlan };
    
    if (billingCycle === "yearly") {
      // Calculate yearly pricing (e.g. roughly 30% discount per month, billed for 12 months)
      let monthlyPrice = basePlan.sub_price;
      if (basePlan.sub_type === "SILVER") {
        monthlyPrice = 35000;
      } else if (basePlan.sub_type === "GOLD") {
        monthlyPrice = 69000;
      } else if (basePlan.sub_type === "DIAMOND") {
        monthlyPrice = 139000; // Best value 12-month
      }
      
      finalPlan.sub_price = monthlyPrice * 12;
      finalPlan.sub_title = `${basePlan.sub_title} (12 Tháng)`;
      finalPlan.sub_time = "12 Tháng";
      finalPlan.sub_description = `${basePlan.sub_description} (Đăng ký chu kỳ năm tiết kiệm 30%).`;
    }

    setCheckoutPlan(finalPlan);
    onClose();
    router.push("/order");
  };

  // Get dynamic prices for display
  const getDisplayPrice = (plan: Subscription) => {
    if (billingCycle === "yearly") {
      if (plan.sub_type === "SILVER") return 35000;
      if (plan.sub_type === "GOLD") return 69000;
      if (plan.sub_type === "DIAMOND") return 139000;
    }
    return plan.sub_price;
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case "SILVER":
        return <Zap className="h-5 w-5 text-slate-400" />;
      case "GOLD":
        return <Crown className="h-6 w-6 text-[#F97316] animate-[pulse_2s_infinite]" />;
      case "DIAMOND":
        return <Sparkles className="h-6 w-6 text-[#D946EF] animate-[bounce_3s_infinite]" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const getPlanBadge = (type: string) => {
    switch (type) {
      case "SILVER":
        return "Gói Tiết Kiệm";
      case "GOLD":
        return "Phổ Biến Nhất ✨";
      case "DIAMOND":
        return "Giá Trị Tối Thượng 🔥";
      default:
        return "";
    }
  };

  const getPlanFeatures = (type: string) => {
    switch (type) {
      case "SILVER":
        return [
          "50 lượt vuốt tìm roommate / tháng",
          "Bộ lọc cơ bản (Quận/Huyện, Giá phòng)",
          "Xem thông tin hồ sơ rút gọn",
          "Chat ghép đôi thông thường"
        ];
      case "GOLD":
        return [
          "Không giới hạn lượt vuốt tìm roommate",
          "AI So Khớp đa chiều thông minh (>90%)",
          "Mở khóa thông tin chi tiết lối sống",
          "Ưu tiên gửi lời mời kết nối trực tiếp",
          "Huy hiệu Vàng nổi bật trên trang chủ",
          "Hỗ trợ chat ẩn danh bảo mật"
        ];
      case "DIAMOND":
        return [
          "Quyền lợi Premium trong suốt chu kỳ",
          "Hỗ trợ tìm kiếm roommate 1-1 từ tư vấn viên",
          "Hồ sơ được ưu tiên đề xuất hàng đầu",
          "Cam kết hoàn tiền trong 7 ngày nếu không khớp",
          "Đặc quyền hỗ trợ VIP 24/7"
        ];
      default:
        return [];
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#86198F]/20 dark:bg-black/80 backdrop-blur-[6px]"
          />

          {/* Modal Container: Liquid Glass themed styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", duration: 0.45 }}
            className="relative w-full max-w-5xl rounded-[3rem] border border-white/60 bg-white/70 dark:bg-stone-900/70 backdrop-blur-3xl p-6 sm:p-12 shadow-[0_50px_100px_-20px_rgba(217,70,239,0.18)] overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Iridescent background fluid elements */}
            <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-[#D946EF]/20 via-[#E879F9]/10 to-transparent blur-[110px] pointer-events-none animate-[pulse_10s_infinite]" />
            <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#F97316]/15 via-[#D946EF]/5 to-transparent blur-[110px] pointer-events-none animate-[pulse_12s_infinite_2s]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(217,70,239,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(217,70,239,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2.5 rounded-full border border-[#D946EF]/20 bg-white/80 dark:bg-stone-850 text-[#86198F] hover:text-[#D946EF] hover:bg-[#FDF4FF] dark:hover:bg-[#86198F]/10 hover:shadow-lg hover:shadow-[#D946EF]/10 active:scale-90 transition-all cursor-pointer z-20"
            >
              <X className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>

            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D946EF]/30 bg-[#FDF4FF]/90 dark:bg-[#86198F]/20 px-4.5 py-1.5 text-xs font-black uppercase tracking-widest text-[#86198F] dark:text-[#E879F9] shadow-sm">
                <Crown className="h-3.5 w-3.5 text-[#D946EF] animate-pulse" />
                Nâng cấp Roomie Premium
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#86198F] dark:text-white leading-tight font-heading">
                Tìm Bạn Ở Ghép Phù Hợp Hơn Với <span className="bg-gradient-to-r from-[#D946EF] via-[#E879F9] to-[#F97316] bg-clip-text text-transparent italic font-display">Roomie Premium</span>
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-350 max-w-xl mx-auto font-body leading-relaxed">
                Mở khóa không giới hạn gợi ý, kết nối trực tiếp tức thì và thuật toán AI so khớp phong cách sống chính xác 99%.
              </p>

              {/* Billing Cycle Switch (Monthly vs Yearly) */}
              <div className="pt-4 flex justify-center">
                <div className="bg-slate-100 dark:bg-stone-850 p-1 rounded-2xl flex items-center border border-slate-200/50 dark:border-white/5 shadow-inner">
                  {/* Monthly Switch */}
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      billingCycle === "monthly"
                        ? "bg-white dark:bg-stone-800 text-[#86198F] dark:text-white shadow-md"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    Hàng tháng
                  </button>

                  {/* Yearly Switch */}
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer relative ${
                      billingCycle === "yearly"
                        ? "bg-white dark:bg-stone-800 text-[#86198F] dark:text-white shadow-md"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                  >
                    Hàng năm
                    <span className="bg-[#F97316] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Gift className="h-2 w-2" />
                      -30%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isSilver = plan.sub_type === "SILVER";
                const isGold = plan.sub_type === "GOLD";
                const isDiamond = plan.sub_type === "DIAMOND";

                const displayPrice = getDisplayPrice(plan);
                const originalMonthlyPrice = plan.sub_price;

                return (
                  <motion.div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative rounded-[2rem] border p-7 flex flex-col justify-between transition-all cursor-pointer select-none shadow-sm group ${
                      isSelected
                        ? isGold
                          ? "border-[#D946EF] bg-[#FDF4FF]/40 dark:bg-[#86198F]/5 ring-2 ring-[#D946EF] shadow-[#D946EF]/10"
                          : isDiamond
                            ? "border-[#D946EF] bg-[#FDF4FF]/40 dark:bg-[#86198F]/5 ring-2 ring-[#D946EF] shadow-[#D946EF]/10"
                            : "border-slate-800 bg-slate-50/50 dark:bg-stone-850 dark:border-white ring-2 ring-slate-800 shadow-slate-500/5"
                        : "border-slate-200/80 bg-white/40 hover:bg-white/80 dark:border-white/5 dark:bg-stone-900/40 hover:dark:bg-stone-900/85"
                    }`}
                  >
                    {/* Badge header */}
                    {isSelected && (
                      <span className={`absolute -top-3.5 right-8 rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-md ${
                        isGold 
                          ? "bg-gradient-to-r from-[#D946EF] to-[#F97316]" 
                          : isDiamond 
                            ? "bg-gradient-to-r from-[#D946EF] to-[#86198F]" 
                            : "bg-slate-700"
                      }`}>
                        {getPlanBadge(plan.sub_type)}
                      </span>
                    )}

                    <div className="space-y-5">
                      {/* Plan title */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-lg text-[#86198F] dark:text-slate-100 flex items-center gap-1.5">
                            {plan.sub_title}
                          </h3>
                          <span className="text-[9px] uppercase font-black tracking-widest text-slate-450 block">
                            Hạn mức: {billingCycle === "yearly" ? "12 Tháng" : plan.sub_time}
                          </span>
                        </div>
                        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${
                          isGold ? "bg-[#FDF4FF]/80 dark:bg-[#86198F]/20" : isDiamond ? "bg-[#FDF4FF]/80 dark:bg-[#86198F]/20" : "bg-slate-100 dark:bg-stone-800"
                        }`}>
                          {getPlanIcon(plan.sub_type)}
                        </div>
                      </div>

                      {/* Pricing block */}
                      <div className="py-2 space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-black text-[#86198F] dark:text-white bg-gradient-to-r from-[#86198F] to-[#D946EF] bg-clip-text">
                            {formatVND(displayPrice)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            / tháng
                          </span>
                        </div>

                        {/* Cost breakdown */}
                        {billingCycle === "yearly" ? (
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                              Billed {formatVND(displayPrice * 12)} / Năm
                            </span>
                            <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider block">
                              Tiết kiệm {formatVND((originalMonthlyPrice - displayPrice) * 12)} / Năm
                            </span>
                          </div>
                        ) : (
                          isDiamond && (
                            <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider block">
                              Tiết kiệm ~33.000đ / tháng
                            </span>
                          )
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {plan.sub_description}
                      </p>

                      <hr className="border-slate-100 dark:border-white/5" />

                      {/* Features */}
                      <ul className="space-y-3 text-xs text-slate-650 dark:text-slate-350 font-body">
                        {getPlanFeatures(plan.sub_type).map((feature, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start leading-tight font-medium">
                            <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isGold ? "bg-[#D946EF]/10 text-[#D946EF]" : isDiamond ? "bg-[#D946EF]/10 text-[#D946EF]" : "bg-slate-100 text-slate-400"
                            }`}>
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button in card */}
                    <div className="mt-8">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan);
                        }}
                        className={`w-full py-4 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg ${
                          isSelected
                            ? isGold
                              ? "bg-gradient-to-r from-[#D946EF] via-[#E879F9] to-[#F97316] text-white hover:brightness-105 active:scale-95 shadow-[#D946EF]/10"
                              : isDiamond
                                ? "bg-gradient-to-r from-[#D946EF] via-[#E879F9] to-[#F97316] text-white hover:brightness-105 active:scale-95 shadow-[#D946EF]/10"
                                : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-slate-100"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-stone-850 dark:hover:bg-stone-750 dark:text-slate-300 active:scale-95"
                        }`}
                      >
                        Đăng ký ngay
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom trust footer */}
            <div className="mt-12 pt-6 border-t border-slate-150/60 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest font-body">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                Thanh toán an toàn bảo mật 256-bit
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-[#D946EF]" />
                Hơn 12,000+ người đã ghép đôi thành công
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-4.5 w-4.5 text-red-500 fill-current" />
                Đồng hành kiến tạo tổ ấm Việt
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
