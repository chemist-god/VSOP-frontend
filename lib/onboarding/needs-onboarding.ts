import type { AuthUser } from "@/lib/types/auth";
import { CURRENT_TERMS_VERSION } from "@/lib/onboarding/terms";

/**
 * Tour completion and terms acceptance are independent: a redesigned tour
 * only resets `tourCompleted`, and a terms bump only resets `termsVersion`.
 * Either one being stale routes the user back into the onboarding flow.
 */
export function needsOnboarding(
  user: Pick<AuthUser, "tourCompleted" | "termsVersion"> | null | undefined,
): boolean {
  if (!user) return false;
  return !user.tourCompleted || user.termsVersion !== CURRENT_TERMS_VERSION;
}
