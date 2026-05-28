/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AddressApi } from "@/services/api/adress";
import { useAuthStore } from "@/stores/authStore";
import { useMatchingStore } from "@/stores/matchingStore";
import {
  UserPreferenceSchema,
  type UserPreference,
} from "@/schema/matching/UserPreference";

export interface LocationItem {
  code: number;
  name: string;
}

export function useUserPreferenceForm() {
  const { isAuthenticated } = useAuthStore();
  const store = useMatchingStore();
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  // Address Loading State
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | "">("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const form = useForm<UserPreference>({
    resolver: zodResolver(UserPreferenceSchema),
    defaultValues: {
      budget_min: store.budget_min,
      budget_max: store.budget_max,
      sleep_time: store.sleep_time,
      smoking: store.smoking,
      district: store.district,
      noise_tolerance: store.noise_tolerance,
      cleanliness_level: store.cleanliness_level,
      pet_friendly: store.pet_friendly,
      area: store.area,
    },
  });

  // Sync store values to react-hook-form in real-time only when values are different
  useEffect(() => {
    if (form.getValues("budget_min") !== store.budget_min) {
      form.setValue("budget_min", store.budget_min, { shouldValidate: true });
    }
  }, [store.budget_min, form]);

  useEffect(() => {
    if (form.getValues("budget_max") !== store.budget_max) {
      form.setValue("budget_max", store.budget_max, { shouldValidate: true });
    }
  }, [store.budget_max, form]);

  useEffect(() => {
    if (form.getValues("sleep_time") !== store.sleep_time) {
      form.setValue("sleep_time", store.sleep_time, { shouldValidate: true });
    }
  }, [store.sleep_time, form]);

  useEffect(() => {
    if (form.getValues("smoking") !== store.smoking) {
      form.setValue("smoking", store.smoking, { shouldValidate: true });
    }
  }, [store.smoking, form]);

  useEffect(() => {
    if (form.getValues("district") !== store.district) {
      form.setValue("district", store.district, { shouldValidate: true });
    }
  }, [store.district, form]);

  useEffect(() => {
    if (form.getValues("noise_tolerance") !== store.noise_tolerance) {
      form.setValue("noise_tolerance", store.noise_tolerance, { shouldValidate: true });
    }
  }, [store.noise_tolerance, form]);

  useEffect(() => {
    if (form.getValues("cleanliness_level") !== store.cleanliness_level) {
      form.setValue("cleanliness_level", store.cleanliness_level, { shouldValidate: true });
    }
  }, [store.cleanliness_level, form]);

  useEffect(() => {
    if (form.getValues("pet_friendly") !== store.pet_friendly) {
      form.setValue("pet_friendly", store.pet_friendly, { shouldValidate: true });
    }
  }, [store.pet_friendly, form]);

  useEffect(() => {
    const currentFormArea = form.getValues("area");
    if (currentFormArea !== store.area && Number(currentFormArea) !== Number(store.area)) {
      form.setValue("area", store.area, { shouldValidate: true });
    }
  }, [store.area, form]);

  // Watchers for component rendering / real-time feedback
  const watchDistrict = form.watch("district");
  const watchSleepTime = form.watch("sleep_time");
  const watchSmoking = form.watch("smoking");
  const watchPetFriendly = form.watch("pet_friendly");
  const watchCleanliness = form.watch("cleanliness_level");
  const watchNoiseTolerance = form.watch("noise_tolerance");
  const watchBudgetMin = form.watch("budget_min");
  const watchBudgetMax = form.watch("budget_max");
  const watchArea = form.watch("area");

  useEffect(() => {
    if (watchArea !== undefined && watchArea !== null && watchArea !== "" && !isNaN(Number(watchArea))) {
      const numericArea = Number(watchArea);
      if (store.area !== numericArea) {
        store.setArea(numericArea);
      }
    }
  }, [watchArea, store]);

  useEffect(() => {
    if (watchDistrict !== undefined && watchDistrict !== null) {
      if (store.district !== watchDistrict) {
        store.setDistrict(watchDistrict);
      }
    }
  }, [watchDistrict, store]);

  // Load Provinces on mount
  useEffect(() => {
    async function loadProvinces() {
      setLoadingProvinces(true);
      try {
        const data = await AddressApi.getProvinces();
        const mapped = data.map((item: any) => ({
          code: item.code,
          name: item.name,
        }));
        setProvinces(mapped);
      } catch (error) {
        console.error("Failed to load provinces", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố!");
      } finally {
        setLoadingProvinces(false);
      }
    }
    loadProvinces();
  }, []);

  // Load Districts when selectedProvinceCode changes
  useEffect(() => {
    if (!selectedProvinceCode) {
      setDistricts([]);
      return;
    }

    async function loadDistricts() {
      setLoadingDistricts(true);
      try {
        const data = await AddressApi.getDistricts(Number(selectedProvinceCode));
        const mapped = data.map((item: any) => ({
          code: item.code,
          name: item.name,
        }));
        setDistricts(mapped);
      } catch (error) {
        console.error("Failed to load districts", error);
        toast.error("Không thể tải danh sách quận/huyện!");
      } finally {
        setLoadingDistricts(false);
      }
    }
    loadDistricts();
  }, [selectedProvinceCode]);

  const handleProvinceChange = (provinceCodeString: string) => {
    const code = provinceCodeString === "all" ? "" : Number(provinceCodeString);
    setSelectedProvinceCode(code);
    form.setValue("district", ""); // Reset district in react-hook-form
  };

  const formatVND = (value: number) => {
    if (value === undefined || value === null || isNaN(value)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const onSubmit = async (data: UserPreference) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu cấu hình tìm kiếm bạn ở ghép!");
      return;
    }

    if (data.budget_max < data.budget_min) {
      toast.error("Ngân sách tối đa không được nhỏ hơn ngân sách tối thiểu!");
      return;
    }

    if (!data.district) {
      toast.error("Vui lòng chọn Quận/Huyện!");
      return;
    }

    const success = await store.savePreferences(data);
    if (success) {
      toast.success("Cấu hình tiêu chí tìm bạn ở ghép thành công!");
      setSuccessSubmitted(true);
      setTimeout(() => {
        setSuccessSubmitted(false);
      }, 1500);
    } else {
      toast.error(store.error || "Có lỗi xảy ra khi lưu tùy chọn!");
    }
  };

  return {
    form,
    provinces,
    districts,
    selectedProvinceCode,
    loadingProvinces,
    loadingDistricts,
    successSubmitted,
    watchDistrict,
    watchSleepTime,
    watchSmoking,
    watchPetFriendly,
    watchCleanliness,
    watchNoiseTolerance,
    watchBudgetMin,
    watchBudgetMax,
    handleProvinceChange,
    formatVND,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
