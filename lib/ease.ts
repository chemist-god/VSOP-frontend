/** Shared motion easing curves for VSOP UI transitions. */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const SPRING_PANEL = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.85,
};
