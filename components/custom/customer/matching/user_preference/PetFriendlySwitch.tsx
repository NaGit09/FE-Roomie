import { useMatchingStore } from "@/stores/matchingStore";
import { PawPrint, X } from "lucide-react";

const PetFriendlySwitch = () => {
  const { pet_friendly, setPetFriendly } = useMatchingStore();
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body">
        Thú cưng trong nhà
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPetFriendly(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
            !pet_friendly
              ? "bg-primary/10 border-primary text-primary shadow-sm font-bold"
              : "bg-background/40 border-border/80 text-muted-foreground hover:border-primary/20 hover:text-foreground"
          }`}
        >
          <X className="h-4.5 w-4.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Không nuôi pet
          </span>
        </button>
        <button
          type="button"
          onClick={() => setPetFriendly(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 cursor-pointer ${
            pet_friendly
              ? "bg-primary/10 border-primary text-primary shadow-sm font-bold"
              : "bg-background/40 border-border/80 text-muted-foreground hover:border-primary/20 hover:text-foreground"
          }`}
        >
          <PawPrint className="h-4.5 w-4.5" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Thân thiện pet
          </span>
        </button>
      </div>
    </div>
  );
};

export default PetFriendlySwitch;
