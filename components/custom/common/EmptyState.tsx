"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "glass" | "minimal";
  className?: string;
}

export const EmptyState = ({
  title = "Không tìm thấy kết quả",
  description = "Hiện tại chưa có dữ liệu nào được tìm thấy. Vui lòng quay lại sau!",
  icon: IconComponent = Home,
  actionLabel,
  onAction,
  variant = "glass",
  className,
}: EmptyStateProps) => {
  const containerClasses = cn(
    "col-span-full flex flex-col items-center justify-center py-16 px-6 text-center rounded-[2.5rem] transition-all duration-300 w-full",
    variant === "glass"
      ? "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]"
      : "border border-dashed border-slate-200 dark:border-slate-800 bg-transparent",
    className,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={containerClasses}
    >
      {/* Animated Icon Ring */}
      <div className="relative mb-6">
        <motion.div
          animate={{
            scale: [1, 1.08, 0.96, 1.04, 1],
            borderRadius: [
              "30% 70% 70% 30% / 30% 30% 70% 70%",
              "50% 60% 30% 70% / 50% 60% 40% 60%",
              "30% 70% 70% 30% / 30% 30% 70% 70%",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-3 bg-linear-to-tr from-amber-500/10 to-indigo-500/10 blur-md"
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr from-amber-500/10 to-amber-500/20 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-500/20">
          <IconComponent className="h-7 w-7" />
        </div>
      </div>

      {/* Typography */}
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {/* Interactive Action Button */}
      {actionLabel && onAction && (
        <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
          <Button
            onClick={onAction}
            className="rounded-full px-7 py-5 font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 shadow-md shadow-slate-900/10 dark:shadow-amber-500/15 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;
