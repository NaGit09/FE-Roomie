import { useMatchingStore } from "@/stores/matchingStore";

const NoiseTolerance = () => {
  const { noise_tolerance, setNoiseTolerance } = useMatchingStore();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body">
          Khả năng chịu tiếng ồn
        </label>
        <span className="text-xs font-extrabold text-primary font-body tracking-wide bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-md">
          {noise_tolerance === 1 && "Yêu cầu yên tĩnh tuyệt đối"}
          {noise_tolerance === 2 && "Nhạy cảm tiếng ồn nhẹ"}
          {noise_tolerance === 3 && "Chấp nhận tiếng ồn sinh hoạt"}
          {noise_tolerance === 4 && "Thoải mái với nhạc / tivi"}
          {noise_tolerance === 5 && "Không bận tâm bất cứ tiếng ồn"}
        </span>
      </div>
      <div className="flex gap-2.5">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setNoiseTolerance(lvl)}
            className={`flex-1 h-11 rounded-xl border font-black text-sm transition-all duration-300 cursor-pointer ${
              noise_tolerance === lvl
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

export default NoiseTolerance;
