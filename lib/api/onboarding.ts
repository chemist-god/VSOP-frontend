import { apiFetch } from "@/lib/api";
import type { AuthUser, OnboardingStep } from "@/lib/types/auth";

export interface OnboardingProgress {
  tourCompleted: boolean;
  onboardingStep: OnboardingStep;
  acceptedTermsAt: string | null;
  termsVersion: string | null;
}

export function updateOnboardingStep(step: OnboardingStep) {
  return apiFetch<OnboardingProgress>("/users/me/onboarding", {
    method: "PATCH",
    body: JSON.stringify({ step }),
  });
}

export function acceptOnboardingTerms(termsVersion: string) {
  return apiFetch<AuthUser>("/users/me/onboarding/accept-terms", {
    method: "POST",
    body: JSON.stringify({ termsVersion }),
  });
}
