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
} from "lucide-react";
import SubscriptionModal from "./SubscriptionModal";
import MatchingCard from "./matching_item/UserCard";
import { Button } from "@/components/ui/button";
import formatVND from "@/utils/priceUtils";

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
