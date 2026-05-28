/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, 
  Zap, 
  Sparkles, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Compass, 
  Coins, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  X, 
  Building,
  Check,
  Percent,
  Calendar,
  Layers,
  Info,
  DollarSign
} from "lucide-react";
import { SubscriptionApi } from "@/services/api/subcription";
import { Subscription, SubscriptionDetail } from "@/schema/user/subcription";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";

export default function AdminSubscriptionPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"packages" | "logs">("packages");
  const [filterType, setFilterType] = useState<"ALL" | "RENTER" | "LANDLORD">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [packages, setPackages] = useState<Subscription[]>([]);
  const [logs, setLogs] = useState<SubscriptionDetail[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Subscription | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("SILVER");
  const [formPrice, setFormPrice] = useState(59000);
  const [formTime, setFormTime] = useState("1 Tháng");
  const [formDescription, setFormDescription] = useState("");
  const [formException, setFormException] = useState("");

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await SubscriptionApi.get_all_subscription();
      if (res && res.code === 200 && Array.isArray(res.data)) {
        setPackages(res.data);
      } else {
        // Safe fallback in case API returns empty
        const renterRes = await SubscriptionApi.get_all_renter_subscriptions();
        const landlordRes = await SubscriptionApi.get_all_landlord_subscriptions();
        const combined = [
          ...(renterRes?.data || []),
          ...(landlordRes?.data || [])
        ];
        setPackages(combined);
      }
    } catch (err: any) {
      console.error("Failed to load subscription packages:", err);
      toast.error("Không thể nạp danh sách gói cước. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await SubscriptionApi.get_user_subscription();
      if (res && res.code === 200 && Array.isArray(res.data)) {
        setLogs(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load subscription history logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPackages();
    fetchLogs();
  }, []);

  if (!mounted) return null;

  // Helpers
  const normalizePlanType = (type: string) => {
    const upper = (type || "").toUpperCase();
    if (upper.includes("DIAMOND")) return "DIAMOND";
    if (upper.includes("GOLD")) return "GOLD";
    if (upper.includes("SILVER")) return "SILVER";
    if (upper.includes("LANDLORD")) return "LANDLORD";
    return upper;
  };

  const getPlanIcon = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "SILVER":
        return <Zap className="h-5 w-5 text-slate-400" />;
      case "GOLD":
        return <Crown className="h-5 w-5 text-amber-500 animate-pulse" />;
      case "DIAMOND":
        return <Sparkles className="h-5 w-5 text-fuchsia-400" />;
      default:
        return <Building className="h-5 w-5 text-indigo-400" />;
    }
  };

  const getPlanGradient = (type: string) => {
    const planType = normalizePlanType(type);
    switch (planType) {
      case "SILVER":
        return "from-slate-500/20 via-slate-500/10 to-transparent border-slate-500/30";
      case "GOLD":
        return "from-amber-500/20 via-amber-500/10 to-transparent border-amber-500/30";
      case "DIAMOND":
        return "from-fuchsia-500/20 via-fuchsia-500/10 to-transparent border-fuchsia-500/30";
      default:
        return "from-indigo-500/20 via-indigo-500/10 to-transparent border-indigo-500/30";
    }
  };

  // CRUD handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription) {
      toast.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    const payload: Subscription = {
      sub_title: formTitle,
      sub_type: formType,
      sub_price: Number(formPrice),
      sub_time: formTime,
      sub_description: formDescription,
      sub_exception: formException || "Không có hạn chế đặc biệt nào."
    };

    try {
      const res = await SubscriptionApi.create_subscription(payload);
      if (res && (res.code === 200 || res.code === 201)) {
        toast.success(`Đã thêm gói dịch vụ "${formTitle}" thành công!`);
        setIsAddOpen(false);
        fetchPackages();
        // Reset form
        setFormTitle("");
        setFormType("SILVER");
        setFormPrice(59000);
        setFormTime("1 Tháng");
        setFormDescription("");
        setFormException("");
      } else {
        toast.error(res?.message || "Đã xảy ra lỗi khi tạo gói.");
      }
    } catch (err: any) {
      console.error("Failed to create package:", err);
      toast.error(err?.response?.data?.message || "Không thể tạo gói mới. Vui lòng kiểm tra lại!");
    }
  };

  const handleEditClick = (pkg: Subscription) => {
    setSelectedPackage(pkg);
    setFormTitle(pkg.sub_title);
    setFormType(pkg.sub_type);
    setFormPrice(pkg.sub_price);
    setFormTime(pkg.sub_time);
    setFormDescription(pkg.sub_description);
    setFormException(pkg.sub_exception || "");
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !selectedPackage.id) return;

    const payload: Subscription = {
      id: selectedPackage.id,
      sub_title: formTitle,
      sub_type: formType,
      sub_price: Number(formPrice),
      sub_time: formTime,
      sub_description: formDescription,
      sub_exception: formException
    };

    try {
      const res = await SubscriptionApi.update_subscription(payload, selectedPackage.id);
      if (res && res.code === 200) {
        toast.success(`Cập nhật gói "${formTitle}" thành công!`);
        setIsEditOpen(false);
        fetchPackages();
      } else {
        toast.error(res?.message || "Đã xảy ra lỗi khi cập nhật.");
      }
    } catch (err: any) {
      console.error("Failed to update package:", err);
      toast.error(err?.response?.data?.message || "Không thể lưu cập nhật. Vui lòng thử lại!");
    }
  };

  const handleDeleteClick = async (pkg: Subscription) => {
    if (!pkg.id) return;
    if (!confirm(`Bạn có chắc chắn muốn xóa gói dịch vụ "${pkg.sub_title}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      const res = await SubscriptionApi.delete_subscription(pkg.id);
      if (res && res.code === 200) {
        toast.success(`Đã xóa gói "${pkg.sub_title}" thành công.`);
        fetchPackages();
      } else {
        toast.error(res?.message || "Không thể xóa gói dịch vụ.");
      }
    } catch (err: any) {
      console.error("Failed to delete package:", err);
      toast.error(err?.response?.data?.message || "Lỗi khi xóa gói. Gói này có thể đang được người dùng sử dụng!");
    }
  };

  // Filtered lists
  const filteredPackages = packages.filter((pkg) => {
    const typeUpper = pkg.sub_type.toUpperCase();
    const isLandlordPkg = typeUpper.includes("LANDLORD") || typeUpper.includes("STARTER");
    
    const matchesTab = 
      filterType === "ALL" ||
      (filterType === "LANDLORD" && isLandlordPkg) ||
      (filterType === "RENTER" && !isLandlordPkg);

    const matchesSearch = 
      pkg.sub_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.sub_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.sub_type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-fade-in text-[#F8FAFC]">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-fuchsia-400">
            <Layers className="h-3.5 w-3.5" />
            Bảng điều khiển Admin
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-100">
            Quản trị gói cước dịch vụ
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium font-body leading-relaxed max-w-xl">
            Cấu hình các hạng gói cước thành viên Roomie Premium dành cho Người tìm phòng (Renter) và Chủ nhà (Landlord).
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            // Preset default creation values
            setFormTitle("");
            setFormType("SILVER");
            setFormPrice(59000);
            setFormTime("1 Tháng");
            setFormDescription("");
            setFormException("");
            setIsAddOpen(true);
          }}
          className="h-12 px-6 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-fuchsia-950/20 shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Tạo gói cước mới
        </button>
      </div>

      {/* 2. Admin Analytics KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Tổng số gói cước", value: packages.length, icon: Layers, color: "text-blue-400 bg-blue-500/5 border-blue-500/10" },
          { label: "Gói cước Renter", value: packages.filter(p => !p.sub_type.toUpperCase().includes("LANDLORD")).length, icon: Users, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
          { label: "Gói cước Landlord", value: packages.filter(p => p.sub_type.toUpperCase().includes("LANDLORD")).length, icon: Building, color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
          { label: "Doanh thu trung bình", value: formatVND(packages.reduce((acc, curr) => acc + curr.sub_price, 0) / (packages.length || 1)), icon: Coins, color: "text-fuchsia-400 bg-fuchsia-500/5 border-fuchsia-500/10" },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`rounded-2xl border p-4 flex items-center justify-between shadow-xs bg-[#0f172a]/20 backdrop-blur-md ${kpi.color}`}>
              <div className="space-y-1 text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-450 block font-body">{kpi.label}</span>
                <span className="text-lg font-black tracking-tight">{kpi.value}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 shrink-0">
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Controls & Tabs */}
      <div className="flex flex-col gap-4 bg-[#0f172a]/40 border border-white/5 rounded-2xl p-4 md:flex-row md:items-center justify-between">
        
        {/* Toggle tabs (Packages list vs Purchase logs) */}
        <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded-xl border border-white/5 self-stretch md:self-auto justify-between">
          {[
            { id: "packages", label: "Danh sách gói cước", count: packages.length },
            { id: "logs", label: "Giao dịch hệ thống", count: logs.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters specific to ActiveTab */}
        <AnimatePresence mode="wait">
          {activeTab === "packages" ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex flex-wrap items-center gap-3 w-full md:w-auto"
            >
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] md:max-w-xs">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm gói cước..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 bg-[#0b0f19] border border-white/5 rounded-xl pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-fuchsia-500 text-slate-205 placeholder-slate-500"
                />
              </div>

              {/* Renter/Landlord filters */}
              <div className="flex bg-[#0b0f19] p-1 rounded-xl border border-white/5">
                {[
                  { id: "ALL", label: "Tất cả" },
                  { id: "RENTER", label: "Renter" },
                  { id: "LANDLORD", label: "Landlord" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilterType(item.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      filterType === item.id
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2"
            >
              <button 
                onClick={fetchLogs} 
                className="h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Làm mới giao dịch
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Packages List Grid / Log Tables View */}
      {isLoading ? (
        /* Skeletons */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="rounded-3xl border border-white/5 bg-[#0f172a]/20 p-6 space-y-6 animate-pulse">
              <div className="h-6 w-1/3 bg-white/10 rounded-full" />
              <div className="space-y-2">
                <div className="h-8 w-3/4 bg-white/10 rounded-md" />
                <div className="h-4 w-1/2 bg-white/10 rounded-md" />
              </div>
              <hr className="border-white/5" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/10 rounded-md" />
                <div className="h-4 w-full bg-white/10 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === "packages" ? (
        filteredPackages.length === 0 ? (
          <div className="rounded-[2rem] border border-white/5 bg-[#0f172a]/20 p-12 text-center space-y-4 max-w-md mx-auto">
            <Compass className="h-10 w-10 text-slate-500 animate-pulse mx-auto" />
            <h3 className="text-sm font-bold text-slate-205">Không tìm thấy gói cước nào</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body">
              Vui lòng thử lại với các tiêu chí tìm kiếm hoặc tạo gói cước Premium mới.
            </p>
          </div>
        ) : (
          /* Cards Grid layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredPackages.map((pkg, idx) => {
              const gradientClass = getPlanGradient(pkg.sub_type);
              const isLandlord = pkg.sub_type.toUpperCase().includes("LANDLORD") || pkg.sub_type.toUpperCase().includes("STARTER");
              
              return (
                <motion.div
                  key={pkg.id || idx}
                  layout
                  whileHover={{ y: -4 }}
                  className={`rounded-[2rem] border bg-[#0f172a]/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative group overflow-hidden ${gradientClass}`}
                >
                  {/* Subtle top decoration badge */}
                  <span className={`absolute -top-3 right-6 rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-md ${
                    isLandlord ? "bg-amber-400" : "bg-fuchsia-400"
                  }`}>
                    {isLandlord ? "LANDLORD" : "RENTER"}
                  </span>

                  <div className="space-y-4">
                    {/* Header title */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 text-left">
                        <h3 className="font-extrabold text-sm text-slate-105 group-hover:text-fuchsia-400 transition-colors">
                          {pkg.sub_title}
                        </h3>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block font-body">
                          Chu kỳ: {pkg.sub_time}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                        {getPlanIcon(pkg.sub_type)}
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="flex items-baseline gap-1 text-left">
                      <span className="text-2xl font-black bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                        {formatVND(pkg.sub_price)}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">/ chu kỳ</span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium text-left">
                      {pkg.sub_description}
                    </p>

                    <hr className="border-white/5" />

                    {/* Features list */}
                    <div className="space-y-2 text-left">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block font-body">Thông số kỹ thuật</span>
                      <div className="flex items-start gap-2 text-[10px] text-slate-400 font-medium font-body leading-tight">
                        <div className="h-4.5 w-4.5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                        <span>Đặc quyền: {pkg.sub_type} tier</span>
                      </div>

                      <div className="flex items-start gap-2 text-[10px] text-slate-400 font-medium font-body leading-tight">
                        <div className="h-4.5 w-4.5 rounded-full bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                          <Info className="h-2.5 w-2.5" />
                        </div>
                        <span className="truncate">Hạn chế: {pkg.sub_exception}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin actions block */}
                  <div className="mt-6 pt-4 border-t border-dashed border-white/5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleEditClick(pkg)}
                      className="flex-1 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(pkg)}
                      className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 flex items-center justify-center transition-all cursor-pointer"
                      title="Xóa gói cước"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      ) : (
        /* Logs History View */
        <div className="space-y-4">
          {loadingLogs ? (
            <div className="h-32 flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/5 bg-[#0f172a]/20">
              <Compass className="h-6 w-6 text-fuchsia-500 animate-spin" />
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                Đang tải lịch sử đăng ký hệ thống...
              </span>
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-[2rem] border border-white/5 bg-[#0f172a]/20 p-12 text-center space-y-4 max-w-md mx-auto">
              <Coins className="h-10 w-10 text-slate-500 animate-pulse mx-auto" />
              <h3 className="text-sm font-bold text-slate-205">Chưa có giao dịch hội viên</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-body">
                Hệ thống chưa ghi nhận bất kỳ giao dịch nạp và đăng ký Premium nào từ người dùng.
              </p>
            </div>
          ) : (
            /* Log table list */
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0f172a]/40 backdrop-blur-md shadow-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0b0f19]/60 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-450 font-body">
                    <th className="py-4 px-6">ID Giao Dịch</th>
                    <th className="py-4 px-6">Mã Người dùng</th>
                    <th className="py-4 px-6">Gói liên kết (ID)</th>
                    <th className="py-4 px-6">Ngày Kích Hoạt</th>
                    <th className="py-4 px-6">Ngày Hết Hạn</th>
                    <th className="py-4 px-6">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold text-slate-300">
                  {logs.map((detail) => (
                    <tr key={detail.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 font-mono text-fuchsia-400 font-bold">RM-SUB-{detail.id}</td>
                      <td className="py-4 px-6 font-mono text-slate-400 font-medium truncate max-w-[120px]" title={detail.user_id}>
                        {detail.user_id}
                      </td>
                      <td className="py-4 px-6 font-bold">Gói dịch vụ #{detail.sub_id}</td>
                      <td className="py-4 px-6 text-slate-400 font-medium font-body">
                        {new Date(detail.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-medium font-body">
                        {new Date(detail.time_end).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-6">
                        {detail.is_active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[9px] font-extrabold text-emerald-400">
                            <CheckCircle className="h-3 w-3 shrink-0 animate-pulse" />
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 border border-slate-500/20 px-2.5 py-1 text-[9px] font-extrabold text-slate-500">
                            Đã hết hạn
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. ADD MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 z-10 text-left text-[#F8FAFC]"
            >
              {/* Close */}
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 mb-6">
                <span className="text-[10px] font-black uppercase text-fuchsia-500 tracking-widest block font-body">
                  Setup New Tier
                </span>
                <h3 className="text-xl font-black text-slate-100">Khai báo gói cước mới</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-body">
                  Thiết lập gói cước để đồng bộ trực tiếp lên hệ thống Roomie và cho phép người dùng đăng ký.
                </p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 font-body">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Tên gói cước</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Gói Gold Renter VIP"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                    required
                  />
                </div>

                {/* Grid Inputs: Type and Billing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Loại Gói (Tier Key)</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full h-11 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                    >
                      <option value="SILVER">SILVER (Renter)</option>
                      <option value="GOLD">GOLD (Renter)</option>
                      <option value="DIAMOND">DIAMOND (Renter)</option>
                      <option value="LANDLORD_STARTER">LANDLORD_STARTER</option>
                      <option value="LANDLORD_PRO">LANDLORD_PRO</option>
                      <option value="LANDLORD_BUSINESS">LANDLORD_BUSINESS</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Chu kỳ thời hạn</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 1 Tháng, 1 Năm"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                      required
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Phí gói cước (VNĐ)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Mô tả chi tiết gói</label>
                  <textarea
                    placeholder="Mô tả các đặc quyền hoặc giới hạn của gói..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500 resize-none"
                    required
                  />
                </div>

                {/* Exception */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Các hạn chế (Exception)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Giới hạn 50 lượt roommate / tháng"
                    value={formException}
                    onChange={(e) => setFormException(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="h-11 px-5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-fuchsia-950/20"
                  >
                    Khai báo ngay
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. EDIT MODAL */}
      <AnimatePresence>
        {isEditOpen && selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 z-10 text-left text-[#F8FAFC]"
            >
              {/* Close */}
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 mb-6">
                <span className="text-[10px] font-black uppercase text-fuchsia-500 tracking-widest block font-body">
                  Update Tier Configurations
                </span>
                <h3 className="text-xl font-black text-slate-100">Chỉnh sửa thông tin gói cước</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-body">
                  Cập nhật các thuộc tính, phí thanh toán và chu kỳ gia hạn của gói dịch vụ.
                </p>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 font-body">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Tên gói cước</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                    required
                  />
                </div>

                {/* Grid Inputs: Type and Billing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Loại Gói (Tier Key)</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full h-11 bg-[#0f172a] border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                    >
                      <option value="SILVER">SILVER (Renter)</option>
                      <option value="GOLD">GOLD (Renter)</option>
                      <option value="DIAMOND">DIAMOND (Renter)</option>
                      <option value="LANDLORD_STARTER">LANDLORD_STARTER</option>
                      <option value="LANDLORD_PRO">LANDLORD_PRO</option>
                      <option value="LANDLORD_BUSINESS">LANDLORD_BUSINESS</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Chu kỳ thời hạn</label>
                    <input
                      type="text"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                      required
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Phí gói cước (VNĐ)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Mô tả chi tiết gói</label>
                  <textarea
                    placeholder="Mô tả các đặc quyền hoặc giới hạn của gói..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500 resize-none"
                    required
                  />
                </div>

                {/* Exception */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Các hạn chế (Exception)</label>
                  <input
                    type="text"
                    value={formException}
                    onChange={(e) => setFormException(e.target.value)}
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-semibold text-slate-205 focus:outline-none focus:border-fuchsia-500"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="h-11 px-5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-fuchsia-950/20"
                  >
                    Lưu cập nhật
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
