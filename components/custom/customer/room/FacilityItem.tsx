import React from "react";
import { Check } from "lucide-react";

interface FacilityItemProps {
  value: string;
  handleToggleFacility: (value: string) => void;
  label: string;
  icon: React.ElementType;
  isChecked: boolean;
}

const FacilityItem = ({
  value,
  handleToggleFacility,
  label,
  icon: IconComponent,
  isChecked,
}: FacilityItemProps) => {
  return (
    <button
      key={value}
      onClick={() => handleToggleFacility(value)}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-300
        ${
          isChecked
            ? "bg-primary/5 border-primary text-primary"
            : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        }
      `}
    >
      <IconComponent
        className={`h-4 w-4 transition-colors ${isChecked ? "text-primary" : "text-slate-400"}`}
      />
      <span>{label}</span>
      <div
        className={`
          flex h-4 w-4 items-center justify-center rounded-md border transition-all duration-300 ml-1.5
          ${
            isChecked
              ? "bg-primary border-primary text-white"
              : "border-slate-200 bg-white"
          }
        `}
      >
        {isChecked && <Check className="h-2.5 w-2.5 stroke-3" />}
      </div>
    </button>
  );
};

export default FacilityItem;
