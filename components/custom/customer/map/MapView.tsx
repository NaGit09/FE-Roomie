"use client";

import React from "react";
import { useRoomStore } from "@/stores/roomStore";
import { useRoomFilterStore } from "@/stores/roomFilterStore";
import { mapPostToRoom } from "@/utils/mapper";
import RoomCard from "@/components/custom/customer/home/RoomCard";
import { MapPin, ExternalLink, Sparkles, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

// Coordinates index for major cities
const CITY_COORDINATES: Record<number, { lat: number; lng: number }> = {
  1: { lat: 21.028511, lng: 105.804817 },  // Hanoi
  79: { lat: 10.762622, lng: 106.660172 }, // HCMC
  48: { lat: 16.054407, lng: 108.202162 }, // Da Nang
};

export default function MapView() {
  const { paginatedRooms, isLoading } = useRoomStore();
  const { selectedProvinceCode, selectedDistrictCode } = useRoomFilterStore();

  // ── 1. Coordinate Resolution Logic ──
  let mapLat = 10.762622;
  let mapLon = 106.660172;

  if (selectedProvinceCode) {
    const provCode = Number(selectedProvinceCode);
    if (CITY_COORDINATES[provCode]) {
      mapLat = CITY_COORDINATES[provCode].lat;
      mapLon = CITY_COORDINATES[provCode].lng;
    }

    if (selectedDistrictCode) {
      // Apply offset based on district code to pan the map dynamically
      const distOffset = (Number(selectedDistrictCode) % 10) * 0.015;
      mapLat += distOffset - 0.035;
      mapLon += distOffset - 0.035;
    }
  }

  // Bounding box dimensions for OpenStreetMap embed centring zoom level
  const offsetLat = 0.008;
  const offsetLon = 0.012;

  const minLon = mapLon - offsetLon;
  const minLat = mapLat - offsetLat;
  const maxLon = mapLon + offsetLon;
  const maxLat = mapLat + offsetLat;

  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${mapLat}%2C${mapLon}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapLat},${mapLon}`;

  return (
    <div className="space-y-8 h-full flex flex-col">
      
      {/* ── 2. Interactive Map Frame (Expanded height) ── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-3 shadow-lg shadow-slate-100/50 space-y-4 shrink-0">
        <div className="relative h-[670px] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 shadow-inner">
          <iframe
            title="Interactive Map Explorer"
            width="100%"
            height="100%"
            src={osmEmbedUrl}
            className="rounded-2xl saturate-[0.95] contrast-[1.05]"
            style={{ border: 0 }}
          />
        </div>

        {/* Info & Deep-link Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 pb-1">
          <div className="flex items-center gap-2 max-w-lg">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <div>
              <h5 className="font-bold text-slate-800 text-sm">
                Khu vực đang hiển thị
              </h5>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Vĩ độ: {mapLat.toFixed(4)} • Kinh độ: {mapLon.toFixed(4)}
              </p>
            </div>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button
              variant="outline"
              className="rounded-full font-extrabold text-xs text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-primary transition-all duration-300 w-full sm:w-auto uppercase tracking-wider py-4 px-5"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Xem trên bản đồ lớn
            </Button>
          </a>
        </div>
      </div>



    </div>
  );
}