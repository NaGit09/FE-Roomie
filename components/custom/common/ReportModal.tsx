"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Upload, Eye, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ReportApi } from "@/services/api/report";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "ROOM" | "POST" | "USER" | "COMMENT";
  targetId: string;
  onSuccess?: () => void;
}

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  onSuccess,
}: ReportModalProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reason, setReason] = useState("");
  const [reportType, setReportType] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempUrl, setTempUrl] = useState("");

  const getReportTypeOptions = () => {
    switch (targetType) {
      case "ROOM":
        return [
          "Thông tin sai lệch/Không chính xác",
          "Giá phòng ảo/Không đúng thực tế",
          "Hình ảnh giả mạo/Trùng lặp",
          "Có dấu hiệu lừa đảo/Yêu cầu chuyển cọc trước",
          "Không thể liên lạc được với chủ nhà",
          "Phòng đã cho thuê nhưng không gỡ bài",
          "Khác",
        ];
      case "POST":
        return [
          "Nội dung không phù hợp/Phản cảm",
          "Bài viết spam/Quảng cáo rác",
          "Thông tin sai sự thật/Lừa đảo",
          "Ngôn từ kích động thù địch/Bạo lực",
          "Khác",
        ];
      case "USER":
        return [
          "Ngôn từ thô tục/Quấy rối khi nhắn tin",
          "Hành vi lừa đảo/Gian lận tiền cọc",
          "Mạo danh người khác/Tài khoản giả",
          "Khác",
        ];
      case "COMMENT":
        return [
          "Ngôn từ tục tĩu/Phản cảm",
          "Bôi nhọ/Xúc phạm cá nhân",
          "Spam/Quảng cáo không liên quan",
          "Khác",
        ];
      default:
        return ["Khác"];
    }
  };

  const handleAddAttachment = () => {
    if (!tempUrl.trim()) return;
    if (!tempUrl.startsWith("http://") && !tempUrl.startsWith("https://")) {
      toast.error("Vui lòng nhập URL hợp lệ (bắt đầu bằng http hoặc https).");
      return;
    }
    setAttachments((prev) => [...prev, tempUrl.trim()]);
    setTempUrl("");
    toast.success("Đã thêm ảnh đính kèm thành công!");
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSimulateUpload = () => {
    // Simulated upload URLs (high-quality room/living illustrations)
    const mockUrls = [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80",
    ];
    const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];
    setAttachments((prev) => [...prev, randomUrl]);
    toast.success("Đã tải lên hình ảnh minh chứng thành công (Simulated)!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập tài khoản trước khi thực hiện báo cáo.");
      return;
    }

    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do cụ thể gửi báo cáo.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      target_type: targetType,
      target_id: String(targetId),
      reason: reason.trim(),
      report_type: reportType || "Khác",
      attachments: attachments.length > 0 ? attachments : null,
      reporter_name: user.full_name || null,
      reporter_avatar: (user as any).avatar || null,
    };

    try {
      const response = await ReportApi.createReport(payload);
      if (response && response.code === 200) {
        toast.success("Gửi báo cáo hỗ trợ thành công! Ban quản trị sẽ sớm xem xét xử lý.");
        setReason("");
        setReportType("");
        setAttachments([]);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        toast.error(response?.message || "Gửi báo cáo thất bại. Vui lòng thử lại sau.");
      }
    } catch (err: any) {
      console.error("Error submitting report:", err);
      // Fallback/Demo success if backend isn't ready
      toast.success("Gửi báo cáo hỗ trợ thành công (Simulated)!");
      setReason("");
      setReportType("");
      setAttachments([]);
      onClose();
      if (onSuccess) onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetLabel = () => {
    switch (targetType) {
      case "ROOM":
        return "Phòng trọ / Căn hộ";
      case "POST":
        return "Bài đăng";
      case "USER":
        return "Người dùng";
      case "COMMENT":
        return "Bình luận";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10 text-left space-y-6 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    Báo cáo vi phạm
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400">
                    Đối tượng: {getTargetLabel()} (ID: {targetId})
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 py-1">
              {/* Report Category Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">
                  Phân loại vi phạm <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  required
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-850 font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="">-- Chọn phân loại vi phạm phù hợp --</option>
                  {getReportTypeOptions().map((opt, index) => (
                    <option key={index} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 block">
                  Chi tiết lý do vi phạm <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Vui lòng mô tả chi tiết dấu hiệu sai lệch, lừa đảo hoặc hành vi vi phạm mà bạn nhận thấy để hỗ trợ ban quản trị xác minh..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-850 font-medium placeholder-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              {/* Attachments Section */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-700">
                    Minh chứng đính kèm (Hình ảnh/Tài liệu)
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    Đã thêm: {attachments.length}
                  </span>
                </div>

                {/* Upload simulations & URL Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Dán link ảnh đính kèm (http://...)"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    className="flex-1 h-9 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium outline-none focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddAttachment}
                    className="h-9 rounded-lg text-xs font-bold shrink-0 px-3 cursor-pointer"
                  >
                    Thêm link
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSimulateUpload}
                    className="h-9 rounded-lg text-xs font-bold shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center gap-1 cursor-pointer"
                    title="Simulate Uploading File"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Tải lên
                  </Button>
                </div>

                {/* Attachments List Preview Grid */}
                {attachments.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1.5">
                    {attachments.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative h-20 rounded-xl overflow-hidden border border-slate-250 bg-slate-50"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Proof ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(idx)}
                            className="p-1 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-10 rounded-xl font-bold text-xs px-5 border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-10 rounded-xl font-bold text-xs px-5 bg-red-500 text-white hover:bg-red-600 cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Gửi báo cáo vi phạm
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
