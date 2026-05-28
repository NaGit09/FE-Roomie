"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Coins, 
  CheckCircle, 
  Calendar, 
  HelpCircle,
  TrendingUp,
  Compass,
  ArrowRight,
  Crown,
  Zap,
  Sparkles,
  Check,
  Gift
} from "lucide-react";
import { useSubscriptionStore, defaultPlans } from "@/stores/subscriptionStore";
import { SubscriptionApi } from "@/services/api/subcription";
import { Subscription, SubscriptionDetail, UpgradeSubscription } from "@/schema/user/subcription";
import formatVND from "@/utils/priceUtils";
import { useRouter } from "next/navigation";

export default function HistorySubscriptionPage() {
  const router = useRouter();
  const { setCheckoutPlan } = useSubscriptionStore();
  
  const [mounted, setMounted] = useState(false);
  const [hasActiveSub, setHasActiveSub] = useState<boolean | null>(null);
  const [loadingCheck, setLoadingCheck] = useState<boolean>(true);
  const [availablePlans, setAvailablePlans] = useState<Subscription[]>([]);
  const [loadingPlans, setLoadingPlans] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  // New States
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeSubscription | null>(null);
  const [loadingUpgrade, setLoadingUpgrade] = useState<boolean>(false);
  const [userSubscriptions, setUserSubscriptions] = useState<SubscriptionDetail[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Normalize sub_type helper
  const normalizePlanType = (type: string) => {
    const upper = (type || "").toUpperCase();
    if (upper.includes("DIAMOND")) return "DIAMOND";
    if (upper.includes("GOLD")) return "GOLD";
    if (upper.includes("SILVER")) return "SILVER";
    return upper;
  };

  useEffect(() => {
    setMounted(true);

    const verifySubscription = async () => {
      setLoadingCheck(true);
      try {
        const res = await SubscriptionApi.check_subscription();
        const active = res && res.code === 200 ? res.data : false;
        setHasActiveSub(active);

        // 1. Fetch available packages if they don't have an active subscription
        if (!active) {
          setLoadingPlans(true);
          try {
            const plansRes = await SubscriptionApi.get_all_renter_subscriptions();
            if (plansRes && plansRes.code === 200 && Array.isArray(plansRes.data)) {
              setAvailablePlans(plansRes.data);
            } else {
              setAvailablePlans(defaultPlans);
            }
          } catch (planErr) {
            console.warn("Failed to fetch available plans from API, using defaults:", planErr);
            setAvailablePlans(defaultPlans);
          } finally {
            setLoadingPlans(false);
          }
        } 
        // 2. Fetch upgrade recommendations if they have an active subscription
        else {
          setLoadingUpgrade(true);
          try {
            const upgradeRes = await SubscriptionApi.upgrade_subscription();
            if (upgradeRes && upgradeRes.code === 200 && upgradeRes.data) {
              setUpgradeInfo(upgradeRes.data);
            }
          } catch (upgradeErr) {
            console.error("Failed to check upgrade recommendation:", upgradeErr);
          } finally {
            setLoadingUpgrade(false);
          }
        }

        // 3. Always fetch user past subscriptions history
        setLoadingHistory(true);
        try {
          const historyRes = await SubscriptionApi.get_user_subscription();
          if (historyRes && historyRes.code === 200 && Array.isArray(historyRes.data)) {
            setUserSubscriptions(historyRes.data);
          }
        } catch (historyErr) {
          console.error("Failed to fetch user subscription history:", historyErr);
        } finally {
          setLoadingHistory(false);
        }

      } catch (err) {
        console.error("Failed to check subscription status:", err);
        setHasActiveSub(false);
        setAvailablePlans(defaultPlans);
      } finally {
        setLoadingCheck(false);
      }
    };

    verifySubscription();
  }, []);

  if (!mounted || loadingCheck) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-20 gap-3">
        <Compass className="h-8 w-8 text-primary animate-spin" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Đang xác minh lịch sử gói dịch vụ...
        </span>
      </div>
    );
  }

  // Format dates
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const handleSelectPlan = (plan: Subscription) => {
    const finalPlan = { ...plan };
    const planType = normalizePlanType(plan.sub_type);

    if (billingCycle === "yearly") {
      let monthlyPrice = plan.sub_price;
      if (planType === "SILVER") {
        monthlyPrice = 35000;
      } else if (planType === "GOLD") {
        monthlyPrice = 69000;
      } else if (planType === "DIAMOND") {
        monthlyPrice = 139000;
      }

      finalPlan.sub_price = monthlyPrice * 12;
      finalPlan.sub_title = `${plan.sub_title} (12 Tháng)`;
      finalPlan.sub_time = "12 Tháng";
      finalPlan.sub_description = `${plan.sub_description} (Đăng ký chu kỳ năm tiết kiệm 30%).`;
    }

    setCheckoutPlan(finalPlan);
    router.push(`/order?subscription_id=${plan.id}`);
  };

  const getDisplayPrice = (plan: Subscription) => {
    const planType = normalizePlanType(plan.sub_type);
    if (billingCycle === "yearly") {
      if (planType === "SILVER") return 35000;
      if (planType === "GOLD") return 69000;
      if (planType === "DIAMOND") return 139000;
    }
    return plan.sub_price;
  };

  const getPlanIcon = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "SILVER":
        return <Zap className="h-5 w-5 text-slate-400" />;
      case "GOLD":
        return <Crown className="h-5 w-5 text-[#F97316]" />;
      case "DIAMOND":
        return <Sparkles className="h-5 w-5 text-[#D946EF]" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const getPlanBadge = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "SILVER":
        return "Tiết Kiệm";
      case "GOLD":
        return "Phổ Biến ✨";
      case "DIAMOND":
        return "Tối Thượng 🔥";
      default:
        return "";
    }
  };

  const getPlanFeatures = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "SILVER":
        return [
          "50 lượt vuốt roommate / tháng",
          "Bộ lọc cơ bản (Quận/Huyện, Giá)",
          "Xem thông tin hồ sơ rút gọn",
          "Chat ghép đôi thông thường"
        ];
      case "GOLD":
        return [
          "Không giới hạn lượt vuốt",
          "AI So Khớp đa chiều (>90%)",
          "Mở khóa thông tin chi tiết lối sống",
          "Ưu tiên gửi lời mời kết nối",
          "Huy hiệu Vàng nổi bật",
          "Hỗ trợ chat ẩn danh bảo mật"
        ];
      case "DIAMOND":
        return [
          "Quyền lợi Premium suốt chu kỳ",
          "Hỗ trợ roommate 1-1 từ CSKH",
          "Hồ sơ được ưu tiên đề xuất hàng đầu",
          "Cam kết hoàn tiền trong 7 ngày",
          "Đặc quyền hỗ trợ VIP 24/7"
        ];
      default:
        return [];
    }
  };

  const getPlanTitle = (detail: SubscriptionDetail & { subscription?: Subscription }) => {
    if (detail.subscription?.sub_title) {
      return detail.subscription.sub_title;
    }
    const matched = [...availablePlans, ...defaultPlans].find(p => p.id === detail.sub_id);
    return matched ? matched.sub_title : `Gói dịch vụ #${detail.sub_id}`;
  };

  const activeDetail = userSubscriptions.find(d => d.is_active);
  const activePlanTitle = activeDetail ? getPlanTitle(activeDetail) : "";

  return (
    <div className="w-full space-y-8 animate-fade-in text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-black text-slate-800">Đăng ký Premium & Lịch sử</h1>
          <p className="text-xs text-slate-400 font-medium font-body">
            Xem lại lịch sử hoạt động, kiểm tra thời hạn hoặc nâng cấp lên gói dịch vụ Roomie Premium cao hơn.
          </p>
        </div>

        {hasActiveSub && activePlanTitle ? (
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 self-start sm:self-center shadow-sm">
            <TrendingUp className="h-4 w-4 text-amber-500 animate-pulse" />
            <span>Gói hiện tại: {activePlanTitle}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-bold text-slate-500 self-start sm:self-center shadow-sm">
            <Zap className="h-4 w-4 text-slate-400" />
            <span>Trạng thái: Miễn phí (Free)</span>
          </div>
        )}
      </div>

      {/* ── PLANS SECTION (If user hasn't subscribed to any active package) ── */}
      {!hasActiveSub && availablePlans.length > 0 && (
        <div className="space-y-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden shadow-sm">
          {/* Subtle decoration */}
          <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-tr from-[#D946EF]/10 via-[#E879F9]/5 to-transparent blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-gradient-to-br from-[#F97316]/8 via-transparent to-transparent blur-[80px] pointer-events-none" />

          {/* Plan Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
            <div className="space-y-1.5 text-left">
              <h2 className="text-xl font-black text-[#86198F] flex items-center gap-2 font-heading">
                <Crown className="h-5 w-5 text-amber-500 animate-pulse" />
                Nâng cấp Gói Roomie Premium
              </h2>
              <p className="text-xs text-slate-500 font-medium font-body max-w-xl">
                Khám phá roommate phù hợp nhất. Nâng cấp ngay để mở khóa toàn bộ tiêu chí so khớp AI và không giới hạn kết nối.
              </p>
            </div>

            {/* Switch Billing Cycle */}
            <div className="bg-slate-200/50 p-1 rounded-2xl flex items-center border border-slate-200/20 shadow-inner self-start md:self-center">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-[#86198F] shadow-sm"
                    : "text-slate-500 hover:text-slate-705"
                }`}
              >
                Hàng tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-white text-[#86198F] shadow-sm"
                    : "text-slate-500 hover:text-slate-705"
                }`}
              >
                Hàng năm
                <span className="bg-[#F97316] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Gift className="h-2 w-2" />
                  -30%
                </span>
              </button>
            </div>
          </div>

          {loadingPlans ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3">
              <Compass className="h-8 w-8 text-primary animate-spin" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Đang nạp các gói hội viên...
              </span>
            </div>
          ) : (
            /* Premium Plan Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4 relative z-10">
              {availablePlans.map((plan) => {
                const planType = normalizePlanType(plan.sub_type);
                const isGold = planType === "GOLD";
                const isDiamond = planType === "DIAMOND";
                const displayPrice = getDisplayPrice(plan);
                const originalMonthlyPrice = plan.sub_price;

                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative rounded-[2rem] border p-6 flex flex-col justify-between transition-all select-none shadow-xs group cursor-pointer ${
                      isGold
                        ? "border-[#D946EF]/30 bg-white shadow-md shadow-[#D946EF]/5 ring-1 ring-[#D946EF]/20"
                        : isDiamond
                          ? "border-[#D946EF]/30 bg-white shadow-md shadow-[#D946EF]/5 ring-1 ring-[#D946EF]/20"
                          : "border-slate-200/80 bg-white/70 hover:bg-white"
                    }`}
                  >
                    {/* Badge */}
                    <span className={`absolute -top-3 right-6 rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest text-white shadow-md ${
                      isGold 
                        ? "bg-gradient-to-r from-[#D946EF] to-[#F97316]" 
                        : isDiamond 
                          ? "bg-gradient-to-r from-[#D946EF] to-[#86198F]" 
                          : "bg-slate-500"
                    }`}>
                      {getPlanBadge(plan.sub_type)}
                    </span>

                    <div className="space-y-4">
                      {/* Title block */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="font-extrabold text-sm text-[#86198F]">
                            {plan.sub_title}
                          </h3>
                          <span className="text-[8px] uppercase font-black tracking-widest text-slate-400 block font-body">
                            Hạn mức: {billingCycle === "yearly" ? "12 Tháng" : plan.sub_time}
                          </span>
                        </div>
                        <div className={`p-2.5 rounded-xl ${
                          isGold ? "bg-[#FDF4FF]" : isDiamond ? "bg-[#FDF4FF]" : "bg-slate-100"
                        }`}>
                          {getPlanIcon(plan.sub_type)}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#86198F] bg-gradient-to-r from-[#86198F] to-[#D946EF] bg-clip-text">
                            {formatVND(displayPrice)}
                          </span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                            / tháng
                          </span>
                        </div>
                        {billingCycle === "yearly" ? (
                          <div className="space-y-0.5 text-[8px] font-bold">
                            <span className="text-slate-400 uppercase tracking-wider block">
                              Billed {formatVND(displayPrice * 12)} / Năm
                            </span>
                            <span className="text-emerald-500 uppercase tracking-wider block">
                              Tiết kiệm {formatVND((originalMonthlyPrice - displayPrice) * 12)} / Năm
                            </span>
                          </div>
                        ) : (
                          isDiamond && (
                            <span className="text-[8px] font-extrabold text-emerald-500 uppercase tracking-wider block">
                              Tiết kiệm ~33.000đ / tháng
                            </span>
                          )
                        )}
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        {plan.sub_description}
                      </p>

                      <hr className="border-slate-100" />

                      {/* Features */}
                      <ul className="space-y-2 text-[10px] text-slate-655 font-body font-medium">
                        {getPlanFeatures(plan.sub_type).map((feature, idx) => (
                          <li key={idx} className="flex gap-2 items-start leading-tight">
                            <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              isGold ? "bg-[#D946EF]/10 text-[#D946EF]" : isDiamond ? "bg-[#D946EF]/10 text-[#D946EF]" : "bg-slate-100 text-slate-400"
                            }`}>
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full mt-6 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow ${
                        isGold
                          ? "bg-gradient-to-r from-[#D946EF] via-[#E879F9] to-[#F97316] text-white hover:brightness-105 active:scale-95 shadow-md shadow-[#D946EF]/10"
                          : isDiamond
                            ? "bg-gradient-to-r from-[#D946EF] via-[#E879F9] to-[#F97316] text-white hover:brightness-105 active:scale-95 shadow-md shadow-[#D946EF]/10"
                            : "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                      }`}
                    >
                      Đăng ký ngay
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── UPGRADE RECOMMENDATION SECTION (If user is subscribed and can upgrade) ── */}
      {hasActiveSub && upgradeInfo && upgradeInfo.can_upgrade && upgradeInfo.higher_packages.length > 0 && (
        <div className="space-y-6 bg-gradient-to-tr from-purple-50/60 to-pink-50/60 border border-purple-100 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden shadow-sm">
          {/* Glowing background */}
          <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-tr from-[#D946EF]/10 via-[#E879F9]/5 to-transparent blur-[80px] pointer-events-none animate-pulse" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
            <div className="space-y-1.5 text-left">
              <h2 className="text-xl font-black text-[#86198F] flex items-center gap-2 font-heading">
                <Sparkles className="h-5 w-5 text-[#D946EF] animate-pulse" />
                Nâng cấp Trải Nghiệm Đỉnh Cao
              </h2>
              <p className="text-xs text-slate-500 font-medium font-body max-w-xl">
                Bạn đang sử dụng gói <strong className="text-[#86198F]">{upgradeInfo.current_subscription?.subscription?.sub_title || "Premium"}</strong>. Hãy nâng cấp lên gói cao hơn để sở hữu những đặc quyền tối thượng!
              </p>
            </div>

            {/* Switch Billing Cycle */}
            <div className="bg-slate-200/50 p-1 rounded-2xl flex items-center border border-slate-200/20 shadow-inner self-start md:self-center">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-[#86198F] shadow-sm"
                    : "text-slate-500 hover:text-slate-705"
                }`}
              >
                Hàng tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-white text-[#86198F] shadow-sm"
                    : "text-slate-500 hover:text-slate-705"
                }`}
              >
                Hàng năm
                <span className="bg-[#F97316] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Gift className="h-2 w-2" />
                  -30%
                </span>
              </button>
            </div>
          </div>

          {loadingUpgrade ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3">
              <Compass className="h-8 w-8 text-primary animate-spin" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Đang đối chiếu các gói nâng cấp...
              </span>
            </div>
          ) : (
            /* Higher Plans Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch pt-4 relative z-10">
              {upgradeInfo.higher_packages.map((plan) => {
                const planType = normalizePlanType(plan.sub_type);
                const isGold = planType === "GOLD";
                const isDiamond = planType === "DIAMOND";
                const displayPrice = getDisplayPrice(plan);
                const originalMonthlyPrice = plan.sub_price;

                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative rounded-[2rem] border p-6 flex flex-col justify-between transition-all select-none shadow-xs group cursor-pointer bg-white ${
                      isGold || isDiamond ? "border-[#D946EF]/30 shadow-md ring-1 ring-[#D946EF]/20" : "border-slate-200"
                    }`}
                  >
                    <span className="absolute -top-3 right-6 rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest text-white shadow-md bg-gradient-to-r from-[#D946EF] to-[#F97316]">
                      Khuyên Dùng ✨
                    </span>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="font-extrabold text-sm text-[#86198F]">
                            {plan.sub_title}
                          </h3>
                          <span className="text-[8px] uppercase font-black tracking-widest text-slate-400 block font-body">
                            Hạn mức: {billingCycle === "yearly" ? "12 Tháng" : plan.sub_time}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FDF4FF]">
                          {getPlanIcon(plan.sub_type)}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#86198F] bg-gradient-to-r from-[#86198F] to-[#D946EF] bg-clip-text">
                            {formatVND(displayPrice)}
                          </span>
                          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                            / tháng
                          </span>
                        </div>
                        {billingCycle === "yearly" ? (
                          <div className="space-y-0.5 text-[8px] font-bold">
                            <span className="text-slate-400 uppercase tracking-wider block">
                              Billed {formatVND(displayPrice * 12)} / Năm
                            </span>
                            <span className="text-emerald-500 uppercase tracking-wider block">
                              Tiết kiệm {formatVND((originalMonthlyPrice - displayPrice) * 12)} / Năm
                            </span>
                          </div>
                        ) : (
                          isDiamond && (
                            <span className="text-[8px] font-extrabold text-emerald-500 uppercase tracking-wider block">
                              Tiết kiệm ~33.000đ / tháng
                            </span>
                          )
                        )}
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        {plan.sub_description}
                      </p>

                      <hr className="border-slate-100" />

                      <ul className="space-y-2 text-[10px] text-slate-655 font-body font-medium">
                        {getPlanFeatures(plan.sub_type).map((feature, idx) => (
                          <li key={idx} className="flex gap-2 items-start leading-tight">
                            <div className="h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#D946EF]/10 text-[#D946EF]">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full mt-6 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow bg-gradient-to-r from-[#D946EF] via-[#E879F9] to-[#F97316] text-white hover:brightness-105 active:scale-95"
                    >
                      Nâng cấp ngay
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TRANSACTION LISTS (Using actual server history from get_user_subscription) ── */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-805 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-500" />
          Lịch sử nạp và đăng ký gói
        </h2>

        {loadingHistory ? (
          <div className="h-32 flex flex-col items-center justify-center gap-2 rounded-3xl border border-slate-100 bg-white">
            <Compass className="h-6 w-6 text-primary animate-spin" />
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
              Đang tải lịch sử giao dịch...
            </span>
          </div>
        ) : userSubscriptions.length === 0 ? (
          /* EMPTY STATE (Only shown if user has no subscription history) */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-slate-150 bg-slate-50/50 p-12 text-center space-y-6 max-w-lg mx-auto"
          >
            <div className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-450 flex items-center justify-center mx-auto shadow-inner">
              <Coins className="h-8 w-8 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-md font-extrabold text-slate-850">Chưa có giao dịch nào</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-body max-w-sm mx-auto">
                Bạn chưa thực hiện bất kỳ giao dịch nạp xu hoặc đăng ký gói Premium nào trên hệ thống Roomie.
              </p>
            </div>
          </motion.div>
        ) : (
          /* TRANSACTIONS TABLE LIST */
          <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-450 font-body">
                  <th className="py-4 px-6">ID Giao Dịch</th>
                  <th className="py-4 px-6">Ngày Đăng Ký</th>
                  <th className="py-4 px-6">Gói Hội Viên</th>
                  <th className="py-4 px-6">Ngày Hết Hạn</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                {userSubscriptions.map((detail) => {
                  const planTitle = getPlanTitle(detail);
                  return (
                    <tr key={detail.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-505 font-bold">RM-SUB-{detail.id}</td>
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                          {formatDate(detail.created_at)}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-slate-800">{planTitle}</td>
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                          {formatDate(detail.time_end)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {detail.is_active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100/60 px-2.5 py-1 text-[10px] font-extrabold text-emerald-600">
                            <CheckCircle className="h-3 w-3 shrink-0 animate-pulse" />
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">
                            Đã hết hạn
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Help & Support Info Box */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 flex gap-3 text-slate-400 items-start text-xs font-body font-medium">
          <HelpCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-650 block">Bạn cần hỗ trợ về hóa đơn?</span>
            <p className="leading-relaxed font-body text-slate-450">
              Nếu phát hiện bất kỳ sai sót nào trong giao dịch thanh toán hoặc muốn nhận hóa đơn giá trị gia tăng (VAT), vui lòng liên hệ ngay với bộ phận CSKH Roomie qua hotline <strong className="text-slate-650">1900 6868</strong> hoặc email <strong className="text-slate-650">support@roomie.vn</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
