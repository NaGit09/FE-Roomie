/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { UserApi } from "@/services/api/user";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Shield,
  Coins,
  Edit3,
  Save,
  X,
  Calendar,
  CheckCircle2,
  Lock,
  Phone,
  Link as LinkIcon,
  MessageCircle
} from "lucide-react";

export default function LandlordProfilePage() {
  const { user, setUser } = useAuthStore();

  // Form edit states
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [zalo, setZalo] = useState("");
  const [facebook, setFacebook] = useState("");

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const updated = await UserApi.getMe();
        setUser(updated.data as any);
        setFullName(updated.data.full_name || "");
        setPhonenumber(updated.data.landlord_profile?.phonenumber || "");
        setZalo(updated.data.landlord_profile?.zalo || "");
        setFacebook(updated.data.landlord_profile?.facebook || "");
      } catch (err) {
        console.warn("Failed to sync profile from server:", err);
      } finally {
        setSyncing(false);
      }
    };
    fetchLatestProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (syncing && !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-semibold text-slate-400">
          Đang tải thông tin chủ nhà...
        </p>
      </div>
    );
  }

  const currentUser = user!;

  // Generate initials cleanly
  const initials = currentUser.full_name
    ? currentUser.full_name
        .trim()
        .split(/\s+/)
        .map((n: string) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Họ và tên không được để trống!");
      return;
    }

    setLoading(true);
    try {
      // Update both core user and landlord specific profile
      await Promise.all([
        UserApi.updateMe(fullName.trim()),
        UserApi.updateLandlordProfile({
          phonenumber: phonenumber.trim() || undefined,
          zalo: zalo.trim() || undefined,
          facebook: facebook.trim() || undefined,
        })
      ]);

      // Fetch fresh data
      const updatedUser = await UserApi.getMe();
      setUser(updatedUser.data as any);
      toast.success("Cập nhật thông tin chủ nhà thành công!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Cập nhật thất bại. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(currentUser.full_name || "");
    setPhonenumber(currentUser.landlord_profile?.phonenumber || "");
    setZalo(currentUser.landlord_profile?.zalo || "");
    setFacebook(currentUser.landlord_profile?.facebook || "");
    setIsEditing(false);
  };

  // Format creation date
  const joinDate = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Chưa cập nhật";

  return (
    <div className="space-y-8">
      {/* ── Top Header Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl -mr-10 -mt-10" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Dynamic Avatar */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] text-xl font-black select-none shadow-md bg-amber-100 text-amber-700 shadow-amber-100/50 ring-4 ring-amber-50">
              {initials}
            </div>

            <div className="space-y-1">
              <h1 className="font-heading text-xl font-black text-slate-800 flex items-center gap-2">
                {currentUser.full_name}
                <CheckCircle2 className="h-4 w-4 text-emerald-500 fill-emerald-50" />
              </h1>
              <p className="text-sm font-semibold text-slate-400">
                {currentUser.email}
              </p>

              {/* Status & Role Pill Row */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700">
                  Chủ nhà (Landlord)
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>

          {/* Edit toggle button */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm active:scale-95 z-10"
            >
              <Edit3 className="h-4 w-4 text-slate-400" />
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Side: Form Details & Security (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          <form onSubmit={handleUpdate} className="space-y-8">
            
            {/* System Info Section */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-black text-slate-800 border-b border-slate-50 pb-4 mb-6">
                Thông tin hệ thống
              </h2>

              <div className="space-y-6">
                {/* Input: Họ và tên */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <UserIcon className={`h-4.5 w-4.5 ${isEditing ? "text-primary" : "text-slate-300"}`} />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditing || loading}
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                        ${isEditing ? "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-800 bg-white" : "border-slate-100 bg-slate-50/50 text-slate-500 cursor-not-allowed"}
                      `}
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                </div>

                {/* Input: Email (Disabled) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Địa chỉ Email
                    </label>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                      <Lock className="h-3 w-3" /> Không thể thay đổi
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className="h-4.5 w-4.5 text-slate-300" />
                    </div>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-400 text-sm font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Public Contact Info Section */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="border-b border-slate-50 pb-4 mb-6">
                <h2 className="font-heading text-lg font-black text-slate-800">
                  Thông tin liên hệ công khai
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Thông tin này sẽ được hiển thị trên tin đăng của bạn để người thuê tiện liên lạc.
                </p>
              </div>

              <div className="space-y-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Phone className={`h-4.5 w-4.5 ${isEditing ? "text-emerald-500" : "text-slate-300"}`} />
                    </div>
                    <input
                      type="tel"
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                      disabled={!isEditing || loading}
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                        ${isEditing ? "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-800 bg-white" : "border-slate-100 bg-slate-50/50 text-slate-500 cursor-not-allowed"}
                      `}
                      placeholder="VD: 0912345678"
                    />
                  </div>
                </div>

                {/* Zalo */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Zalo (Số điện thoại hoặc Link)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <MessageCircle className={`h-4.5 w-4.5 ${isEditing ? "text-blue-500" : "text-slate-300"}`} />
                    </div>
                    <input
                      type="text"
                      value={zalo}
                      onChange={(e) => setZalo(e.target.value)}
                      disabled={!isEditing || loading}
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                        ${isEditing ? "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 bg-white" : "border-slate-100 bg-slate-50/50 text-slate-500 cursor-not-allowed"}
                      `}
                      placeholder="VD: 0912345678 hoặc https://zalo.me/..."
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Đường dẫn Facebook (Link)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <LinkIcon className={`h-4.5 w-4.5 ${isEditing ? "text-blue-600" : "text-slate-300"}`} />
                    </div>
                    <input
                      type="url"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      disabled={!isEditing || loading}
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                        ${isEditing ? "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-slate-800 bg-white" : "border-slate-100 bg-slate-50/50 text-slate-500 cursor-not-allowed"}
                      `}
                      placeholder="VD: https://facebook.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Form actions (Visible only in edit mode) */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 border-t border-slate-50 pt-5 mt-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 px-5 py-2.5 text-sm font-black text-white hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Lưu thay đổi
                  </button>
                </div>
              )}

            </div>
          </form>
        </div>

        {/* Right Side: Account Analytics/Stats Card (1 column) */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-lg font-black text-slate-800 border-b border-slate-50 pb-1 mb-1">
              Thống kê tài khoản
            </h2>

            <div className="space-y-6 mt-4">
              {/* Coin Usage Stat Card */}
              <div className="rounded-2xl bg-amber-500/5 p-4 border border-amber-500/10 relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 group-hover:scale-110 transition-transform duration-300">
                  <Coins className="h-20 w-20 text-amber-500" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Lượt đăng tin miễn phí
                    </span>
                    <div className="font-heading text-2xl font-black text-amber-600">
                      {currentUser.free_usage_count ?? 0}{" "}
                      <span className="text-xs font-semibold text-amber-600/70">
                        lượt
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Status Card */}
              <div className="space-y-4 pt-2">
                {/* Join Date Row */}
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Ngày tham gia
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {joinDate}
                  </span>
                </div>

                {/* Profile ID Row */}
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                    <Shield className="h-4 w-4 text-slate-400" />
                    Mã hồ sơ
                  </span>
                  <span
                    className="text-xs font-extrabold text-slate-400 font-mono tracking-tight select-all truncate max-w-[120px]"
                    title={currentUser.profile_id}
                  >
                    {currentUser.profile_id || "N/A"}
                  </span>
                </div>

                {/* Account Status Row */}
                <div className="flex items-center justify-between py-2">
                  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                    Trạng thái hồ sơ
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-600">
                    Đã xác minh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
