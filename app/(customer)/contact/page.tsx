"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ── Schema ──────────────────────────────────────────────────────
const contactSchema = z.object({
  firstName:   z.string().min(1, "Vui lòng nhập tên của bạn"),
  lastName:    z.string().min(1, "Vui lòng nhập họ của bạn"),
  email:       z.email("Địa chỉ email không hợp lệ").min(1, "Vui lòng nhập email"),
  phone:       z.string().min(7, "Vui lòng nhập số điện thoại hợp lệ"),
  problem:     z.string().min(10, "Vui lòng mô tả yêu cầu của bạn (tối thiểu 10 ký tự)"),
});
type ContactSchema = z.infer<typeof contactSchema>;

// ── Info cards ───────────────────────────────────────────────────
const INFO_ITEMS = [
  {
    icon: MapPin,
    label: "Văn Phòng",
    value: "123 Đường Nguyễn Huệ",
    sub: "Quận 1, TP. Hồ Chí Minh",
  },
  {
    icon: Mail,
    label: "Gửi Email",
    value: "hello@roomie.vn",
    sub: "Phản hồi trong vòng 24 giờ",
  },
  {
    icon: Phone,
    label: "Hotline Liên Hệ",
    value: "090 123 4567",
    sub: "Thứ 2 – Thứ 6, 8:00 – 18:00",
  },
  {
    icon: Clock,
    label: "Giờ Hỗ Trợ",
    value: "Thứ 2 – Thứ 6",
    sub: "8:00 – 18:00 (Giờ Việt Nam)",
  },
];

// ── Page ────────────────────────────────────────────────────────
export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactSchema>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactSchema) => {
    setLoading(true);
    console.log("Contact form submission:", data);
    // TODO: wire to API → authApi.contact(data) or similar
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    reset();
  };

  return (
    <div className="min-h-screen bg-background font-sans">

      {/* ── Hero banner ── */}
      <section className="bg-other-3 text-white py-16 px-4">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Liên Hệ Với Chúng Tôi
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
            Roomie Luôn Sẵn Sàng Hỗ Trợ
          </h1>
          <p className="text-other-4/80 text-base leading-relaxed max-w-xl mx-auto font-body">
            Bạn có thắc mắc về phòng đăng, cần hỗ trợ tài khoản hay chỉ muốn gửi lời chào? Hãy điền thông tin vào biểu mẫu, đội ngũ của chúng tôi sẽ liên hệ lại ngay.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Info column ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Thông Tin Liên Hệ
              </h2>
              <p className="text-sm text-muted-foreground font-body">
                Kết nối với chúng tôi qua các kênh dưới đây.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {INFO_ITEMS.map(({ icon: Icon, label, value, sub }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-4 transition-shadow hover:shadow-md cursor-default"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="font-body">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form column ── */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
              {sent ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 font-body">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-xl font-bold text-foreground">Gửi tin nhắn thành công!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Cảm ơn bạn đã liên hệ với Roomie. Đội ngũ hỗ trợ của chúng tôi sẽ phản hồi lại bạn trong vòng 24 giờ.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 rounded-full cursor-pointer"
                    onClick={() => setSent(false)}
                  >
                    Gửi tin nhắn khác
                  </Button>
                </div>
              ) : (
                /* Form */
                <>
                  <div className="mb-6 space-y-1">
                    <h2 className="font-heading text-2xl font-bold tracking-tight">
                      Gửi Tin Nhắn Cho Chúng Tôi
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      Tất cả các trường thông tin đều bắt buộc. Chúng tôi cam kết bảo mật thông tin của bạn.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-body">
                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-sm font-medium">Tên</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            id="firstName"
                            placeholder="Nhập tên..."
                            className="pl-9 h-10 bg-background/50 border-border/75"
                            {...register("firstName")}
                          />
                        </div>
                        {errors.firstName && (
                          <p className="text-xs text-destructive">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-sm font-medium">Họ</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                          <Input
                            id="lastName"
                            placeholder="Nhập họ..."
                            className="pl-9 h-10 bg-background/50 border-border/75"
                            {...register("lastName")}
                          />
                        </div>
                        {errors.lastName && (
                          <p className="text-xs text-destructive">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">Địa chỉ Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@vi-du.com"
                          className="pl-9 h-10 bg-background/50 border-border/75"
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="09xx xxx xxx"
                          className="pl-9 h-10 bg-background/50 border-border/75"
                          {...register("phone")}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Problem */}
                    <div className="space-y-1.5">
                      <Label htmlFor="problem" className="text-sm font-medium">
                        Mô tả yêu cầu của bạn
                      </Label>
                      <Textarea
                        id="problem"
                        placeholder="Hãy cho chúng tôi biết bạn cần hỗ trợ gì — thông tin càng chi tiết, chúng tôi hỗ trợ càng nhanh chóng..."
                        className="min-h-[130px] resize-none bg-background/50 border-border/75"
                        {...register("problem")}
                      />
                      {errors.problem && (
                        <p className="text-xs text-destructive">{errors.problem.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 font-semibold rounded-full bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/15 transition-all cursor-pointer"
                      disabled={loading}
                    >
                      {loading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang gửi…</>
                      ) : (
                        <><Send className="mr-2 h-4 w-4" />Gửi tin nhắn</>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
