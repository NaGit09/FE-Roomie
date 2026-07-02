"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Star,
  Loader2,
  Send,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  Calendar
} from "lucide-react";
import { FeedbackApi, FeedbackResponse } from "@/services/api/feedback";
import { PostApi } from "@/services/api/post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface EnhancedFeedback extends FeedbackResponse {
  post_title: string;
}

const factorLabels: Record<string, string> = {
  OVERALL: "Tổng quan",
  LOCATION: "Vị trí",
  PRICE: "Giá cả",
  OWNER: "Chủ nhà",
  CLEANLINESS: "Vệ sinh",
};

export default function LandlordFeedbacksPage() {
  const [mounted, setMounted] = useState(false);
  const [feedbacks, setFeedbacks] = useState<EnhancedFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scoreFilter, setScoreFilter] = useState<string>("ALL");

  // Reply States
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

  // Expand States
  const [expandedFeedbacks, setExpandedFeedbacks] = useState<Record<number, boolean>>({});

  const toggleExpandFeedback = (id: number) => {
    setExpandedFeedbacks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchAllFeedbacks = async () => {
    try {
      setIsLoading(true);
      // 1. Fetch landlord's posts
      const postsRes = await PostApi.getMyPost(0, 100);
      const postsList = postsRes.data?.items || postsRes.data || [];

      if (postsList.length === 0) {
        setFeedbacks([]);
        return;
      }

      // 2. Fetch feedbacks for all posts in parallel
      const allEnhancedFeedbacks: EnhancedFeedback[] = [];
      const fetchPromises = postsList.map(async (post: any) => {
        try {
          const fbRes = await FeedbackApi.getPostFeedbacks(post.post_id);
          const fbs = fbRes.data || [];
          fbs.forEach((fb) => {
            allEnhancedFeedbacks.push({
              ...fb,
              post_title: post.title || `Bài viết #${post.post_id}`,
            });
          });
        } catch (err) {
          console.error(`Error fetching feedbacks for post ${post.post_id}:`, err);
        }
      });

      await Promise.all(fetchPromises);

      // Sort by created_at descending (newest first)
      allEnhancedFeedbacks.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setFeedbacks(allEnhancedFeedbacks);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
      toast.error("Không thể tải danh sách đánh giá.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (feedbackId: number) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      const res = await FeedbackApi.replyToFeedback(feedbackId, replyText);
      if (res && res.code === 200) {
        toast.success("Phản hồi thành công!");
        setFeedbacks((prev) =>
          prev.map((fb) =>
            fb.feedback_id === feedbackId
              ? { ...fb, reply: replyText, replied_at: new Date().toISOString() }
              : fb
          )
        );
        setReplyingTo(null);
        setReplyText("");
      } else {
        toast.error("Phản hồi thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Lỗi khi gửi phản hồi.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAllFeedbacks();
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-10 animate-fade-in text-foreground">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <MessageSquare className="h-3.5 w-3.5" />
            Quản lý Đánh giá & Nhận xét
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
            Đánh giá từ khách thuê
          </h1>
          <p className="text-xs sm:text-sm text-slate-650 font-medium font-body leading-relaxed max-w-xl">
            Xem và trả lời tất cả các nhận xét, đánh giá từ khách hàng trên toàn bộ các bài đăng của bạn.
          </p>
        </div>
      </div>

      {/* Rating Score Filters */}
      <div className="flex flex-wrap gap-2 pb-2">
        {[
          { id: "ALL", label: "Tất cả đánh giá" },
          { id: "5", label: "5 Sao" },
          { id: "4", label: "4 Sao" },
          { id: "3", label: "3 Sao" },
          { id: "2", label: "2 Sao" },
          { id: "1", label: "1 Sao" },
          { id: "REPLIED", label: "Đã phản hồi" },
          { id: "UNREPLIED", label: "Chưa phản hồi" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScoreFilter(tab.id)}
            className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              scoreFilter === tab.id
                ? "bg-primary text-white shadow-md shadow-primary/10"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feedbacks list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-650 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-semibold">Đang tải danh sách nhận xét...</span>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-100 backdrop-blur-md p-16 text-center text-slate-650 space-y-4">
            <AlertCircle className="h-10 w-10 text-slate-650 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-md font-bold text-slate-350">Không tìm thấy đánh giá nào</h3>
              <p className="text-xs text-slate-650">
                Các bài đăng của bạn hiện tại chưa có nhận xét hay đánh giá nào từ khách thuê.
              </p>
            </div>
          </div>
        ) : (() => {
          const filtered = feedbacks.filter((fb) => {
            const overallRating = fb.ratings?.find(r => r.rating_type === "OVERALL")?.rating_value || 5;
            if (scoreFilter === "ALL") return true;
            if (scoreFilter === "REPLIED") return !!fb.reply;
            if (scoreFilter === "UNREPLIED") return !fb.reply;
            return Math.round(overallRating).toString() === scoreFilter;
          });

          if (filtered.length === 0) {
            return (
              <div className="rounded-3xl border border-slate-200 bg-slate-100 backdrop-blur-md p-16 text-center text-slate-650 space-y-4">
                <AlertCircle className="h-10 w-10 text-slate-650 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-slate-350">Không có đánh giá phù hợp</h3>
                  <p className="text-xs text-slate-650">
                    Không tìm thấy đánh giá nào khớp với tiêu chí bộ lọc của bạn.
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-6">
              {filtered.map((fb) => {
                const overallRating = fb.ratings?.find(r => r.rating_type === "OVERALL")?.rating_value || 5;
                return (
                  <motion.div
                    key={fb.feedback_id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-slate-200 bg-card p-6 flex flex-col justify-between gap-5 shadow-xl text-left"
                  >
                    <div className="space-y-4">
                      {/* Attached Post Title Indicator */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200/50 w-fit">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        Bài đăng: <span className="text-slate-700 font-extrabold">{fb.post_title}</span>
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {fb.user_id ? fb.user_id.substring(0, 2).toUpperCase() : "ND"}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-slate-800 block">
                              {fb.user_id ? (fb.user_id.startsWith("ND-") ? fb.user_id : `User ${fb.user_id.substring(0, 8)}...`) : "Người dùng"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 font-body mt-0.5">
                              <Calendar className="h-3 w-3" />
                              {fb.created_at ? new Date(fb.created_at).toLocaleString('vi-VN') : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(overallRating) ? 'fill-current' : 'text-slate-300'}`} />
                          ))}
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-slate-605 text-xs sm:text-sm leading-relaxed bg-slate-50/50 border border-slate-100 p-4 rounded-2xl shadow-inner font-medium italic">
                        "{fb.content || "Không có nội dung bình luận."}"
                      </p>

                      {/* Attached review images */}
                      {fb.images && fb.images.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {fb.images.map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative h-14 w-22 overflow-hidden rounded-xl border border-slate-150 shadow-sm shrink-0"
                            >
                              <img
                                src={img}
                                alt="Review attachments"
                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Collapsible detailed scores */}
                      {fb.ratings && fb.ratings.length > 0 && (
                        <div className="pt-1">
                          <button
                            onClick={() => toggleExpandFeedback(fb.feedback_id)}
                            className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-wider cursor-pointer"
                          >
                            {expandedFeedbacks[fb.feedback_id] ? (
                              <>
                                <ChevronUp className="h-3.5 w-3.5" /> Thu gọn tiêu chí
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3.5 w-3.5" /> Chi tiết tiêu chí
                              </>
                            )}
                          </button>

                          {expandedFeedbacks[fb.feedback_id] && (
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-150/80 animate-fade-in">
                              {fb.ratings.map((rat) => (
                                <div key={rat.id} className="flex flex-col gap-0.5 text-left">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    {factorLabels[rat.rating_type] || rat.rating_type}
                                  </span>
                                  <div className="flex items-center gap-0.5 font-black text-xs text-slate-700">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span>{rat.rating_value}/5</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reply Section */}
                    {fb.reply ? (
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex gap-2.5 items-start relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-2xl"></div>
                        <CornerDownRight className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded font-black uppercase shrink-0">
                              Phản hồi của bạn
                            </span>
                            {fb.replied_at && (
                              <span className="text-[9px] font-bold text-slate-400 uppercase">
                                • {new Date(fb.replied_at).toLocaleString('vi-VN')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                            {fb.reply}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {replyingTo === fb.feedback_id ? (
                          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <Textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Nhập phản hồi của bạn cho nhận xét này..."
                              className="rounded-2xl bg-white text-xs font-semibold"
                              rows={3}
                              disabled={isSubmittingReply}
                            />
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full text-[10px] h-8 px-4 font-bold"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                                disabled={isSubmittingReply}
                              >
                                Hủy
                              </Button>
                              <Button
                                size="sm"
                                className="rounded-full text-[10px] h-8 px-4 font-bold gap-1"
                                onClick={() => handleSubmitReply(fb.feedback_id)}
                                disabled={isSubmittingReply || !replyText.trim()}
                              >
                                {isSubmittingReply ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Send className="h-3 w-3" />
                                )}
                                Gửi phản hồi
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setReplyingTo(fb.feedback_id);
                              setReplyText("");
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Phản hồi đánh giá
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
