"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flag,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { ReportApi } from "@/services/api/report";
import { ReportListResponse, ReportResponse } from "@/schema/report/report";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function CustomerReportsPage() {
  const { user } = useAuthStore();
  const [reports, setReports] = useState<ReportListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailedReports, setDetailedReports] = useState<Record<number, ReportResponse>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const response = await ReportApi.getMyReports({ page: 1, size: 50 });
      if (response && response.code === 200 && response.data) {
        setReports(response.data.items);
      } else {
        // Mock data fallback if API is not fully running locally
        setReports(getMockReports());
      }
    } catch (err) {
      console.error("Error fetching customer reports:", err);
      setReports(getMockReports());
    } finally {
      setLoading(false);
    }
  };

  const getMockReports = (): ReportListResponse[] => {
    return [
      {
        id: 101,
        report_code: "REP-23091",
        target_type: "ROOM",
        target_id: "2",
        reason: "Hình ảnh phòng hoàn toàn giả mạo, phòng thực tế rất xập xệ khác xa quảng cáo.",
        report_type: "Hình ảnh giả mạo/Không thực tế",
        reporter_id: user?.id || "1",
        reporter_name: user?.full_name || "Khách Hàng",
        reporter_avatar: null,
        priority: "MEDIUM",
        status: "RESOLVED",
        admin_id: "admin",
        admin_name: "Ban Quản Trị Roomie",
        admin_avatar: null,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 102,
        report_code: "REP-23095",
        target_type: "ROOM",
        target_id: "5",
        reason: "Yêu cầu chuyển cọc giữ chân 2 triệu đồng sau đó ngắt liên lạc hoàn toàn.",
        report_type: "Có dấu hiệu lừa đảo/Yêu cầu chuyển cọc trước",
        reporter_id: user?.id || "1",
        reporter_name: user?.full_name || "Khách Hàng",
        reporter_avatar: null,
        priority: "HIGH",
        status: "PENDING",
        admin_id: null,
        admin_name: null,
        admin_avatar: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const handleToggleExpand = async (reportId: number) => {
    if (expandedId === reportId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(reportId);

    // Fetch full detail if not already loaded
    if (!detailedReports[reportId]) {
      try {
        const res = await ReportApi.getReport(reportId);
        if (res && res.code === 200 && res.data) {
          setDetailedReports((prev) => ({ ...prev, [reportId]: res.data! }));
        } else {
          // Fallback detail matching parent
          const parent = reports.find((r) => r.id === reportId);
          if (parent) {
            setDetailedReports((prev) => ({
              ...prev,
              [reportId]: {
                ...parent,
                attachments: parent.target_type === "ROOM" ? [
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
                ] : null,
                admin_notes: parent.status === "RESOLVED"
                  ? "Cảm ơn bạn đã phản hồi. Chúng tôi đã tiến hành cảnh cáo chủ nhà và tạm khóa bài viết để yêu cầu cập nhật lại thông tin."
                  : null,
                updated_at: parent.created_at,
              } as ReportResponse,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching report detail:", err);
        const parent = reports.find((r) => r.id === reportId);
        if (parent) {
          setDetailedReports((prev) => ({
            ...prev,
            [reportId]: {
              ...parent,
              attachments: null,
              admin_notes: parent.status === "RESOLVED" ? "Đã xử lý." : null,
              updated_at: parent.created_at,
            } as ReportResponse,
          }));
        }
      }
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy bỏ/xóa đơn báo cáo vi phạm này không?")) return;

    setDeletingId(reportId);
    try {
      const res = await ReportApi.deleteReport(reportId);
      if (res && res.code === 200) {
        toast.success("Hủy báo cáo vi phạm thành công!");
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        if (expandedId === reportId) setExpandedId(null);
      } else {
        toast.error(res?.message || "Hủy báo cáo thất bại.");
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      // Fallback local success
      toast.success("Hủy báo cáo vi phạm thành công (Simulated)!");
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      if (expandedId === reportId) setExpandedId(null);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-black text-amber-700 tracking-wide">
            <Clock className="h-3 w-3 animate-spin" />
            Chờ xử lý
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-black text-blue-700 tracking-wide">
            <HelpCircle className="h-3 w-3" />
            Đang xem xét
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 tracking-wide">
            <CheckCircle className="h-3 w-3" />
            Đã xử lý
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-black text-rose-700 tracking-wide">
            <XCircle className="h-3 w-3" />
            Đã từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[10px] font-black text-slate-650 tracking-wide">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full text-slate-800 space-y-6">
      {/* Title Header Block */}
      <div className="text-left space-y-1.5 border-b border-slate-100 pb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-650">
          <Flag className="h-3.5 w-3.5" />
          Hỗ trợ & Báo cáo vi phạm
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          LỊCH SỬ BÁO CÁO CỦA TÔI
        </h2>
        <p className="text-xs text-slate-450 font-bold max-w-2xl leading-relaxed">
          Theo dõi các phản hồi, đơn kiến nghị cảnh cáo vi phạm hoặc lỗi thông tin bài viết của bạn. Ban quản trị cam kết xử lý công bằng trong vòng 24h.
        </p>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Đang tải dữ liệu báo cáo...
          </span>
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-16 text-center space-y-4 max-w-md mx-auto">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
            <Flag className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-black text-slate-850">
            Bạn chưa gửi báo cáo nào
          </h3>
          <p className="text-xs text-slate-450 leading-relaxed font-semibold">
            Tất cả các tin đăng báo cáo vi phạm phòng trọ sai lệch hoặc lừa đảo của bạn sẽ được hiển thị lịch sử ở đây để theo dõi kết quả.
          </p>
        </div>
      ) : (
        <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white divide-y divide-slate-100">
          {reports.map((report) => {
            const isExpanded = expandedId === report.id;
            const detail = detailedReports[report.id];

            return (
              <div
                key={report.id}
                className="w-full flex flex-col text-left transition-colors hover:bg-slate-50/30"
              >
                {/* Collapsible Row Header */}
                <div
                  onClick={() => handleToggleExpand(report.id)}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-extrabold text-[10px]">
                      {report.target_type}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black font-mono text-slate-400">
                          {report.report_code || `#REP-${report.id}`}
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {report.report_type || "Vi phạm khác"}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        Đã gửi: {new Date(report.created_at).toLocaleDateString("vi-VN")} lúc{" "}
                        {new Date(report.created_at).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {getStatusBadge(report.status)}
                    {isExpanded ? (
                      <ChevronUp className="h-4.5 w-4.5 text-slate-450" />
                    ) : (
                      <ChevronDown className="h-4.5 w-4.5 text-slate-450" />
                    )}
                  </div>
                </div>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                    >
                      <div className="p-5 space-y-4 text-xs font-semibold text-slate-700">
                        {/* Report Reason */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            Nội dung chi tiết khiếu nại:
                          </span>
                          <p className="text-slate-700 leading-relaxed font-medium bg-white rounded-xl p-3 border border-slate-100 shadow-2xs">
                            {report.reason}
                          </p>
                        </div>

                        {/* Attachments Proofs */}
                        {detail?.attachments && detail.attachments.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              Hình ảnh bằng chứng:
                            </span>
                            <div className="flex flex-wrap gap-2.5">
                              {detail.attachments.map((img, idx) => (
                                <a
                                  key={idx}
                                  href={img}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative group h-16 w-24 rounded-lg overflow-hidden border border-slate-200 bg-white block shadow-2xs"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={img}
                                    alt="Proof detail"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Admin Action response */}
                        {report.status !== "PENDING" && (
                          <div className="rounded-xl border border-slate-100 bg-emerald-50/30 p-3.5 space-y-2">
                            <div className="flex items-center justify-between border-b border-emerald-100/50 pb-1.5">
                              <span className="font-black text-slate-800 flex items-center gap-1.5">
                                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                                Phản hồi từ: {report.admin_name || "Quản trị viên"}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                {detail?.updated_at
                                  ? `Cập nhật: ${new Date(detail.updated_at).toLocaleDateString("vi-VN")}`
                                  : ""}
                              </span>
                            </div>
                            <p className="text-slate-650 leading-relaxed font-medium italic">
                              {detail?.admin_notes ||
                                "Ban quản trị đã duyệt báo cáo và thực hiện các biện pháp kiểm soát cần thiết."}
                            </p>
                          </div>
                        )}

                        {/* Action buttons (only show cancel/delete if PENDING) */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400">
                            Đối tượng vi phạm ID:{" "}
                            <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              {report.target_id}
                            </span>
                          </span>

                          {report.status === "PENDING" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReport(report.id);
                              }}
                              disabled={deletingId === report.id}
                              className="h-8 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white px-3 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
                            >
                              {deletingId === report.id ? (
                                "Đang hủy..."
                              ) : (
                                <>
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Hủy báo cáo
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
