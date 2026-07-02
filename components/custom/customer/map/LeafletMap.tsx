"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import formatVND from "@/utils/priceUtils";
import { PostCardType } from "@/schema/room/post";

// Custom Marker Icon with pulsing effect
const createCustomIcon = (isFeatured: boolean) => {
  const bgClass = isFeatured ? "bg-amber-500" : "bg-primary";
  const borderClass = isFeatured ? "border-amber-200" : "border-white";
  const pingClass = isFeatured ? "bg-amber-500/40" : "bg-primary/30";
  
  return L.divIcon({
    html: `<div class="relative flex items-center justify-center">
             <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full ${pingClass} opacity-75"></span>
             <div class="relative flex h-5.5 w-5.5 items-center justify-center rounded-full ${bgClass} border-2 ${borderClass} shadow-md text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
             </div>
           </div>`,
    className: "custom-marker-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Helper component to pan/zoom map dynamically when search filters change
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  rooms: PostCardType[];
}

export default function LeafletMap({ center, zoom, rooms }: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      className="rounded-2xl"
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rooms.map((post) => {
        const lat = post.room.address.latitude;
        const lng = post.room.address.longitude;
        
        // Skip if coordinates are missing or invalid
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

        const isFeatured = post.is_featured || false;

        return (
          <Marker
            key={post.post_id}
            position={[lat, lng]}
            icon={createCustomIcon(isFeatured)}
          >
            <Popup className="custom-leaflet-popup">
              <div className="w-[180px] text-left space-y-2 font-sans">
                {post.image_url && (
                  <div className="relative h-20 w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-[11px] leading-tight line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-[11px] font-black text-[#F59E0B]">
                    {formatVND(post.room.price)}/tháng
                  </p>
                  <p className="text-[9px] text-slate-400 font-semibold font-body">
                    {post.room.area} m² • {post.room.address.district}
                  </p>
                </div>
                <Link
                  href={`/rooms/${post.post_id}`}
                  className="block w-full text-center py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                >
                  Xem chi tiết
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
