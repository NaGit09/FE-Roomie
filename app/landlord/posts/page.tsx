"use client";
 
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Trash2
} from "lucide-react";
import formatVND from "@/utils/priceUtils";
import { toast } from "sonner";
import { PostApi } from "@/services/api/post";
import { PostCardType } from "@/schema/room/post";
import { CreatePostForm } from "@/components/custom/landlord/CreatePostForm";

export default function LandlordPostsPage() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<PostCardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostCardType | null>(null);

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

  const handleDeletePost = async (postId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa tin đăng này không?")) {
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
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, []);

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
                  onClick={() => toast.success(`Mở trang xem chi tiết tin đăng`)}
                  className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-650 transition-all cursor-pointer flex items-center justify-center"
                  title="Xem chi tiết"
                >
                  <Eye className="h-4.5 w-4.5" />
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
                  onClick={() => handleDeletePost(post.post_id)}
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
    </div>
  );
}
