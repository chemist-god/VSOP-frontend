/**
 * Minimal first-login funnel tracker. There's no analytics vendor wired up
 * yet, so this logs in dev and broadcasts a DOM event any real sink can
 * subscribe to later — swap the sink here without touching call sites.
 * Never throws; onboarding UX must not depend on analytics succeeding.
 */
export type OnboardingEventName =
  | "onboarding.tour_started"
  | "onboarding.tour_completed"
  | "onboarding.terms_opened"
  | "onboarding.terms_reached_bottom"
  | "onboarding.terms_accepted"
  | "onboarding.entered_dashboard";

export function trackOnboardingEvent(
  name: OnboardingEventName,
  props?: Record<string, unknown>,
): void {
  try {
    const event = { name, props, at: new Date().toISOString() };

    if (process.env.NODE_ENV !== "production") {
      console.info("[onboarding]", event.name, event.props ?? "");
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vsop:onboarding-event", { detail: event }),
      );
    }
  } catch {
    /* analytics must never break the onboarding UX */
  }
}
