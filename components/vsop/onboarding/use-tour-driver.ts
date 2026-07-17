"use client";

import { useEffect, useRef } from "react";
import { driver, type DriveStep } from "driver.js";
import type { OnboardingSlide } from "@/lib/onboarding/content";

/**
 * Drives a driver.js walkthrough over the `data-tour` anchors in
 * DashboardPreview. Previous/Next only — no close button, no Escape, no
 * overlay-click dismiss — so the only way out is finishing the sequence.
 * `onFinished` fires exactly once, when the user reaches the end.
 */
export function useTourDriver({
  slides,
  onFinished,
}: {
  slides: OnboardingSlide[];
  onFinished: () => void;
}) {
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    if (slides.length === 0) return;

    let finished = false;

    const steps: DriveStep[] = slides.map((slide) => ({
      element: `[data-tour="${slide.target}"]`,
      popover: {
        title: slide.title,
        description: slide.description,
        side: slide.side ?? "bottom",
        align: "start",
      },
    }));

    const instance = driver({
      steps,
      animate: true,
      smoothScroll: true,
      allowClose: false,
      allowKeyboardControl: false,
      overlayColor: "rgb(8, 10, 16)",
      overlayOpacity: 0.7,
      stagePadding: 8,
      stageRadius: 14,
      popoverOffset: 12,
      showButtons: ["next", "previous"],
      showProgress: true,
      progressText: "{{current}} of {{total}}",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Continue",
      popoverClass: "vsop-tour-popover",
      onDestroyed: () => {
        if (finished) return;
        finished = true;
        onFinishedRef.current();
      },
    });

    const frame = requestAnimationFrame(() => instance.drive());

    return () => {
      cancelAnimationFrame(frame);
      finished = true;
      instance.destroy();
    };
  }, [slides]);
}
