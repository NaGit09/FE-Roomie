"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Home,
  Heart,
  ArrowRight,
  Building2,
  CheckCircle,
  Sparkles,
  Cpu,
  X,
  ChevronRight,
  Smile,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  STATS,
  VALUES,
  TEAM,
  LIFESTYLE_TAGS,
  CANDIDATE_ROOMS,
  MILESTONES,
} from "@/constant/about";

// ── Helper Components ───────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      start += increment;
      if (currentStep >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Main Page Component ──────────────────────────────────────────

export default function AboutPage() {
  // Interactive Simulator States
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Near Cafes",
    "Spacious",
  ]);
  const [activeTeamMember, setActiveTeamMember] = useState<
    (typeof TEAM)[0] | null
  >(null);
  const [activeWayTab, setActiveWayTab] = useState<"roomie" | "old">("roomie");

  // Tag toggle handler for matching engine
  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  // Compute live match scores for simulation
  const processedRooms = CANDIDATE_ROOMS.map((room) => {
    const matchCount = selectedTags.filter((t) => room.tags.includes(t)).length;
    const score = Math.min(99, room.baseMatch + matchCount * 14);
    return { ...room, score };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* ── Background Aesthetic Decorators ── */}
      <div className="absolute top-0 left-0 right-0 h-150 bg-[linear-gradient(to_bottom,rgba(193,68,14,0.04),transparent)] pointer-events-none" />

      <div className="absolute top-[20%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-primary/3 blur-[120px] pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute top-[60%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-primary/4 blur-[100px] pointer-events-none animate-[pulse_10s_infinite_1s]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C1440E05_1px,transparent_1px),linear-gradient(to_bottom,#C1440E05_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />

      {/* ── 1. Hero Cinematic Section ── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary font-body">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Giới thiệu Roomie
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Nâng Tầm Không Gian Thuê, <br />
              <span className="text-primary font-display italic font-medium">
                Khởi Nguồn Cuộc Sống Đẹp.
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl font-body">
              Roomie là hệ sinh thái công nghệ bất động sản (PropTech) thế hệ
              mới, được thiết kế để kết nối hoàn hảo giữa phong cách sống cá
              nhân và không gian kiến trúc thực tế. Chúng tôi tin rằng một căn
              phòng không chỉ đơn thuần là giao dịch thuê — đó là thánh đường
              bình yên của riêng bạn.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Link href="/rooms">
                  Khám Phá Phòng Ngay <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <a
                href="#simulator"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold text-foreground border border-border bg-card/40 hover:bg-card/90 transition-all cursor-pointer font-body text-sm"
              >
                Trải Nghiệm Mô Phỏng Ghép Đôi
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Glass Block illustrating the technology */}
            <div className="relative rounded-2xl border border-primary/10 bg-card/60 backdrop-blur-md p-6 sm:p-8 shadow-2xl shadow-primary/5 space-y-6">
              <div className="absolute top-2.5 right-2.5 w-20 h-20 bg-primary/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-foreground">
                      Hệ thống Roomie
                    </h3>
                    <p className="text-xs text-muted-foreground font-body">
                      Mô-đun Tương Thích Hoạt Động V2.4
                    </p>
                  </div>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="space-y-4 font-body">
                <div className="p-4 rounded-xl bg-background/50 border border-border/30 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Thẩm Định & Xác Thực Tin Đăng
                    </span>
                    <span className="text-primary flex items-center gap-1">
                      <BadgeCheck className="h-3.5 w-3.5" /> 100% Xác Thực
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/30 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">
                      Độ Tương Thích Bạn Cùng Nhà Trung Bình
                    </span>
                    <span className="text-foreground">94.8% Tương Thích</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "94.8%" }}
                      transition={{ duration: 1.2, delay: 0.7 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-xl p-3.5 text-xs text-primary font-body">
                <Cpu className="h-4.5 w-4.5 shrink-0" />
                <span>
                  Thuật toán so khớp PropTech của chúng tôi tính toán dựa trên
                  thói quen thực tế, giảm thiểu 62% tỷ lệ xung đột khi ở chung.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Animated Stats Grid ── */}
      <section className="border-y border-border/40 bg-card/35 backdrop-blur-sm relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, suffix, label }, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={label}
                className="text-center space-y-2 group cursor-default"
              >
                <div className="font-heading text-4xl sm:text-5xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <p className="text-sm font-body text-muted-foreground font-medium uppercase tracking-wider">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Matching Simulator ── */}
      <section
        id="simulator"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20"
      >
        <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary font-body">
            <Cpu className="h-3 w-3" /> Thử Nghiệm Thực Tế
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Trải Nghiệm Trình Ghép Đôi AI
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-body leading-relaxed">
            Lựa chọn các chỉ số phong cách sống của bạn để xem cách Roomie tính
            toán độ tương thích, tự động sắp xếp lại danh sách phòng và làm nổi
            bật các lựa chọn phù hợp nhất theo thuật toán AI tức thì.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left panel: Build profile */}
          <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-8 shadow-lg">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <h3 className="font-heading font-bold text-xl text-foreground">
                  1. Chỉ Số Phong Cách Sống
                </h3>
                <p className="text-xs text-muted-foreground font-body">
                  Chọn các tiêu chí ưu tiên của bạn để tính toán điểm tương
                  thích với từng căn phòng.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {LIFESTYLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5"
                          : "bg-background/40 border-border/60 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-sm font-semibold mb-0.5">
                        {tag.label}
                      </span>
                      <span className="text-[10px] opacity-80 font-body leading-tight">
                        {tag.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary font-body">
                <Sparkles className="h-4 w-4" />
                <span>Hồ Sơ Mô Phỏng:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.length === 0 ? (
                  <span className="text-xs text-muted-foreground font-body italic">
                    Chưa chọn tiêu chí (hiển thị điểm cơ sở)
                  </span>
                ) : (
                  selectedTags.map((tag) => {
                    const tagLabel =
                      LIFESTYLE_TAGS.find((t) => t.id === tag)?.label || tag;
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-card border border-primary/20 px-2 py-0.5 text-xs text-primary font-medium"
                      >
                        {tagLabel.split(" ").slice(1).join(" ")}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right panel: Rooms reorder */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-start">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-heading font-bold text-lg text-foreground">
                2. Sắp Xếp Độ Tương Thích Trực Tiếp
              </h3>
              <span className="text-xs text-muted-foreground font-body">
                Sắp xếp theo chỉ số phù hợp giảm dần
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {processedRooms.map((room) => (
                  <motion.div
                    layout
                    key={room.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="relative rounded-2xl border border-border/80 bg-card/20 hover:bg-card/45 hover:border-primary/30 transition-colors p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group shadow-sm"
                  >
                    {/* Architectural Abstract Visual Indicator */}
                    <div className="flex gap-4 items-center">
                      <div
                        className={`h-16 w-16 shrink-0 rounded-xl bg-linear-to-tr ${room.color} border border-primary/5 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(to_tr,rgba(193,68,14,0.1),transparent)]" />
                        <Home className="h-7 w-7 text-primary relative z-10" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-base text-foreground">
                            {room.name}
                          </h4>
                          <span className="text-[10px] text-muted-foreground flex items-center font-body">
                            <MapPin className="h-3 w-3 mr-0.5 shrink-0" />{" "}
                            {room.location}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-body leading-relaxed max-w-sm">
                          {room.features}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {room.tags.map((t) => {
                            const isMatch = selectedTags.includes(t);
                            const currentTagObj = LIFESTYLE_TAGS.find(
                              (tag) => tag.id === t,
                            );
                            return (
                              <span
                                key={t}
                                className={`text-[9px] px-1.5 py-0.5 rounded font-body font-medium transition-all ${
                                  isMatch
                                    ? "bg-primary/10 border border-primary/30 text-primary"
                                    : "bg-muted/30 border border-border/40 text-muted-foreground"
                                }`}
                              >
                                {currentTagObj
                                  ? currentTagObj.label
                                      .split(" ")
                                      .slice(1)
                                      .join(" ")
                                  : t}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/30">
                      <span className="font-heading text-sm font-semibold text-primary mb-1">
                        {room.price}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-[9px] text-muted-foreground block font-body">
                            Độ tương thích
                          </span>
                          <span className="font-heading text-lg font-bold text-foreground tabular-nums">
                            {room.score}%
                          </span>
                        </div>
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-heading font-bold text-xs ${
                            room.score >= 80
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 animate-pulse"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {room.score}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. The "Old Way" vs "The Roomie Way" Switcher ── */}
      <section className="bg-card/25 border-y border-border/40 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-[30%] left-[5%] w-64 h-64 bg-primary/2 rounded-full blur-[80px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary font-body">
              Tiêu Chuẩn Vượt Trội
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Tái Định Nghĩa Trải Nghiệm Tìm Phòng
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base font-body leading-relaxed">
              Chúng tôi loại bỏ hoàn toàn những bất cập của phương thức tìm
              phòng truyền thống và kiến tạo một quy chuẩn mới tự động hóa dựa
              trên sự tin tưởng và minh bạch tuyệt đối.
            </p>

            {/* Elegant Selector Switch */}
            <div className="inline-flex rounded-full bg-muted/60 p-1 border border-border/30 max-w-xs mx-auto">
              <button
                onClick={() => setActiveWayTab("roomie")}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  activeWayTab === "roomie"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Trải Nghiệm Với Roomie
              </button>
              <button
                onClick={() => setActiveWayTab("old")}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  activeWayTab === "old"
                    ? "bg-other-3 text-other-4 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tìm Kiếm Truyền Thống
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeWayTab === "roomie" ? (
                <motion.div
                  key="roomie-way"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-primary/20 bg-card/70 backdrop-blur-md p-8 shadow-xl space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Sparkles className="h-5.5 w-5.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl text-foreground">
                        Tiêu chuẩn của Roomie
                      </h3>
                      <p className="text-xs text-muted-foreground font-body">
                        Hệ sinh thái co-living kết hợp hoàn hảo giữa công nghệ &
                        sự thấu hiểu
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body">
                    {[
                      {
                        title: "100% Thực Thế Được Xác Thực",
                        desc: "Mọi phòng đăng tải đều được thẩm định thực tế và quét 3D bởi đội ngũ chuyên viên địa phương. Những gì bạn nhìn thấy chính xác là những gì bạn nhận được.",
                      },
                      {
                        title: "Chọn Lọc Bạn Cùng Nhà Phù Hợp",
                        desc: "Tìm kiếm bạn cùng phòng dựa trên thói quen sinh hoạt, độ tương thích phong cách sống, chế độ ăn uống và chu kỳ giấc ngủ.",
                      },
                      {
                        title: "Bảo Mật Kênh Liên Lạc",
                        desc: "Trò chuyện, đàm phán và lên lịch hẹn trực tiếp trên app. Chỉ chia sẻ số điện thoại hay Zalo cá nhân khi bạn cảm thấy hoàn toàn an tâm.",
                      },
                      {
                        title: "Hợp Đồng Điện Tử & Bảo Vệ Tiền Cọc",
                        desc: "Cơ cấu hợp đồng được pháp lý hóa điện tử, tiền cọc được giữ an toàn trong ví điện tử trung gian cho đến khi bạn xác nhận nhận phòng thành công.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-start bg-background/35 border border-border/30 rounded-xl p-4 hover:border-primary/20 transition-all"
                      >
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm text-foreground mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="old-way"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl border border-destructive/20 bg-other-3 text-other-4/90 p-8 shadow-xl space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
                      <X className="h-5.5 w-5.5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl text-white">
                        Sự Hỗn Loạn Truyền Thống
                      </h3>
                      <p className="text-xs text-other-4/50 font-body">
                        Hành trình đầy rủi ro, áp lực và tốn kém thời gian
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body">
                    {[
                      {
                        title: "Hình Ảnh Ảo & Tin Đăng Giả",
                        desc: "Lướt qua các hội nhóm trôi nổi tràn ngập tin giả, để rồi thất vọng khi thực tế hoàn toàn khác xa hình ảnh minh họa lỗi thời.",
                      },
                      {
                        title: "Xung Đột Ngầm Khi Ở Chung",
                        desc: "Chuyển vào ở ngẫu nhiên với những người xa lạ mà không biết trước thói quen của họ, dẫn đến những bất hòa ngầm hủy hoại cuộc sống bình yên.",
                      },
                      {
                        title: "Nguy Cơ Rò Rỉ Thông Tin & Tin Rác",
                        desc: "Nhận hàng chục cuộc gọi làm phiền và tin nhắn rác mỗi ngày sau khi để lộ số điện thoại, thông tin liên hệ trên mạng xã hội.",
                      },
                      {
                        title: "Rủi Ro Mất Cọc & Không Minh Bạch",
                        desc: "Bị yêu cầu đặt cọc tiền mặt trực tiếp bởi những chủ nhà chưa được xác minh, không có cơ chế bảo vệ khi xảy ra tranh chấp.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-start bg-background/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
                      >
                        <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm text-white mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-other-4/60 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── 5. Core Values ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary font-body">
            Giá Trị Cốt Lõi
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Các Trụ Cột Nền Tảng
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-body">
            Roomie vận hành dựa trên các nguyên tắc nghiêm ngặt nhằm đảm bảo sự
            tin cậy, an toàn và hòa hợp cao nhất trong toàn bộ cộng đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALUES.map(
            ({ icon: Icon, title, subtitle, description, color }, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={title}
                className="rounded-2xl border border-border/50 bg-card/25 p-6 sm:p-8 flex flex-col sm:flex-row gap-5 hover:border-primary/30 transition-all duration-300 group cursor-default shadow-sm hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr ${color} border border-primary/5 group-hover:scale-105 transition-transform duration-300`}
                >
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block font-body mb-0.5">
                      {subtitle}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* ── 6. Dynamic Chronological Timeline ── */}
      <section className="bg-card/20 border-y border-border/40 py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-3xl relative">
          <div className="text-center space-y-4 mb-20">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary font-body">
              Cột Mốc & Tăng Trưởng
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Hành Trình Phát Triển
            </h2>
            <p className="text-muted-foreground text-sm font-body max-w-md mx-auto">
              Lịch sử phát triển từ một công cụ môi giới nhỏ cấp địa phương
              thành một hệ sinh thái PropTech phủ sóng khu vực.
            </p>
          </div>

          <div className="relative">
            {/* Chronological Path Line */}
            <div className="absolute left-5 sm:left-7 top-4 bottom-4 w-0.5 bg-linear-to-b from-primary/80 via-primary/30 to-border" />

            <div className="space-y-12">
              {MILESTONES.map((milestone, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  key={milestone.year}
                  className="relative flex items-start gap-6 pl-12 sm:pl-16 group"
                >
                  {/* Year Indicator Node */}
                  <div className="absolute left-0 top-1 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-primary/30 bg-background shadow-md group-hover:border-primary transition-all duration-300 shrink-0">
                    <span className="font-heading text-xs sm:text-sm font-bold text-primary">
                      {milestone.year}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1.5 font-body">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-0.5">
                        {milestone.title}
                      </span>
                      <h4 className="font-heading text-lg font-bold text-foreground leading-tight">
                        {milestone.event}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-body">
                      {milestone.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Interactive Team & Dream Room Showcases ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary font-body">
            Đội Ngũ Sáng Lập
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Gặp Gỡ Đội Ngũ Roomie
          </h2>
          <p className="text-muted-foreground text-sm font-body">
            Chúng tôi là tập hợp của những kỹ sư, nhà thiết kế và chuyên gia vận
            hành cùng chung niềm tin rằng sự minh bạch trong nhà ở là quyền lợi
            tối thiểu của mọi người.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <motion.div
              layoutId={`member-card-${member.name}`}
              onClick={() => setActiveTeamMember(member)}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              key={member.name}
              className="rounded-2xl border border-border bg-card/30 hover:border-primary/40 hover:shadow-lg p-6 space-y-4 cursor-pointer text-center group relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-4.5 w-4.5 text-primary" />
              </div>

              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-xl font-bold shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105">
                  {member.initials}
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="font-heading font-bold text-lg text-foreground">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider font-body">
                  {member.role}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-body line-clamp-3">
                {member.bio}
              </p>

              <div className="pt-2 border-t border-border/40">
                <span className="text-[10px] font-semibold text-primary group-hover:text-primary/80 transition-colors uppercase tracking-widest flex items-center justify-center gap-1">
                  Xem Hồ Sơ Ghép Đôi <ArrowRight className="h-3 w-3 shrink-0" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Radix/Overlay style Panel for member details */}
        <AnimatePresence>
          {activeTeamMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setActiveTeamMember(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-full max-w-xl rounded-2xl border border-primary/20 bg-card p-6 sm:p-8 shadow-2xl space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveTeamMember(null)}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full border border-border flex items-center justify-center bg-background/50 hover:bg-background transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4.5 w-4.5" />
                </button>

                <div className="flex gap-4 items-center border-b border-border/50 pb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white font-heading text-lg font-bold">
                    {activeTeamMember.initials}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground">
                      {activeTeamMember.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide font-body">
                      {activeTeamMember.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 font-body">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      Tiểu sử & Định hướng
                    </span>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                      {activeTeamMember.bio}
                    </p>
                  </div>

                  {/* Ideal Room details illustrating the PropTech concept */}
                  <div className="bg-background/80 border border-primary/10 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-1">
                        <Heart className="h-3 w-3 shrink-0" /> Hồ Sơ Co-Living
                        Mơ Ước
                      </span>
                      <span className="text-[9px] text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-0.5 shrink-0" />{" "}
                        {activeTeamMember.dreamRoom.location}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-base text-foreground">
                        {activeTeamMember.dreamRoom.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {activeTeamMember.dreamRoom.lifestyle}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeTeamMember.dreamRoom.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-muted/40 border border-border/30 rounded-xl p-3.5 text-xs text-muted-foreground leading-relaxed">
                    <Smile className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>
                      <strong className="text-foreground">
                        Sự Thật Thú Vị:
                      </strong>{" "}
                      {activeTeamMember.dreamRoom.funFact}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setActiveTeamMember(null)}
                    className="rounded-full px-6 font-semibold bg-primary hover:bg-primary/90 text-white cursor-pointer"
                  >
                    Hoàn tất
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── 8. Call to Action (CTA) ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-28 pt-8">
        <div className="relative rounded-3xl bg-linear-to-br from-other-3 to-slate-950 text-white overflow-hidden p-8 sm:p-12 lg:p-16 text-center space-y-8 shadow-2xl border border-white/5">
          {/* CTA Background blobs */}
          <div className="absolute top-[-40%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-30%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-primary/5 blur-[70px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/45 animate-bounce">
                <Home className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Sẵn Sàng Tìm Kiếm Thánh Đường <br />
                <span className="text-primary font-display italic font-medium">
                  Bình Yên Của Bạn?
                </span>
              </h2>
              <p className="text-other-4/70 text-sm sm:text-base leading-relaxed font-body">
                Tham gia cùng hàng ngàn cư dân đô thị đã tìm thấy không gian
                sống xác thực, hoàn hảo với phong cách cá nhân cùng Roomie tại
                TP. Hồ Chí Minh, Hà Nội và Đà Nẵng.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Link href="/rooms">
                  Tìm Phòng Ngay{" "}
                  <ArrowRight className="ml-2 h-4 w-4 animate-[bounce_1.5s_infinite_horizontal]" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 font-semibold border-white/20 text-white hover:bg-white/10 hover:text-white cursor-pointer font-body"
              >
                <Link href="/contact">Liên Hệ Với Chúng Tôi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
