"use client";

import type { OnboardingSlide } from "@/lib/onboarding/content";
import { useTourDriver } from "./use-tour-driver";

/**
 * Continues straight into a deeper, workflow-focused spotlight sequence —
 * momentum from the product tour carries over, so this starts immediately
 * with no extra gate.
 */
export function FeatureSpotlightStep({
  slides,
  onComplete,
}: {
  slides: OnboardingSlide[];
  onComplete: () => void;
}) {
  useTourDriver({ slides, onFinished: onComplete });

  return null;
}
