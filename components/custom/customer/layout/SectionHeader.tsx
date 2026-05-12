import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
// ─────────────────────────────────────────────
// Reusable Section Header
// ─────────────────────────────────────────────
interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description?: string;
  dark?: boolean;
  centered?: boolean;
}

export const SectionHeader = ({
  subtitle,
  title,
  description,
  dark = false,
  centered = false,
}: SectionHeaderProps) => (
  <div
    className={cn(
      "mb-16",
      centered ? "text-center flex flex-col items-center" : "text-left",
    )}
  >
    <div
      className={cn(
        "mb-6 flex items-center gap-3",
        centered && "justify-center",
      )}
    >
      <Sparkles
        className={cn("h-4 w-4", dark ? "text-white/40" : "text-primary")}
      />
      <span
        className={cn(
          "text-[10px] font-black uppercase tracking-[0.4em]",
          dark ? "text-white/60" : "text-primary",
        )}
      >
        {subtitle}
      </span>
    </div>
    <h2
      className={cn(
        "max-w-3xl text-4xl font-black tracking-tighter md:text-6xl leading-[1.1] font-heading",
        dark ? "text-white" : "text-slate-900",
      )}
    >
      {title}
    </h2>
    {description && (
      <p
        className={cn(
          "mt-6 max-w-2xl text-lg leading-relaxed font-medium",
          dark ? "text-white/60" : "text-slate-500/80",
        )}
      >
        {description}
      </p>
    )}
  </div>
);