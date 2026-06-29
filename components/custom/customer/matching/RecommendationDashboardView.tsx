"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  Crown,
  Sparkles,
  X,
  Info,
  Heart,
  Coins,
  MapPin,
  Clock,
  Edit3,
  Phone,
  ExternalLink,
  Compass,
  MessageSquare,
} from "lucide-react";
import SubscriptionModal from "./SubscriptionModal";
import MatchingCard from "./matching_item/UserCard";
import { Button } from "@/components/ui/button";
import formatVND from "@/utils/priceUtils";
import { useMatchingStore } from "@/stores/matchingStore";
import { toast } from "sonner";

interface RecommendationDashboardViewProps {
  hasActiveSub: boolean | null;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  setIsEditingPreference: (editing: boolean) => void;
  budget_min: number;
  budget_max: number;
  sleep_time: number;
  district: string;
  cleanliness_level: number;
}

export default function RecommendationDashboardView({
  hasActiveSub,
  isSubscriptionModalOpen,
  setIsSubscriptionModalOpen,
  setIsEditingPreference,
  budget_min,
  budget_max,
  sleep_time,
  district,
  cleanliness_level,
}: RecommendationDashboardViewProps) {
  const [activeTab, setActiveTab] = React.useState<"deck" | "saved">("deck");
  const { savedMatches, fetchSavedMatches } = useMatchingStore();

  React.useEffect(() => {
    fetchSavedMatches();
  }, [fetchSavedMatches]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
      {/* Background Aesthetic Decorators */}
      <div className="absolute top-0 left-0 right-0 h-125 bg-[linear-gradient(to_bottom,rgba(193,68,14,0.04),transparent)] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/3 blur-[120px] pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/4 blur-[100px] pointer-events-none animate-[pulse_10s_infinite_2s]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C1440E04_1px,transparent_1px),linear-gradient(to_bottom,#C1440E04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-left space-y-2 max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
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
              className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
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
            {hasActiveSub ? (
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
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
                  Hệ thống phân tích chéo chênh lệch lối sống và khả năng tài
                  chính của bạn với các ứng viên khác để tìm ra roommate tương
                  thích nhất.
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
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        AI So Khớp Đa Chiều
                      </p>
                      <p className="text-muted-foreground leading-normal mt-0.5">
                        So sánh giờ ngủ nghỉ, độ vệ sinh, thói quen hút thuốc,
                        và nuôi thú cưng.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start text-xs font-body">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Tương Tác Vuốt Thẻ
                      </p>
                      <p className="text-muted-foreground leading-normal mt-0.5">
                        Vuốt phải (Like) để gửi kết nối, vuốt trái (Pass) để
                        bỏ qua gợi ý nhanh chóng.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start text-xs font-body">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Kết Nối Ẩn Danh An Toàn
                      </p>
                      <p className="text-muted-foreground leading-normal mt-0.5">
                        Trò chuyện bảo mật qua hệ thống Roomie chat mà không
                        cần lộ Zalo hay SĐT cá nhân.
                      </p>
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

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div className="flex items-center gap-2 bg-white/60 dark:bg-stone-850 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                  <Coins className="h-4 w-4 text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block font-body">
                      Ngân sách
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {formatVND(budget_min)} - {formatVND(budget_max)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/60 dark:bg-stone-850 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                  <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block font-body">
                      Khu vực
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {district || "Bất kỳ"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/60 dark:bg-stone-850 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                  <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block font-body">
                      Giờ ngủ nghỉ
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      ~ {sleep_time}:00
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/60 dark:bg-stone-850 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
                  <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 block font-body">
                      Độ sạch sẽ
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      Cấp {cleanliness_level}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CENTER / RIGHT COLUMN: Interactive Recommendation Deck / Saved Matches */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-7 flex flex-col items-center w-full space-y-4"
          >
            {/* Premium Tab Switcher */}
            <div className="flex bg-slate-100/80 dark:bg-stone-800/80 p-1 rounded-2xl border border-slate-200/50 dark:border-white/5 w-full max-w-lg shadow-sm">
              <button
                onClick={() => setActiveTab("deck")}
                className={`flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                  activeTab === "deck"
                    ? "bg-white dark:bg-stone-700 text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Gợi ý Roommate
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex-1 py-2.5 text-[11px] font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                  activeTab === "saved"
                    ? "bg-white dark:bg-stone-700 text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Đã Lưu ({savedMatches.length})
              </button>
            </div>

            <div className="w-full max-w-lg rounded-[2.5rem] border border-white/40 bg-white/30 dark:bg-stone-900/30 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center min-h-[500px]">
              {activeTab === "deck" ? (
                <MatchingCard />
              ) : (
                <SavedMatchesList />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const SavedMatchesList = () => {
  const { savedMatches, loadingSavedMatches } = useMatchingStore();

  if (loadingSavedMatches) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 space-y-4 py-12 w-full">
        <Compass className="h-10 w-10 text-primary animate-spin" />
        <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse font-body">
          Đang tải danh sách ứng viên đã lưu...
        </p>
      </div>
    );
  }

  if (savedMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center flex-1 p-6 space-y-4 py-16 w-full">
        <div className="h-14 w-14 rounded-full bg-slate-100/50 dark:bg-stone-850 flex items-center justify-center text-slate-400">
          <Heart className="h-6 w-6 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-white">
            Chưa có ứng viên đã lưu
          </h4>
          <p className="text-[11px] text-muted-foreground font-body leading-relaxed max-w-[240px]">
            Hãy vuốt phải hoặc bấm nút Trái Tim trên thẻ gợi ý để lưu những ứng viên phù hợp với bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
      {savedMatches.map((item, idx) => {
        const scorePct = item.score ? (item.score <= 1 ? Math.round(item.score * 100) : Math.round(item.score)) : 0;
        const roleText = item.user.role === "LANDLORD" ? "Chủ nhà" : "Khách thuê";
        const firstChar = item.user.full_name ? item.user.full_name.split(" ").slice(-1)[0][0] : "?";
        
        const gradients = [
          "from-rose-500 to-orange-500",
          "from-cyan-500 to-blue-500",
          "from-emerald-500 to-teal-500",
          "from-violet-500 to-purple-500",
        ];
        const avatarGradient = gradients[idx % gradients.length];
        const profile = item.matching_profile || {};

        return (
          <div
            key={item.saved_id || idx}
            className="flex items-start gap-4 p-4 bg-white/70 dark:bg-stone-900/60 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-md transition-all duration-300 w-full"
          >
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${avatarGradient} text-white font-heading font-black text-sm flex items-center justify-center shadow-sm shrink-0`}>
              {firstChar}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5 text-left">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-heading text-xs font-bold text-slate-800 dark:text-white truncate">
                  {item.user.full_name}
                </h4>
                {scorePct > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30 px-1.5 py-0.5 rounded-md shrink-0">
                    {scorePct}% hợp
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                <span className="inline-flex text-[9px] font-bold text-slate-500 bg-slate-100/50 dark:bg-stone-850 px-1.5 py-0.5 rounded">
                  {roleText}
                </span>
                <span className="inline-flex text-[9px] font-bold text-slate-500 bg-slate-100/50 dark:bg-stone-850 px-1.5 py-0.5 rounded">
                  Q. {item.address?.district || "Bất kỳ"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  onClick={() => {
                    toast.success(`Đang mở cuộc trò chuyện trực tuyến với ${item.user.full_name}`);
                  }}
                  className="h-7 px-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-750 text-slate-650 dark:text-slate-350 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-sm shrink-0"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Chat
                </Button>

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="h-7 px-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-750 text-slate-650 dark:text-slate-350 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-sm shrink-0"
                  >
                    <Phone className="h-3 w-3 text-slate-455" />
                    Gọi điện
                  </a>
                )}

                {profile.zalo && (
                  <a
                    href={`https://zalo.me/${profile.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 px-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary text-primary hover:text-white text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all duration-300 shadow-sm shrink-0"
                  >
                    Zalo
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}

                {profile.facebook && (
                  <a
                    href={profile.facebook.startsWith('http') ? profile.facebook : `https://${profile.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-7 px-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-500 hover:text-white text-indigo-650 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 transition-all duration-300 shadow-sm shrink-0"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    FB
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
