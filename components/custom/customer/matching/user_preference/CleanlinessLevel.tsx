import { useMatchingStore } from "@/stores/matchingStore";

const CleanlinessLevel = () => {
  const { cleanliness_level, setCleanlinessLevel } = useMatchingStore();
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body">
          Mức độ sạch sẽ mong muốn
        </label>
        <span className="text-xs font-extrabold text-primary font-body tracking-wide bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-md">
          {cleanliness_level === 1 && "Khá thoải mái"}
          {cleanliness_level === 2 && "Tiêu chuẩn"}
          {cleanliness_level === 3 && "Sạch sẽ gọn gàng"}
          {cleanliness_level === 4 && "Cực kỳ ngăn nắp"}
          {cleanliness_level === 5 && "Không tì vết"}
        </span>
      </div>
      <div className="flex gap-2.5">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setCleanlinessLevel(lvl)}
            className={`flex-1 h-11 rounded-xl border font-black text-sm transition-all duration-300 cursor-pointer ${
              cleanliness_level === lvl
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.03]"
                : "bg-background/40 border-border/80 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CleanlinessLevel;
