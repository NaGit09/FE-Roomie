"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake, HelpCircle, ChevronRight } from "lucide-react";
import SubscriptionModal from "./SubscriptionModal";
import UserPreference from "./user_preference/UserPreference";
import { Button } from "@/components/ui/button";

interface PreferenceSetupViewProps {
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  isEditingPreference: boolean;
  setIsEditingPreference: (editing: boolean) => void;
}

export default function PreferenceSetupView({
  isSubscriptionModalOpen,
  setIsSubscriptionModalOpen,
  isEditingPreference,
  setIsEditingPreference,
}: PreferenceSetupViewProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />
      {/* Background Aesthetic Decorators */}
      <div className="absolute top-0 left-0 right-0 h-125 bg-[linear-gradient(to_bottom,rgba(193,68,14,0.04),transparent)] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/3 blur-[120px] pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/4 blur-[100px] pointer-events-none animate-[pulse_10s_infinite_2s]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C1440E04_1px,transparent_1px),linear-gradient(to_bottom,#C1440E04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Container */}
      <div className="mx-auto max-w-5xl relative z-10 space-y-10 sm:space-y-12">
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
            className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
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
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest font-body">
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
