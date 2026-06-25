/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Crown, 
  Sparkles,
  CheckCircle,
  Zap,
  Info,
  Compass,
  ArrowRight,
  Check,
  HelpCircle,
  Gift
} from "lucide-react";
import { SubscriptionApi } from "@/services/api/subcription";
import { Subscription, SubscriptionDetail, UpgradeSubscription } from "@/schema/user/subcription";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useRouter } from "next/navigation";

export default function LandlordSubscriptionPage() {
  const router = useRouter();
  const { setCheckoutPlan } = useSubscriptionStore();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Subscription States
  const [hasActiveSub, setHasActiveSub] = useState<boolean>(false);
  const [availablePlans, setAvailablePlans] = useState<Subscription[]>([]);
  const [userSubscriptions, setUserSubscriptions] = useState<SubscriptionDetail[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Upgrade Recommendation States
  const [upgradeInfo, setUpgradeInfo] = useState<UpgradeSubscription | null>(null);
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [showUpgradeSection, setShowUpgradeSection] = useState(false);

  const fetchSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      // 1. Check if landlord has active subscription
      const checkRes = await SubscriptionApi.check_subscription();
      const active = checkRes && checkRes.code === 200 ? checkRes.data : false;
      setHasActiveSub(active);

      // 2. Fetch available packages ALWAYS
      setLoadingPlans(true);
      try {
        const plansRes = await SubscriptionApi.get_all_landlord_subscriptions();
        if (plansRes && plansRes.code === 200 && Array.isArray(plansRes.data)) {
          setAvailablePlans(plansRes.data);
        } else {
          setAvailablePlans([]);
        }
      } catch (planErr) {
        console.error("Failed to fetch available landlord plans:", planErr);
      } finally {
        setLoadingPlans(false);
      }

      // 3. Fetch upgrade recommendations if active
      if (active) {
        setLoadingUpgrade(true);
        try {
          const upgradeRes = await SubscriptionApi.upgrade_subscription();
          if (upgradeRes && upgradeRes.code === 200) {
            setUpgradeInfo(upgradeRes.data);
          }
        } catch (upgradeErr) {
          console.error("Failed to check upgrade recommendation:", upgradeErr);
        } finally {
          setLoadingUpgrade(false);
        }
      } else {
        setUpgradeInfo(null);
      }

      // 4. Fetch past subscriptions history log
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

    } catch (err: any) {
      console.error("Error verifying landlord subscription:", err);
      toast.error("Không thể xác thực thông tin gói cước. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchSubscriptionStatus();
  }, []);

  if (!mounted) return null;

  // Format dates helper
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return isoString;
    }
  };

  const normalizePlanType = (type: string) => {
    const upper = (type || "").toUpperCase();
    if (upper.includes("BUSINESS") || upper.includes("DIAMOND")) return "DIAMOND";
    if (upper.includes("PRO") || upper.includes("GOLD")) return "GOLD";
    return "SILVER";
  };

  const getPlanIcon = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "GOLD":
        return <Crown className="h-5 w-5 text-primary" />;
      case "DIAMOND":
        return <Sparkles className="h-5 w-5 text-[#D946EF]" />;
      default:
        return <Zap className="h-5 w-5 text-slate-650" />;
    }
  };

  const getPlanGradient = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "GOLD":
        return "from-primary/20 via-primary/5 to-transparent border-primary/30 shadow-primary/5";
      case "DIAMOND":
        return "from-[#D946EF]/20 via-[#D946EF]/5 to-transparent border-[#D946EF]/30 shadow-[#D946EF]/5";
      default:
        return "from-slate-500/20 via-slate-500/5 to-transparent border-slate-500/30 shadow-black/20";
    }
  };

  const getPlanBadge = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "GOLD":
        return "Khuyên dùng ✨";
      case "DIAMOND":
        return "Doanh nghiệp 🔥";
      default:
        return "Cơ bản";
    }
  };

  const getPlanFeatures = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "GOLD":
        return [
          "Đẩy tin đăng tự động lên đầu bảng tin tìm kiếm",
          "AI phân tích Renter tương thích cao >90%",
          "Huy hiệu Chủ nhà Pro nổi bật màu vàng",
          "Khai báo số lượng phòng: Không giới hạn",
          "Ưu tiên hỗ trợ CSKH & Kỹ thuật VIP 24/7"
        ];
      case "DIAMOND":
        return [
          "Cam kết hoàn tiền trong 7 ngày nếu không khớp",
          "Chuyên viên hỗ trợ riêng 1-1 ghép đôi",
          "Được ghim tin nổi bật (Banner HOT đầu trang)",
          "Hỗ trợ VIP 24/7 bất kể lễ Tết",
          "Báo cáo xu hướng & số liệu phân tích chuyên sâu"
        ];
      default:
        return [
          "Tối đa 5 tin đăng phòng hoạt động cùng lúc",
          "Đẩy tin lên đầu trang thủ công hàng ngày",
          "Bộ lọc Renter cơ bản (Ngân sách, Vị trí)",
          "Hỗ trợ kỹ thuật qua hotline giờ hành chính"
        ];
    }
  };

  const getPlanTitle = (detail: SubscriptionDetail & { subscription?: Subscription }) => {
    if (detail.subscription?.sub_title) {
      return detail.subscription.sub_title;
    }
    const matched = availablePlans.find(p => p.id === detail.sub_id);
    return matched ? matched.sub_title : `Gói dịch vụ #${detail.sub_id}`;
  };

  const getDisplayPrice = (plan: Subscription) => {
    const planType = normalizePlanType(plan.sub_type);
    if (billingCycle === "yearly") {
      let monthlyPrice = plan.sub_price;
      if (planType === "SILVER") monthlyPrice = 139000;
      else if (planType === "GOLD") monthlyPrice = 279000;
      else if (planType === "DIAMOND") monthlyPrice = 489000;
      return monthlyPrice;
    }
    return plan.sub_price;
  };

  // Subscribe package handler
  const handleSubscribe = (plan: Subscription) => {
    const displayPrice = getDisplayPrice(plan);
    const subscribePayload = {
      ...plan,
      sub_price: billingCycle === "yearly" ? displayPrice * 12 : plan.sub_price,
      sub_title: billingCycle === "yearly" ? `${plan.sub_title} (12 Tháng)` : plan.sub_title,
      sub_time: billingCycle === "yearly" ? "12 Tháng" : plan.sub_time
    };

    setCheckoutPlan(subscribePayload);
    router.push(`/order?subscription_id=${plan.id}`);
  };

  // Cancel subscription handler
  const handleCancelSubscription = async (userSubId: number, planName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn hủy tự động gia hạn gói cước "${planName}"? Các quyền lợi VIP sẽ bị chấm dứt khi hết hạn.`)) {
      return;
    }
    try {
      const res = await SubscriptionApi.cancel_subscription(userSubId);
      if (res && res.code === 200) {
        toast.success("Đã hủy tự động gia hạn thành công.");
        fetchSubscriptionStatus();
      } else {
        toast.error(res?.message || "Hủy gia hạn không thành công.");
      }
    } catch (err: any) {
      console.error("Failed to cancel subscription:", err);
      toast.error(err?.response?.data?.message || "Giao dịch không thành công. Vui lòng thử lại!");
    }
  };

  const activeSubDetail = userSubscriptions.find(d => d.is_active);
  const activePlanTitle = activeSubDetail ? getPlanTitle(activeSubDetail) : "";

  return (
    <div className="space-y-10 animate-fade-in text-foreground relative">
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      {/* 1. Header Title */}
      <div className="space-y-1.5 border-b border-slate-200 pb-6 text-left relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
          <CreditCard className="h-3.5 w-3.5" />
          Hạng hội viên & cước phí
        </div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
          Vận hành gói cước chủ nhà
        </h1>
        <p className="text-xs sm:text-sm text-slate-650 font-medium font-body leading-relaxed max-w-xl">
          Nâng cấp quyền lợi Pro để tăng hiệu suất tiếp cận người tìm phòng, mở rộng quy mô hiển thị bài đăng và in hóa đơn giao dịch.
        </p>
      </div>

      {isLoading ? (
        /* ── LOADING SKELETON ── */
        <div className="h-72 flex flex-col items-center justify-center gap-4 bg-card/20 border border-slate-200 rounded-[2.5rem] animate-pulse">
          <Compass className="h-8 w-8 text-[#FBBF24] animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-650 font-body">
            Đang xác minh lịch sử tài khoản...
          </span>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* ── 2a. ACTIVE SUBSCRIBER CARD ── */}
          {hasActiveSub && activeSubDetail && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] bg-card border border-slate-200 p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between lg:items-center gap-8 z-10"
            >
              {/* Spotlight animated blur node */}
              <div className="absolute top-[-50%] right-[-10%] w-[45%] h-[120%] rounded-full bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-[80px] pointer-events-none animate-pulse" />

              <div className="space-y-6 flex-1 text-left">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[8px] font-black uppercase bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full shadow-md animate-pulse flex items-center gap-1 font-heading">
                      <Crown className="h-3 w-3 fill-current text-primary" /> Active Member
                    </span>
                    <span className="text-[8px] font-black uppercase bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full shadow-sm font-heading">
                      Đang hoạt động
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight font-heading">
                    {activePlanTitle}
                  </h2>
                  
                  <p className="text-xs text-slate-650 font-body max-w-xl leading-relaxed">
                    Tài khoản của bạn đã được nâng cấp lên hạng cước Chủ nhà cao cấp. Bài viết của bạn sẽ được ưu tiên xuất hiện đầu tiên trên bảng tin so khớp, và kích hoạt đầy đủ hệ thống AI để giới thiệu Renter tương thích.
                  </p>
                </div>

                <hr className="border-slate-200" />

                {/* Pricing details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-semibold">
                  <div className="space-y-1 text-left">
                    <span className="text-[8px] font-black text-slate-650 uppercase tracking-widest block font-body">Biểu phí định kỳ</span>
                    <span className="text-sm font-black text-primary">
                      {activeSubDetail.sub_id ? formatVND(userSubscriptions.find(s => s.id === activeSubDetail.id)?.sub_id === 1 ? 199000 : 1668000) : "Nạp xu gia hạn"}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <span className="text-[8px] font-black text-slate-650 uppercase tracking-widest block font-body">Chu kỳ tiếp theo</span>
                    <span className="text-sm font-black text-slate-700 font-body">{formatDate(activeSubDetail.time_end)}</span>
                  </div>
                  
                  <div className="space-y-1 text-left col-span-2 sm:col-span-1">
                    <span className="text-[8px] font-black text-slate-650 uppercase tracking-widest block font-body">Kênh thụ hưởng</span>
                    <span className="text-sm font-black text-slate-700">Ví xu hệ thống</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-fit self-stretch lg:self-center justify-center z-10">
                {upgradeInfo && upgradeInfo.can_upgrade && upgradeInfo.higher_packages.length > 0 && (
                  <button
                    onClick={() => {
                      setShowUpgradeSection(true);
                      setTimeout(() => {
                        const element = document.getElementById("upgrade-section");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        } else {
                          toast.info("Vui lòng cuộn xuống để xem các gói nâng cấp!");
                        }
                      }, 100);
                    }}
                    className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 active:scale-95"
                  >
                    <Sparkles className="h-4 w-4 fill-current text-slate-900 animate-pulse" />
                    Nâng cấp gói cước
                  </button>
                )}
                
                <button
                  onClick={() => handleCancelSubscription(activeSubDetail.id!, activePlanTitle)}
                  className="h-12 px-6 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider cursor-pointer border border-red-500/10 transition-all text-center flex items-center justify-center active:scale-95"
                >
                  Hủy gia hạn tự động
                </button>
              </div>
            </motion.div>
          )}

          {/* ── 2b. UPGRADE RECOMMENDATION SECTION ── */}
          {hasActiveSub && showUpgradeSection && upgradeInfo && upgradeInfo.can_upgrade && upgradeInfo.higher_packages.length > 0 && (
            <div id="upgrade-section" className="space-y-6 bg-card/20 border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden backdrop-blur-xl text-left z-10 shadow-2xl">
              {/* Glowing background */}
              <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-tr from-[#D946EF]/10 via-[#F59E0B]/5 to-transparent blur-[90px] pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                <div className="space-y-1.5">
                  <h2 className="text-xl font-black text-primary flex items-center gap-2 font-heading">
                    <Sparkles className="h-5 w-5 text-[#D946EF] animate-pulse" />
                    Nâng cấp Trải Nghiệm Chủ Nhà Pro
                  </h2>
                  <p className="text-xs text-slate-405 font-medium font-body max-w-xl leading-relaxed">
                    Bạn đang sử dụng gói <strong className="text-[#FBBF24]">{activePlanTitle}</strong>. Hãy nâng cấp lên gói cao hơn để sở hữu những đặc quyền tối thượng!
                  </p>
                </div>

                {/* Switch Billing Cycle Toggle */}
                <div className="bg-background p-1 rounded-2xl flex items-center border border-slate-200 shadow-inner self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      billingCycle === "monthly"
                        ? "bg-white/10 text-[#FBBF24] shadow-sm"
                        : "text-slate-650 hover:text-slate-350"
                    }`}
                  >
                    Hàng tháng
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                      billingCycle === "yearly"
                        ? "bg-white/10 text-[#FBBF24] shadow-sm"
                        : "text-slate-650 hover:text-slate-350"
                    }`}
                  >
                    Hàng năm
                    <span className="bg-[#F97316] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-heading">
                      <Gift className="h-2 w-2" />
                      -30%
                    </span>
                  </button>
                </div>
              </div>

              {loadingUpgrade ? (
                <div className="h-44 flex flex-col items-center justify-center gap-3">
                  <Compass className="h-7 w-7 text-primary animate-spin" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-555 font-body">
                    Đang đối chiếu các gói nâng cấp...
                  </span>
                </div>
              ) : (
                /* Higher plans cards layout */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4 relative z-10">
                  {upgradeInfo.higher_packages.map((plan) => {
                    const planType = normalizePlanType(plan.sub_type);
                    const isGold = planType === "GOLD";
                    const isDiamond = planType === "DIAMOND";
                    const gradient = getPlanGradient(plan.sub_type);
                    const badge = getPlanBadge(plan.sub_type);
                    const displayPrice = getDisplayPrice(plan);
                    const originalMonthlyPrice = plan.sub_price;
                    
                    return (
                      <motion.div
                        key={plan.id}
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`relative rounded-[2rem] border bg-card/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg group cursor-pointer ${gradient}`}
                      >
                        {/* Badge */}
                        <span className={`absolute -top-3 right-6 rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest text-white shadow-md ${
                          isGold 
                            ? "bg-primary" 
                            : isDiamond 
                              ? "bg-fuchsia-500" 
                              : "bg-slate-400"
                        }`}>
                          {badge}
                        </span>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5 text-left font-heading">
                              <h3 className="font-extrabold text-sm text-primary group-hover:text-white transition-colors">
                                {plan.sub_title}
                              </h3>
                              <span className="text-[8px] uppercase font-black tracking-widest text-slate-650 block font-body">
                                Thời hạn: {billingCycle === "yearly" ? "12 Tháng" : plan.sub_time}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                              {getPlanIcon(plan.sub_type)}
                            </div>
                          </div>

                          {/* Display Pricing details */}
                          <div className="space-y-0.5 text-left">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-slate-800 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text">
                                {formatVND(displayPrice)}
                              </span>
                              <span className="text-[9px] text-slate-650 font-bold uppercase tracking-widest">
                                / tháng
                              </span>
                            </div>
                            {billingCycle === "yearly" ? (
                              <div className="space-y-0.5 text-[8px] font-bold">
                                <span className="text-slate-650 uppercase tracking-wider block">
                                  Thanh toán định kỳ {formatVND(displayPrice * 12)} / năm
                                </span>
                                <span className="text-emerald-400 uppercase tracking-wider block">
                                  Tiết kiệm {formatVND((originalMonthlyPrice - displayPrice) * 12)} / năm
                                </span>
                              </div>
                            ) : (
                              isDiamond && (
                                <span className="text-[8px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                                  Tiết kiệm ~120.000đ / tháng
                                </span>
                              )
                            )}
                          </div>

                          <p className="text-[10px] text-slate-650 leading-relaxed font-medium text-left font-body">
                            {plan.sub_description}
                          </p>

                          <hr className="border-slate-200" />

                          {/* Features checklist */}
                          <ul className="space-y-2 text-[10px] text-slate-650 font-body font-medium text-left">
                            {getPlanFeatures(plan.sub_type).map((feature, idx) => (
                              <li key={idx} className="flex gap-2 items-start leading-tight">
                                <div className="h-4.5 w-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 border border-slate-200 text-slate-650">
                                  <Check className="h-2.5 w-2.5" />
                                </div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => handleSubscribe(plan)}
                          className="w-full mt-6 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-slate-900 hover:brightness-105 active:scale-95"
                        >
                          Nâng cấp gói ngay
                          <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── 2c. ALL AVAILABLE PACKAGES GRID ── */}
          <div className="space-y-6 bg-card/20 border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden backdrop-blur-xl text-left z-10 shadow-2xl">
            {/* Background glowing iridescent node */}
            <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-tr from-[#D946EF]/10 via-[#F59E0B]/5 to-transparent blur-[90px] pointer-events-none" />

            {/* Pricing header controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-primary flex items-center gap-2 font-heading">
                  <Crown className="h-5 w-5 text-[#FBBF24] animate-pulse" />
                  {hasActiveSub ? "Các Gói Cước Chủ Nhà Roomie" : "Nâng cấp Gói hội viên Chủ nhà"}
                </h2>
                <p className="text-xs text-slate-650 font-medium font-body max-w-xl leading-relaxed">
                  Đăng tin phòng không giới hạn, đẩy tin tự động, mở khóa toàn bộ tiêu chí so khớp của Renter và hỗ trợ kỹ thuật 24/7.
                </p>
              </div>

              {/* Switch Billing Cycle Toggle */}
              <div className="bg-background p-1 rounded-2xl flex items-center border border-slate-200 shadow-inner self-start md:self-center">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-white/10 text-[#FBBF24] shadow-sm"
                      : "text-slate-650 hover:text-slate-350"
                  }`}
                >
                  Hàng tháng
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                    billingCycle === "yearly"
                      ? "bg-white/10 text-[#FBBF24] shadow-sm"
                      : "text-slate-650 hover:text-slate-350"
                  }`}
                >
                  Hàng năm
                  <span className="bg-[#F97316] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-heading">
                    <Gift className="h-2 w-2" />
                    -30%
                  </span>
                </button>
              </div>
            </div>

            {loadingPlans ? (
              <div className="h-44 flex flex-col items-center justify-center gap-3">
                <Compass className="h-7 w-7 text-primary animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-555 font-body">
                  Đang đối chiếu bảng giá chủ nhà...
                </span>
              </div>
            ) : (
              /* Premium plans cards layout */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4 relative z-10">
                {availablePlans.map((plan) => {
                  const planType = normalizePlanType(plan.sub_type);
                  const isGold = planType === "GOLD";
                  const isDiamond = planType === "DIAMOND";
                  const gradient = getPlanGradient(plan.sub_type);
                  const badge = getPlanBadge(plan.sub_type);
                  const displayPrice = getDisplayPrice(plan);
                  const originalMonthlyPrice = plan.sub_price;
                  
                  return (
                    <motion.div
                      key={plan.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`relative rounded-[2rem] border bg-card/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg group cursor-pointer ${gradient}`}
                    >
                      {/* Badge */}
                      <span className={`absolute -top-3 right-6 rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-md ${
                        isGold 
                          ? "bg-primary text-white" 
                          : isDiamond 
                            ? "bg-fuchsia-400" 
                            : "bg-slate-400"
                      }`}>
                        {badge}
                      </span>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5 text-left font-heading">
                            <h3 className="font-extrabold text-sm text-primary group-hover:text-white transition-colors">
                              {plan.sub_title}
                            </h3>
                            <span className="text-[8px] uppercase font-black tracking-widest text-slate-555 block font-body">
                              Thời hạn: {billingCycle === "yearly" ? "12 Tháng" : plan.sub_time}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                            {getPlanIcon(plan.sub_type)}
                          </div>
                        </div>

                        {/* Display Pricing details */}
                        <div className="space-y-0.5 text-left">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-800 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text">
                              {formatVND(displayPrice)}
                            </span>
                            <span className="text-[9px] text-slate-650 font-bold uppercase tracking-widest">
                              / tháng
                            </span>
                          </div>
                          {billingCycle === "yearly" ? (
                            <div className="space-y-0.5 text-[8px] font-bold">
                              <span className="text-slate-650 uppercase tracking-wider block">
                                Thanh toán định kỳ {formatVND(displayPrice * 12)} / năm
                              </span>
                              <span className="text-emerald-400 uppercase tracking-wider block">
                                Tiết kiệm {formatVND((originalMonthlyPrice - displayPrice) * 12)} / năm
                              </span>
                            </div>
                          ) : (
                            isDiamond && (
                              <span className="text-[8px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                                Tiết kiệm ~120.000đ / tháng
                              </span>
                            )
                          )}
                        </div>

                        <p className="text-[10px] text-slate-650 leading-relaxed font-medium text-left font-body">
                          {plan.sub_description}
                        </p>

                        <hr className="border-slate-200" />

                        {/* Features checklist */}
                        <ul className="space-y-2 text-[10px] text-slate-650 font-body font-medium text-left">
                          {getPlanFeatures(plan.sub_type).map((feature, idx) => (
                            <li key={idx} className="flex gap-2 items-start leading-tight">
                              <div className="h-4.5 w-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 border border-slate-200 text-slate-650">
                                <Check className="h-2.5 w-2.5" />
                              </div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSubscribe(plan)}
                        className="w-full mt-6 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-slate-900 hover:brightness-105 active:scale-95"
                      >
                        Kích hoạt gói ngay
                        <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. Invoices Logs Table List */}
      <div className="space-y-4 relative z-10">
        <h3 className="font-heading text-md font-bold text-slate-700 text-left">Lịch sử hóa đơn giao dịch</h3>
        
        {loadingHistory ? (
          <div className="h-32 flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-card/20 animate-pulse">
            <Compass className="h-6 w-6 text-primary animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-555 font-body">
              Đang tải lịch sử giao dịch...
            </span>
          </div>
        ) : userSubscriptions.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-card/20 p-10 text-center space-y-4 max-w-md mx-auto">
            <Info className="h-10 w-10 text-slate-650 animate-pulse mx-auto" />
            <h3 className="text-sm font-bold text-slate-205">Chưa có hóa đơn nào</h3>
            <p className="text-xs text-slate-650 leading-relaxed font-body">
              Bạn chưa thực hiện bất kỳ giao dịch nạp và đăng ký gói cước nào trên hệ thống Roomie.
            </p>
          </div>
        ) : (
          /* Ledger Table */
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 shadow-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-650 font-body">
                  <th className="py-4 px-6">Mã hóa đơn</th>
                  <th className="py-4 px-6">Ngày đăng ký</th>
                  <th className="py-4 px-6">Gói hội viên</th>
                  <th className="py-4 px-6">Thời lượng</th>
                  <th className="py-4 px-6">Ngày hết hạn</th>
                  <th className="py-4 px-6">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-slate-600">
                {userSubscriptions.map((inv) => {
                  const matchedPlan = availablePlans.find(p => p.id === inv.sub_id);
                  const planTitle = getPlanTitle(inv);
                  const planTime = (inv as any).subscription?.sub_time || matchedPlan?.sub_time || "Theo chu kỳ";
                  return (
                    <tr key={inv.id} className="hover:bg-slate-100 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-650 font-bold">RM-SUB-{inv.id}</td>
                      <td className="py-4 px-6 text-slate-650 font-medium font-body">{formatDate(inv.created_at)}</td>
                      <td className="py-4 px-6 font-extrabold text-slate-700">{planTitle}</td>
                      <td className="py-4 px-6 text-slate-650 font-medium">{planTime}</td>
                      <td className="py-4 px-6 text-slate-650 font-medium font-body">{formatDate(inv.time_end)}</td>
                      <td className="py-4 px-6">
                        {inv.is_active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-400">
                            Thành công
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[9px] font-black uppercase text-slate-650">
                            Hết hạn
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
      </div>

      {/* 5. Help & Support callout box */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex gap-3 text-slate-650 items-start text-xs font-body font-medium text-left z-10 relative">
        <HelpCircle className="h-5 w-5 text-slate-650 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-700 block">Bạn cần hỗ trợ về hóa đơn giao dịch?</span>
          <p className="leading-relaxed font-body text-slate-650">
            Nếu phát hiện bất kỳ sai sót nào trong giao dịch thanh toán hoặc muốn nhận hóa đơn giá trị gia tăng (VAT), vui lòng liên hệ ngay với bộ phận hỗ trợ Roomie Landlord qua hotline <strong className="text-slate-700">1900 6868</strong> hoặc email <strong className="text-slate-700">landlord-support@roomie.vn</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
