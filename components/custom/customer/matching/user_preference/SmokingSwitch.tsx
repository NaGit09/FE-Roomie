import { useMatchingStore } from "@/stores/matchingStore";
import { Cigarette, CigaretteOff } from "lucide-react";

const SmokingSwitch = () => {
  const { smoking, setSmoking } = useMatchingStore();
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body">
        Thói quen hút thuốc
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setSmoking(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
            !smoking
              ? "bg-primary/10 border-primary text-primary shadow-sm font-bold"
              : "bg-background/40 border-border/80 text-muted-foreground hover:border-primary/20 hover:text-foreground"
          }`}
        >
          <CigaretteOff className="h-4.5 w-4.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Không hút thuốc
          </span>
        </button>
        <button
          type="button"
          onClick={() => setSmoking(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
            smoking
              ? "bg-primary/10 border-primary text-primary shadow-sm font-bold"
              : "bg-background/40 border-border/80 text-muted-foreground hover:border-primary/20 hover:text-foreground"
          }`}
        >
          <Cigarette className="h-4.5 w-4.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Có hút thuốc
          </span>
        </button>
      </div>
    </div>
  );
};

export default SmokingSwitch;
