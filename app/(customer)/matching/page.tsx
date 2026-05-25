/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  HelpCircle,
  HeartHandshake,
  Lock,
  Coins,
  MapPin,
  Scaling,
  Clock,
  Cigarette,
  CigaretteOff,
  PawPrint,
  Volume2,
  Edit3,
  MessageSquare,
  ChevronRight,
  Compass,
  CheckCircle,
  UserCheck,
  X,
  Heart,
  Info,
  RefreshCw,
  Crown,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useMatchingStore } from "@/stores/matchingStore";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import SubscriptionModal from "@/components/custom/customer/matching/SubscriptionModal";
import UserPreference from "@/components/custom/customer/matching/user_preference/UserPreference";
import MatchingCard from "@/components/custom/customer/matching/matching_item/UserCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import formatVND from "@/utils/priceUtils";

export default function MatchingPage() {
  const [mounted, setMounted] = React.useState(false);
  const { isAuthenticated } = useAuthStore();
  const { isSubscribed } = useSubscriptionStore();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = React.useState(false);
  const {
    hasPreference,
    isEditingPreference,
    checkPreferenceStatus,
    setIsEditingPreference,
    budget_min,
    budget_max,
    sleep_time,
    smoking,
    district,
    noise_tolerance,
    cleanliness_level,
    pet_friendly,
    area,
    loadingPreferences,
    fetchMatches,
    matches,
    loadingMatches,
  } = useMatchingStore();



  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && isAuthenticated) {
      checkPreferenceStatus();
    }
  }, [mounted, isAuthenticated, checkPreferenceStatus]);

  React.useEffect(() => {
    if (mounted && isAuthenticated && hasPreference === true) {
      fetchMatches();
    }
  }, [mounted, isAuthenticated, hasPreference, fetchMatches]);

  // Delay opening the modal slightly when landing
  React.useEffect(() => {
    if (mounted && isAuthenticated && !isSubscribed) {
      const timer = setTimeout(() => {
        setIsSubscriptionModalOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, isAuthenticated, isSubscribed]);


  // 1. Hydration loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Compass className="h-10 w-10 text-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-semibold">
            Đang chuẩn bị không gian...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state display
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[linear-gradient(to_bottom,rgba(193,68,14,0.04),transparent)] pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/3 blur-[120px] pointer-events-none animate-[pulse_8s_infinite]" />
        <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/4 blur-[100px] pointer-events-none animate-[pulse_10s_infinite_2s]" />

        <div className="mx-auto max-w-xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2.5rem] border border-white/40 bg-card/45 backdrop-blur-md p-10 shadow-2xl shadow-primary/5 space-y-8 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <Lock className="h-7 w-7" />
            </div>
            <div className="space-y-3">
              <h2 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
                Tìm Bạn Ghép Hoàn Hảo
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-body">
                Tính năng so khớp roommate thông minh của chúng tôi yêu cầu tài
                khoản để thiết lập lối sống, giờ giấc sinh hoạt và tìm kiếm
                người phù hợp nhất.
              </p>
            </div>
            <Link href="/auth/login" className="block w-full">
              <Button className="w-full h-12 font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-primary rounded-xl cursor-pointer hover:shadow-lg active:scale-95 transition-all">
                Đăng nhập ngay
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // 3. Store checking / loading state
  if (hasPreference === null || loadingPreferences) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden py-16 px-4 font-sans flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm">
          <div className="relative w-20 h-20 mx-auto">
            <Compass className="h-20 w-20 text-primary animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-slate-800 animate-pulse">
              Đang xác minh hồ sơ tiêu chí...
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chúng tôi đang đọc thông tin thiết lập phong cách sống từ tài
              khoản của bạn để tối ưu hóa gợi ý.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. If hasPreferences is true, show Roommate Recommendation Dashboard
  if (hasPreference === true && !isEditingPreference) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} />
        {/* Background Aesthetic Decorators */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[linear-gradient(to_bottom,rgba(193,68,14,0.04),transparent)] pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/3 blur-[120px] pointer-events-none animate-[pulse_8s_infinite]" />
        <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/4 blur-[100px] pointer-events-none animate-[pulse_10s_infinite_2s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C1440E04_1px,transparent_1px),linear-gradient(to_bottom,#C1440E04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10 space-y-8">
          {/* Header */}
          <div className="text-left space-y-2 max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary font-body"
              >
                <HeartHandshake className="h-3.5 w-3.5" />
                So Khớp Roommate AI
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight"
              >
                Tìm Bạn Đồng Hành Hoàn Hảo
              </motion.h1>
            </div>

            {/* Premium Upgrade Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3 self-start sm:self-center shrink-0"
            >
              {isSubscribed ? (
                <div className="flex items-center gap-2.5 rounded-2xl border border-amber-400 bg-amber-500/10 px-5 py-3 text-xs font-extrabold text-amber-700 dark:text-amber-400 shadow-md shadow-amber-500/5">
                  <Crown className="h-4 w-4 text-amber-500 animate-pulse" />
                  <span>Hội Viên Premium Active</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsSubscriptionModalOpen(true)}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>Nâng cấp Premium</span>
                </button>
              )}
            </motion.div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Feature Introduction & Active Preferences */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Feature Intro Card */}
              <div className="rounded-3xl border border-white/40 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md p-6 shadow-xl space-y-6">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    Roomie Matcher
                  </h3>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    Hệ thống phân tích chéo chênh lệch lối sống và khả năng tài chính của bạn với các ứng viên khác để tìm ra roommate tương thích nhất.
                  </p>
                </div>

                {/* How to use */}
                <div className="space-y-3 pt-2 border-t border-slate-200/50 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-body">
                    Cách thức hoạt động
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start text-xs font-body">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">AI So Khớp Đa Chiều</p>
                        <p className="text-muted-foreground leading-normal mt-0.5">So sánh giờ ngủ nghỉ, độ vệ sinh, thói quen hút thuốc, và nuôi thú cưng.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start text-xs font-body">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Tương Tác Vuốt Thẻ</p>
                        <p className="text-muted-foreground leading-normal mt-0.5">Vuốt phải (Like) để gửi kết nối, vuốt trái (Pass) để bỏ qua gợi ý nhanh chóng.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start text-xs font-body">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Kết Nối Ẩn Danh An Toàn</p>
                        <p className="text-muted-foreground leading-normal mt-0.5">Trò chuyện bảo mật qua hệ thống Roomie chat mà không cần lộ Zalo hay SĐT cá nhân.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gesture Guide */}
                <div className="rounded-2xl bg-slate-50/50 dark:bg-stone-850/50 border border-slate-100 dark:border-white/5 p-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-body">
                    Hướng dẫn vuốt thẻ
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-body font-bold text-slate-650 dark:text-slate-350">
                    <div className="bg-white/80 dark:bg-stone-800 p-2 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-1">
                      <div className="h-6 w-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                        <X className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>Vuốt Trái: Bỏ qua</span>
                    </div>
                    <div className="bg-white/80 dark:bg-stone-800 p-2 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-1">
                      <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
                        <Info className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                      <span>Bấm Info: Chi tiết</span>
                    </div>
                    <div className="bg-white/80 dark:bg-stone-800 p-2 rounded-xl border border-slate-200/50 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-1">
                      <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
                        <Heart className="h-3.5 w-3.5 fill-current text-emerald-500" />
                      </div>
                      <span>Vuốt Phải: Ghép đôi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Preferences Panel */}
              <div className="rounded-3xl border border-white/40 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
                      Tiêu chí tìm roommate của bạn
                    </h3>
                  </div>
                  <Button
                    onClick={() => setIsEditingPreference(true)}
                    className="h-7 px-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary text-primary hover:text-white text-[10px] font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Edit3 className="h-3 w-3" />
                    Cập nhật
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-stone-850 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                    <Coins className="h-4 w-4 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] text-slate-400 block font-body">Ngân sách</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{formatVND(budget_min)} - {formatVND(budget_max)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/60 dark:bg-stone-850 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                    <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] text-slate-400 block font-body">Khu vực</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{district || "Bất kỳ"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/60 dark:bg-stone-850 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                    <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] text-slate-400 block font-body">Giờ ngủ nghỉ</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">~ {sleep_time}:00</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/60 dark:bg-stone-850 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                    <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] text-slate-400 block font-body">Độ sạch sẽ</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">Cấp {cleanliness_level}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CENTER / RIGHT COLUMN: Interactive Recommendation Deck Card (MatchingCard component) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-7 flex justify-center w-full"
            >
              <div className="w-full max-w-lg rounded-[2.5rem] border border-white/40 bg-white/30 dark:bg-stone-900/30 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
                <MatchingCard />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Default state: if hasPreference === false or isEditingPreference is true, show the Preference Setup Form
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} />
      {/* Background Aesthetic Decorators */}
      <div className="absolute top-0 left-0 right-0 h-125 bg-[linear-gradient(to_bottom,rgba(193,68,14,0.04),transparent)] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/3 blur-[120px] pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/4 blur-[100px] pointer-events-none animate-[pulse_10s_infinite_2s]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C1440E04_1px,transparent_1px),linear-gradient(to_bottom,#C1440E04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Container */}
      <div className="mx-auto max-w-5xl relative z-10 space-y-12">
        {/* Editorial Heading Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary font-body"
          >
            <HeartHandshake className="h-3.5 w-3.5" />
            Tìm Bạn Ở Ghép Hoàn Hảo
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
          >
            Tìm Không Gian Hài Hòa, <br />
            <span className="text-primary font-display italic font-medium">
              Bình Yên Bên Bạn Đồng Hành.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-body"
          >
            Chúng tôi hiểu rằng tìm kiếm bạn cùng phòng quan trọng không kém gì
            việc tìm kiếm một căn phòng tốt. Thiết lập các tiêu chuẩn phong cách
            sống bên dưới và để công nghệ AI của chúng tôi làm phần còn lại.
          </motion.p>
        </div>

        {/* Dynamic header toggles back if editing */}
        {isEditingPreference && (
          <div className="max-w-3xl mx-auto flex items-center justify-start">
            <Button
              onClick={() => setIsEditingPreference(false)}
              variant="link"
              className="text-primary font-bold text-xs uppercase tracking-wider hover:underline flex items-center gap-1 px-0"
            >
              <ChevronRight className="h-4 w-4 rotate-180" /> Quay lại danh sách
              gợi ý
            </Button>
          </div>
        )}

        {/* Mounted Form Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full flex justify-center animate-fade-in"
        >
          <UserPreference />
        </motion.div>

        {/* Footer Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-3xl mx-auto rounded-2xl border border-border bg-card/25 p-6 text-center space-y-2"
        >
          <div className="flex justify-center text-primary mb-1">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-body">
            Cách thức hoạt động
          </h4>
          <p className="text-xs text-muted-foreground font-body leading-relaxed max-w-xl mx-auto">
            Hồ sơ tiêu chí của bạn sẽ được so khớp chéo với phong cách sống, giờ
            giấc sinh hoạt và khả năng chi tiêu của các thành viên khác trên
            Roomie để gợi ý những người bạn đồng hành tương thích trên 90%.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
