"use client";

import React from "react";
import { 
  Wifi, 
  AirVent, 
  ParkingSquare, 
  BedDouble,
  Waves
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomCard, { Room } from "./RoomCard";

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    name: "Phòng Studio Cao Cấp - Vinhomes Central Park",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    price: "12.500.000",
    postedAt: "3 giờ trước",
    roomType: "Studio",
    address: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    verified: true,
    facilities: [
      { icon: Wifi, label: "Wifi" },
      { icon: AirVent, label: "Máy lạnh" },
      { icon: Waves, label: "Hồ bơi" },
    ],
  },
  {
    id: "2",
    name: "Phòng Trọ Ban Công Lớn - Gần ĐH Ngoại Thương",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    price: "4.500.000",
    postedAt: "5 giờ trước",
    roomType: "Phòng trọ",
    address: "Quận 3, TP. Hồ Chí Minh",
    verified: false,
    facilities: [
      { icon: Wifi, label: "Wifi" },
      { icon: ParkingSquare, label: "Bãi xe" },
      { icon: AirVent, label: "Máy lạnh" },
    ],
  },
  {
    id: "3",
    name: "Căn Hộ Mini Full Nội Thất - Quận 1",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
    price: "8.000.000",
    postedAt: "Hôm qua",
    roomType: "Chung cư mini",
    address: "Đa Kao, Quận 1, TP. Hồ Chí Minh",
    verified: true,
    facilities: [
      { icon: Wifi, label: "Wifi" },
      { icon: AirVent, label: "Máy lạnh" },
      { icon: ParkingSquare, label: "Bãi xe" },
    ],
  },
  {
    id: "4",
    name: "Nhà Nguyên Căn 2 Phòng Ngủ - Thủ Đức",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
    price: "15.000.000",
    postedAt: "2 ngày trước",
    roomType: "Nhà nguyên căn",
    address: "Hiệp Bình Chánh, Thủ Đức",
    verified: true,
    facilities: [
      { icon: BedDouble, label: "2 PN" },
      { icon: ParkingSquare, label: "Sân xe" },
      { icon: Wifi, label: "Wifi" },
    ],
  },
];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function NewRoom() {
  return (
    <section id="new-room" className="w-full bg-slate-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOCK_ROOMS.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

      </div>
    </section>
  );
}