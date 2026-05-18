"use client";


import MapFilter from "@/components/custom/customer/map/MapFilter";
import MapView from "@/components/custom/customer/map/MapView";
import MapResult from "@/components/custom/customer/map/MapResult";

export default function MapPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Page header displaying localized descriptions */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tìm phòng trọ trên bản đồ
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Khám phá phòng trọ, chung cư mini, và căn hộ dịch vụ xung quanh bạn trực quan qua bản đồ số.
          </p>
        </div>

        {/* Row 1: Split Screen Map View & Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-10">
          
          {/* Left Column: Filter Sidebar (1/3 width) */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-xl shadow-slate-100/30">
            <div className="border-b border-slate-100 pb-3 mb-6">
              <h3 className="font-extrabold text-slate-800 text-lg">
                Bộ lọc bản đồ
              </h3>
            </div>
            <MapFilter />
          </div>

          {/* Right Column: Expanded Map View Panel (2/3 width) */}
          <div className="lg:col-span-2">
            <MapView />
          </div>
        </div>

        {/* Row 2: Full Width Search Results Panel */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/30">
          <MapResult />
        </div>
        
      </div>
    </main>
  );
}
