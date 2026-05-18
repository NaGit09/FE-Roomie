"use client";

import React, { useState } from "react";
import { useRoomStore } from "@/stores/roomStore";
import formatRelativeTime from "@/utils/timeUtils";
import {
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  PlusCircle,
  CheckCircle,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function DetailFeedback() {
  const { currentRoomDetail, addLocalFeedback } = useRoomStore();

  const feedbacks = currentRoomDetail?.feedbacks || [];

  // Collapsible control for review scores
  const [expandedReviews, setExpandedReviews] = useState<
    Record<number, boolean>
  >({});

  // Review form states
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [ratings, setRatings] = useState<Record<string, number>>({
    OVERALL: 5,
    LOCATION: 5,
    PRICE: 5,
    OWNER: 5,
    CLEANLINESS: 5,
  });

  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  if (!currentRoomDetail) return null;

  // Toggle collapse state for a review card
  const toggleExpand = (id: number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Compute factor translations and values
  const factorLabels: Record<string, string> = {
    OVERALL: "Tổng thể",
    LOCATION: "Vị trí",
    PRICE: "Giá cả",
    OWNER: "Chủ trọ",
    CLEANLINESS: "Vệ sinh",
  };

  // Get dynamic average rating for each factor across all feedbacks
  const getAverageFactorRating = (factor: string) => {
    const values = feedbacks
      .flatMap((f) => f.rating || f.rating || [])
      .filter((r) => r.rating_type === factor)
      .map((r) => r.rating_value);

    if (values.length === 0) return 5.0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Number((sum / values.length).toFixed(1));
  };

  // Compute overall cumulative rating score
  const overallAvg =
    feedbacks.length > 0
      ? Number(
          (
            feedbacks
              .map((f) => {
                const ratingsList = f.rating || f.rating || [];
                const overallRating = ratingsList.find(
                  (r) => r.rating_type === "OVERALL",
                );
                if (overallRating) return overallRating.rating_value;

                // Fallback to average of their ratings list
                if (ratingsList.length > 0) {
                  return (
                    ratingsList.reduce((sum, r) => sum + r.rating_value, 0) /
                    ratingsList.length
                  );
                }
                return 5;
              })
              .reduce((a, b) => a + b, 0) / feedbacks.length
          ).toFixed(1),
        )
      : 5.0;

  // Handle interactive rating click
  const handleRatingClick = (factor: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [factor]: value,
    }));
  };

  // Submit feedback
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const mockId = Date.now();
    const newFeedback = {
      feedback_id: mockId,
      post_id: currentRoomDetail.post_id,
      user_id: "ND-cá-nhân-bạn",
      content: content,
      feedback: content,
      created_at: new Date().toISOString(),
      images: imageUrl.trim() ? [imageUrl.trim()] : [],
      // Supply both 'rating' and 'ratings' lists for 100% schemas compatibility
      rating: Object.entries(ratings).map(([type, val], index) => ({
        id: mockId + index,
        rating_type: type,
        rating_value: val,
      })),
      ratings: Object.entries(ratings).map(([type, val], index) => ({
        id: mockId + index,
        rating_type: type,
        rating_value: val,
      })),
    };

    addLocalFeedback(newFeedback);

    // Clear inputs and show success message
    setContent("");
    setImageUrl("");
    setRatings({
      OVERALL: 5,
      LOCATION: 5,
      PRICE: 5,
      OWNER: 5,
      CLEANLINESS: 5,
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4000);
  };

  return (
    <div className="pt-8 border-t border-slate-100 space-y-10">
      {/* ── 1. Header Title & Score Summary Box ── */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h4 className="font-extrabold text-slate-900 text-lg">
          Thông tin người đăng phòng
        </h4>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start bg-slate-50/40 p-6 md:p-8 rounded-3xl border border-slate-100/60">
        {/* Score Overview Circle */}
        <div className="flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm h-full">
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
            Đánh giá chung
          </h4>
          <span className="text-5xl font-black text-slate-900 mt-4 tracking-tight">
            {overallAvg}
          </span>

          <div className="flex items-center gap-0.5 mt-2.5">
            {Array.from({ length: 5 }).map((_, idx) => {
              const fillLevel = Math.round(overallAvg);
              return (
                <Star
                  key={idx}
                  className={`h-5 w-5 ${idx < fillLevel ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                />
              );
            })}
          </div>

          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">
            Dựa trên {feedbacks.length} nhận xét
          </span>
        </div>

        {/* Factor Progress Bars */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Điểm theo tiêu chí
          </h4>

          <div className="space-y-3.5">
            {Object.entries(factorLabels).map(([key, label]) => {
              const score = getAverageFactorRating(key);
              const percent = (score / 5) * 100;

              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>{label}</span>
                    <span className="text-slate-800">{score}/5</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 2. Add Review Form ── */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <PlusCircle className="h-5 w-5 text-primary" />
          <h4 className="font-extrabold text-slate-900 text-lg">
            Viết nhận xét của bạn
          </h4>
        </div>

        {submitSuccess && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-800 text-sm font-semibold">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              Cảm ơn bạn! Đánh giá của bạn đã được cập nhật thành công trên
              trang phòng trọ.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmitFeedback} className="space-y-6">
          {/* Interactive Star rating sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/60">
            {Object.entries(factorLabels).map(([key, label]) => {
              const currentScore = ratings[key] || 5;

              return (
                <div key={key} className="flex flex-col gap-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                    {label}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const starVal = idx + 1;
                      const isActive = starVal <= currentScore;
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleRatingClick(key, starVal)}
                          className="text-slate-200 hover:scale-110 active:scale-95 transition-all duration-150"
                        >
                          <Star
                            className={`h-6 w-6 ${isActive ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-extrabold text-slate-600 ml-2">
                      {currentScore}/5
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Review Textarea */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Nội dung nhận xét
            </span>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ trải nghiệm thực tế của bạn về không gian phòng, an ninh, chủ trọ, giá điện nước..."
              required
              rows={4}
              className="rounded-2xl border-slate-200/80 focus-visible:ring-primary focus-visible:border-primary/20 text-sm font-semibold"
            />
          </div>

          {/* Optional Attach Photo */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              Hình ảnh đính kèm (URL Unsplash / Custom link)
            </span>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Ví dụ: https://images.unsplash.com/photo-..."
              className="rounded-full border-slate-200/80 focus-visible:ring-primary text-xs font-bold"
            />
          </div>

          <Button
            type="submit"
            className="rounded-full font-bold shadow-lg shadow-primary/10 px-8 py-5"
          >
            Gửi đánh giá
          </Button>
        </form>
      </div>

      {/* ── 3. Reviews List ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h4 className="font-extrabold text-slate-900 text-lg">
            Danh sách nhận xét ({feedbacks.length})
          </h4>
        </div>

        {feedbacks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {feedbacks.map((item) => {
              const ratingsList = item.rating || item.rating || [];
              const isExpanded = expandedReviews[item.feedback_id] || false;

              // Calculate specific overall rating
              const userOverall =
                ratingsList.find((r) => r.rating_type === "OVERALL")
                  ?.rating_value || 5;

              return (
                <div
                  key={item.feedback_id}
                  className="rounded-3xl border border-slate-100 bg-white p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-100/50"
                >
                  <div className="space-y-4">
                    {/* Review Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {item.user_id?.substring(0, 2).toUpperCase() || "ND"}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-slate-800">
                            {item.user_id.startsWith("ND-")
                              ? item.user_id
                              : `User ${item.user_id.substring(0, 8)}...`}
                          </h5>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                            {formatRelativeTime(item.created_at || "")}
                          </p>
                        </div>
                      </div>

                      {/* Cumulative Score Badge */}
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full text-xs font-extrabold text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{userOverall}/5</span>
                      </div>
                    </div>

                    {/* Feedback Comment content */}
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium italic">
                      "{item.content || item.feedback}"
                    </p>

                    {/* Attached review images */}
                    {item.images && item.images.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {item.images.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative h-16 w-24 overflow-hidden rounded-xl border border-slate-100 shadow-sm shrink-0"
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
                  </div>

                  {/* ── Collapsible factor scores trigger ── */}
                  <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
                    <button
                      onClick={() => toggleExpand(item.feedback_id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors self-start cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" /> Thu gọn điểm chi
                          tiết
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" /> Xem chi tiết điểm
                          tiêu chí
                        </>
                      )}
                    </button>

                    {/* Expandable scores sub-grid */}
                    {isExpanded && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 animate-in slide-in-from-top-2 duration-300">
                        {ratingsList.map((rat) => (
                          <div key={rat.id} className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                              {factorLabels[rat.rating_type] || rat.rating_type}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              <span className="text-xs font-extrabold text-slate-700">
                                {rat.rating_value}/5
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-[2rem] border border-dashed border-slate-200/80 bg-slate-50/20 text-slate-400 max-w-lg mx-auto">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">
              Chưa có đánh giá nào cho phòng này.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Trở thành người đầu tiên trải nghiệm và chia sẻ ý kiến của bạn!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
