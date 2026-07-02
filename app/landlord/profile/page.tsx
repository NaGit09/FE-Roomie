/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { UserApi } from "@/services/api/user";
import { SubscriptionApi } from "@/services/api/subcription";
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
  MessageCircle,
  CreditCard,
  Sparkles,
  Info,
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from "next/link";

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

  // Subscription plan states
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    const fetchLatestProfileAndPlan = async () => {
      try {
        const [profileRes, subRes] = await Promise.all([
          UserApi.getMe(),
          SubscriptionApi.upgrade_subscription()
        ]);

        setUser(profileRes.data as any);
        setFullName(profileRes.data.full_name || "");
        setPhonenumber(profileRes.data.landlord_profile?.phonenumber || "");
        setZalo(profileRes.data.landlord_profile?.zalo || "");
        setFacebook(profileRes.data.landlord_profile?.facebook || "");

        if (subRes && subRes.code === 200) {
          setActivePlan(subRes.data || null);
        }
      } catch (err) {
        console.warn("Failed to sync profile or subscription plan:", err);
      } finally {
        setSyncing(false);
        setLoadingPlan(false);
      }
    };
    fetchLatestProfileAndPlan();
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

  // Check current plan details
  const hasSub = activePlan?.current_subscription?.is_active;
  const planTitle = hasSub ? activePlan.current_subscription.subscription?.sub_title : "Gói Thường (Free Account)";
  const planEndDate = hasSub && activePlan.current_subscription.time_end
    ? new Date(activePlan.current_subscription.time_end).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="space-y-8 text-left">
      {/* ── Top Header Hero Banner ── */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-card p-6 md:p-8 shadow-lg">
        {/* Background gradient radial glow */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl -mr-12 -mt-12 pointer-events-none" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="flex items-center gap-5">
            {/* Dynamic Avatar */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] text-xl font-black select-none shadow-md bg-gradient-to-tr from-primary to-primary/80 text-white border border-primary/20 ring-4 ring-slate-100/50">
              {initials}
            </div>

            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
                {currentUser.full_name}
                <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-50 shrink-0" />
              </h1>
              <p className="text-sm font-semibold text-slate-500">
                {currentUser.email}
              </p>

              {/* Status & Role Pill Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  Chủ nhà (Landlord)
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-600 border border-emerald-200/50">
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
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-350 px-5 py-3 text-xs font-black uppercase tracking-wider text-slate-700 transition-all cursor-pointer shadow-sm active:scale-95 self-start md:self-center"
            >
              <Edit3 className="h-4 w-4 text-slate-400" />
              Chỉnh sửa hồ sơ
            </button>
          )}
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Side: Form Details (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="space-y-8">
            {/* System Info Section */}
            <div className="rounded-[2rem] border border-slate-200 bg-card p-6 md:p-8 shadow-lg space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-slate-800">
                  Thông tin hệ thống
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input: Họ và tên */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <UserIcon className={`h-4.5 w-4.5 ${isEditing ? "text-primary" : "text-slate-400"}`} />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditing || loading}
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                        ${isEditing ? "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 text-slate-800 bg-white" : "border-slate-150 bg-slate-50/50 text-slate-500 cursor-not-allowed"}
                      `}
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                </div>

                {/* Input: Email (Disabled) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Địa chỉ Email
                    </label>
                    <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
                      <Lock className="h-3 w-3" /> Lock
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className="h-4.5 w-4.5 text-slate-450" />
                    </div>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-150 bg-slate-50/50 text-slate-450 text-sm font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Public Contact Info Section */}
            <div className="rounded-[2rem] border border-slate-200 bg-card p-6 md:p-8 shadow-lg space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-emerald-500" />
                  Thông tin liên hệ công khai
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Thông tin liên hệ công khai giúp khách thuê chủ động liên lạc khi quan tâm phòng của bạn.
                </p>
              </div>

              <div className="space-y-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Số điện thoại liên hệ
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Phone className={`h-4.5 w-4.5 ${isEditing ? "text-emerald-500" : "text-slate-400"}`} />
                    </div>
                    <input
                      type="tel"
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                      disabled={!isEditing || loading}
                      className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                        ${isEditing ? "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-800 bg-white" : "border-slate-150 bg-slate-50/50 text-slate-500 cursor-not-allowed"}
                      `}
                      placeholder="VD: 0912345678"
                    />
                  </div>
                </div>

                {/* Zalo & Facebook row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Zalo */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Tài khoản Zalo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <MessageCircle className={`h-4.5 w-4.5 ${isEditing ? "text-blue-500" : "text-slate-400"}`} />
                      </div>
                      <input
                        type="text"
                        value={zalo}
                        onChange={(e) => setZalo(e.target.value)}
                        disabled={!isEditing || loading}
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                          ${isEditing ? "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 bg-white" : "border-slate-150 bg-slate-50/50 text-slate-500 cursor-not-allowed"}
                        `}
                        placeholder="Số điện thoại hoặc link Zalo"
                      />
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Link Facebook cá nhân
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <LinkIcon className={`h-4.5 w-4.5 ${isEditing ? "text-blue-600" : "text-slate-400"}`} />
                      </div>
                      <input
                        type="url"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        disabled={!isEditing || loading}
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 outline-none
                          ${isEditing ? "border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 text-slate-800 bg-white" : "border-slate-150 bg-slate-50/50 text-slate-500 cursor-not-allowed"}
                        `}
                        placeholder="Đường dẫn profile Facebook"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form actions (Visible only in edit mode) */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-2xl bg-primary hover:bg-primary/95 text-white hover:shadow-lg hover:shadow-primary/20 px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
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

        {/* Right Side: Membership & Account Details (lg:col-span-1) */}
        <div className="space-y-8">
          {/* Membership Card */}
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 shadow-xl text-white relative overflow-hidden flex flex-col justify-between min-h-[260px]">
            {/* Background elements */}
            <div className="absolute right-0 bottom-0 h-32 w-32 rounded-full bg-primary/20 blur-2xl -mr-10 -mb-10 pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full text-slate-300">
                  Membership plan
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hội viên hiện tại</p>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400 shrink-0" />
                  {planTitle}
                </h3>
              </div>

              {planEndDate ? (
                <p className="text-[11px] text-slate-400 leading-relaxed font-body">
                  Hạn sử dụng gói dịch vụ đến ngày: <span className="font-bold text-white">{planEndDate}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 leading-relaxed font-body">
                  Bạn đang sử dụng quyền lợi miễn phí. Các tính năng AI so khớp và đẩy tin nổi bật bị giới hạn.
                </p>
              )}
            </div>

            <Link 
              href="/landlord/subscription"
              className="mt-6 w-full py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/20 active:scale-95"
            >
              Nâng cấp dịch vụ
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Account Details Card */}
          <div className="rounded-[2rem] border border-slate-200 bg-card p-6 md:p-8 shadow-lg space-y-6">
            <h3 className="font-heading text-md font-bold text-slate-800 border-b border-slate-100 pb-3">
              Thông tin tài khoản
            </h3>

            <div className="space-y-4 text-xs font-body">
              {/* Join Date */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100/50">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Ngày đăng ký
                </span>
                <span className="font-bold text-slate-700">{joinDate}</span>
              </div>

              {/* Free AI Matches */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100/50">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-slate-400" />
                  Lượt AI ghép cặp
                </span>
                <span className="font-bold text-slate-700">{currentUser.free_usage_count} lượt</span>
              </div>

              {/* Unique ID */}
              <div className="space-y-1.5 pt-2">
                <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-slate-400" />
                  Mã tài khoản hệ thống
                </span>
                <p className="font-mono text-[10px] text-slate-750 bg-slate-50 border border-slate-150 p-2.5 rounded-xl break-all">
                  {currentUser.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
