"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Calendar,
  CheckCircle,
  Compass,
  ArrowUpRight,
  Clock,
  Eye,
  Edit2,
  Trash2,
  MessageSquare,
  X,
  Star
} from "lucide-react";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";
import { PostApi } from "@/services/api/post";
import { FeedbackApi, FeedbackResponse } from "@/services/api/feedback";
import { PostCardType } from "@/schema/room/post";
import { CreatePostForm } from "@/components/custom/landlord/CreatePostForm";

export default function LandlordPostsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<PostCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostCardType | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // Feedbacks State
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedPostForFeedback, setSelectedPostForFeedback] = useState<PostCardType | null>(null);
  const [postFeedbacks, setPostFeedbacks] = useState<FeedbackResponse[]>([]);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await PostApi.getMyPost(0, 10);
      if (response.data) {
        setPosts(response.data.items || response.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tin đăng");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeletePost = async (postId: number) => {
    try {
      const response = await PostApi.deletePost(postId);
      if (response && (response.code === 200 || response.code === 201)) {
        toast.success("Xóa tin đăng thành công!");
        fetchPosts();
      } else {
        toast.error(response?.message || "Không thể xóa tin đăng.");
      }
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error("Không thể xóa tin đăng. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, []);

  const handleOpenFeedbacks = async (post: PostCardType) => {
    setSelectedPostForFeedback(post);
    setIsFeedbackOpen(true);
    setIsLoadingFeedbacks(true);
    try {
      const res = await FeedbackApi.getPostFeedbacks(post.post_id);
      if (res && res.data) {
        setPostFeedbacks(res.data);
      } else {
        setPostFeedbacks([]);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Không thể tải danh sách đánh giá.");
      setPostFeedbacks([]);
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  if (!mounted) return null;

  // Status Badge Helper
  const getStatusBadge = (is_verified: boolean) => {
    if (is_verified) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 shadow-sm animate-pulse">
          <CheckCircle className="h-3 w-3" />
          Đã duyệt
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
        <Clock className="h-3 w-3 animate-spin-slow" />
        Chờ duyệt tin
      </span>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in text-foreground">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <FileText className="h-3.5 w-3.5" />
            Truyền thông quảng cáo
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-800">
            Quản lý tin đăng ghép phòng
          </h1>
          <p className="text-xs sm:text-sm text-slate-650 font-medium font-body leading-relaxed max-w-xl">
            Đăng tin tìm kiếm roommate, đẩy bài đăng lên vị trí ưu tiên và theo dõi lưu lượng clicks chuyển đổi ghép phòng.
          </p>
        </div>

        <button
          onClick={() => { setEditingPost(null); setIsAddOpen(true); }}
          className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 shadow-md shadow-primary/10 shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          Tạo tin đăng mới
        </button>
      </div>

      {/* Posts Cards Stack */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-slate-650 py-10">Đang tải dữ liệu...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-slate-650 py-10">Bạn chưa có tin đăng nào.</div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.post_id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-slate-200 bg-card/60 backdrop-blur-md p-6 sm:p-8 flex flex-col lg:flex-row justify-between lg:items-center gap-6 shadow-xl relative group cursor-pointer"
            >
              {/* Left information card details */}
              <div className="space-y-4 flex-1 text-left">
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(post.is_verified)}
                  
                  <span className="text-[10px] text-slate-650 font-bold uppercase tracking-wider flex items-center gap-1 font-body">
                    <Calendar className="h-3.5 w-3.5 text-slate-650 shrink-0" />
                    Đăng ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-md sm:text-lg text-slate-800 leading-snug group-hover:text-[#FBBF24] transition-colors max-w-3xl">
                    {post.title}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-slate-650 font-body">
                    <span className="flex items-center gap-1 font-semibold text-slate-350">
                      <Compass className="h-4 w-4 text-primary" />
                      {post.room.address.district}, {post.room.address.city}
                    </span>
                    
                    <span className="font-bold text-primary sm:border-l sm:border-slate-200 sm:pl-6">
                      {formatVND(post.room.price)}/tháng
                    </span>
                  </div>
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                <button
                  type="button"
                  onClick={() => router.push(`/rooms/${post.post_id}`)}
                  className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-650 transition-all cursor-pointer flex items-center justify-center"
                  title="Xem chi tiết"
                >
                  <Eye className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenFeedbacks(post)}
                  className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 text-slate-650 transition-all cursor-pointer flex items-center justify-center"
                  title="Xem đánh giá"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingPost(post); setIsAddOpen(true); }}
                  className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-primary/10 hover:text-primary hover:border-primary/20 text-slate-650 transition-all cursor-pointer flex items-center justify-center"
                  title="Cập nhật"
                >
                  <Edit2 className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => { setPostToDelete(post.post_id); setIsDeleteConfirmOpen(true); }}
                  className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-650 transition-all cursor-pointer flex items-center justify-center"
                  title="Xóa"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create / Edit Post Modal */}
      <CreatePostForm
        isOpen={isAddOpen}
        editingPost={editingPost}
        onClose={() => {
          setIsAddOpen(false);
          setEditingPost(null);
        }}
        onSuccess={() => {
          setIsAddOpen(false);
          setEditingPost(null);
          fetchPosts();
        }}
      />
      {/* Feedbacks Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFeedbackOpen(false)} />
          <div className="relative w-full max-w-2xl bg-card rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-800">Đánh giá của khách thuê</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedPostForFeedback?.title}</p>
              </div>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingFeedbacks ? (
                <div className="text-center py-10 text-slate-500">Đang tải đánh giá...</div>
              ) : postFeedbacks.length === 0 ? (
                <div className="text-center py-10 text-slate-500">Chưa có đánh giá nào cho bài viết này.</div>
              ) : (
                postFeedbacks.map((fb) => {
                  const overallRating = fb.ratings?.find(r => r.rating_type === "OVERALL")?.rating_value || 5;
                  return (
                    <div key={fb.feedback_id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {fb.user_id ? fb.user_id.substring(0, 2).toUpperCase() : "ND"}
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-semibold text-sm text-slate-800 block">
                                {fb.user_id ? (fb.user_id.startsWith("ND-") ? fb.user_id : `User ${fb.user_id.substring(0, 8)}...`) : "Người dùng"}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {fb.created_at ? new Date(fb.created_at).toLocaleString('vi-VN') : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < Math.round(overallRating) ? 'fill-current' : 'text-slate-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl shadow-sm italic">
                            "{fb.content || "Không có nội dung bình luận."}"
                          </p>
                        </div>
                      </div>

                      {/* Display Reply if already replied */}
                      {fb.reply && (
                        <div className="ml-14 bg-white border border-slate-100 rounded-xl p-3 flex gap-2.5 items-start">
                          <div className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase shrink-0 mt-0.5">
                            Phản hồi
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {fb.reply}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
