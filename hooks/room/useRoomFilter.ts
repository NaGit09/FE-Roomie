import { useEffect, useMemo } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { useRoomFilterStore } from "@/stores/roomFilterStore";
import { mapPostToRoom } from "@/utils/mapper";

export function useRoomFilter() {

  const {
    paginatedRooms,
    total,
    total_pages,
    isLoading,
    fetchRoomPagination,
  } = useRoomStore();

  const {
    keyword,
    selectedProvince,
    selectedProvinceCode,
    selectedDistrict,
    selectedDistrictCode,
    selectedFacilities,
    priceRange,
    sortBy,
    page,
    limit,
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
    setKeyword,
    setSelectedProvince,
    setSelectedProvinceCode,
    setSelectedDistrict,
    setSelectedDistrictCode,
    setPriceRange,
    setSortBy,
    setPage,
    handleToggleFacility,
    handleClearFilters,
    loadProvinces,
  } = useRoomFilterStore();

  // 1. Initial Load: Fetch provinces list once on mount
  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  // 2. Server-side Query Trigger: Fetch paginated rooms from API on parameter change
  useEffect(() => {
    const skip = (page - 1) * limit;

    // Map the internal sortBy option to backend query properties
    let sort_by = "created_at";
    let order = "desc";
    if (sortBy === "priceAsc") {
      sort_by = "price";
      order = "asc";
    } else if (sortBy === "priceDesc") {
      sort_by = "price";
      order = "desc";
    }

    fetchRoomPagination({
      skip,
      limit,
      province_code: selectedProvinceCode || undefined,
      district_code: selectedDistrictCode || undefined,
      city: selectedProvince || undefined,
      district: selectedDistrict || undefined,
      price_from: priceRange[0],
      price_to: priceRange[1],
      min_price: priceRange[0],
      max_price: priceRange[1],
      sort_by,
      order,
    });
  }, [
    page,
    limit,
    selectedProvinceCode,
    selectedDistrictCode,
    selectedProvince,
    selectedDistrict,
    priceRange[0],
    priceRange[1],
    sortBy,
    fetchRoomPagination,
  ]);

  // 3. Client-side Processing: Map items and apply client-only filters (keyword, facilities)
  const filteredAndSortedRooms = useMemo(() => {
    let result = paginatedRooms.map(mapPostToRoom);

    // Apply keyword search locally on the fetched page
    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      result = result.filter(
        (room) =>
          room.name.toLowerCase().includes(q) ||
          room.address.toLowerCase().includes(q)
      );
    }

    // Apply facilities local filter on the fetched page
    if (selectedFacilities.length > 0) {
      result = result.filter((room) => {
        const roomFacs = room.facilities.map((f) => f.label);
        return selectedFacilities.every((facility) =>
          roomFacs.includes(facility)
        );
      });
    }

    return result;
  }, [paginatedRooms, keyword, selectedFacilities]);

  return {
    // Current filter states
    keyword,
    selectedProvince,
    selectedProvinceCode,
    selectedDistrict,
    selectedDistrictCode,
    selectedFacilities,
    priceRange,
    sortBy,
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
    isLoading,

    // Server-side Pagination properties
    page,
    limit,
    total,
    total_pages,

    // Calculated rooms list
    filteredAndSortedRooms,

    // Action setters
    setKeyword,
    setSelectedProvince,
    setSelectedProvinceCode,
    setSelectedDistrict,
    setSelectedDistrictCode,
    setPriceRange,
    setSortBy,
    setPage,
    handleToggleFacility,
    handleClearFilters,
  };
}
