import React from "react";
import { Scaling } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserPreferenceForm } from "@/hooks/matching/useUserPreferenceForm";
const InputArea = () => {
  const {
    form: {
      register,
      formState: { errors },
    },
  } = useUserPreferenceForm();
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-body">
        Diện tích phòng tối thiểu
      </label>
      <div className="relative">
        <Scaling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          type="number"
          placeholder="25"
          className="pl-9 pr-12 h-11 w-full rounded-xl border border-border/80 bg-background/50 focus:border-primary/50 transition-all duration-200 font-semibold"
          {...register("area", { valueAsNumber: true })}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
          m²
        </span>
      </div>
      {errors.area && (
        <p className="text-xs text-red-500 font-medium mt-1">
          {errors.area.message}
        </p>
      )}
    </div>
  );
};

export default InputArea;
