"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Edit3,
  X,
  Heart,
  Info,
  RefreshCw,
  Coins,
  MapPin,
  Clock,
  MessageSquare,
  HeartHandshake,
  CheckCircle,
  Compass,
  PawPrint,
  CigaretteOff,
  Cigarette,
  Scaling,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import formatVND from "@/utils/priceUtils";
import { useMatchingStore } from "@/stores/matchingStore";
import { UserMatching } from "@/schema/matching/UserMatching";

interface RoommateCandidate {
  id: string;
  name: string;
  email: string;
  role: "RENTER" | "LANDLORD";
  matchPercentage: number;
  avatarGradient: string;
  badges: string[];
  description: string;
  budget: number;
  cleanlinessLevelRaw: number;
  cleanliness: string;
  sleepTime: string;
  noiseTolerance: number;
  area: number;
  smokingRaw: boolean;
  petFriendlyRaw: boolean;
  district: string;
}

const CircularMatchIndicator = ({ percentage }: { percentage: number }) => {
  const radius = 24;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center h-12 w-12 shrink-0">
      <svg className="h-12 w-12 -rotate-90">
        <circle
          stroke="rgba(16, 185, 129, 0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#10B981"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute text-[10px] font-black text-emerald-600 dark:text-emerald-400">
        {percentage}%
      </span>
    </div>
  );
};

const mapUserMatchingToCandidate = (item: UserMatching, index: number): RoommateCandidate => {
  const gradients = [
    "from-rose-500 to-orange-500",
    "from-cyan-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-violet-500 to-purple-500",
    "from-amber-500 to-orange-500",
    "from-pink-500 to-rose-500",
  ];
  
  const districts = ["Quận 1", "Quận 3", "Quận 10", "Bình Thạnh", "Quận 7", "Gò Vấp"];
  const bios = [
    "Mình là nhân viên văn phòng, thích sự yên tĩnh sau giờ làm việc. Rất ngăn nắp và tôn trọng không gian riêng tư của bạn cùng phòng.",
    "Yêu động vật và thích nấu ăn. Mình đang tìm một người bạn ở ghép vui vẻ, sạch sẽ và có thể cùng chia sẻ các bữa tối cuối tuần.",
    "Freelancer thiết kế đồ họa, làm việc tại nhà nên cần không gian cách âm tốt. Lối sống lành mạnh, không hút thuốc và ngủ sớm.",
    "Sinh viên năm cuối ngành CNTT, hòa đồng và dễ tính. Thích chơi thể thao và có thói quen dọn dẹp phòng mỗi cuối tuần.",
    "Lập trình viên nhiệt tình, đam mê công nghệ và sách. Lối sống ngăn nắp, thích yên tĩnh và mong muốn tìm bạn cùng phòng có gu tương đồng.",
    "Thích trang trí nhà cửa, yêu cây xanh và lối sống tối giản. Rất chú trọng vệ sinh chung và mong muốn tìm roommate ngăn nắp.",
  ];

  const scorePct = item.score <= 1 ? Math.round(item.score * 100) : Math.round(item.score);
  const cleanlinessLevel = 3 + (index % 3);
  const cleanlinessText = cleanlinessLevel === 5 ? "Rất ngăn nắp" : cleanlinessLevel === 4 ? "Sạch sẽ" : "Bình thường";
  const sleepHour = (22 + (index % 4)) % 24;
  const sleepTime = `~ ${sleepHour}:00`;
  const noiseLevel = 2 + (index % 3);
  const budgetVal = 3000000 + (index * 700000) % 4000000;
  const areaVal = 20 + (index * 5) % 25;
  const isSmoking = index % 5 === 0;
  const isPet = index % 3 === 0;

  const roleText = item.user.role === "LANDLORD" ? "Chủ nhà" : "Khách thuê";
  const badges = [
    roleText,
    isSmoking ? "Có hút thuốc" : "Không hút thuốc",
    isPet ? "Cho nuôi thú" : "Không nuôi thú",
  ];

  return {
    id: item.user.user_id,
    name: item.user.full_name || "Thành viên ẩn danh",
    email: item.user.email,
    role: item.user.role,
    matchPercentage: scorePct,
    avatarGradient: gradients[index % gradients.length],
    badges,
    description: bios[index % bios.length],
    budget: budgetVal,
    cleanlinessLevelRaw: cleanlinessLevel,
    cleanliness: cleanlinessText,
    sleepTime,
    noiseTolerance: noiseLevel,
    area: areaVal,
    smokingRaw: isSmoking,
    petFriendlyRaw: isPet,
    district: districts[index % districts.length],
  };
};

export const UserMatchingCard = () => {
  const {
    matches,
    loadingMatches,
    setIsEditingPreference,
    connectedIds,
    connectingId,
    connectRoommate,
    fetchMatches,
  } = useMatchingStore();

  const [cardIndex, setCardIndex] = React.useState(0);
  const [swipeDirection, setSwipeDirection] = React.useState<"left" | "right" | null>(null);
  const [showDetailPopup, setShowDetailPopup] = React.useState(false);
  const [selectedCandidate, setSelectedCandidate] = React.useState<RoommateCandidate | null>(null);

  // Sync index on matches changes
  React.useEffect(() => {
    setCardIndex(0);
  }, [matches]);

  // Dynamically map API raw UserMatching matching list to beautiful candidates
  const displayCandidates = React.useMemo(() => {
    return matches.map((item, index) => mapUserMatchingToCandidate(item, index));
  }, [matches]);

  const activeCandidate = cardIndex < displayCandidates.length ? displayCandidates[cardIndex] : null;
  const nextCandidate = cardIndex + 1 < displayCandidates.length ? displayCandidates[cardIndex + 1] : null;

  const handleSwipeLeft = () => {
    setSwipeDirection("left");
    toast.info("Đã bỏ qua gợi ý");
    setTimeout(() => {
      setCardIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 200);
  };

  const handleSwipeRight = () => {
    setSwipeDirection("right");
    setTimeout(() => {
      setCardIndex((prev) => prev + 1);
      setSwipeDirection(null);
    }, 200);
  };

  const handleConnect = async (id: string, name: string) => {
    const success = await connectRoommate(id);
    if (success) {
      toast.success(`Đã gửi lời mời ở ghép đến ${name}!`);
    } else {
      toast.error("Không thể kết nối lúc này!");
    }
  };

  const handleOpenInfo = () => {
    if (activeCandidate) {
      setSelectedCandidate(activeCandidate);
      setShowDetailPopup(true);
    }
  };

  const handleResetDeck = () => {
    setCardIndex(0);
    fetchMatches();
    toast.success("Đã làm mới danh sách gợi ý!");
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6 animate-fade-in select-none">
      {/* Dynamic Sub-header */}
      <div className="text-center space-y-2 w-full max-w-md">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50/50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700 font-body shadow-sm">
          <Sparkles className="h-3 w-3 animate-pulse text-emerald-500" />
          So Khớp Lối Sống Thông Minh
        </div>
        <p className="text-muted-foreground text-xs font-body leading-relaxed">
          Vuốt sang phải để gửi lời mời ở ghép, vuốt sang trái để bỏ qua. Bấm nút thông tin để xem chi tiết thói quen sinh hoạt.
        </p>
      </div>

      {/* Swipe Card Stack Area */}
      <div className="w-full max-w-[360px] h-[460px] relative mt-2">
        {loadingMatches ? (
          <div className="absolute inset-0 rounded-3xl border border-white/40 bg-card/65 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-xl">
            <Compass className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-slate-800 font-bold font-body animate-pulse">
              Đang phân tích ứng viên tương thích...
            </p>
          </div>
        ) : activeCandidate ? (
          <div className="w-full h-full relative">
            {/* Visual Deck Card Layer (Behind current card) */}
            {nextCandidate && (
              <div className="absolute inset-0 w-full h-full rounded-3xl bg-white/60 dark:bg-stone-850/60 backdrop-blur-md border border-white/30 shadow-lg scale-[0.95] translate-y-4 opacity-50 pointer-events-none -z-10 transition-all duration-300 flex flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-xl bg-linear-to-tr ${nextCandidate.avatarGradient} text-white font-heading font-black text-md flex items-center justify-center opacity-70`}>
                    {nextCandidate.name.split(" ").slice(-1)[0][0]}
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">
                    {nextCandidate.matchPercentage}% Hòa hợp
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading text-md font-bold text-slate-400 leading-none">
                    {nextCandidate.name}
                  </h4>
                </div>
                <div className="w-full h-1 bg-slate-100/50 rounded-full" />
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-slate-100/30 opacity-20">
                  <div className="h-2 bg-slate-200 rounded" />
                  <div className="h-2 bg-slate-200 rounded" />
                  <div className="h-2 bg-slate-200 rounded" />
                </div>
              </div>
            )}

            {/* Main Interactive Draggable Card */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeCandidate.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -120) {
                    handleSwipeLeft();
                  } else if (info.offset.x > 120) {
                    handleSwipeRight();
                  }
                }}
                animate={{
                  x: swipeDirection === "left" ? -350 : swipeDirection === "right" ? 350 : 0,
                  opacity: swipeDirection ? 0 : 1,
                  rotate: swipeDirection === "left" ? -10 : swipeDirection === "right" ? 10 : 0,
                  scale: 1,
                }}
                exit={{
                  x: swipeDirection === "left" ? -350 : swipeDirection === "right" ? 350 : 0,
                  opacity: 0,
                  rotate: swipeDirection === "left" ? -10 : swipeDirection === "right" ? 10 : 0,
                  scale: 0.95,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                className="absolute inset-0 w-full h-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-3xl flex flex-col justify-between p-6 select-none cursor-grab active:cursor-grabbing z-10 hover:shadow-primary/5 transition-shadow"
              >
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${activeCandidate.avatarGradient} text-white font-heading font-black text-xl flex items-center justify-center shadow-md`}>
                    {activeCandidate.name.split(" ").slice(-1)[0][0]}
                  </div>

                  <CircularMatchIndicator percentage={activeCandidate.matchPercentage} />
                </div>

                {/* Lifestyle Badges */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {activeCandidate.badges.slice(0, 3).map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-stone-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/5 px-2.5 py-0.5 rounded-lg"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Short Intro Bio */}
                <div className="flex-1 mt-3.5 flex items-center">
                  <p className="text-xs text-slate-650 dark:text-slate-350 font-body leading-relaxed line-clamp-3">
                    {activeCandidate.description}
                  </p>
                </div>

                {/* Core Stats Grid */}
                <div className="grid grid-cols-3 gap-1.5 border-t border-dashed border-slate-200/60 dark:border-white/10 pt-4 mt-3">
                  <div className="text-center space-y-0.5">
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-body">
                      Ngân Sách
                    </span>
                    <span className="text-[10px] text-slate-800 dark:text-slate-200 font-extrabold block truncate">
                      {formatVND(activeCandidate.budget)}
                    </span>
                  </div>
                  <div className="text-center space-y-0.5 border-x border-slate-100 dark:border-white/5">
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-body">
                      Vệ Sinh
                    </span>
                    <span className="text-[10px] text-slate-800 dark:text-slate-200 font-extrabold block truncate">
                      {activeCandidate.cleanlinessLevelRaw}/5
                    </span>
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-body">
                      Giờ Ngủ
                    </span>
                    <span className="text-[10px] text-slate-800 dark:text-slate-200 font-extrabold block truncate">
                      {activeCandidate.sleepTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Empty Deck State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-2xl rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="relative w-16 h-16 bg-gradient-to-tr from-primary/10 to-orange-500/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <Compass className="h-8 w-8 text-primary animate-pulse" />
              <Sparkles className="h-4 w-4 text-orange-500 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Hết gợi ý phù hợp
              </h3>
              <p className="text-xs text-muted-foreground font-body leading-relaxed max-w-[240px] mx-auto">
                Bạn đã xem hết các gợi ý của hệ thống. Bạn có thể làm mới bộ thẻ hoặc cập nhật lại tiêu chuẩn phòng để tìm thêm.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2.5 px-4 pt-2">
              <Button
                onClick={handleResetDeck}
                className="w-full h-10 font-bold uppercase tracking-wider text-[10px] bg-slate-900 text-white hover:bg-primary rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Làm mới danh sách
              </Button>
              <Button
                onClick={() => setIsEditingPreference(true)}
                className="w-full h-10 font-bold uppercase tracking-wider text-[10px] border border-slate-200 dark:border-white/10 bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-750 text-slate-700 dark:text-slate-200 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-450" />
                Cập nhật tiêu chí
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Action Controls Row */}
      {activeCandidate && !loadingMatches && (
        <div className="flex items-center justify-center gap-6 pt-2 w-full">
          {/* Skip Button */}
          <Button
            onClick={handleSwipeLeft}
            className="w-14 h-14 rounded-full bg-white dark:bg-stone-800 border border-slate-200 dark:border-white/10 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 hover:border-red-300 shadow-lg hover:shadow-red-500/5 active:scale-90 transition-all flex items-center justify-center p-0 cursor-pointer shrink-0"
          >
            <X className="h-6 w-6 stroke-[3]" />
          </Button>

          {/* Quick Info Detail Button */}
          <Button
            onClick={handleOpenInfo}
            className="w-11 h-11 rounded-full bg-white dark:bg-stone-800 border border-slate-200 dark:border-white/10 text-indigo-500 hover:text-indigo-650 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:border-indigo-200 shadow-md active:scale-90 transition-all flex items-center justify-center p-0 cursor-pointer shrink-0"
          >
            <Info className="h-5 w-5 stroke-[2.5]" />
          </Button>

          {/* Connect/Heart Button */}
          <Button
            onClick={handleSwipeRight}
            disabled={connectedIds.includes(activeCandidate.id) || connectingId === activeCandidate.id}
            className="w-14 h-14 rounded-full bg-white dark:bg-stone-800 border border-slate-200 dark:border-white/10 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-300 shadow-lg hover:shadow-emerald-500/5 active:scale-90 transition-all flex items-center justify-center p-0 cursor-pointer shrink-0"
          >
            <Heart className={`h-6 w-6 stroke-[1.5] ${connectedIds.includes(activeCandidate.id) ? "fill-current" : ""}`} />
          </Button>
        </div>
      )}

      {/* Detailed Roommate Profile Popup Modal */}
      <AnimatePresence>
        {showDetailPopup && selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="relative w-full max-w-lg bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[2rem] shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[85vh] text-left"
            >
              {/* Close Icon Button */}
              <Button
                onClick={() => {
                  setShowDetailPopup(false);
                  setSelectedCandidate(null);
                }}
                variant="ghost"
                className="absolute top-4 right-4 h-8 w-8 rounded-full p-0 text-slate-450 hover:text-slate-600 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Compatibility Score */}
              <div className="rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 p-4 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-body">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    Chỉ số tương thích phong cách sống
                  </h4>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                    {selectedCandidate.matchPercentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/55 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedCandidate.matchPercentage}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Lifestyle Traits Detailed Grid */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-body">
                  Hồ sơ tiêu chí chi tiết
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {/* Stats Box: Budget */}
                  <div className="rounded-xl bg-slate-50/50 dark:bg-stone-850 border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Khả năng chi trả
                    </span>
                    <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold mt-1 flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-amber-500" />
                      {formatVND(selectedCandidate.budget)}/tháng
                    </span>
                  </div>

                  {/* Stats Box: Location */}
                  <div className="rounded-xl bg-slate-50/50 dark:bg-stone-850 border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Khu vực mong muốn
                    </span>
                    <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold mt-1 flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      {selectedCandidate.district || "Bất kỳ"}
                    </span>
                  </div>

                  {/* Stats Box: Sleep */}
                  <div className="rounded-xl bg-slate-50/50 dark:bg-stone-850 border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Thời gian ngủ nghỉ
                    </span>
                    <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold mt-1 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />~
                      {selectedCandidate.sleepTime}
                    </span>
                  </div>

                  {/* Stats Box: Cleanliness */}
                  <div className="rounded-xl bg-slate-50/50 dark:bg-stone-850 border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Mức độ vệ sinh
                    </span>
                    <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold mt-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                        Cấp {selectedCandidate.cleanlinessLevelRaw}/5
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold truncate">
                        ({selectedCandidate.cleanliness})
                      </span>
                    </span>
                  </div>

                  {/* Stats Box: Noise */}
                  <div className="rounded-xl bg-slate-50/50 dark:bg-stone-850 border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Độ ồn tối đa
                    </span>
                    <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold mt-1 flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5 text-sky-500" />
                      Cấp độ {selectedCandidate.noiseTolerance}/5
                    </span>
                  </div>

                  {/* Stats Box: Area */}
                  <div className="rounded-xl bg-slate-50/50 dark:bg-stone-850 border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Diện tích phòng
                    </span>
                    <span className="text-[11px] text-slate-800 dark:text-slate-200 font-extrabold mt-1 flex items-center gap-1">
                      <Scaling className="h-3.5 w-3.5 text-purple-500" />
                      Từ {selectedCandidate.area} m² trở lên
                    </span>
                  </div>

                  {/* Stats Box: Smoking & Pets */}
                  <div className="rounded-xl bg-slate-50/50 dark:bg-stone-850 border border-slate-100 dark:border-white/5 p-3 flex flex-col justify-between col-span-2 space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Thói quen hút thuốc & Thú cưng
                    </span>
                    <div className="flex gap-4">
                      {selectedCandidate.smokingRaw ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md border border-amber-100/50">
                          <Cigarette className="h-3 w-3" /> Có hút thuốc
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md border border-emerald-100/50">
                          <CigaretteOff className="h-3.5 w-3.5" /> Không hút thuốc
                        </span>
                      )}
                      {selectedCandidate.petFriendlyRaw ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-700 bg-purple-50 dark:bg-purple-950/20 px-2 py-0.5 rounded-md border border-purple-100/50">
                          <PawPrint className="h-3 w-3" /> Chấp nhận thú cưng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-50 dark:bg-stone-800 px-2 py-0.5 rounded-md border border-slate-200/50">
                          <PawPrint className="h-3 w-3 opacity-55" /> Không nuôi thú
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Box */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-body">
                  Giới thiệu bản thân
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-body leading-relaxed bg-slate-50/60 dark:bg-stone-850 rounded-2xl p-4 border border-slate-100/70 dark:border-white/5">
                  {selectedCandidate.description}
                </p>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => handleConnect(selectedCandidate.id, selectedCandidate.name)}
                  disabled={connectedIds.includes(selectedCandidate.id) || connectingId === selectedCandidate.id}
                  className={`flex-1 h-11 font-bold uppercase tracking-wider text-[10px] rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                    connectedIds.includes(selectedCandidate.id)
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-slate-900 text-white hover:bg-primary hover:shadow-lg"
                  }`}
                >
                  {connectingId === selectedCandidate.id ? (
                    <>
                      <Compass className="h-3.5 w-3.5 animate-spin" />
                      Đang kết nối...
                    </>
                  ) : connectedIds.includes(selectedCandidate.id) ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      Đã gửi yêu cầu ở ghép
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="h-3.5 w-3.5" />
                      Gửi lời mời ghép
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    toast.success(`Đang mở cuộc trò chuyện trực tuyến với ${selectedCandidate.name}`);
                  }}
                  className="h-11 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-stone-800 hover:bg-slate-50 dark:hover:bg-stone-750 text-slate-700 dark:text-slate-200 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                  Nhắn tin
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMatchingCard;
