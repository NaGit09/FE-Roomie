import { Room } from "@/components/custom/customer/home/RoomCard";
import { PostCardType } from "@/schema/room/post";
import { AirVent, BedDouble, ParkingSquare, Sparkles, Waves, Wifi } from "lucide-react";
import formatRelativeTime from "./timeUtils";

export const mapPostToRoom = (
  post: PostCardType,
): Room & { rawPrice: number; ward: string } => {
  const facilities = (post.room.amenities || []).map((amenity) => {
    const normalized = amenity.toLowerCase().trim();
    let icon = Sparkles;
    let label = amenity;

    if (
      normalized.includes("wifi") ||
      normalized.includes("internet") ||
      normalized.includes("mạng")
    ) {
      icon = Wifi;
      label = "Wifi";
    } else if (
      normalized.includes("lạnh") ||
      normalized.includes("điều hòa") ||
      normalized.includes("air")
    ) {
      icon = AirVent;
      label = "Máy lạnh";
    } else if (
      normalized.includes("xe") ||
      normalized.includes("parking") ||
      normalized.includes("đỗ")
    ) {
      icon = ParkingSquare;
      label = "Bãi xe";
    } else if (normalized.includes("bơi") || normalized.includes("pool")) {
      icon = Waves;
      label = "Hồ bơi";
    } else if (
      normalized.includes("giường") ||
      normalized.includes("bed") ||
      normalized.includes("pn") ||
      normalized.includes("ngủ")
    ) {
      icon = BedDouble;
      label = "Giường đôi";
    }

    return { icon, label };
  });

  const finalFacilities =
    facilities.length > 0
      ? facilities
      : [
          { icon: Wifi, label: "Wifi" },
          { icon: AirVent, label: "Máy lạnh" },
        ];

  // Derive a mock ward for richer local filtering in demo
  let ward = "Phường Bến Nghé";
  if (post.post_id % 3 === 0) ward = "Phường 15";
  else if (post.post_id % 3 === 1) ward = "Phường Thảo Điền";
  else if (post.post_id % 3 === 2) ward = "Phường Linh Trung";

  return {
    id: post.post_id.toString(),
    name: post.title,
    image:
      post.image_url ||
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    price: post.room.price.toLocaleString("vi-VN"),
    rawPrice: post.room.price,
    postedAt: formatRelativeTime(post.created_at),
    address: `${post.room.address.district}, ${post.room.address.city}`,
    verified: post.is_verified,
    facilities: finalFacilities,
    ward,
  };
};