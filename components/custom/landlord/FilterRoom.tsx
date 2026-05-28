import React from "react";
import { Search } from "lucide-react";

interface FilterRoomProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: "ALL" | "VACANT" | "OCCUPIED";
  setFilter: (filter: "ALL" | "VACANT" | "OCCUPIED") => void;
}

export const FilterRoom: React.FC<FilterRoomProps> = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#0f172a]/40 border border-white/5 rounded-2xl p-4">
      {/* Search bar input widget */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
        <input
          type="text"
          placeholder="Tìm theo tên phòng, địa chỉ, quận..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 bg-[#0b0f19] border border-white/5 rounded-xl pl-11 pr-4 text-xs font-semibold focus:outline-none focus:border-[#F59E0B] text-slate-200 placeholder-slate-500"
        />
      </div>

      {/* Filter togglers */}
      <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded-xl border border-white/5 self-stretch md:self-auto justify-between md:justify-start">
        {[
          { id: "ALL", label: "Tất cả" },
          { id: "VACANT", label: "Còn trống" },
          { id: "OCCUPIED", label: "Đã cho thuê" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id as "ALL" | "VACANT" | "OCCUPIED")}
            className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              filter === item.id
                ? "bg-[#F59E0B] text-slate-900 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
