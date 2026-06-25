/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { PostApi as RoomApi } from "@/services/api/room";
import { PostApi } from "@/services/api/post";
import { UploadApi } from "@/services/api/upload";
import { RoomDetail } from "@/schema/room/room";
import { CreatePost, PostCardType, PostDetailType } from "@/schema/room/post";

interface CreatePostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPost?: PostCardType | PostDetailType | null;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingPost = null,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  
  // Room list
  const [rooms, setRooms] = useState<RoomDetail[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch landlord's rooms to select from
  useEffect(() => {
    if (!isOpen) return;

    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const response = await RoomApi.getMyRoom();
        if (response && response.data) {
          const roomsList = Array.isArray(response.data)
            ? response.data
            : (response.data as any).items || [];
          setRooms(roomsList);
        }
      } catch (error) {
        console.error("Failed to load rooms:", error);
        toast.error("Không thể tải danh sách phòng của bạn.");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [isOpen]);

  // Handle Editing Pre-fill
  useEffect(() => {
    if (!isOpen) return;

    if (editingPost) {
      setTitle(editingPost.title);
      setContent((editingPost as any).content || "");
      
      const rId = (editingPost as any).room_id || (editingPost.room as any)?.id?.toString() || "";
      setSelectedRoomId(rId);
      setImageUrl(editingPost.image_url || "");
    } else {
      setTitle("");
      setContent("");
      setSelectedRoomId("");
      setImageUrl("");
    }
  }, [isOpen, editingPost]);

  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.warning("Tập tin chọn không phải là ảnh!");
      return;
    }

    setIsUploading(true);
    const refId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    try {
      const response = await UploadApi.uploadFile({
        file,
        reference_id: refId,
        context: "POST",
        is_primary: true
      });

      if (response && response.data && response.data.file_url) {
        setImageUrl(response.data.file_url);
        toast.success("Tải ảnh bìa lên thành công!");
      }
    } catch (error) {
      console.error("Error uploading post image:", error);
      toast.error("Không thể tải hình ảnh lên. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === "" || content.trim() === "") {
      toast.warning("Vui lòng nhập đầy đủ tiêu đề và nội dung bài viết!");
      return;
    }

    if (!imageUrl) {
      toast.warning("Vui lòng tải lên một hình ảnh banner cho bài viết!");
      return;
    }

    const payload: CreatePost = {
      title,
      content,
      image_url: imageUrl,
      room_id: selectedRoomId || undefined
    };

    try {
      let response;
      if (editingPost && editingPost.post_id) {
        response = await PostApi.updatePost(editingPost.post_id, payload);
        if (response && (response.code === 200 || response.code === 201)) {
          toast.success("Cập nhật tin đăng thành công!");
          onSuccess();
          onClose();
        } else {
          toast.error(response?.message || "Đã xảy ra lỗi khi cập nhật tin.");
        }
      } else {
        response = await PostApi.createPost(payload);
        if (response && (response.code === 200 || response.code === 201)) {
          toast.success("Tạo tin đăng tìm bạn ở ghép thành công!");
          onSuccess();
          onClose();
        } else {
          toast.error(response?.message || "Đã xảy ra lỗi khi tạo tin.");
        }
      }
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast.error(error?.response?.data?.message || "Không thể lưu tin đăng. Vui lòng thử lại!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Form Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-xl rounded-[2.5rem] border border-slate-200 bg-card/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 z-10 text-left text-foreground max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full border border-slate-200 bg-slate-100 text-slate-650 hover:text-white cursor-pointer transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1.5 mb-6">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest block font-heading">
                Quảng cáo phòng ghép
              </span>
              <h3 className="text-xl font-black text-slate-800 font-heading">
                {editingPost ? "Cập nhật bài viết tìm bạn ở ghép" : "Tạo bài viết tìm bạn ở ghép"}
              </h3>
              <p className="text-[10px] text-slate-650 leading-relaxed font-body">
                Khai báo tiêu đề, bài viết chi tiết, đính kèm phòng đã thuê để người tìm phòng có thể dễ dàng ghép phòng.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 font-body">
              {/* Select Room */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-650 uppercase tracking-widest block font-body">
                  Liên kết với căn hộ / phòng trống {loadingRooms && "..."}
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full h-11 bg-card border border-slate-200 rounded-xl px-4 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#F59E0B]"
                  required
                >
                  <option value="">-- Chọn Căn hộ / Phòng trống của bạn --</option>
                  {rooms.map((room: any) => (
                    <option key={room.id} value={room.id}>
                      {room.name} ({room.price.toLocaleString("vi-VN")}đ/tháng - {room.address.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-650 uppercase tracking-widest block font-body">Tiêu đề bài viết</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tìm nam ở ghép phòng Penthouse ban công Q3 siêu đẹp"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 bg-slate-100 border border-slate-200 rounded-xl px-4 text-xs font-semibold text-slate-700 placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-650 uppercase tracking-widest block font-body">Nội dung chi tiết bài viết</label>
                <textarea
                  placeholder="Nhập thông tin giới thiệu bản thân, phong cách sống, yêu cầu đối với roommate của bạn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-700 placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] resize-none"
                  required
                />
              </div>

              {/* Banner Image Uploader */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-650 uppercase tracking-widest block font-body">
                  Ảnh bìa bài viết (1 ảnh)
                </label>
                
                {imageUrl ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-200 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={imageUrl} 
                      alt="Post cover banner" 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform" 
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute top-3 right-3 p-2 bg-black/70 rounded-full hover:bg-red-500/80 text-white cursor-pointer transition-all border border-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="border border-dashed border-slate-200 hover:border-[#F59E0B]/50 rounded-2xl p-6 bg-slate-100 transition-all text-center cursor-pointer relative group flex flex-col items-center justify-center min-h-[120px]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        await handleImageUpload(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => document.getElementById("post-image-input")?.click()}
                  >
                    <input
                      id="post-image-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          await handleImageUpload(e.target.files);
                        }
                      }}
                    />
                    
                    {isUploading ? (
                      <div className="space-y-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F59E0B] mx-auto" />
                        <span className="text-[10px] text-slate-650 font-bold block">Đang tải ảnh banner bài viết...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Plus className="h-6 w-6 text-slate-650 group-hover:text-primary mx-auto transition-colors" />
                        <p className="text-[11px] font-bold text-slate-700 group-hover:text-white transition-colors">
                          Kéo thả ảnh hoặc click để chọn ảnh bìa
                        </p>
                        <p className="text-[9px] text-slate-650 font-body">
                          Định dạng JPEG, PNG. Tối đa 5MB.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 px-5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-primary/10"
                >
                  {editingPost ? "Cập nhật bài viết" : "Đăng tin ngay"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
