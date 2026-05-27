
// ── Data Constants ──────────────────────────────────────────────

import { Heart, Shield , Target , Lock} from "lucide-react";

export const STATS = [
  { value: 10000, suffix: "+", label: "Khách Thuê Hài Lòng" },
  { value: 3500,  suffix: "+", label: "Căn Phòng Xác Thực" },
  { value: 120,   suffix: "+", label: "Thành Phố Phủ Sóng" },
  { value: 98,    suffix: "%", label: "Tỷ Lệ Hài Lòng" },
];

export const VALUES = [
  {
    icon: Shield,
    title: "100% Xác Thực Thực Tế",
    subtitle: "Chính Sách Chống Gian Lận",
    description:
      "Mỗi căn phòng trên Roomie đều trải qua quy trình kiểm tra thực địa 24 bước nghiêm ngặt bởi nhân viên địa phương. Chúng tôi thực hiện quét 3D, đối chiếu giấy tờ sở hữu và chỉ số điện nước để bạn an tâm ký thuê.",
    color: "from-orange-500/10 to-amber-500/10",
  },
  {
    icon: Heart,
    title: "Hòa Hợp Phong Cách Sống",
    subtitle: "Cộng Đồng & Bình Yên",
    description:
      "Một ngôi nhà chỉ thực sự ấm áp khi bạn hòa hợp với những người sống cùng. Thuật toán thông minh của chúng tôi tính toán đến giờ giấc sinh hoạt, thói quen dọn dẹp và ranh giới cá nhân — không chỉ dừng lại ở ngân sách và diện tích.",
    color: "from-pink-500/10 to-rose-500/10",
  },
  {
    icon: Target,
    title: "Công Nghệ Bất Động Sản Chính Xác",
    subtitle: "Tối Ưu Thời Gian Tìm Kiếm",
    description:
      "Hệ thống AI của chúng tôi chấm điểm và ánh xạ hồ sơ của bạn với hàng ngàn phòng trong vài mili-giây. Loại bỏ hoàn toàn thời gian lướt tìm vô ích, thời gian trung bình để tìm thấy căn nhà ưng ý trên Roomie chỉ mất 4.8 ngày.",
    color: "from-blue-500/10 to-indigo-500/10",
  },
  {
    icon: Lock,
    title: "Tấm Khiên Bảo Mật Thông Tin",
    subtitle: "Quyền Riêng Tư Tuyệt Đối",
    description:
      "Nhắn tin, đặt lịch xem phòng và thương lượng hợp đồng hoàn toàn an toàn ngay trên nền tảng. Số điện thoại, Zalo và email của bạn sẽ luôn được mã hóa ẩn danh cho đến khi hợp đồng điện tử được chính thức ký kết.",
    color: "from-emerald-500/10 to-teal-500/10",
  },
];

export const TEAM = [
  {
    name: "An Nguyễn",
    role: "Co-founder & CEO",
    initials: "AN",
    bio: "Cựu Giám đốc sản phẩm tại startup PropTech hàng đầu. Mang trong mình khát vọng đem lại sự an toàn và triết lý lấy con người làm trọng tâm vào thị trường cho thuê Đông Nam Á.",
    dreamRoom: {
      title: "Căn Gác Lửng Tối Giản Ngập Tràn Ánh Sáng",
      location: "Quận 3, TP. Hồ Chí Minh",
      tags: ["☕ Gần Quán Cà Phê", "🧹 Vệ Sinh Ngăn Nắp", "🏡 Diện Tích Rộng Rãi"],
      lifestyle: "Dậy sớm đón bình minh, thích tự pha cà phê tại nhà, yêu thích thiết kế trần cao thoáng đãng.",
      funFact: "Thành lập Roomie sau khi phải ở khách sạn tạm bợ suốt 21 ngày chỉ để tìm kiếm một căn hộ thực tế đúng như quảng cáo khi trở về TP.HCM."
    }
  },
  {
    name: "Linh Trần",
    role: "Co-founder & CTO",
    initials: "LT",
    bio: "Kiến trúc sư phần mềm Full-stack với 8 năm kinh nghiệm xây dựng hệ thống lớn. Đam mê cơ sở dữ liệu đồ thị, bảo mật dữ liệu và hợp đồng số thông minh.",
    dreamRoom: {
      title: "Căn Hộ Studio Tự Động Hóa Thông Minh",
      location: "Tây Hồ, Hà Nội",
      tags: ["💻 Internet Tốc Độ Cao", "🤫 Yên Tĩnh & Cách Âm", "🏡 Diện Tích Rộng Rãi"],
      lifestyle: "Cú đêm chính hiệu, thích lắp ráp nhà thông minh, có sở thích sưu tầm bàn phím cơ custom.",
      funFact: "Lập trình bản chạy thử đầu tiên của thuật toán ghép đôi chỉ trong 48 giờ hackathon liên tục nhờ sự đồng hành của caffeine, đối chiếu thử trên 100 phòng giả lập."
    }
  },
  {
    name: "Minh Phạm",
    role: "Head of Design",
    initials: "MP",
    bio: "Từng làm việc tại agency sáng tạo toàn cầu hàng đầu. Minh tin rằng thiết kế tuyệt vời là thiết kế tạo cảm giác tự nhiên nhất và chạm đến cảm xúc người dùng.",
    dreamRoom: {
      title: "Căn Hộ Gác Lửng Phong Cách Bắc Âu Xanh Mát",
      location: "Sơn Trà, Đà Nẵng",
      tags: ["🏡 Diện Tích Rộng Rãi", "🐱 Thân Thiện Thú Cưng", "☕ Gần Quán Cà Phê"],
      lifestyle: "Thích trồng cây bàng Singapore, chạy bộ dọc bờ biển mỗi chiều, theo đuổi lối sống tối giản.",
      funFact: "Tự tay vẽ những nét biểu tượng cấu trúc đầu tiên của Roomie lên bức tường gạch tại văn phòng làm việc chung năm 2021."
    }
  },
  {
    name: "Thu Lê",
    role: "Head of Operations",
    initials: "TL",
    bio: "Từng xây dựng và quản trị đội ngũ vận hành tại hai startup kỳ lân trong khu vực. Người giữ lửa cho mạng lưới thẩm định viên thực địa chuyên nghiệp và năng suất.",
    dreamRoom: {
      title: "Căn Hộ Studio Hiện Đại Tiện Nghi",
      location: "Quận 2, TP. Hồ Chí Minh",
      tags: ["🧹 Vệ Sinh Ngăn Nắp", "🤫 Yên Tĩnh & Cách Âm", "🐱 Thân Thiện Thú Cưng"],
      lifestyle: "Tập yoga thường xuyên, tình nguyện viên tại trạm cứu hộ động vật, quản lý thời gian cực kỳ nghiêm ngặt.",
      funFact: "Tự tay tối ưu thuật toán dẫn đường cho nhân viên thẩm định thực địa, giúp giảm 42% thời gian di chuyển và lượng khí thải carbon phát sinh."
    }
  },
];

export const MILESTONES = [
  {
    year: "2021",
    title: "Khởi Đầu Kiến Tạo",
    event: "Roomie được thành lập tại một không gian làm việc chung nhỏ ở Quận 1, TP.HCM, bởi ba nhà sáng lập với tầm nhìn về những căn phòng thuê được xác thực 100%.",
    detail: "Ban đầu ra mắt dưới dạng một công cụ web đơn giản kết nối các chủ nhà uy tín với nhân viên văn phòng, lập trình viên cần thuê phòng dài hạn tin cậy."
  },
  {
    year: "2022",
    title: "Cam Kết Xác Thực Toàn Diện",
    event: "Tiên phong chuẩn hóa quy trình 'Thẩm định thực tế tại nhà' ở TP.HCM. Đạt mốc 500 căn phòng được kiểm định toàn diện và 2.000 thành viên hoạt động.",
    detail: "Giới thiệu cơ chế giữ tiền cọc trung gian an toàn, loại bỏ hoàn toàn các trường hợp chủ nhà ảo bùng tiền cọc."
  },
  {
    year: "2023",
    title: "Kỷ Nguyên Thuật Toán Ghép Đôi",
    event: "Mở rộng dịch vụ ra Hà Nội và Đà Nẵng. Chính thức ra mắt thuật toán ghép đôi tương thích phong cách sống độc bản.",
    detail: "Ứng dụng công nghệ quét không gian 3D, cho phép khách thuê ở tỉnh xa tham quan toàn cảnh căn phòng trực quan trước khi đến trực tiếp."
  },
  {
    year: "2024",
    title: "Bứt Phá Quy Mô & Gọi Vốn Series A",
    event: "Vượt mốc 10.000 khách thuê hài lòng trên ứng dụng. Gọi vốn thành công vòng Series A để phát triển hạ tầng pháp lý hợp đồng số.",
    detail: "Tích hợp hệ thống thông báo khai báo tạm trú tự động, giúp cả khách thuê trong nước và nước ngoài hoàn tất thủ tục hành chính dễ dàng."
  },
  {
    year: "2025",
    title: "Vươn Tầm Khu Vực",
    event: "Mở rộng đến các thành phố lớn tại Đông Nam Á. Phủ sóng trên 120+ đô thị, tiếp tục khôi phục niềm tin trong lĩnh vực thuê nhà tại mỗi điểm đến.",
    detail: "Ra mắt các tính năng đa ngôn ngữ để xóa nhòa rào cản giữa khách thuê người nước ngoài và các chủ nhà địa phương uy tín."
  },
];

// ── Interactive Matching Simulator Mock Data ─────────────────────

export const LIFESTYLE_TAGS = [
  { id: "Spacious", label: "🏡 Diện Tích Rộng Rãi", desc: "Diện tích phòng > 25m²" },
  { id: "Pet Friendly", label: "🐱 Thân Thiện Thú Cưng", desc: "Chào đón thú cưng" },
  { id: "Near Cafes", label: "☕ Gần Quán Cà Phê", desc: "Khoảng cách đi bộ" },
  { id: "High-speed Wifi", label: "💻 Internet Tốc Độ Cao", desc: "Đường truyền cáp quang" },
  { id: "Quiet Space", label: "🤫 Yên Tĩnh & Cách Âm", desc: "Phù hợp người nhạy âm" },
  { id: "Clean & Tidy", label: "🧹 Vệ Sinh Ngăn Nắp", desc: "Có lịch dọn dẹp chung" },
];

export const CANDIDATE_ROOMS = [
  {
    id: 1,
    name: "Urban Oasis Loft",
    location: "Quận 1, TP. Hồ Chí Minh",
    tags: ["Spacious", "Near Cafes", "Clean & Tidy"],
    price: "8,500,000 ₫",
    features: "Ban công riêng, trần cao 4m, không gian cà phê chung tầng trệt tiện lợi.",
    baseMatch: 58,
    color: "from-rose-500/20 to-orange-500/20",
  },
  {
    id: 2,
    name: "Tech Haven Studio",
    location: "Tây Hồ, Hà Nội",
    tags: ["High-speed Wifi", "Quiet Space", "Spacious"],
    price: "7,200,000 ₫",
    features: "Góc làm việc chuyên dụng, cửa kính hộp cách âm, máy phát điện mặt trời dự phòng.",
    baseMatch: 52,
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: 3,
    name: "Green Garden Room",
    location: "Ngũ Hành Sơn, Đà Nẵng",
    tags: ["Pet Friendly", "Quiet Space", "Near Cafes"],
    price: "6,000,000 ₫",
    features: "Lối ra sân vườn thảm cỏ mát mẻ, trạm tắm thú cưng riêng, đi bộ ngắn ra bãi biển.",
    baseMatch: 48,
    color: "from-emerald-500/20 to-amber-500/20",
  },
];
