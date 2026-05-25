"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Coins, 
  CheckCircle, 
  Calendar, 
  CreditCard, 
  HelpCircle,
  TrendingUp,
  Compass,
  ArrowRight
} from "lucide-react";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import formatVND from "@/utils/priceUtils";
import Link from "next/link";

export default function HistorySubscriptionPage() {
  const { transactionHistory, isSubscribed, activeSubscription } = useSubscriptionStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full flex items-center justify-center p-20">
        <Compass className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // Format dynamic dates
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

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-black text-slate-800">Lịch sử giao dịch</h1>
          <p className="text-xs text-slate-400 font-medium">
            Quản lý và xem lại tất cả các giao dịch đăng ký gói Premium trên Roomie.
          </p>
        </div>
        
        {isSubscribed && activeSubscription && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 self-start sm:self-center shadow-sm">
            <TrendingUp className="h-4 w-4 text-amber-500 animate-pulse" />
            <span>Gói hiện tại: {activeSubscription.plan.sub_title}</span>
          </div>
        )}
      </div>

      {transactionHistory.length === 0 ? (
        /* EMPTY STATE */
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
              Bạn chưa thực hiện bất kỳ giao dịch nạp xu hoặc mua gói hội viên nào trên hệ thống Roomie.
            </p>
          </div>
          <Link href="/matching" className="inline-block">
            <button className="h-11 px-6 font-bold uppercase tracking-wider text-[10px] bg-slate-900 text-white hover:bg-primary rounded-xl transition-all hover:shadow-lg active:scale-95 flex items-center gap-1.5 cursor-pointer">
              Khám phá gói Premium ngay
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </motion.div>
      ) : (
        /* TRANSACTIONS TABLE LIST */
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-450 font-body">
                  <th className="py-4 px-6">Mã giao dịch</th>
                  <th className="py-4 px-6">Thời gian</th>
                  <th className="py-4 px-6">Gói hội viên</th>
                  <th className="py-4 px-6">Hình thức</th>
                  <th className="py-4 px-6">Số tiền</th>
                  <th className="py-4 px-6">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                {transactionHistory.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-500 font-bold">{tx.id}</td>
                    <td className="py-4 px-6 text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        {formatDate(tx.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-800">{tx.planTitle}</td>
                    <td className="py-4 px-6 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 shrink-0 opacity-60 text-indigo-500" />
                        {tx.paymentMethod}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 text-sm">
                      {formatVND(tx.amount)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100/60 px-2.5 py-1 text-[10px] font-extrabold text-emerald-600">
                        <CheckCircle className="h-3 w-3 shrink-0" />
                        Thành công
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Help & Support Info Box */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 flex gap-3 text-slate-400 items-start text-xs font-body font-medium">
            <HelpCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-650 block">Bạn cần hỗ trợ về hóa đơn?</span>
              <p className="leading-relaxed">
                Nếu phát hiện bất kỳ sai sót nào trong giao dịch thanh toán hoặc muốn nhận hóa đơn giá trị gia tăng (VAT), vui lòng liên hệ ngay với bộ phận CSKH Roomie qua hotline <strong className="text-slate-600">1900 6868</strong> hoặc email <strong className="text-slate-600">support@roomie.vn</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
