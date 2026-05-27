"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: React.ReactNode;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "glass" | "minimal";
  className?: string;
}

export const ErrorState = ({
  title = "Đã xảy ra lỗi",
  message,
  onRetry,
  retryLabel = "Thử lại",
  icon: IconComponent = AlertCircle,
  variant = "glass",
  className,
}: ErrorStateProps) => {
  const containerClasses = cn(
    "col-span-full flex flex-col items-center justify-center py-16 px-6 text-center rounded-[2.5rem] transition-all duration-300 w-full",
    variant === "glass"
      ? "bg-rose-50/30 dark:bg-rose-950/10 backdrop-blur-xl border border-rose-100/50 dark:border-rose-900/30 shadow-[0_8px_32px_0_rgba(244,63,94,0.04)]"
      : "border border-dashed border-rose-200 dark:border-rose-900/50 bg-transparent",
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
      {/* Red Pulse Icon Ring */}
      <div className="relative mb-6">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.15, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-4 bg-rose-500/20 rounded-full blur-sm"
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 shadow-sm shadow-rose-100 dark:shadow-none">
          <IconComponent className="h-7 w-7" />
        </div>
      </div>

      {/* Typography */}
      <h3 className="text-xl font-bold text-rose-800 dark:text-rose-400 mb-2 leading-snug">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-rose-600/80 dark:text-rose-400/70 max-w-md mb-6 leading-relaxed">
          {message}
        </p>
      )}

      {/* Retry Button */}
      {onRetry && (
        <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
          <Button
            onClick={onRetry}
            variant="destructive"
            className="rounded-full px-7 py-5 font-semibold text-white bg-rose-600 hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-500 shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-600/30 transition-all duration-300 cursor-pointer"
          >
            {retryLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;
