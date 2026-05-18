"use client";
import { useRoomStore } from "@/stores/roomStore";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DetailMap() {
  const { currentRoomDetail } = useRoomStore();

  if (!currentRoomDetail || !currentRoomDetail.room.address) return null;

  const { latitude, longitude, full_text, street, ward, district, city } =
    currentRoomDetail.room.address;

  // Fallback to text aggregate if full_text is missing
  const addressText =
    full_text || [street, ward, district, city].filter(Boolean).join(", ");

  // Safety boundaries: default HCMC center coordinates if backend returns zero/empty
  const hasCoordinates =
    latitude && longitude && latitude !== 0 && longitude !== 0;

  const mapLat = hasCoordinates ? latitude : 10.762622;
  const mapLon = hasCoordinates ? longitude : 106.660172;

  // Bounding box dimensions for OpenStreetMap centering zoom level (~16 zoom)
  const offsetLat = 0.002;
  const offsetLon = 0.003;

  const minLon = mapLon - offsetLon;
  const minLat = mapLat - offsetLat;
  const maxLon = mapLon + offsetLon;
  const maxLat = mapLat + offsetLat;

  // Dynamic OpenStreetMap embed link with custom center pin marker
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${mapLat}%2C${mapLon}`;

  // Direct Google Maps Deep Link coordinates lookup
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapLat},${mapLon}`;

  return (
    <div className="space-y-5">
      {/* Section Title */}
      <h3 className="text-xl font-extrabold text-slate-900">
        Vị trí trên bản đồ
      </h3>

      {/* Frame Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-lg shadow-slate-100/50 space-y-4">
        {/* Map View Frame */}
        <div className="relative h-[350px] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 shadow-inner">
          <iframe
            title="Room Location Map"
            width="100%"
            height="100%"
            src={osmEmbedUrl}
            className="rounded-2xl saturate-[0.95]"
            style={{ border: 0 }}
          />
        </div>

        {/* Address & Navigation Helper Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <div className="flex items-start gap-2.5 max-w-lg">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-800 text-sm">
                Địa chỉ chính xác
              </h5>
              <p className="text-xs font-semibold text-slate-500 mt-0.5 leading-relaxed">
                {addressText}
              </p>
            </div>
          </div>

          {/* Deep link Action Button */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button
              variant="outline"
              className="rounded-full font-bold text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-primary transition-all duration-300 w-full sm:w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Mở Google Maps
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
