"use client";

import { ReactNode } from "react";
import LoadingState, { LoadingStateProps } from "./LoadingState";
import EmptyState, { EmptyStateProps } from "./EmptyState";
import ErrorState, { ErrorStateProps } from "./ErrorState";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StateContainerProps {
  state: "loading" | "empty" | "error" | "success";

  error?: string | null;

  onRetry?: () => void;

  loadingProps?: Partial<LoadingStateProps>;
  emptyProps?: Partial<EmptyStateProps>;
  errorProps?: Partial<ErrorStateProps>;

  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  errorComponent?: ReactNode;

  className?: string;

  children: React.ReactNode;
}

export const StateContainer = ({
  state,
  error,
  onRetry,
  loadingProps,
  emptyProps,
  errorProps,
  loadingComponent,
  emptyComponent,
  errorComponent,
  className,
  children,
}: StateContainerProps) => {
  const wrapperClasses = cn("w-full transition-all duration-300", className);

  return (
    <div className={wrapperClasses}>
      <AnimatePresence mode="wait">
        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex justify-center"
          >
            {loadingComponent || <LoadingState {...loadingProps} />}
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {errorComponent || (
              <ErrorState
                message={error || undefined}
                onRetry={onRetry}
                {...errorProps}
              />
            )}
          </motion.div>
        )}

        {state === "empty" && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {emptyComponent || <EmptyState {...emptyProps} />}
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StateContainer;
