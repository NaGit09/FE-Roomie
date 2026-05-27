import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQItem } from "@/schema/common/FAQItem";

export const FAQAccordion = ({
  item,
  isOpen,
  onClick,
}: {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        "group mb-4 overflow-hidden rounded-[2rem] border transition-all duration-500",
        isOpen
          ? "border-primary/50 bg-white/5 shadow-2xl shadow-primary/10"
          : "border-white/5 bg-white/2 hover:border-white/20 hover:bg-white/4",
      )}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-6 sm:p-8 text-left"
      >
        <div className="flex items-center gap-5">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-500",
              isOpen
                ? "bg-primary text-white rotate-360 shadow-lg shadow-primary/20"
                : "bg-white/5 text-white/40 group-hover:text-white/80",
            )}
          >
            {isOpen ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <HelpCircle className="h-5 w-5" />
            )}
          </div>
          <span
            className={cn(
              "text-lg font-bold tracking-tight transition-colors duration-300",
              isOpen ? "text-white" : "text-white/70 group-hover:text-white",
            )}
          >
            {item.question}
          </span>
        </div>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
            isOpen ? "bg-primary/20 text-primary" : "bg-white/5 text-white/20",
          )}
        >
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-500 ease-out",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-8 pl-6 sm:pl-21 pr-8">
              <div className="h-px w-12 bg-primary/30 mb-6" />
              <p className="text-white/60 leading-relaxed text-base">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
