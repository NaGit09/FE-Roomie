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
  User,
  Save,
  ShieldCheck,
  Mail,
  Calendar,
  UserCog,
  AlertOctagon,
  UserX,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { UserApi } from "@/services/api/user";
import { UserProfile } from "@/schema/user/profile";

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Detail Modal States
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form Fields
  const [newStatus, setNewStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [newRole, setNewRole] = useState<"RENTER" | "LANDLORD" | "ADMIN">("RENTER");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserApi.getAllUsers({ skip: 0, limit: 100 });
      if (response && response.code === 200 && response.data && Array.isArray((response.data as any).items)) {
        setUsers((response.data as any).items);
      } else if (response && response.code === 200 && Array.isArray(response.data)) {
        setUsers(response.data as any);
      } else {
        setUsers([]);
        toast.error("Không thể lấy danh sách thành viên.");
      }
    } catch (err: any) {
      console.error("Error loading users for admin:", err);
      setUsers([]);
      toast.error("Có lỗi xảy ra khi tải dữ liệu thành viên.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, []);

  if (!mounted) return null;

  // Filters
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || u.status === statusFilter;

    const matchesRole =
      roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Metrics
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const suspendedCount = users.filter((u) => u.status === "INACTIVE").length;
  const landlordCount = users.filter((u) => u.role === "LANDLORD").length;
  const renterCount = users.filter((u) => u.role === "RENTER").length;

  const handleOpenDetail = (u: UserProfile) => {
    setSelectedUser(u);
    setNewStatus(u.status);
    setNewRole(u.role);
    setIsDetailOpen(true);
  };

  const handleUpdateStatusAndRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);

    try {
      // 1. Update status if changed
      if (newStatus !== selectedUser.status) {
        await UserApi.updateUserStatus(selectedUser.id, newStatus);
      }
      
      // 2. Update role if changed
      if (newRole !== selectedUser.role) {
        await UserApi.updateUserRole(selectedUser.id, newRole);
      }

      toast.success("Cập nhật thông tin thành viên thành công!");
      fetchUsers();
      setIsDetailOpen(false);
    } catch (err: any) {
      console.error("Error updating user status/role:", err);
      toast.error("Không thể cập nhật thông tin thành viên.");
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-rose-500/10 border-rose-500/20 text-rose-400";
      case "LANDLORD":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "RENTER":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      default:
        return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "INACTIVE":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      default:
        return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-10 text-slate-100 font-sans w-full">
      {/* 1. Header & Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
            <UserCog className="h-3.5 w-3.5" />
            Hệ thống quản lý thành viên
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100 font-heading">
            QUẢN LÝ THÀNH VIÊN
          </h2>
          <p className="text-xs text-slate-400 font-medium font-body max-w-xl">
            Xem danh sách tài khoản, chuyển đổi quyền hạn (Renter, Landlord, Admin) hoặc khóa/kích hoạt tài khoản người dùng vi phạm.
          </p>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {[
          { label: "Tổng thành viên", value: totalCount, color: "text-slate-350" },
          { label: "Đang hoạt động", value: activeCount, color: "text-emerald-500" },
          { label: "Đã đình chỉ", value: suspendedCount, color: "text-red-500" },
          { label: "Chủ nhà (Landlord)", value: landlordCount, color: "text-amber-500" },
          { label: "Khách thuê (Renter)", value: renterCount, color: "text-blue-500" },
        ].map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md p-4 text-left space-y-1.5 shadow-md"
          >
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-slate-500 block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#080d1a]/40 border border-white/5">
        {/* Search */}
        <div className="flex items-center gap-2 h-11 bg-slate-900/60 rounded-xl px-3.5 border border-white/5 text-xs text-slate-400 w-full md:max-w-xs focus-within:border-emerald-500/50 transition-colors">
          <Search className="h-4.5 w-4.5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Tìm theo tên, email, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 font-medium"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Vai trò:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 border border-white/5 bg-slate-900 rounded-lg px-3 text-slate-200 outline-none text-[10px] font-bold cursor-pointer"
            >
              <option value="ALL">TẤT CẢ VAI TRÒ</option>
              <option value="ADMIN">ADMIN</option>
              <option value="LANDLORD">LANDLORD</option>
              <option value="RENTER">RENTER</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-555 font-bold uppercase tracking-wider">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 border border-white/5 bg-slate-900 rounded-lg px-3 text-slate-200 outline-none text-[10px] font-bold cursor-pointer"
            >
              <option value="ALL">TẤT CẢ TRẠNG THÁI</option>
              <option value="ACTIVE">HOẠT ĐỘNG</option>
              <option value="INACTIVE">ĐÃ ĐÌNH CHỈ</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table view */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-9 w-9 text-blue-505 text-blue-500 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Đang tải hồ sơ thành viên...
          </span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-[2.5rem] border border-white/5 bg-[#080d1a]/30 p-16 text-center space-y-4 max-w-md mx-auto">
          <AlertOctagon className="h-10 w-10 text-slate-600 animate-pulse mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">Không tìm thấy thành viên</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-body">
            Thử đổi từ khóa hoặc bộ lọc trạng thái để tìm kiếm lại.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#080d1a]/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 uppercase font-mono tracking-wider font-bold">
                <th className="py-4 px-6 pl-8">Mã tài khoản (UUID)</th>
                <th className="py-4 px-4">Thành viên</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Vai trò</th>
                <th className="py-4 px-4">Lượt đăng tin free</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-6 pr-8 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 text-slate-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6 pl-8 font-mono font-bold text-slate-400 text-[10px]">
                    {user.id}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-extrabold text-[10px] shrink-0">
                        {user.full_name?.substring(0, 2).toUpperCase() || "US"}
                      </div>
                      <span>{user.full_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300 font-medium">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-300 text-center md:text-left pl-6">
                    {user.free_usage_count}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${getStatusBadgeColor(
                        user.status
                      )}`}
                    >
                      {user.status === "ACTIVE" ? "Hoạt động" : "Đình chỉ"}
                    </span>
                  </td>
                  <td className="py-4 px-6 pr-8 text-right">
                    <button
                      onClick={() => handleOpenDetail(user)}
                      className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 text-slate-400 flex items-center justify-center cursor-pointer transition-all active:scale-90 text-[10px] font-bold uppercase tracking-wider gap-1.5 ml-auto"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Chi tiết / Chỉnh sửa
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
        {isDetailOpen && selectedUser && (
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

              {/* Header */}
              <div className="space-y-1.5 text-left border-b border-white/5 pb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${getStatusBadgeColor(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status === "ACTIVE" ? "Hoạt động" : "Đình chỉ"}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${getRoleBadgeColor(
                      selectedUser.role
                    )}`}
                  >
                    Vai trò: {selectedUser.role}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 font-heading">
                  CHI TIẾT THÀNH VIÊN: {selectedUser.full_name}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  User ID: {selectedUser.id}
                </p>
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                {/* Left Panel: Stats */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-3">
                    <span className="text-slate-500 font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      Thông tin cơ bản
                    </span>
                    <div className="space-y-2 text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Đăng ký: {new Date(selectedUser.created_at).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Số tin free còn lại: {selectedUser.free_usage_count}</span>
                      </div>
                    </div>
                  </div>

                  {/* Landlord Profile Details if applicable */}
                  {selectedUser.role === "LANDLORD" && selectedUser.landlord_profile && (
                    <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 space-y-3">
                      <span className="text-amber-400 font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Hồ sơ chủ nhà (Landlord Profile)
                      </span>
                      <div className="space-y-1.5 text-slate-300">
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase">Số điện thoại liên hệ</span>
                          <span className="font-bold text-xs">{selectedUser.landlord_profile.phonenumber || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase">Facebook Link</span>
                          {selectedUser.landlord_profile.facebook ? (
                            <a
                              href={selectedUser.landlord_profile.facebook}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:underline break-all"
                            >
                              {selectedUser.landlord_profile.facebook}
                            </a>
                          ) : (
                            <span className="font-semibold text-slate-400">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Panel: Settings controls */}
                <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
                  <form onSubmit={handleUpdateStatusAndRole} className="space-y-4">
                    <span className="text-emerald-400 font-black uppercase tracking-wider block text-[9px]">
                      Kiểm duyệt & Chỉnh sửa quyền
                    </span>

                    {/* Role Control */}
                    <div className="space-y-2">
                      <label className="text-slate-400 block text-[9px] uppercase tracking-wider">
                        Phân bổ vai trò tài khoản
                      </label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as any)}
                        className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50 cursor-pointer text-xs font-bold"
                      >
                        <option value="RENTER">RENTER (Khách đi thuê)</option>
                        <option value="LANDLORD">LANDLORD (Chủ cho thuê)</option>
                        <option value="ADMIN">ADMIN (Quản trị hệ thống)</option>
                      </select>
                    </div>

                    {/* Status Control */}
                    <div className="space-y-2">
                      <label className="text-slate-400 block text-[9px] uppercase tracking-wider">
                        Trạng thái hoạt động
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        className="w-full h-11 border border-white/5 bg-slate-900 rounded-xl px-4 text-slate-200 outline-none focus:border-emerald-500/50 cursor-pointer text-xs font-bold"
                      >
                        <option value="ACTIVE">ACTIVE (Đang hoạt động)</option>
                        <option value="INACTIVE">INACTIVE (Khóa/Đình chỉ tài khoản)</option>
                      </select>
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="h-11 px-5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 w-full"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Lưu thay đổi kiểm duyệt
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
