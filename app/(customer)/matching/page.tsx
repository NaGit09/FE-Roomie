"use client";

import { useEffect, useState } from "react";
import { Sparkles, Compass } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useMatchingStore } from "@/stores/matchingStore";
import { StateContainer } from "@/components/custom/common/StateContainer";
import { SubscriptionApi } from "@/services/api/subcription";

// Subcomponents
import UnauthenticatedView from "@/components/custom/customer/matching/UnauthenticatedView";
import RecommendationDashboardView from "@/components/custom/customer/matching/RecommendationDashboardView";
import PreferenceSetupView from "@/components/custom/customer/matching/PreferenceSetupView";

export default function MatchingPage() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const [hasActiveSub, setHasActiveSub] = useState<boolean | null>(null);
  const [loadingCheck, setLoadingCheck] = useState<boolean>(true);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const {
    hasPreference,
    isEditingPreference,
    checkPreferenceStatus,
    setIsEditingPreference,
    budget_min,
    budget_max,
    sleep_time,
    district,
    cleanliness_level,
    loadingPreferences,
    fetchMatches,
  } = useMatchingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      checkPreferenceStatus();
    }
  }, [mounted, isAuthenticated, checkPreferenceStatus]);

  useEffect(() => {
    const verifySubscription = async () => {
      if (!isAuthenticated) {
        setLoadingCheck(false);
        return;
      }
      try {
        setLoadingCheck(true);
        const res = await SubscriptionApi.check_subscription();
        const active = res && res.code === 200 ? res.data : false;
        setHasActiveSub(active);
      } catch (err) {
        console.error("Failed to check subscription status:", err);
        setHasActiveSub(false);
      } finally {
        setLoadingCheck(false);
      }
    };

    if (mounted && isAuthenticated) {
      verifySubscription();
    }
  }, [mounted, isAuthenticated]);

  useEffect(() => {
    if (mounted && isAuthenticated && hasPreference === true) {
      fetchMatches();
    }
  }, [mounted, isAuthenticated, hasPreference, fetchMatches]);

  useEffect(() => {
    if (mounted && isAuthenticated && hasActiveSub === false) {
      const timer = setTimeout(() => {
        setIsSubscriptionModalOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mounted, isAuthenticated, hasActiveSub]);

  // 1. Hydration loading state
  if (!mounted) {
    return (
      <StateContainer state="loading">
        <div className=""></div>
      </StateContainer>
    );
  }

  // 2. Unauthenticated state display
  if (!isAuthenticated) {
    return <UnauthenticatedView />;
  }

  // 3. Store checking / loading state
  if (hasPreference === null || loadingPreferences || loadingCheck) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden py-16 px-4 font-sans flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm">
          <div className="relative w-20 h-20 mx-auto">
            <Compass className="h-20 w-20 text-primary animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold text-slate-800 animate-pulse">
              Đang kết nối hệ thống Roomie...
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chúng tôi đang đọc thông tin tài khoản và cấu hình so khớp của bạn để hiển thị kết quả tối ưu nhất.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. If hasPreferences is true, show Roommate Recommendation Dashboard
  if (hasPreference === true && !isEditingPreference) {
    return (
      <RecommendationDashboardView
        hasActiveSub={hasActiveSub}
        isSubscriptionModalOpen={isSubscriptionModalOpen}
        setIsSubscriptionModalOpen={setIsSubscriptionModalOpen}
        setIsEditingPreference={setIsEditingPreference}
        budget_min={budget_min}
        budget_max={budget_max}
        sleep_time={sleep_time}
        district={district}
        cleanliness_level={cleanliness_level}
      />
    );
  }

  // 5. Setup Preference Form View (hasPreference === false || isEditingPreference === true)
  return (
    <PreferenceSetupView
      isSubscriptionModalOpen={isSubscriptionModalOpen}
      setIsSubscriptionModalOpen={setIsSubscriptionModalOpen}
      isEditingPreference={isEditingPreference}
      setIsEditingPreference={setIsEditingPreference}
    />
  );
}
