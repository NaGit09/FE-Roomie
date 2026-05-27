"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StateContainer } from "@/components/custom/common/StateContainer";

export default function UnauthenticatedView() {
  return (
    <StateContainer state="empty">
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
    </StateContainer>
  );
}
