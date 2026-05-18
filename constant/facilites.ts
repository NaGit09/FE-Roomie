import {
    BedDouble,
    Wifi,
    AirVent,
    ParkingSquare,
    Waves,
    Weight,
    Compass,
    ShieldCheck,
    PawPrint,
    UtensilsCrossed
} from "lucide-react";

export const FACILITIES_LIST = [
    { value: "Wifi", label: "Wi-Fi", icon: Wifi },
    { value: "Máy lạnh", label: "Máy lạnh", icon: AirVent },
    { value: "Bãi xe", label: "Bãi xe", icon: ParkingSquare },
    { value: "Hồ bơi", label: "Hồ bơi", icon: Waves },
    { value: "Giường đôi", label: "Giường đôi", icon: BedDouble },
    { value: "Gym", label: "Gym", icon: Weight },
    { value: "Elevator", label: "Thang máy", icon: Compass },
    { value: "Security 24/7", label: "Bảo vệ 24/7", icon: ShieldCheck },
    { value: "Pet Friendly", label: "Thú cưng", icon: PawPrint },
    { value: "Kitchen", label: "Bếp", icon: UtensilsCrossed },
];