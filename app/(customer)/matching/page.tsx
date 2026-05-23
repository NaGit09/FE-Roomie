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
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useMatchingStore } from "@/stores/matchingStore";
import UserPreference from "@/components/custom/customer/matching/user_preference/UserPreference";
import MatchingCard from "@/components/custom/customer/matching/matching_item/UserCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import formatVND from "@/utils/priceUtils";

export default function MatchingPage() {
  const [mounted, setMounted] = React.useState(false);
  const { isAuthenticated } = useAuthStore();
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

  const [connectingId, setConnectingId] = React.useState<string | null>(null);
  const [connectedIds, setConnectedIds] = React.useState<string[]>([]);
  const [cardIndex, setCardIndex] = React.useState(0);
  const [showDetailPopup, setShowDetailPopup] = React.useState(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState<any>(null);
  const [swipeDirection, setSwipeDirection] = React.useState<
    "left" | "right" | null
  >(null);

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

  React.useEffect(() => {
    setCardIndex(0);
  }, [matches, isEditingPreference]);

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
      <div className="min-h-screen bg-background relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 font-sans">
        {/* Background Aesthetic Decorators */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[linear-gradient(to_bottom,rgba(193,68,14,0.04),transparent)] pointer-events-none" />
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/3 blur-[120px] pointer-events-none animate-[pulse_8s_infinite]" />
        <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/4 blur-[100px] pointer-events-none animate-[pulse_10s_infinite_2s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C1440E04_1px,transparent_1px),linear-gradient(to_bottom,#C1440E04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="mx-auto max-w-5xl relative z-10 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary font-body"
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              So Khớp Roommate
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
            >
              Tìm Bạn Đồng Hành Ở Ghép
            </motion.h1>
          </div>

          {/* Bento Grid: Active Preferences Card (Bento Grid Section 1 design spec) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/40 bg-white/40 dark:bg-stone-900/40 backdrop-blur-md p-6 sm:p-8 shadow-xl space-y-6"
          >
            {/* Header row */}
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 pb-4">
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Tiêu Chí Sống Hiện Tại Của Bạn
                </h3>
                <p className="text-xs text-muted-foreground font-body">
                  Hệ thống AI đang so khớp chéo các thông số này để gợi ý roommate phù hợp
                </p>
              </div>
              <Button
                onClick={() => setIsEditingPreference(true)}
                className="h-9 px-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Cập nhật
              </Button>
            </div>

            {/* 8-panel Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Box 1: Budget */}
              <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/80">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Coins className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-body">
                    Khoảng ngân sách
                  </span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold block truncate">
                    {formatVND(budget_min)} - {formatVND(budget_max)}
                  </span>
                </div>
              </div>

              {/* Box 2: District */}
              <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/80">
                <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-body">
                    Khu vực tìm phòng
                  </span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold block truncate">
                    {district || "Bất kỳ"}
                  </span>
                </div>
              </div>

              {/* Box 3: Sleep time */}
              <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/80">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-body">
                    Giờ ngủ nghỉ
                  </span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold block truncate">
                    ~ {sleep_time}:00
                  </span>
                </div>
              </div>

              {/* Box 4: Cleanliness */}
              <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/80">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-body">
                    Độ sạch sẽ tối thiểu
                  </span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold block truncate">
                    Cấp {cleanliness_level}/5
                  </span>
                </div>
              </div>

              {/* Box 5: Noise tolerance */}
              <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/80">
                <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-500 flex items-center justify-center shrink-0">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-body">
                    Độ ồn chấp nhận
                  </span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold block truncate">
                    Cấp độ {noise_tolerance}/5
                  </span>
                </div>
              </div>

              {/* Box 6: Area */}
              <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/80">
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center shrink-0">
                  <Scaling className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-body">
                    Diện tích yêu cầu
                  </span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold block truncate font-body">
                    Từ {area} m² trở lên
                  </span>
                </div>
              </div>

              {/* Box 7: Smoking */}
              <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/80">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center shrink-0">
                  <Cigarette className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-body">
                    Thói quen hút thuốc
                  </span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold block truncate font-body">
                    {smoking ? "Hút thuốc" : "Không hút thuốc"}
                  </span>
                </div>
              </div>

              {/* Box 8: Pet friendly */}
              <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/20 hover:bg-white/80">
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 flex items-center justify-center shrink-0">
                  <PawPrint className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-body">
                    Chấp nhận nuôi thú
                  </span>
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold block truncate font-body">
                    {pet_friendly ? "Cho nuôi thú" : "Không nuôi thú"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Recommendation Deck Card (MatchingCard component) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full flex justify-center mt-6"
          >
            <div className="w-full max-w-lg rounded-[2.5rem] border border-white/40 bg-white/30 dark:bg-stone-900/30 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <MatchingCard />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 5. Default state: if hasPreference === false or isEditingPreference is true, show the Preference Setup Form
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 font-sans">
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
