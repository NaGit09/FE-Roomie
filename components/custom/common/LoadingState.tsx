"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  type?: "spinner" | "pulse" | "skeleton";
  message?: string;
  fullscreen?: boolean;
  className?: string;
}

export const LoadingState = ({
  type = "spinner",
  message = "Đang tải dữ liệu...",
  fullscreen = false,
  className,
}: LoadingStateProps) => {
  const containerClasses = cn(
    "flex flex-col items-center justify-center text-center p-8",
    fullscreen
      ? "fixed inset-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md"
      : "col-span-full py-16 w-full",
    className,
  );

  return (
    <div className={containerClasses}>
      {type === "spinner" && (
        <div className="relative flex flex-col items-center justify-center mb-4">
          {/* Liquid Glass Background Blur Glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 0.95, 1.05, 1],
              rotate: 360,
              borderRadius: [
                "40% 60% 70% 30% / 40% 50% 60% 50%",
                "50% 60% 30% 70% / 50% 60% 40% 60%",
                "40% 60% 70% 30% / 40% 50% 60% 50%",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-20 w-20 bg-linear-to-tr from-indigo-500/20 via-amber-500/10 to-rose-500/10 blur-xl dark:from-indigo-500/30"
          />

          {/* Main Glass Circle Spinner */}
          <div className="relative h-14 w-14 rounded-full border border-white/20 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md flex items-center justify-center shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-600 border-r-indigo-600/30 dark:border-t-indigo-400 dark:border-r-indigo-400/30"
            />
            <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
        </div>
      )}

      {type === "pulse" && (
        <div className="relative flex items-center justify-center h-16 w-16 mb-4">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-indigo-500/20 backdrop-blur-md"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="h-8 w-8 rounded-full bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-500/25"
          />
        </div>
      )}

      {type === "skeleton" && (
        <div className="w-full max-w-md space-y-4 p-6 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6" />
          </div>
        </div>
      )}

      {message && type !== "skeleton" && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide mt-1"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingState;
