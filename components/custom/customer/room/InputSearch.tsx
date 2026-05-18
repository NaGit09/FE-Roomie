import { Search } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";

interface InputSearchProps {
  keyword: string;
  setKeyword: (value: string) => void;
}

const InputSearch = ({ keyword, setKeyword }: InputSearchProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
        Từ khóa tìm kiếm
      </label>
      <div className="relative group">
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Nhập tên phòng, đường..."
          className="w-full pl-10 pr-4 py-3 text-sm font-medium border border-slate-100 rounded-2xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-300"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
      </div>
    </div>
  );
};

export default InputSearch;