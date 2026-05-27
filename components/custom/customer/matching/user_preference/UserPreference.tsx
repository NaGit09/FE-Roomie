"use client";

import { motion } from "framer-motion";
import { Sparkles, Loader2, CheckCircle, Compass, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUserPreferenceForm } from "@/hooks/matching/useUserPreferenceForm";
import SmokingSwitch from "./SmokingSwitch";
import PetFriendlySwitch from "./PetFriendlySwitch";
import CleanlinessLevel from "./CleanlinessLevel";
import NoiseTolerance from "./NoiseTolerance";
import SLeepTime from "./SLeepTime";
import RangeBudget from "./RangeBudget";
import AddressSelect from "./AddressSelect";
import InputArea from "./InputArea";

export default function UserPreference() {
  const {
    form: {
      formState: { errors },
      setValue,
      register,
    },
    provinces,
    districts,
    selectedProvinceCode,
    loadingProvinces,
    loadingDistricts,
    successSubmitted,
    watchDistrict,
    handleProvinceChange,
    onSubmit,
  } = useUserPreferenceForm();

  if (successSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2.5rem] border border-emerald-500/10 bg-emerald-50/50 backdrop-blur-xl p-10 text-center shadow-xl flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto"
      >
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
          <CheckCircle className="h-8 w-8 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-2xl font-bold text-slate-800">
            Lưu Tùy Chọn Thành Công!
          </h3>
          <p className="text-sm text-slate-500 font-body max-w-md">
            Chúng tôi đang xử lý các tiêu chí của bạn để tìm những phòng trọ và
            bạn cùng nhà có độ hòa hợp tốt nhất. Đang cập nhật kết quả...
          </p>
        </div>
        <div className="flex h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="h-full bg-emerald-500"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-[2.5rem] border border-white/40 bg-card/45 backdrop-blur-md p-8 sm:p-10 shadow-2xl shadow-primary/5 space-y-8"
      >
        {/* Decorative elements for premium Liquid Glass look */}
        <div className="absolute top-3.75 right-3.75 w-24 h-24 bg-primary/8 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-3.75 left-3.75 w-24 h-24 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-border/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Compass className="h-6 w-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Bộ Tiêu Chí Ở Ghép
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                <Sparkles className="h-2.5 w-2.5" /> AI Matcher
              </span>
            </h2>
            <p className="text-xs text-muted-foreground font-body">
              Điền các tùy chọn của bạn để thuật toán đề xuất bạn cùng phòng
              tương thích hoàn hảo.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-8">
          {/* SECTION 1: KHU VỰC & DIỆN TÍCH */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-body flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              1. Khu Vực & Không Gian Sống
            </h3>

            {/* Address cascading selectors */}
            <AddressSelect
              provinces={provinces}
              districts={districts}
              selectedProvinceCode={selectedProvinceCode}
              loadingProvinces={loadingProvinces}
              loadingDistricts={loadingDistricts}
              watchDistrict={watchDistrict}
              handleProvinceChange={handleProvinceChange}
              setValue={setValue}
              errors={errors}
            />

            <div className="flex flex-col gap-6 mt-6">
              {/* Area Input */}
              <InputArea register={register} errors={errors} />
            </div>
          </div>

          {/* SECTION 2: NGÂN SÁCH CHI TIÊU */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-body flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              2. Ngân Sách Hàng Tháng (VNĐ)
            </h3>

            <RangeBudget />
          </div>

          {/* SECTION 3: THÓI QUEN & LỐI SỐNG */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-body flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              3. Thói Quen & Phong Cách Sống
            </h3>

            <SLeepTime />

            {/* Cleanliness Level Scale */}
            <CleanlinessLevel />

            {/* Noise Tolerance Scale */}
            <NoiseTolerance />

            {/* Toggles stacked vertically in a single-column layout */}
            <div className="flex flex-col gap-6">
              {/* Smoking Switch */}
              <SmokingSwitch />

              {/* Pet Friendly Switch */}
              <PetFriendlySwitch />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loadingProvinces || loadingDistricts}
              className="w-full h-12 font-black tracking-widest uppercase rounded-2xl bg-slate-900 text-white cursor-pointer hover:bg-primary hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingProvinces || loadingDistricts ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang tải thông tin địa chỉ...
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5 rotate-90 shrink-0" />
                  Lưu & Tìm Bạn Ghép Ngay
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
