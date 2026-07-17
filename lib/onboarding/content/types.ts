export interface OnboardingSlide {
  /** Matches a `data-tour="<target>"` attribute inside DashboardPreview. */
  target: string;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
}

export interface RoleOnboardingContent {
  tour: OnboardingSlide[];
  spotlights: OnboardingSlide[];
}
