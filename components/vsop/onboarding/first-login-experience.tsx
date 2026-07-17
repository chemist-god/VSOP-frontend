"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { fetchMyProfile } from "@/lib/api/team";
import { updateOnboardingStep } from "@/lib/api/onboarding";
import { queryKeys } from "@/lib/query-keys";
import { replaceStoredUser, updateStoredUser } from "@/lib/auth";
import { needsOnboarding } from "@/lib/onboarding/needs-onboarding";
import { resolveOnboardingContent } from "@/lib/onboarding/content";
import { trackOnboardingEvent } from "@/lib/onboarding/analytics";
import { EASE_OUT } from "@/lib/ease";
import { toastError } from "@/lib/toast";
import type { AuthUser, OnboardingStep } from "@/lib/types/auth";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./dashboard-preview";
import { OnboardingProgress } from "./onboarding-progress";
import { ProductTourStep } from "./product-tour-step";
import { FeatureSpotlightStep } from "./feature-spotlight-step";
import { AgreementStep } from "./agreement-step";

export function FirstLoginExperience() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep | null>(null);
  const initializedRef = useRef(false);

  const profileQuery = useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: fetchMyProfile,
    staleTime: 0,
  });

  useEffect(() => {
    if (!profileQuery.data) return;

    updateStoredUser(profileQuery.data);

    if (!needsOnboarding(profileQuery.data)) {
      router.replace("/dashboard");
      return;
    }

    if (!initializedRef.current) {
      initializedRef.current = true;
      setStep(profileQuery.data.onboardingStep);
    }
  }, [profileQuery.data, router]);

  const advanceStepMutation = useMutation({
    mutationFn: (next: OnboardingStep) => updateOnboardingStep(next),
    onSuccess: (progress) => updateStoredUser(progress),
    onError: () => {
      // Non-blocking: the wizard keeps moving locally even if the resume
      // point failed to persist. Worst case, a lost connection mid-flow
      // means restarting this step on return instead of resuming exactly.
      toastError("Couldn't save your progress", {
        description: "You can keep going — we'll retry saving in the background.",
      });
    },
  });

  function handleTourComplete() {
    setStep("SPOTLIGHTS");
    advanceStepMutation.mutate("SPOTLIGHTS");
  }

  function handleSpotlightsComplete() {
    setStep("AGREEMENT");
    advanceStepMutation.mutate("AGREEMENT");
    trackOnboardingEvent("onboarding.tour_completed");
  }

  function handleAccepted(user: AuthUser) {
    replaceStoredUser(user);
    trackOnboardingEvent("onboarding.entered_dashboard");
    router.replace("/dashboard");
  }

  if (profileQuery.isError) {
    return (
      <div className="flex min-h-[50vh] w-full max-w-sm flex-col items-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load your account. Please try again.
        </p>
        <Button variant="outline" onClick={() => profileQuery.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const role = profileQuery.data?.role ?? "DEVELOPER";
  const name = profileQuery.data?.name ?? "there";
  const content = resolveOnboardingContent(role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="flex w-full max-w-4xl flex-col items-center gap-6 sm:gap-8"
    >
      <OnboardingProgress step={step} />

      <div className="relative w-full">
        <DashboardPreview role={role} />

        {step === "PRODUCT_TOUR" ? (
          <ProductTourStep name={name} slides={content.tour} onComplete={handleTourComplete} />
        ) : null}

        {step === "SPOTLIGHTS" ? (
          <FeatureSpotlightStep
            slides={content.spotlights}
            onComplete={handleSpotlightsComplete}
          />
        ) : null}
      </div>

      {step === "AGREEMENT" ? <AgreementStep onAccepted={handleAccepted} /> : null}
    </motion.div>
  );
}
