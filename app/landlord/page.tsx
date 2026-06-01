"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  FileText, 
  Coins, 
  Users, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Zap,
  ChevronRight,
  X,
  Check,
  Crown,
  Info,
  Compass
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import formatVND from "@/utils/priceUtils";
import Link from "next/link";
import { UserApi } from "@/services/api/user";
import { SubscriptionApi } from "@/services/api/subcription";
import { Subscription } from "@/schema/user/subcription";
import { toast } from "sonner";

export default function LandlordDashboardIndex() {

  const { user , setUser , isAuthenticated } = useAuthStore();

  // Subscription States
  const [hasActiveSub, setHasActiveSub] = useState<boolean | null>(null);
  const [activePlanName, setActivePlanName] = useState<string>("");
  const [activePlanEndDate, setActivePlanEndDate] = useState<string>("");
  const [loadingSub, setLoadingSub] = useState(true);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<Subscription[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    // Define an async function inside the effect
    const fetchUser = async () => {
      if (isAuthenticated && !user) {
        try {
          const userData = await UserApi.getMe();
          setUser(userData.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser();
  }, [isAuthenticated, user, setUser]);

  const checkSub = async () => {
    setLoadingSub(true);
    try {
      const res = await SubscriptionApi.check_subscription();
      const active = res && res.code === 200 ? res.data : false;
      setHasActiveSub(active);

      // Fetch user subscriptions to get the active plan detail
      const historyRes = await SubscriptionApi.get_user_subscription();
      if (historyRes && historyRes.code === 200 && Array.isArray(historyRes.data)) {
        const activeDetail = historyRes.data.find(d => d.is_active);
        if (activeDetail) {
          try {
            const plansRes = await SubscriptionApi.get_all_landlord_subscriptions();
            const plans = plansRes?.data || [];
            const matched = plans.find(p => p.id === activeDetail.sub_id);
            setActivePlanName(matched ? matched.sub_title : `Gói dịch vụ #${activeDetail.sub_id}`);
          } catch {
            setActivePlanName(`Gói dịch vụ #${activeDetail.sub_id}`);
          }
          setActivePlanEndDate(activeDetail.time_end);
        }
      }

      // If inactive, pop up the plans modal and fetch available landlord plans
      if (!active) {
        setShowPlansModal(true);
        setLoadingPlans(true);
        try {
          const plansRes = await SubscriptionApi.get_all_landlord_subscriptions();
          if (plansRes && plansRes.code === 200 && Array.isArray(plansRes.data)) {
            setAvailablePlans(plansRes.data);
          }
        } catch (err) {
          console.error("Failed to fetch landlord subscriptions:", err);
        } finally {
          setLoadingPlans(false);
        }
      }
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setHasActiveSub(false);
    } finally {
      setLoadingSub(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkSub();
    }
  }, [isAuthenticated]);

  const handleSubscribe = async (plan: Subscription) => {
    if (!plan.id) return;
    try {
      const res = await SubscriptionApi.subscribe(plan.id);
      if (res && res.code === 200) {
        toast.success(`Kích hoạt thành công gói "${plan.sub_title}"!`);
        setShowPlansModal(false);
        checkSub();
      } else {
        toast.error(res?.message || "Đăng ký gói không thành công.");
      }
    } catch (err: any) {
      console.error("Failed to subscribe plan:", err);
      toast.error(err?.response?.data?.message || "Không thể đăng ký gói. Vui lòng nạp thêm xu hoặc thử lại!");
    }
  };

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
        return <Crown className="h-5 w-5 text-[#F59E0B]" />;
      case "DIAMOND":
        return <Sparkles className="h-5 w-5 text-[#D946EF]" />;
      default:
        return <Zap className="h-5 w-5 text-slate-400" />;
    }
  };

  const getPlanGradient = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "GOLD":
        return "from-[#F59E0B]/20 via-[#F59E0B]/5 to-transparent border-[#F59E0B]/30";
      case "DIAMOND":
        return "from-[#D946EF]/20 via-[#D946EF]/5 to-transparent border-[#D946EF]/30";
      default:
        return "from-slate-500/20 via-slate-500/5 to-transparent border-slate-500/30";
    }
  };

  const getPlanFeatures = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "GOLD":
        return [
          "Đẩy tin đăng tự động lên đầu trang",
          "AI phân tích Renter tương thích >90%",
          "Huy hiệu Chủ nhà Pro nổi bật màu vàng",
          "Khai báo số lượng phòng: Không giới hạn",
          "Ưu tiên hỗ trợ CSKH VIP 24/7"
        ];
      case "DIAMOND":
        return [
          "Cam kết hoàn tiền trong 7 ngày",
          "Chuyên viên hỗ trợ riêng 1-1 ghép đôi",
          "Được ghim tin nổi bật đầu trang",
          "Đặc quyền hỗ trợ VIP 24/7",
          "Báo cáo xu hướng & số liệu phân tích"
        ];
      default:
        return [
          "Tối đa 5 tin đăng hoạt động cùng lúc",
          "Đẩy tin lên đầu trang thủ công hàng ngày",
          "Bộ lọc Renter cơ bản",
          "Hỗ trợ kỹ thuật giờ hành chính"
        ];
    }
  };

  // Mock statistics data
  const stats = [
    {
      label: "Doanh thu tháng này",
      value: 28500000,
      format: "vnd",
      change: "+12.5% so với tháng trước",
      icon: Coins,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      link: "/landlord/statistic"
    },
    {
      label: "Tỷ lệ lấp đầy phòng",
      value: "80%",
      sub: "12 / 15 phòng đã cho thuê",
      change: "Còn trống 3 phòng",
      icon: Home,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      link: "/landlord/rooms"
    },
    {
      label: "Lượt xem tin đăng",
      value: "4,528 Lượt",
      change: "+18% lượng truy cập mới",
      icon: FileText,
      color: "text-sky-500",
      bg: "bg-sky-500/10 border-sky-500/20",
      link: "/landlord/posts"
    },
    {
      label: "Yêu cầu ghép đôi mới",
      value: "8 Renter",
      sub: "Đang chờ bạn phản hồi",
      change: "4 yêu cầu mới hôm nay",
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10 border-violet-500/20",
      pulse: true,
      link: "/landlord/dashboard"
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in text-[#F8FAFC]">
      
      {/* Editorial Header Greeting */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#F59E0B]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Khu vực Chủ nhà Pro
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 leading-tight"
        >
          Xin chào, <span className="bg-linear-to-r from-[#F59E0B] via-[#FBBF24] to-[#8B5CF6] bg-clip-text text-transparent italic font-display">{user?.full_name}</span>
        </motion.h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium font-body max-w-2xl leading-relaxed">
          Chào mừng bạn quay lại hệ thống quản trị Roomie Landlord. Dưới đây là thông số vận hành kinh doanh và tình hình khai thác phòng của bạn trong 30 ngày qua.
        </p>
      </div>

      {/* Grid Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={idx} href={stat.link} className="block">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/5 bg-[#0f172a]/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group cursor-pointer h-full"
              >
                {/* Pulse effect */}
                {stat.pulse && (
                  <span className="absolute top-6 right-6 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      {stat.label}
                    </span>
                    <div className={`p-3 rounded-2xl ${stat.bg} transition-transform group-hover:scale-110`}>
                      <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-100">
                      {stat.format === "vnd" ? formatVND(stat.value as number) : stat.value}
                    </h3>
                    {stat.sub && (
                      <p className="text-[10px] font-bold text-slate-400 font-body">
                        {stat.sub}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-[#FBBF24]">
                  <span>{stat.change}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Subscription Status Banner Section */}
      {loadingSub ? (
        <div className="h-28 rounded-[2.5rem] bg-[#0F172A]/40 border border-white/5 animate-pulse flex items-center justify-center">
          <span className="text-slate-500 text-xs font-semibold">Đang nạp trạng thái cước phí...</span>
        </div>
      ) : hasActiveSub ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-[2.5rem] bg-linear-to-tr from-[#0F172A] via-[#1E293B]/60 to-[#0F172A] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-[-50%] right-[-10%] w-[30%] h-full rounded-full bg-[#F59E0B]/10 blur-[80px] pointer-events-none" />

          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-linear-to-tr from-[#F59E0B]/20 to-[#FBBF24]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shadow-inner shrink-0">
              <Zap className="h-8 w-8 text-[#F59E0B] animate-pulse" />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] px-2 py-0.5 rounded">
                  Active Member
                </span>
                <span className="text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded flex items-center gap-0.5">
                  <ShieldCheck className="h-3 w-3" /> Auto Verified
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-100">{activePlanName || "Gói Chủ Nhà Pro"}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-body flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                Gói cước của bạn đang hoạt động. Ngày hết hạn tiếp theo: <strong className="text-slate-200">{formatDate(activePlanEndDate)}</strong>.
              </p>
            </div>
          </div>

          <Link href="/landlord/subscription">
            <button className="h-12 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-900 text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md shadow-[#F59E0B]/10 cursor-pointer flex items-center gap-1.5 shrink-0 self-start md:self-center">
              Quản lý đăng ký
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-[2.5rem] bg-gradient-to-tr from-amber-500/10 via-[#1E293B]/20 to-amber-500/5 border border-amber-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-[-50%] right-[-10%] w-[30%] h-full rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner shrink-0">
              <Zap className="h-8 w-8 text-amber-400 animate-pulse" />
            </div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase bg-slate-500/10 border border-slate-500/30 text-slate-400 px-2 py-0.5 rounded">
                  Free Member
                </span>
                <span className="text-[9px] font-black uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded flex items-center gap-0.5">
                  <Info className="h-3 w-3" /> Chưa nâng cấp
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-100">Gói Hội Viên Thường (Free Account)</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-body">
                Bạn đang sử dụng quyền lợi miễn phí. Các tính năng AI so khớp và đẩy tin nổi bật bị giới hạn.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPlansModal(true)}
            className="h-12 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#FBBF24] text-slate-900 text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md shadow-[#F59E0B]/10 cursor-pointer flex items-center gap-1.5 shrink-0 self-start md:self-center"
          >
            Nâng cấp ngay
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}

      {/* DYNAMIC LANDLORD PLANS POPUP MODAL */}
      <AnimatePresence>
        {showPlansModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlansModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-4xl rounded-[2.5rem] border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 z-10 text-left text-[#F8FAFC]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPlansModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 mb-6">
                <span className="text-[10px] font-black uppercase text-[#F59E0B] tracking-widest block font-body">
                  Nâng cấp đặc quyền hội viên
                </span>
                <h3 className="text-xl font-black text-slate-100">Kích hoạt Gói cước Landlord VIP</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-body">
                  Chọn gói cước phù hợp nhất với tần suất đăng tin và nhu cầu tìm kiếm khách thuê của bạn.
                </p>
              </div>

              {loadingPlans ? (
                <div className="h-48 flex flex-col items-center justify-center gap-3">
                  <Compass className="h-7 w-7 text-[#F59E0B] animate-spin" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 font-body">
                    Đang nạp dữ liệu gói cước VIP...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch max-h-[60vh] overflow-y-auto pr-1">
                  {availablePlans.map((plan) => {
                    const planType = normalizePlanType(plan.sub_type);
                    const gradient = getPlanGradient(plan.sub_type);
                    const badge = planType === "GOLD" ? "Khuyên dùng ✨" : planType === "DIAMOND" ? "Doanh nghiệp 🔥" : "Cơ bản";
                    
                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-[2rem] border bg-[#0f172a]/60 backdrop-blur-md p-5 flex flex-col justify-between shadow-md transition-all border-white/5 ${gradient}`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-xs text-[#FBBF24]">
                                {plan.sub_title}
                              </h4>
                              <span className="text-[8px] uppercase font-black tracking-widest text-slate-500 block font-body">
                                Thời hạn: {plan.sub_time}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                              {getPlanIcon(plan.sub_type)}
                            </div>
                          </div>

                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-100">
                              {formatVND(plan.sub_price)}
                            </span>
                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                              / chu kỳ
                            </span>
                          </div>

                          <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                            {plan.sub_description}
                          </p>

                          <hr className="border-white/5" />

                          <ul className="space-y-1.5 text-[9px] text-slate-455 font-body font-medium">
                            {getPlanFeatures(plan.sub_type).map((feature, idx) => (
                              <li key={idx} className="flex gap-2 items-start leading-tight">
                                <div className="h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#FBBF24]/10 text-[#FBBF24]">
                                  <Check className="h-2 w-2 stroke-[3]" />
                                </div>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => handleSubscribe(plan)}
                          className="w-full mt-4 py-2.5 px-4 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-slate-900 hover:brightness-105 active:scale-95"
                        >
                          Đăng ký ngay
                          <ArrowRight className="h-3 w-3 text-slate-900" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Box 1: Recent connect requests */}
        <div className="rounded-[2rem] border border-white/5 bg-[#0f172a]/30 backdrop-blur-md p-8 space-y-6">
          <h3 className="font-heading text-md font-bold text-slate-200">Kết nối khách thuê mới nhất</h3>
          <div className="divide-y divide-white/5 space-y-4">
            {[
              { name: "Lê Nguyễn Anh Hùng", match: 94, budget: 4500000, time: "2 giờ trước" },
              { name: "Phạm Minh Hoàng", match: 88, budget: 5000000, time: "Hôm qua" },
              { name: "Nguyễn Thu Thảo", match: 91, budget: 4000000, time: "2 ngày trước" },
            ].map((renter, idx) => (
              <div key={idx} className="flex justify-between items-center pt-4 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-[#8B5CF6]/30 to-[#8B5CF6]/5 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-black flex items-center justify-center">
                    {renter.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">{renter.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium font-body block">
                      Ngân sách: {formatVND(renter.budget)}/tháng • {renter.time}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full">
                  {renter.match}% Khớp
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: Quick Links */}
        <div className="rounded-[2rem] border border-white/5 bg-[#0f172a]/30 backdrop-blur-md p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-heading text-md font-bold text-slate-200">Thao tác nhanh</h3>
            <p className="text-xs text-slate-400 font-medium font-body leading-relaxed">
              Bạn có thể dễ dàng thêm phòng mới, cập nhật bảng giá tiện ích, hoặc đẩy tin đăng để thu hút thêm nhiều renter tương thích nhất.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5">
              Đăng phòng mới
            </button>
            <button className="h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-1.5">
              Đẩy tin nổi bật
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
