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
  CheckCircle,
  Coins,
  Calendar,
  AlertOctagon,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Ban
} from "lucide-react";
import { toast } from "sonner";
import { OrderApi } from "@/services/api/order";
import { Order } from "@/schema/user/order";
import formatVND from "@/utils/priceUtils";

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Detail Modal States
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form Fields
  const [newStatus, setNewStatus] = useState<string>("PENDING");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await OrderApi.get_all_order();
      if (response && response.code === 200 && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
        toast.error("Không thể lấy danh sách hóa đơn.");
      }
    } catch (err) {
      console.error("Error loading orders for admin:", err);
      setOrders([]);
      toast.error("Có lỗi xảy ra khi tải dữ liệu hóa đơn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  if (!mounted) return null;

  // Filters
  const filteredOrders = orders.filter((o) => {
    const orderCodeStr = o.order_code ? String(o.order_code).toLowerCase() : "";
    const userIdStr = o.user_id ? String(o.user_id).toLowerCase() : "";
    const idStr = o.id ? String(o.id).toLowerCase() : "";
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      orderCodeStr.includes(query) ||
      userIdStr.includes(query) ||
      idStr.includes(query);

    const matchesStatus =
      statusFilter === "ALL" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const completedCount = completedOrders.length;
  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;
  const successRate = orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 100;

  const handleOpenDetail = (o: Order) => {
    setSelectedOrder(o);
    setNewStatus(o.status);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setActionLoading(true);

    try {
      await OrderApi.update_order(selectedOrder.id, newStatus);
      toast.success("Cập nhật trạng thái giao dịch thành công!");
      fetchOrders();
      setIsDetailOpen(false);
    } catch (err: any) {
      console.error("Error updating order status:", err);
      toast.error("Không thể cập nhật trạng thái giao dịch.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeColor = (s: string) => {
    switch (s) {
      case "COMPLETED":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "PENDING":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "CANCELLED":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      default:
        return "bg-slate-500/10 border-slate-500/25 text-slate-400";
    }
  };

  const getItemName = (itemType: string, itemId: number) => {
    if (itemType === "SUBSCRIPTION") {
      switch (itemId) {
        case 1: return "Gói Renter Basic";
        case 2: return "Gói Renter VIP";
        case 3: return "Gói Landlord Premium";
        case 4: return "Gói Landlord VIP";
        default: return `Gói dịch vụ #${itemId}`;
      }
    }
    return `${itemType} #${itemId}`;
  };

  return (
    <div className="space-y-10 text-slate-100 font-sans w-full">
      {/* 1. Header & Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-pink-400">
            <Coins className="h-3.5 w-3.5" />
            Cổng quản lý doanh thu & Giao dịch thanh toán
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 font-heading">
            QUẢN LÝ GIAO DỊCH
          </h2>
          <p className="text-xs text-slate-400 font-medium font-body max-w-xl">
            Thống kê doanh số bán các gói cước premium thành viên, theo dõi lịch sử và xác thực giao dịch chuyển khoản thủ công.
          </p>
        </div>
      </div>

      {/* 2. Metrics Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: "Doanh thu thực tế", value: formatVND(totalRevenue), color: "text-[#FBBF24]" },
          { label: "Giao dịch thành công", value: completedCount, color: "text-emerald-500" },
          { label: "Đang thanh toán", value: pendingCount, color: "text-amber-500" },
          { label: "Đã hủy bỏ", value: cancelledCount, color: "text-red-500" },
          { label: "Tỷ lệ thành công", value: `${successRate}%`, color: "text-blue-500" },
        ].map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md p-4 text-left space-y-1.5 shadow-md"
          >
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-slate-500 block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-lg md:text-xl font-black ${m.color}`}>{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search & Quick Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#080d1a]/40 border border-white/5">
        {/* Search */}
        <div className="flex items-center gap-2 h-11 bg-slate-900/60 rounded-xl px-3.5 border border-white/5 text-xs text-slate-400 w-full sm:max-w-xs focus-within:border-emerald-500/50 transition-colors">
          <Search className="h-4.5 w-4.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Tìm theo Mã đơn hàng, ID thành viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 font-medium"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { label: "Tất cả giao dịch", value: "ALL" },
            { label: "Thành công", value: "COMPLETED" },
            { label: "Đang chờ", value: "PENDING" },
            { label: "Đã hủy", value: "CANCELLED" }
          ].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setStatusFilter(tab.value)}
              className={`h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                statusFilter === tab.value
                  ? "bg-pink-500 text-slate-950 shadow-md shadow-pink-500/10"
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
          <Loader2 className="h-9 w-9 text-pink-500 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Đang tải dữ liệu giao dịch...
          </span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-[2.5rem] border border-white/5 bg-[#080d1a]/30 p-16 text-center space-y-4 max-w-md mx-auto">
          <AlertOctagon className="h-10 w-10 text-slate-600 animate-pulse mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">Không tìm thấy giao dịch nào</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-body">
            Vui lòng thay đổi từ khóa tìm kiếm hoặc cập nhật bộ lọc trạng thái hóa đơn thanh toán.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 uppercase font-mono tracking-wider font-bold">
                <th className="py-4 px-6 pl-8">Mã đơn</th>
                <th className="py-4 px-4">Khách hàng (User ID)</th>
                <th className="py-4 px-4">Gói dịch vụ</th>
                <th className="py-4 px-4">Tổng tiền thanh toán</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-4">Thời gian tạo</th>
                <th className="py-4 px-6 pr-8 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 text-slate-300">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6 pl-8 font-mono font-bold text-slate-200">
                    {order.order_code}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-slate-450 text-[10px]" title={order.user_id}>
                    {order.user_id.substring(0, 18)}...
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-200">
                    {getItemName(order.item_type, order.item_id)}
                  </td>
                  <td className="py-4 px-4 font-black text-[#FBBF24]">
                    {formatVND(order.total_amount)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium font-body">
                    {order.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : "N/A"}
                  </td>
                  <td className="py-4 px-6 pr-8 text-right">
                    <button
                      onClick={() => handleOpenDetail(order)}
                      className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90 text-[10px] font-bold uppercase tracking-wider gap-1.5 ml-auto"
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
        {isDetailOpen && selectedOrder && (
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
              className="relative w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-[#0f172a] shadow-2xl p-6 sm:p-10 z-10 text-left space-y-6"
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
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${getStatusBadgeColor(
                    selectedOrder.status
                  )}`}
                >
                  Trạng thái: {selectedOrder.status}
                </span>
                <h3 className="text-xl font-bold text-slate-100 font-heading">
                  HÓA ĐƠN GIAO DỊCH {selectedOrder.order_code}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Giao dịch ID: {selectedOrder.id}
                </p>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                {/* Left Side: Order properties */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-3">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      Thông tin hóa đơn
                    </span>
                    <div className="space-y-2 text-slate-300 font-medium">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">Mã khách hàng (User ID)</span>
                        <span className="font-mono font-bold text-slate-200">{selectedOrder.user_id}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">Gói cước liên kết</span>
                        <span className="font-extrabold text-slate-200">{getItemName(selectedOrder.item_type, selectedOrder.item_id)}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">Tổng tiền thanh toán</span>
                        <span className="font-black text-[#FBBF24] text-sm">{formatVND(selectedOrder.total_amount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-2 text-slate-350">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-550 uppercase">Ngày tạo hóa đơn:</span>
                      <span className="font-bold">{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString("vi-VN") : "N/A"}</span>
                    </div>
                    {selectedOrder.paid_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-emerald-450 text-emerald-400 uppercase">Ngày thanh toán:</span>
                        <span className="font-bold text-emerald-400">{new Date(selectedOrder.paid_at).toLocaleString("vi-VN")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Action form */}
                <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
                  <form onSubmit={handleUpdateStatus} className="space-y-4">
                    <span className="text-pink-400 font-black uppercase tracking-wider block text-[9px]">
                      Thay đổi trạng thái giao dịch thủ công
                    </span>

                    <div className="space-y-2">
                      <label className="text-slate-400 block text-[9px] uppercase tracking-wider">
                        Cập nhật trạng thái
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-pink-500/50 cursor-pointer text-xs font-bold"
                      >
                        <option value="PENDING">PENDING (Chờ thanh toán)</option>
                        <option value="COMPLETED">COMPLETED (Thanh toán thành công)</option>
                        <option value="CANCELLED">CANCELLED (Hủy bỏ giao dịch)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="h-11 px-5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/10 w-full"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Cập nhật trạng thái giao dịch
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
