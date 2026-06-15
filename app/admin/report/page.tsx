/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  X,
  Loader2,
  Activity,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  User,
  ExternalLink,
  Save,
  CheckCircle,
  AlertOctagon,
  Clock,
  UserCheck,
  Clock3,
} from "lucide-react";
import { toast } from "sonner";
import { ReportApi } from "@/services/api/report";
import {
  ReportListResponse,
  ReportResponse,
  ReportStatus,
  ReportPriority,
} from "@/schema/report/report";

export default function AdminReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [reports, setReports] = useState<ReportListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Detail Modal States
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form Fields for review/update
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<ReportStatus>("PENDING");
  const [priority, setPriority] = useState<ReportPriority>("MEDIUM");
  const [deadline, setDeadline] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await ReportApi.getAllReports({ page: 1, size: 50 });
      if (response && response.code === 200 && response.data) {
        setReports(response.data.items);
      } else {
        setReports([]);
        toast.error("Không thể lấy danh sách báo cáo.");
      }
    } catch (err: any) {
      console.error("Error loading all reports for admin:", err);
      setReports([]);
      toast.error("Có lỗi xảy ra khi tải dữ liệu báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchReports();
  }, []);

  if (!mounted) return null;

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.target_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.report_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Operational metrics
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === "PENDING").length;
  const inReviewCount = reports.filter((r) => r.status === "IN_REVIEW").length;
  const resolvedCount = reports.filter((r) => r.status === "RESOLVED").length;
  const rejectedCount = reports.filter((r) => r.status === "REJECTED").length;

  const handleOpenDetail = async (report: ReportListResponse) => {
    setAdminNotes("");
    setNewStatus(report.status);
    setPriority(report.priority);
    setDeadline("");
    setAssigneeId(report.admin_id || "");

    try {
      const res = await ReportApi.getReport(report.id);
      if (res && res.code === 200 && res.data) {
        setSelectedReport(res.data);
        setAdminNotes(res.data.admin_notes || "");
      } else {
        toast.error("Không thể tải chi tiết báo cáo.");
        setIsDetailOpen(false);
      }
    } catch (err) {
      console.error("Error loading report detail:", err);
      toast.error("Không thể tải chi tiết báo cáo.");
      setIsDetailOpen(false);
    }
    setIsDetailOpen(true);
  };

  const handleAcceptRequest = async () => {
    if (!selectedReport) return;
    setActionLoading(true);

    try {
      const payload = {
        priority: priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        admin_name: "Admin Roomie",
        admin_avatar: null,
      };

      const res = await ReportApi.acceptReportRequest(selectedReport.id, payload);
      if (res && res.code === 200 && res.data) {
        toast.success("Đã tiếp nhận xử lý báo cáo!");
        setSelectedReport(res.data);
        fetchReports();
      } else {
        toast.error("Không thể duyệt tiếp nhận đơn báo cáo.");
      }
    } catch (err) {
      console.error("Error accepting report:", err);
      toast.error("Không thể tiếp nhận xử lý báo cáo.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignReport = async () => {
    if (!selectedReport || !assigneeId.trim()) {
      toast.error("Vui lòng điền Assignee ID để bàn giao công việc.");
      return;
    }
    setActionLoading(true);

    try {
      const payload = {
        assignee_id: assigneeId.trim(),
        priority: priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        admin_name: "Admin Roomie",
        admin_avatar: null,
      };

      const res = await ReportApi.assignReport(selectedReport.id, payload);
      if (res && res.code === 200 && res.data) {
        toast.success(`Đã phân công báo cáo cho Admin ID ${assigneeId}!`);
        setSelectedReport(res.data);
        fetchReports();
      } else {
        toast.error("Phân công báo cáo vi phạm thất bại.");
      }
    } catch (err) {
      console.error("Error assigning report:", err);
      toast.error("Không thể phân công báo cáo vi phạm.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    setActionLoading(true);

    try {
      const payload = {
        status: newStatus,
        admin_notes: adminNotes.trim() || null,
      };

      const res = await ReportApi.updateReportStatus(selectedReport.id, payload);
      if (res && res.code === 200 && res.data) {
        toast.success("Cập nhật trạng thái báo cáo thành công!");
        setSelectedReport(res.data);
        fetchReports();
      } else {
        toast.error("Cập nhật trạng thái báo cáo thất bại.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Không thể cập nhật trạng thái báo cáo.");
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityBadgeColor = (p: ReportPriority) => {
    switch (p) {
      case "LOW":
        return "bg-slate-500/10 border-slate-500/20 text-slate-400";
      case "MEDIUM":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "HIGH":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "URGENT":
        return "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse";
    }
  };

  const getStatusBadgeColor = (s: string) => {
    switch (s) {
      case "PENDING":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "IN_REVIEW":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "RESOLVED":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "REJECTED":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      default:
        return "bg-slate-500/10 border-slate-500/25 text-slate-400";
    }
  };

  return (
    <div className="space-y-10 text-slate-100 font-sans w-full">
      {/* 1. Header & Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-red-400">
            <Activity className="h-3.5 w-3.5" />
            Hệ thống xử lý vi phạm & khiếu nại
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 font-heading">
            QUẢN LÝ BÁO CÁO VI PHẠM
          </h2>
          <p className="text-xs text-slate-400 font-medium font-body max-w-xl">
            Tiếp nhận báo cáo từ người dùng về phòng trọ giả mạo, các tin đăng ảo, hoặc các hành vi quấy rối, lừa đảo cọc trên hệ thống.
          </p>
        </div>
      </div>

      {/* 2. Mini Summary Metrics Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: "Tổng báo cáo", value: totalCount, color: "text-slate-350", bg: "bg-slate-500/10" },
          { label: "Chờ xử lý", value: pendingCount, color: "text-amber-500", bg: "bg-amber-500/10", pulse: pendingCount > 0 },
          { label: "Đang xem xét", value: inReviewCount, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Đã xử lý", value: resolvedCount, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Đã từ chối", value: rejectedCount, color: "text-red-500", bg: "bg-red-500/10" },
        ].map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md p-4 text-left space-y-1.5 shadow-md relative"
          >
            {m.pulse && (
              <span className="absolute top-4 right-4 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-450 bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-slate-500 block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#080d1a]/40 border border-white/5">
        {/* Search */}
        <div className="flex items-center gap-2 h-11 bg-slate-900/60 rounded-xl px-3.5 border border-white/5 text-xs text-slate-400 w-full sm:max-w-xs focus-within:border-emerald-500/50 transition-colors">
          <Search className="h-4.5 w-4.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Tìm theo ID, người báo cáo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 font-medium"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { label: "Tất cả", value: "ALL" },
            { label: "Chờ xử lý", value: "PENDING" },
            { label: "Đang xem xét", value: "IN_REVIEW" },
            { label: "Đã xử lý", value: "RESOLVED" },
            { label: "Đã từ chối", value: "REJECTED" },
          ].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setStatusFilter(tab.value)}
              className={`h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                statusFilter === tab.value
                  ? "bg-red-500 text-slate-950 shadow-md shadow-red-500/10"
                  : "bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Table Grid */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-9 w-9 text-red-500 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Đang tải dữ liệu đơn vi phạm...
          </span>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="rounded-[2.5rem] border border-white/5 bg-[#080d1a]/30 p-16 text-center space-y-4 max-w-md mx-auto">
          <AlertOctagon className="h-10 w-10 text-slate-600 animate-pulse mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">Không tìm thấy báo cáo phù hợp</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-body">
            Vui lòng đổi từ khóa tìm kiếm hoặc cập nhật bộ lọc trạng thái để nhận kết quả kiểm duyệt.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 uppercase font-mono tracking-wider font-bold">
                <th className="py-4 px-6 pl-8">Mã đơn</th>
                <th className="py-4 px-4">Đối tượng</th>
                <th className="py-4 px-4">Người báo cáo</th>
                <th className="py-4 px-4">Nội dung lý do</th>
                <th className="py-4 px-4">Độ ưu tiên</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-6 pr-8 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 text-slate-300">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6 pl-8 font-mono font-bold text-slate-200">
                    {report.report_code || `#REP-${report.id}`}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[10px] text-slate-500 uppercase">
                        {report.target_type}
                      </span>
                      <span className="font-mono text-slate-300 font-bold mt-0.5">
                        ID: {report.target_id}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-200">
                    {report.reporter_name || "Anonymous"}
                  </td>
                  <td className="py-4 px-4 max-w-xs truncate italic text-slate-400" title={report.reason}>
                    {report.reason}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getPriorityBadgeColor(
                        report.priority
                      )}`}
                    >
                      {report.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getStatusBadgeColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 pr-8 text-right">
                    <button
                      onClick={() => handleOpenDetail(report)}
                      className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90 text-[10px] font-bold uppercase tracking-wider gap-1.5 ml-auto"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Detail Modal Sheet */}
      <AnimatePresence>
        {isDetailOpen && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-[#0f172a] shadow-2xl p-6 sm:p-10 z-10 text-left space-y-6 max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1.5 text-left border-b border-white/5 pb-4 shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${getStatusBadgeColor(
                      selectedReport.status
                    )}`}
                  >
                    Trạng thái: {selectedReport.status}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${getPriorityBadgeColor(
                      selectedReport.priority
                    )}`}
                  >
                    Độ ưu tiên: {selectedReport.priority}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 font-heading">
                  ĐƠN BÁO CÁO VI PHẠM {selectedReport.report_code || `#REP-${selectedReport.id}`}
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed font-body">
                  Ngày tạo đơn: {new Date(selectedReport.created_at).toLocaleString("vi-VN")}
                </p>
              </div>

              {/* Scrollable Form Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left overflow-y-auto flex-1 pr-1 pb-1">
                {/* Left Side: Report Metadata */}
                <div className="space-y-4">
                  {/* Target Details */}
                  <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-2.5">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">
                      Đối Tượng Báo Cáo
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Phân Loại</span>
                        <span className="font-extrabold text-slate-200 uppercase text-xs">
                          {selectedReport.target_type}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Mã Đối Tượng</span>
                        <span className="font-mono font-extrabold text-slate-200 text-xs">
                          {selectedReport.target_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reporter details */}
                  <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-2.5">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      Người dùng báo cáo
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xs shrink-0">
                        {selectedReport.reporter_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase() || "A"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-200">
                          {selectedReport.reporter_name || "N/A"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          ID: {selectedReport.reporter_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reason text & category */}
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">
                      Lý do & Nội dung báo cáo vi phạm
                    </span>
                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 leading-relaxed font-medium italic text-slate-350">
                      <span className="font-bold block not-italic text-[10px] text-red-400 mb-1.5">
                        [{selectedReport.report_type || "Vi phạm khác"}]
                      </span>
                      {selectedReport.reason}
                    </div>
                  </div>

                  {/* Attachments */}
                  {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px]">
                        Hình ảnh minh chứng ({selectedReport.attachments.length})
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedReport.attachments.map((img, idx) => (
                          <a
                            key={idx}
                            href={img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group h-14 w-20 rounded-lg overflow-hidden border border-white/5 bg-slate-900 block"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt="Proof Detail Admin"
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ExternalLink className="h-3 w-3" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Admin Intervention Form */}
                <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
                  {/* Status & notes update form */}
                  <form onSubmit={handleUpdateStatus} className="space-y-4">
                    <span className="text-emerald-400 font-black uppercase tracking-wider block text-[9px]">
                      Hành động xử lý của Quản trị viên
                    </span>

                    <div className="space-y-2">
                      <label className="text-slate-400 block text-[9px] uppercase tracking-wider">
                        Cập nhật trạng thái
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                        className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50 cursor-pointer text-xs font-bold"
                      >
                        <option value="PENDING">PENDING (Chờ xử lý)</option>
                        <option value="IN_REVIEW">IN_REVIEW (Đang xem xét)</option>
                        <option value="RESOLVED">RESOLVED (Đã giải quyết)</option>
                        <option value="REJECTED">REJECTED (Từ chối báo cáo)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 block text-[9px] uppercase tracking-wider">
                        Phản hồi / Ghi chú của Admin
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Nhập phản hồi gửi đến người dùng hoặc ghi chú kiểm duyệt nội bộ..."
                        rows={4}
                        className="w-full border border-white/5 bg-slate-900 rounded-xl p-4 text-slate-250 placeholder-slate-500 outline-none focus:border-emerald-500/50 text-xs font-medium resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="h-10 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 w-full"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Lưu cập nhật ghi chú & trạng thái
                    </button>
                  </form>

                  {/* Accept & Assign for Pending reports */}
                  {selectedReport.status === "PENDING" && (
                    <div className="pt-4 border-t border-white/5 space-y-4 text-left">
                      <span className="text-amber-400 font-black uppercase tracking-wider block text-[9px] flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Tiếp nhận & Bàn giao xử lý nhanh
                      </span>

                      {/* Settings parameters */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-slate-500 block text-[8px] uppercase tracking-wider">
                            Đặt mức ưu tiên
                          </label>
                          <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as ReportPriority)}
                            className="w-full h-9 border border-white/5 bg-slate-900 rounded-lg px-2 text-slate-200 outline-none focus:border-amber-500/50 cursor-pointer text-[10px] font-bold"
                          >
                            <option value="LOW">LOW (Thấp)</option>
                            <option value="MEDIUM">MEDIUM (Trung bình)</option>
                            <option value="HIGH">HIGH (Cao)</option>
                            <option value="URGENT">URGENT (Khẩn cấp)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-500 block text-[8px] uppercase tracking-wider">
                            Hạn xử lý (Deadline)
                          </label>
                          <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full h-9 border border-white/5 bg-slate-900 rounded-lg px-2 text-slate-200 outline-none focus:border-amber-500/50 text-[10px] font-bold"
                          />
                        </div>
                      </div>

                      {/* Bàn giao Assignee ID */}
                      <div className="space-y-1">
                        <label className="text-slate-500 block text-[8px] uppercase tracking-wider">
                          Assignee Admin ID (Để phân công)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ví dụ: admin_2"
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(e.target.value)}
                            className="flex-1 h-9 border border-white/5 bg-slate-900 rounded-lg px-3 text-slate-200 outline-none text-[10px]"
                          />
                          <button
                            type="button"
                            onClick={handleAssignReport}
                            disabled={actionLoading}
                            className="h-9 px-3.5 rounded-lg border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500 hover:text-slate-950 text-amber-400 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 active:scale-95 disabled:opacity-50"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Phân công
                          </button>
                        </div>
                      </div>

                      {/* Accept Immediately Button */}
                      <button
                        type="button"
                        onClick={handleAcceptRequest}
                        disabled={actionLoading}
                        className="h-10 px-5 rounded-xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500 text-white font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Nhận tự xử lý (Tiếp nhận ngay)
                      </button>
                    </div>
                  )}

                  {/* Display assignment details if assigned and not pending */}
                  {selectedReport.status !== "PENDING" && selectedReport.admin_id && (
                    <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3.5 space-y-2">
                      <span className="text-[8px] font-black uppercase tracking-wider text-slate-500 block">
                        Thông tin phân công kiểm duyệt:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-400">
                        <div>
                          <span className="block text-[8px] text-slate-500">ADMIN PHỤ TRÁCH</span>
                          <span className="text-slate-200 font-extrabold">
                            {selectedReport.admin_name || `Admin (${selectedReport.admin_id})`}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-500">HẠN DEADLINE</span>
                          <span className="text-slate-200 font-extrabold flex items-center gap-1 mt-0.5">
                            <Clock3 className="h-3 w-3 text-amber-500" />
                            {selectedReport.deadline
                              ? new Date(selectedReport.deadline).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
