type ThemeName = "light" | "dark";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Flip light/dark with a branded vertical slide when View Transitions are available.
 * Falls back to an instant swap when unsupported or reduced-motion is on.
 */
export function switchThemeWithTransition(
  next: ThemeName,
  setTheme: (theme: string) => void,
): void {
  const apply = () => setTheme(next);

  if (
    typeof document === "undefined" ||
    prefersReducedMotion() ||
    typeof document.startViewTransition !== "function"
  ) {
    apply();
    return;
  }

  const root = document.documentElement;
  root.dataset.themeTransition = "slide";
  root.dataset.themeTo = next;

  const transition = document.startViewTransition(() => {
    apply();
  });

  transition.finished.finally(() => {
    delete root.dataset.themeTransition;
    delete root.dataset.themeTo;
  });
}

export function toggleThemeWithTransition(
  resolvedTheme: string | undefined,
  setTheme: (theme: string) => void,
): void {
  const next: ThemeName = resolvedTheme === "dark" ? "light" : "dark";
  switchThemeWithTransition(next, setTheme);
}
