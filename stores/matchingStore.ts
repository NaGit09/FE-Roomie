/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { UserPreference } from "@/schema/matching/UserPreference";
import { MatchingApi } from "@/services/api/matching";

interface MatchingState {
  // Preference States
  budget_min: number;
  budget_max: number;
  sleep_time: number;
  smoking: boolean;
  district: string;
  noise_tolerance: number;
  cleanliness_level: number;
  pet_friendly: boolean;
  area: number;

  // Matching Recommended list & loaders
  matches: UserPreference[];
  loadingPreferences: boolean;
  loadingMatches: boolean;
  error: string | null;

  // New preference status states
  hasPreference: boolean | null;
  isEditingPreference: boolean;

  // Connection states
  connectedIds: string[];
  connectingId: string | null;

  // Setters
  setBudgetMin: (budget_min: number) => void;
  setBudgetMax: (budget_max: number) => void;
  setSleepTime: (sleep_time: number) => void;
  setSmoking: (smoking: boolean) => void;
  setDistrict: (district: string) => void;
  setNoiseTolerance: (noise_tolerance: number) => void;
  setCleanlinessLevel: (cleanliness_level: number) => void;
  setPetFriendly: (pet_friendly: boolean) => void;
  setArea: (area: number) => void;
  setIsEditingPreference: (val: boolean) => void;

  // Bulk Setter
  setPreferences: (prefs: Partial<UserPreference>) => void;

  // Async Actions
  checkPreferenceStatus: () => Promise<void>;
  fetchMatches: () => Promise<void>;
  savePreferences: (data: UserPreference) => Promise<boolean>;
  connectRoommate: (candidateId: string) => Promise<boolean>;
  resetStore: () => void;
}

export const useMatchingStore = create<MatchingState>((set, get) => ({
  // Default values
  budget_min: 2000000,
  budget_max: 6000000,
  sleep_time: 23,
  smoking: false,
  district: "",
  noise_tolerance: 3,
  cleanliness_level: 3,
  pet_friendly: false,
  area: 25,

  matches: [],
  loadingPreferences: false,
  loadingMatches: false,
  error: null,

  // New default states
  hasPreference: null,
  isEditingPreference: false,

  // Connection default states
  connectedIds: [],
  connectingId: null,

  // Granular Setters
  setBudgetMin: (budget_min) => set({ budget_min }),
  setBudgetMax: (budget_max) => set({ budget_max }),
  setSleepTime: (sleep_time) => set({ sleep_time }),
  setSmoking: (smoking) => set({ smoking }),
  setDistrict: (district) => set({ district }),
  setNoiseTolerance: (noise_tolerance) => set({ noise_tolerance }),
  setCleanlinessLevel: (cleanliness_level) => set({ cleanliness_level }),
  setPetFriendly: (pet_friendly) => set({ pet_friendly }),
  setArea: (area) => set({ area }),
  setIsEditingPreference: (isEditingPreference) => set({ isEditingPreference }),

  // Bulk preference setter
  setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),

  // Check if preferences exist
  checkPreferenceStatus: async () => {
    set({ loadingPreferences: true, error: null });
    try {
      const response = await MatchingApi.getPreferenceProfile();
      console.log("Preference profile response:", response);
      if (response && response.code === 200 && response.data) {
        set({
          budget_min: response.data.budget_min,
          budget_max: response.data.budget_max,
          sleep_time: response.data.sleep_time,
          smoking: response.data.smoking,
          district: response.data.district,
          noise_tolerance: response.data.noise_tolerance,
          cleanliness_level: response.data.cleanliness_level,
          pet_friendly: response.data.pet_friendly,
          area: response.data.area,
          hasPreference: true,
          loadingPreferences: false,
        });
      } else {
        set({
          hasPreference: false,
          loadingPreferences: false,
        });
      }
    } catch (err: any) {
      console.error("Lỗi khi kiểm tra trạng thái hồ sơ tiêu chí:", err);
      set({
        hasPreference: false, 
        loadingPreferences: false,
      });
    }
  },

  fetchMatches: async () => {
    set({ loadingMatches: true, error: null });
    try {
      const response = await MatchingApi.getMatches();

      const dataMatches = Array.isArray(response.data) ? response.data : [];
      set({ matches: dataMatches, loadingMatches: false });
    } catch (err: any) {
      console.error("Lỗi khi fetchMatches:", err);
      set({
        error: err?.response?.data?.message || "Không thể tải danh sách gợi ý!",
        matches: [],
        loadingMatches: false,
      });
    }
  },

  // Save Preferences to API and sync state
  savePreferences: async (data: UserPreference) => {
    set({ loadingPreferences: true, error: null });
    try {
      const hasPref = get().hasPreference;
      if (hasPref) {
        await MatchingApi.update_preference(data);
      } else {
        await MatchingApi.create_preference(data);
      }
      set({
        budget_min: data.budget_min,
        budget_max: data.budget_max,
        sleep_time: data.sleep_time,
        smoking: data.smoking,
        district: data.district,
        noise_tolerance: data.noise_tolerance,
        cleanliness_level: data.cleanliness_level,
        pet_friendly: data.pet_friendly,
        area: data.area,
        hasPreference: true,
        isEditingPreference: false,
        loadingPreferences: false,
      });
      return true;
    } catch (err: any) {
      console.error(err);
      set({
        error: err?.response?.data?.message || "Lưu thiết lập thất bại!",
        loadingPreferences: false,
      });
      return false;
    }
  },

  // Connect Roommate Async Action
  connectRoommate: async (candidateId: string) => {
    set({ connectingId: candidateId });
    try {
      const response = await MatchingApi.getMatchDetails(candidateId);
      if (response && response.code === 200) {
        set((state) => ({
          connectedIds: [...state.connectedIds, candidateId],
          connectingId: null,
        }));
        return true;
      }
      set({ connectingId: null });
      return false;
    } catch (err: any) {
      console.warn("API connect details thất bại, kích hoạt kết nối giả định:", err);
      set((state) => ({
        connectedIds: [...state.connectedIds, candidateId],
        connectingId: null,
      }));
      return true;
    }
  },

  resetStore: () =>
    set({
      budget_min: 2000000,
      budget_max: 6000000,
      sleep_time: 23,
      smoking: false,
      district: "",
      noise_tolerance: 3,
      cleanliness_level: 3,
      pet_friendly: false,
      area: 25,
      matches: [],
      error: null,
      hasPreference: null,
      isEditingPreference: false,
      loadingPreferences: false,
      loadingMatches: false,
      connectedIds: [],
      connectingId: null,
    }),
}));
