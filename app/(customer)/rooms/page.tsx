"use client";

import RoomSearch from "@/components/custom/customer/room/RoomSearch";
import { useRoomFilter } from "@/hooks/useRoomFilter";
import SortRoom from "@/components/custom/customer/room/SortRoom";
import { RoomSkeleton } from "@/components/custom/customer/room/RoomSkeleton";
import RoomCard from "@/components/custom/customer/home/RoomCard";
import NotFoundRoom from "@/components/custom/customer/room/NotFoundRoom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function RoomsPage() {
  const {
    filteredAndSortedRooms,
    isLoading,
    page,
    total_pages,
    total,
    setPage,
  } = useRoomFilter();

  return (
    <div className="w-full bg-slate-50/50 py-8 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* ── Page Header ── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary mb-4">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
              Khám phá phòng trọ lý tưởng
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
              Tìm Kiếm Phòng Trọ
            </h1>
            <p className="mt-2.5 text-sm font-semibold text-slate-400 max-w-xl">
              Nhập từ khóa hoặc lựa chọn các bộ lọc chuyên sâu để tìm ra phòng
              trọ, căn hộ dịch vụ hoàn hảo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-white px-4 py-2.5 rounded-full border border-slate-100 shadow-xs">
              Tìm thấy{" "}
              <strong className="text-primary">
                {total}
              </strong>{" "}
              kết quả
            </span>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="flex flex-col gap-8">
          {/* 1. HORIZONTAL FILTER PANEL (Full Width Row) */}
          <RoomSearch />

          {/* 2. RESULTS CONTAINER (Full Width Row) */}
          <main className="w-full space-y-6">
            <SortRoom />

            {/* Content Display */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <RoomSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSortedRooms.length === 0 ? (
              // Empty State
              <NotFoundRoom />
            ) : (
              // Results Grid (Full width 3 columns)
              <div className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAndSortedRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>

                {/* ── Official Shadcn Pagination Component ── */}
                {total_pages > 1 && (
                  <Pagination className="pt-10 border-t border-slate-100">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          text="Trước"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage(page - 1);
                          }}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer font-bold"}
                        />
                      </PaginationItem>

                      {Array.from({ length: total_pages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isActive = pageNum === page;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              isActive={isActive}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(pageNum);
                              }}
                              className={`cursor-pointer font-bold ${
                                isActive
                                  ? "bg-primary text-white hover:bg-primary/95 border-primary hover:text-white"
                                  : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          text="Sau"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < total_pages) setPage(page + 1);
                          }}
                          className={page === total_pages ? "pointer-events-none opacity-50" : "cursor-pointer font-bold"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
