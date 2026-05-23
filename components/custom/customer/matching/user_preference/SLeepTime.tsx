import React from "react";
import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMatchingStore } from "@/stores/matchingStore";
import { SLEEP_TIMES } from "@/constant/sleep";
const SLeepTime = () => {
  const { sleep_time, setSleepTime } = useMatchingStore();
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body">
        Giờ đi ngủ thường lệ
      </label>
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 z-10" />
        <Select
          value={sleep_time?.toString()}
          onValueChange={(val) => setSleepTime(Number(val))}
        >
          <SelectTrigger className="w-full h-11 pl-9 pr-4 rounded-xl border border-border/80 bg-background/50 hover:bg-background text-slate-700 font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300">
            <SelectValue placeholder="Chọn giờ giấc ngủ" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-xl bg-background">
            {SLEEP_TIMES.map((time) => (
              <SelectItem
                key={time.value}
                value={time.value.toString()}
                className="rounded-lg font-medium focus:bg-primary/5 focus:text-primary cursor-pointer"
              >
                {time.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SLeepTime;
