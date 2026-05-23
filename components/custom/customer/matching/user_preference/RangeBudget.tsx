import { useMatchingStore } from "@/stores/matchingStore";
import React from "react";
import { Coins } from "lucide-react";
import { Input } from "@/components/ui/input";
import formatVND from "@/utils/priceUtils";
const RangeBudget = () => {
  const { budget_min, budget_max, setBudgetMin, setBudgetMax } =
    useMatchingStore();
  return (
    <div className="flex flex-col gap-6">
      {/* Budget Min */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body flex justify-between">
          <span>Ngân sách tối thiểu</span>
          <span className="text-primary font-semibold lowercase">
            (
            {budget_min >= 1000000
              ? `${budget_min / 1000000} triệu`
              : formatVND(budget_min)}
            )
          </span>
        </label>
        <div className="relative">
          <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            type="number"
            step={500000}
            value={budget_min || ""}
            onChange={(e) => setBudgetMin(Number(e.target.value))}
            placeholder="1,000,000"
            className="pl-9 h-11 rounded-xl border border-border/80 bg-background/50 focus:border-primary/50 transition-all duration-200 font-semibold"
          />
        </div>
      </div>

      {/* Budget Max */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body flex justify-between">
          <span>Ngân sách tối đa</span>
          <span className="text-primary font-semibold lowercase">
            (
            {budget_max >= 1000000
              ? `${budget_max / 1000000} triệu`
              : formatVND(budget_max)}
            )
          </span>
        </label>
        <div className="relative">
          <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            type="number"
            step={500000}
            value={budget_max || ""}
            onChange={(e) => setBudgetMax(Number(e.target.value))}
            placeholder="5,000,000"
            className="pl-9 h-11 rounded-xl border border-border/80 bg-background/50 focus:border-primary/50 transition-all duration-200 font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default RangeBudget;
