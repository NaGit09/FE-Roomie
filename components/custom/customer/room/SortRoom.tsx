import { useRoomFilter } from "@/hooks/useRoomFilter";
import React from "react";

const SortRoom = () => {
  const { sortBy, setSortBy } = useRoomFilter();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-slate-100 p-5 shadow-xs">
      {/* Sorting / Header */}
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Sắp xếp kết quả
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { key: "newest", label: "Phòng mới nhất" },
          { key: "priceAsc", label: "Giá thấp đến cao" },
          { key: "priceDesc", label: "Giá cao đến thấp" },
        ].map((option) => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key as any)}
            className={`
              px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300
              ${
                sortBy === option.key
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10"
                  : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortRoom;