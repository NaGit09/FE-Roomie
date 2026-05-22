/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { addressApi } from "@/services/api/adress";

export interface LocationItem {
  code: number;
  name: string;
}

interface RoomFilterState {
  keyword: string;
  selectedProvince: string;
  selectedProvinceCode: number | "";
  selectedDistrict: string;
  selectedDistrictCode: number | "";
  selectedFacilities: string[];
  priceRange: [number, number];
  sortBy: "newest" | "priceAsc" | "priceDesc";
  
  // Pagination State
  page: number;
  limit: number;

  provinces: LocationItem[];
  districts: LocationItem[];

  loadingProvinces: boolean;
  loadingDistricts: boolean;

  setKeyword: (keyword: string) => void;
  setSelectedProvince: (selectedProvince: string) => void;
  setSelectedProvinceCode: (selectedProvinceCode: number | "") => Promise<void>;
  setSelectedDistrict: (selectedDistrict: string) => void;
  setSelectedDistrictCode: (selectedDistrictCode: number | "") => void;
  setSelectedFacilities: (
    selectedFacilities: string[] | ((prev: string[]) => string[]),
  ) => void;
  setPriceRange: (priceRange: [number, number]) => void;
  setSortBy: (sortBy: "newest" | "priceAsc" | "priceDesc") => void;
  setPage: (page: number) => void;

  setProvinces: (provinces: LocationItem[]) => void;
  setDistricts: (districts: LocationItem[]) => void;

  setLoadingProvinces: (loadingProvinces: boolean) => void;
  setLoadingDistricts: (loadingDistricts: boolean) => void;

  handleToggleFacility: (facility: string) => void;
  handleClearFilters: () => void;
  loadProvinces: () => Promise<void>;
}

export const useRoomFilterStore = create<RoomFilterState>((set, get) => ({
  keyword: "",
  selectedProvince: "",
  selectedProvinceCode: "",
  selectedDistrict: "",
  selectedDistrictCode: "",
  selectedFacilities: [],
  priceRange: [0, 15000000],
  sortBy: "newest",
  
  // Initial page bounds
  page: 1,
  limit: 10, // fills a perfect 3x3 layout

  provinces: [],
  districts: [],

  loadingProvinces: false,
  loadingDistricts: false,

  setKeyword: (keyword) => set({ keyword, page: 1 }),
  setSelectedProvince: (selectedProvince) => set({ selectedProvince, page: 1 }),
  
  setSelectedProvinceCode: async (selectedProvinceCode) => {
    set({
      selectedProvinceCode,
      selectedDistrict: "",
      selectedDistrictCode: "",
      districts: [],
      page: 1, // reset page to 1
    });

    if (!selectedProvinceCode) return;

    set({ loadingDistricts: true });
    try {
      const data = await addressApi.getDistricts(Number(selectedProvinceCode));
      const mapped = data.map((item: any) => ({
        code: item.code,
        name: item.name,
      }));
      set({ districts: mapped, loadingDistricts: false });
    } catch (error) {
      console.error("Failed to load districts", error);
      set({ districts: [], loadingDistricts: false });
    }
  },

  setSelectedDistrict: (selectedDistrict) => set({ selectedDistrict, page: 1 }),
  setSelectedDistrictCode: (selectedDistrictCode) =>
    set({ selectedDistrictCode, page: 1 }),

  setSelectedFacilities: (selectedFacilities) =>
    set((state) => ({
      selectedFacilities:
        typeof selectedFacilities === "function"
          ? selectedFacilities(state.selectedFacilities)
          : selectedFacilities,
      page: 1, // reset page to 1
    })),
  setPriceRange: (priceRange) => set({ priceRange, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),

  setProvinces: (provinces) => set({ provinces }),
  setDistricts: (districts) => set({ districts }),

  setLoadingProvinces: (loadingProvinces) => set({ loadingProvinces }),
  setLoadingDistricts: (loadingDistricts) => set({ loadingDistricts }),

  handleToggleFacility: (facility) =>
    set((state) => ({
      selectedFacilities: state.selectedFacilities.includes(facility)
        ? state.selectedFacilities.filter((f) => f !== facility)
        : [...state.selectedFacilities, facility],
      page: 1, // reset page to 1
    })),

  handleClearFilters: () =>
    set({
      keyword: "",
      selectedProvince: "",
      selectedProvinceCode: "",
      selectedDistrict: "",
      selectedDistrictCode: "",
      selectedFacilities: [],
      priceRange: [0, 15000000],
      sortBy: "newest",
      districts: [],
      page: 1,
    }),

  loadProvinces: async () => {
    const { provinces, loadingProvinces } = get();
    if (provinces.length > 0 || loadingProvinces) return;

    set({ loadingProvinces: true });
    try {
      const data = await addressApi.getProvinces();
      const mapped = data.map((item: any) => ({
        code: item.code,
        name: item.name,
      }));
      set({ provinces: mapped, loadingProvinces: false });
    } catch (error) {
      console.error("Failed to load provinces", error);
      set({ provinces: [], loadingProvinces: false });
    }
  },
}));
