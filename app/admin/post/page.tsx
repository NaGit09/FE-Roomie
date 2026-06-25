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
  AlertTriangle,
  FileText,
  MapPin,
  Compass,
  Trash2,
  AlertOctagon,
  Clock,
  Sparkles,
  ExternalLink,
  ThumbsDown,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { PostApi } from "@/services/api/post";
import { PostCardType, PostDetailType } from "@/schema/room/post";
import formatVND from "@/utils/priceUtils";

export default function AdminPostsPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<PostCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "DELETE_REQUESTS">("ALL");

  // Detail Modal States
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostDetailType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      if (activeTab === "PENDING") {
        const response = await PostApi.getVerificationRequests(0, 50);
        if (response && response.code === 200 && response.data && Array.isArray((response.data as any).items)) {
          setPosts((response.data as any).items);
        } else {
          setPosts([]);
          toast.error("Không thể lấy danh sách tin chờ duyệt.");
        }
      } else {
        const response = await PostApi.getPostPagination({ skip: 0, limit: 100, sort_by: "created_at", order: "desc" });
        if (response && response.code === 200 && response.data && Array.isArray(response.data.items)) {
          setPosts(response.data.items);
        } else {
          setPosts([]);
          toast.error("Không thể lấy danh sách tin đăng.");
        }
      }
    } catch (err: any) {
      console.error("Error loading posts for admin:", err);
      setPosts([]);
      toast.error("Có lỗi xảy ra khi tải dữ liệu tin bài.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, [activeTab]);

  if (!mounted) return null;

  // Filters
  const filteredPosts = posts.filter((p) => {
    const room = p.room as any;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.post_id.toString().includes(searchQuery) ||
      (room && room.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (room && (room.address?.full_text || `${room.address?.district || ""}, ${room.address?.city || ""}`)?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const handleOpenDetail = async (p: PostCardType) => {
    setDetailLoading(true);
    setIsDetailOpen(true);
    try {
      const res = await PostApi.getPostDetail(p.post_id);
      if (res && res.code === 200 && res.data) {
        setSelectedPost(res.data);
      } else {
        toast.error("Không thể tải thông tin chi tiết tin đăng.");
        setIsDetailOpen(false);
      }
    } catch (err) {
      console.error("Error loading post detail:", err);
      toast.error("Không thể tải thông tin chi tiết tin đăng.");
      setIsDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleVerify = async (postId: number, approved: boolean) => {
    setActionLoading(true);
    try {
      await PostApi.verifyPost(postId, approved);
      toast.success(approved ? "Đã phê duyệt tin đăng hoạt động!" : "Đã từ chối kiểm duyệt tin đăng.");
      fetchPosts();
      setIsDetailOpen(false);
    } catch (err: any) {
      console.error("Error verifying post:", err);
      toast.error("Không thể thực hiện phê duyệt tin đăng.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteApproval = async (postId: number, approved: boolean) => {
    setActionLoading(true);
    try {
      await PostApi.approveDeletePost(postId, approved);
      toast.success(approved ? "Đã duyệt yêu cầu gỡ tin đăng!" : "Đã từ chối gỡ tin đăng.");
      fetchPosts();
      setIsDetailOpen(false);
    } catch (err: any) {
      console.error("Error approving post delete:", err);
      toast.error("Không thể xử lý yêu cầu gỡ tin đăng.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePostDirect = async (postId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa trực tiếp tin đăng này khỏi hệ thống?")) return;
    setActionLoading(true);
    try {
      await PostApi.deletePost(postId);
      toast.success("Xóa tin đăng thành công!");
      fetchPosts();
      setIsDetailOpen(false);
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Không thể xóa tin đăng.");
    } finally {
      setActionLoading(false);
    }
  };

  // Safe accessor utilities
  const getRoomFullAddress = (room: any) => {
    if (!room) return "Chưa cập nhật";
    if (typeof room.address === "string") return room.address;
    if (room.address && typeof room.address === "object") {
      return room.address.full_text || `${room.address.street}, ${room.address.ward || ""}, ${room.address.district || ""}, ${room.address.city || ""}`.replace(/,\s*,/g, ",").trim();
    }
    return "Chưa cập nhật";
  };

  // Metrics calculation
  const totalCount = posts.length;
  const verifiedCount = posts.filter((p) => p.is_verified).length;
  const pendingCount = posts.filter((p) => !p.is_verified).length;

  return (
    <div className="space-y-10 text-slate-800 font-sans w-full">
      {/* 1. Header & Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
            <Activity className="h-3.5 w-3.5" />
            Hệ thống kiểm duyệt tin bài đăng
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 font-heading">
            QUẢN LÝ TIN ĐĂNG PHÒNG TRỌ
          </h2>
          <p className="text-xs text-slate-650 font-medium font-body max-w-xl">
            Phê duyệt bài đăng mới từ landlords, rà soát bài đăng có dấu hiệu lừa đảo, hoặc phê duyệt gỡ bỏ tin đăng theo yêu cầu.
          </p>
        </div>
      </div>

      {/* 2. Mini Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Tổng tin hiển thị", value: totalCount, color: "text-slate-350" },
          { label: "Đã xác thực (Verified)", value: verifiedCount, color: "text-emerald-500" },
          { label: "Tin chờ phê duyệt", value: pendingCount, color: "text-amber-500", pulse: pendingCount > 0 },
          { label: "Cảnh báo vi phạm", value: 0, color: "text-red-500" },
        ].map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-card/60 backdrop-blur-md p-4 text-left space-y-1.5 shadow-md relative"
          >
            {m.pulse && (
              <span className="absolute top-4 right-4 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-405 bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
            <span className="text-[9px] font-mono tracking-widest font-black uppercase text-slate-650 block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-card/40 border border-slate-200">
        {/* Search */}
        <div className="flex items-center gap-2 h-11 bg-card/60 rounded-xl px-3.5 border border-slate-200 text-xs text-slate-650 w-full sm:max-w-xs focus-within:border-primary/50 transition-colors">
          <Search className="h-4.5 w-4.5 text-slate-650 shrink-0" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, ID tin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-slate-700 placeholder-slate-500 font-medium"
          />
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { label: "Tất cả tin", value: "ALL" },
            { label: "Đang chờ duyệt", value: "PENDING" },
            { label: "Yêu cầu gỡ bỏ", value: "DELETE_REQUESTS" }
          ].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.value as any)}
              className={`h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                activeTab === tab.value
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                  : "bg-background border border-slate-200 text-slate-650 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Table Grid view */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-9 w-9 text-amber-500 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-650">
            Đang tải dữ liệu tin đăng...
          </span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50 p-16 text-center space-y-4 max-w-md mx-auto">
          <AlertOctagon className="h-10 w-10 text-slate-600 animate-pulse mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Không tìm thấy tin bài nào</h3>
          <p className="text-xs text-slate-650 leading-relaxed font-body">
            Vui lòng thay đổi từ khóa hoặc bộ lọc trạng thái kiểm duyệt tin đăng.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-card/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-650 uppercase font-mono tracking-wider font-bold">
                <th className="py-4 px-6 pl-8">Mã tin</th>
                <th className="py-4 px-4">Bài đăng</th>
                <th className="py-4 px-4">Địa chỉ phòng</th>
                <th className="py-4 px-4">Đơn giá tháng</th>
                <th className="py-4 px-4">Xác thực</th>
                <th className="py-4 px-4">Ngày đăng</th>
                <th className="py-4 px-6 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 text-slate-600">
              {filteredPosts.map((post) => (
                <tr key={post.post_id} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6 pl-8 font-mono font-bold text-slate-650">
                    #{post.post_id}
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      {post.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image_url}
                          alt="Post Thumbnail"
                          className="h-10 w-14 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded-lg bg-background border border-slate-200 flex items-center justify-center shrink-0 text-[10px] text-slate-550 font-bold uppercase">
                          No Pic
                        </div>
                      )}
                      <span className="font-bold text-slate-700 leading-snug line-clamp-2" title={post.title}>
                        {post.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-[200px] truncate text-slate-650" title={getRoomFullAddress(post.room)}>
                    {getRoomFullAddress(post.room)}
                  </td>
                  <td className="py-4 px-4 font-bold text-[#FBBF24]">
                    {post.room ? formatVND(post.room.price) : "N/A"}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border ${
                        post.is_verified
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-primary/10 border-amber-500/20 text-primary"
                      }`}
                    >
                      {post.is_verified ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-650 font-medium font-body">
                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-6 pr-8 text-right">
                    <button
                      onClick={() => handleOpenDetail(post)}
                      className="h-8 px-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-amber-500/20 hover:text-primary hover:border-primary/30 text-slate-650 flex items-center justify-center cursor-pointer transition-all active:scale-90 text-[10px] font-bold uppercase tracking-wider gap-1.5 ml-auto"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Xem duyệt
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
        {isDetailOpen && (
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
              className="relative w-full max-w-3xl rounded-[2.5rem] border border-slate-200 bg-card shadow-2xl p-6 sm:p-10 z-10 text-left space-y-6 max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-650 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {detailLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 flex-1">
                  <Loader2 className="h-9 w-9 text-amber-500 animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-650">
                    Đang tải chi tiết tin bài...
                  </span>
                </div>
              ) : selectedPost ? (
                <>
                  {/* Modal Header */}
                  <div className="space-y-1.5 text-left border-b border-slate-200 pb-4 shrink-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                          selectedPost.is_verified
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-primary/10 border-primary/30 text-primary"
                        }`}
                      >
                        Trạng thái: {selectedPost.is_verified ? "Đã xác thực" : "Chờ duyệt"}
                      </span>
                      <span className="inline-flex rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border bg-background border-slate-200 text-slate-650">
                        Lượt xem: {selectedPost.views || 0}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 font-heading">
                      {selectedPost.title}
                    </h3>
                    <p className="text-[10px] text-slate-650 font-mono">
                      Post ID: {selectedPost.post_id} • Người đăng: {selectedPost.created_by}
                    </p>
                  </div>

                  {/* Scrollable Form Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left overflow-y-auto flex-1 pr-1 pb-1">
                    {/* Left: Image & Text Description */}
                    <div className="space-y-4">
                      {selectedPost.image_url && (
                        <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-background">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedPost.image_url}
                            alt="Room Pic Detail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-slate-650 font-bold uppercase tracking-wider block text-[9px]">
                          Nội dung tin đăng
                        </span>
                        <div className="bg-background/40 border border-slate-200 rounded-2xl p-4 leading-relaxed text-slate-600 font-medium max-h-36 overflow-y-auto">
                          {selectedPost.content}
                        </div>
                      </div>
                    </div>

                    {/* Right: Room Spec Details & Verification Panel */}
                    <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6">
                      {/* Room Specs */}
                      {selectedPost.room ? (
                        <div className="rounded-2xl border border-slate-200 bg-card/60 p-4 space-y-3">
                          <span className="text-slate-650 font-bold uppercase tracking-wider block text-[9px] flex items-center gap-1">
                            <Compass className="h-3.5 w-3.5" />
                            Thông số phòng liên kết
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-slate-600 font-bold">
                            <div>
                              <span className="text-[8px] text-slate-650 block uppercase">Diện tích</span>
                              <span className="text-xs">{selectedPost.room.area} m²</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-650 block uppercase">Tiền cọc</span>
                              <span className="text-xs">{formatVND(selectedPost.room.deposit || selectedPost.room.price)}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[8px] text-slate-650 block uppercase">Giá thuê tháng</span>
                              <span className="text-sm text-[#FBBF24]">{formatVND(selectedPost.room.price)}/tháng</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-650 block uppercase">Địa chỉ phòng</span>
                            <span className="text-slate-350 text-[10px] leading-relaxed flex items-start gap-1 font-semibold">
                              <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                              {getRoomFullAddress(selectedPost.room)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-slate-200 bg-background/40 p-4 text-center text-slate-650">
                          Chưa liên kết thông số phòng trọ.
                        </div>
                      )}

                      {/* Intervention action buttons */}
                      <div className="pt-4 border-t border-slate-200 space-y-3 shrink-0">
                        <span className="text-emerald-400 font-black uppercase tracking-wider block text-[9px]">
                          Thao tác kiểm duyệt hệ thống
                        </span>

                        {activeTab === "DELETE_REQUESTS" ? (
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => handleDeleteApproval(selectedPost.post_id, true)}
                              disabled={actionLoading}
                              className="h-11 rounded-xl bg-red-500 hover:bg-red-650 text-white font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Check className="h-4 w-4" /> Duyệt gỡ tin
                            </button>
                            <button
                              onClick={() => handleDeleteApproval(selectedPost.post_id, false)}
                              disabled={actionLoading}
                              className="h-11 rounded-xl bg-slate-100 border border-slate-200 hover:bg-white/10 text-slate-700 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <X className="h-4 w-4" /> Không gỡ tin
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* If not verified, show approve button */}
                            {!selectedPost.is_verified ? (
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => handleVerify(selectedPost.post_id, true)}
                                  disabled={actionLoading}
                                  className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <CheckCircle className="h-4 w-4" /> Phê duyệt tin
                                </button>
                                <button
                                  onClick={() => handleVerify(selectedPost.post_id, false)}
                                  disabled={actionLoading}
                                  className="h-11 rounded-xl bg-slate-100 border border-slate-200 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-650 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <ThumbsDown className="h-4 w-4" /> Từ chối tin
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleVerify(selectedPost.post_id, false)}
                                disabled={actionLoading}
                                className="h-11 px-5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-amber-500/20 hover:text-primary hover:border-primary/30 text-slate-650 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full"
                              >
                                <ThumbsDown className="h-4 w-4" /> Thu hồi phê duyệt (Bỏ xác thực)
                              </button>
                            )}

                            {/* Direct Delete button */}
                            <button
                              onClick={() => handleDeletePostDirect(selectedPost.post_id)}
                              disabled={actionLoading}
                              className="h-11 px-5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white text-red-400 font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full"
                            >
                              <Trash2 className="h-4 w-4" /> Xóa tin đăng vĩnh viễn
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center gap-2">
                  <AlertTriangle className="h-10 w-10 text-red-500" />
                  <span className="text-slate-650">Không tìm thấy thông tin bài viết.</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
