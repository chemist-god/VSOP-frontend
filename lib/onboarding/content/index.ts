import type { UserRole } from "@/lib/types/auth";
import type { RoleOnboardingContent } from "./types";
import { developerOnboardingContent } from "./developer";
import { adminOnboardingContent } from "./admin";

export type { OnboardingSlide, RoleOnboardingContent } from "./types";

export function resolveOnboardingContent(role: UserRole): RoleOnboardingContent {
  switch (role) {
    case "ADMIN":
      return adminOnboardingContent;
    case "DEVELOPER":
    default:
      return developerOnboardingContent;
  }
}
