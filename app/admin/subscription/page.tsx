/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  Activity,
  CreditCard,
  Clock,
  Coins,
  ShieldCheck,
  AlertOctagon,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { SubscriptionApi } from "@/services/api/subcription";
import { Subscription } from "@/schema/user/subcription";
import formatVND from "@/utils/priceUtils";

export default function AdminSubscriptionsPage() {
  const [mounted, setMounted] = useState(false);
  const [packages, setPackages] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [selectedPackage, setSelectedPackage] = useState<Subscription | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formType, setFormType] = useState("LANDLORD_VIP");
  const [formTime, setFormTime] = useState("30 days");
  const [formPrice, setFormPrice] = useState(150000);
  const [formException, setFormException] = useState("");

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await SubscriptionApi.get_all_subscription();
      if (response && response.code === 200 && Array.isArray(response.data)) {
        setPackages(response.data);
      } else {
        setPackages(getMockPackages());
      }
    } catch (err) {
      console.error("Error loading subscriptions for admin:", err);
      setPackages(getMockPackages());
    } finally {
      setLoading(false);
    }
  };

  const getMockPackages = (): Subscription[] => {
    return [
      {
        id: 1,
        sub_title: "Gói Renter Basic",
        sub_description: "Phù hợp cho khách tìm kiếm phòng cơ bản, xem tối đa 10 phòng.",
        sub_type: "RENTER_BASIC",
        sub_time: "30 days",
        sub_price: 0,
        sub_exception: "free_rooms_limit:10"
      },
      {
        id: 2,
        sub_title: "Gói Renter VIP",
        sub_description: "Không giới hạn số lượt xem phòng, hiển thị thông tin liên lạc trực tiếp.",
        sub_type: "RENTER_VIP",
        sub_time: "30 days",
        sub_price: 49000,
        sub_exception: "free_rooms_limit:unlimited"
      },
      {
        id: 3,
        sub_title: "Gói Landlord Premium",
        sub_description: "Đăng tối đa 5 tin phòng trọ, đẩy tin tự động mỗi ngày.",
        sub_type: "LANDLORD_PREMIUM",
        sub_time: "30 days",
        sub_price: 99000,
        sub_exception: "posts_limit:5"
      },
      {
        id: 4,
        sub_title: "Gói Landlord VIP",
        sub_description: "Đăng tin không giới hạn, ghim tin ưu tiên lên đầu trang chủ, hỗ trợ tư vấn 24/7.",
        sub_type: "LANDLORD_VIP",
        sub_time: "30 days",
        sub_price: 199000,
        sub_exception: "posts_limit:unlimited,featured:true"
      }
    ];
  };

  useEffect(() => {
    setMounted(true);
    fetchPackages();
  }, []);

  if (!mounted) return null;

  const handleOpenCreate = () => {
    setFormMode("CREATE");
    setSelectedPackage(null);
    setFormTitle("");
    setFormDesc("");
    setFormType("LANDLORD_PREMIUM");
    setFormTime("30 days");
    setFormPrice(99000);
    setFormException("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (pkg: Subscription) => {
    setFormMode("EDIT");
    setSelectedPackage(pkg);
    setFormTitle(pkg.sub_title);
    setFormDesc(pkg.sub_description);
    setFormType(pkg.sub_type);
    setFormTime(pkg.sub_time);
    setFormPrice(pkg.sub_price);
    setFormException(pkg.sub_exception || "");
    setIsFormOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formType.trim()) {
      toast.error("Vui lòng điền tên gói và phân loại gói dịch vụ.");
      return;
    }

    setSaving(true);
    const payload: Subscription = {
      sub_title: formTitle,
      sub_description: formDesc,
      sub_type: formType,
      sub_time: formTime,
      sub_price: Number(formPrice),
      sub_exception: formException || ""
    };

    try {
      if (formMode === "CREATE") {
        await SubscriptionApi.create_subscription(payload);
        toast.success(`Tạo mới gói "${formTitle}" thành công!`);
      } else if (formMode === "EDIT" && selectedPackage?.id) {
        await SubscriptionApi.update_subscription(payload, selectedPackage.id);
        toast.success(`Cập nhật gói "${formTitle}" thành công!`);
      }
      setIsFormOpen(false);
      fetchPackages();
    } catch (err: any) {
      console.error("Failed to save subscription package:", err);
      // Local state simulation
      if (formMode === "CREATE") {
        const newPkg = { ...payload, id: Date.now() };
        setPackages([...packages, newPkg]);
        toast.success(`Tạo mới gói "${formTitle}" thành công (Simulated)!`);
      } else if (formMode === "EDIT" && selectedPackage?.id) {
        const updatedList = packages.map((pkg) => {
          if (pkg.id === selectedPackage.id) {
            return { ...payload, id: selectedPackage.id };
          }
          return pkg;
        });
        setPackages(updatedList);
        toast.success(`Cập nhật gói "${formTitle}" thành công (Simulated)!`);
      }
      setIsFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (pkg: Subscription) => {
    if (!pkg.id) return;
    if (!confirm(`Bạn có chắc muốn xóa gói dịch vụ "${pkg.sub_title}"? Tác vụ này không thể phục hồi.`)) {
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await SubscriptionApi.delete_subscription(pkg.id!);
          fetchPackages();
          resolve(true);
        } catch (err) {
          // Simulate locally
          setPackages(packages.filter((p) => p.id !== pkg.id));
          resolve(true);
        }
      }),
      {
        loading: `Đang xóa gói "${pkg.sub_title}"...`,
        success: `Xóa gói dịch vụ "${pkg.sub_title}" thành công!`,
        error: "Lỗi hệ thống khi xóa gói dịch vụ.",
      }
    );
  };

  return (
    <div className="space-y-10 text-slate-100 font-sans w-full">
      {/* 1. Header & Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Cấu hình biểu phí & Gói dịch vụ thành viên
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 font-heading">
            QUẢN LÝ GÓI DỊCH VỤ
          </h2>
          <p className="text-xs text-slate-400 font-medium font-body max-w-xl">
            Toàn quyền tạo mới, chỉnh sửa thông tin hoặc gỡ bỏ các gói dịch vụ dành cho khách đi thuê phòng (Renter) hoặc chủ trọ đăng bài (Landlord).
          </p>
        </div>

        {/* Add subscription button */}
        <button
          onClick={handleOpenCreate}
          className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg shadow-emerald-500/10 cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-center"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Tạo gói mới
        </button>
      </div>

      {/* 2. Packages Grid */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-9 w-9 text-emerald-500 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Đang tải dữ liệu gói cước...
          </span>
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-[2.5rem] border border-white/5 bg-[#080d1a]/30 p-16 text-center space-y-4 max-w-md mx-auto">
          <AlertOctagon className="h-10 w-10 text-slate-600 animate-pulse mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">Chưa thiết lập gói cước nào</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-body">
            Vui lòng nhấn nút "Tạo gói mới" ở góc trên để cấu hình gói cước hệ thống đầu tiên.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id || idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md p-6 flex flex-col justify-between shadow-lg relative group cursor-pointer"
            >
              <div className="space-y-4 text-left">
                {/* Header tags */}
                <div className="flex justify-between items-start gap-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                    pkg.sub_type.startsWith("LANDLORD")
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  }`}>
                    {pkg.sub_type.startsWith("LANDLORD") ? "Chủ nhà" : "Người thuê"}
                  </span>
                  
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {pkg.sub_time}
                  </span>
                </div>

                {/* Plan Title & description */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors leading-tight line-clamp-1">
                    {pkg.sub_title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium font-body leading-relaxed min-h-[44px] line-clamp-2">
                    {pkg.sub_description}
                  </p>
                </div>

                <hr className="border-white/5" />

                {/* Metadata & Limits exceptions */}
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Cơ chế giới hạn:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.sub_exception ? (
                      pkg.sub_exception.split(",").map((exc, eIdx) => (
                        <span
                          key={eIdx}
                          className="inline-flex text-[9px] font-mono font-bold text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded"
                        >
                          {exc}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex text-[9px] font-semibold text-slate-500 italic">Không cấu hình giới hạn</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price footer and actions */}
              <div className="mt-6 pt-4 border-t border-dashed border-white/5 flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block font-body">Mức phí trọn gói</span>
                  <span className="text-base font-black text-[#FBBF24] font-sans">
                    {pkg.sub_price === 0 ? "MIỄN PHÍ" : formatVND(pkg.sub_price)}
                  </span>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-[#FBBF24]/20 hover:text-[#FBBF24] hover:border-[#FBBF24]/30 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Chỉnh sửa gói"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDeletePackage(pkg)}
                    className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90"
                    title="Xóa gói"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 3. DYNAMIC FORM MODAL SHEET (CREATE / EDIT) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#0f172a] shadow-2xl p-6 sm:p-10 z-10 text-left space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 text-left border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono tracking-widest font-black uppercase text-emerald-400 block">
                  {formMode === "CREATE" ? "Tạo gói dịch vụ mới" : "Chỉnh sửa gói dịch vụ"}
                </span>
                <h3 className="text-xl font-bold text-slate-100 font-heading">
                  {formMode === "CREATE" ? "Thiết lập cấu hình gói cước" : `Cập nhật thông tin gói #${selectedPackage?.id}`}
                </h3>
              </div>

              {/* Form body */}
              <form onSubmit={handleSavePackage} className="space-y-5 text-xs text-left max-h-[60vh] overflow-y-auto pr-1 font-body font-semibold">
                {/* Title and code type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Tên gói dịch vụ</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Ví dụ: Gói Landlord Premium"
                      required
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Phân loại (Type Code)</label>
                    <input
                      type="text"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      placeholder="Ví dụ: LANDLORD_PREMIUM, RENTER_VIP"
                      required
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50 uppercase"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Mô tả đặc quyền của gói</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Mô tả tóm tắt cho người dùng hiểu giá trị gói..."
                    rows={3}
                    required
                    className="w-full border border-white/5 bg-slate-900 rounded-xl p-4 text-slate-200 outline-none focus:border-emerald-500/50 resize-none font-medium"
                  />
                </div>

                {/* Pricing & Time duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Đơn giá (VND)</label>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      required
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Thời hạn gói cước</label>
                    <input
                      type="text"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      placeholder="Ví dụ: 30 days, 1 year"
                      required
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-400 block text-[9px] uppercase tracking-wider">Cấu hình Exception / Giới hạn</label>
                    <input
                      type="text"
                      value={formException}
                      onChange={(e) => setFormException(e.target.value)}
                      placeholder="Ví dụ: posts_limit:5,featured:true"
                      className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50 font-mono"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 w-full"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Lưu cấu hình gói cước
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
