"use client";

import { motion } from "motion/react";
import type { OnboardingStep } from "@/lib/types/auth";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/ease";

const STEPS: Array<{ id: OnboardingStep; label: string }> = [
  { id: "PRODUCT_TOUR", label: "Welcome" },
  { id: "SPOTLIGHTS", label: "Explore" },
  { id: "AGREEMENT", label: "Agreement" },
];

export function OnboardingProgress({ step }: { step: OnboardingStep }) {
  const activeIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((item, index) => {
        const state =
          index < activeIndex
            ? "done"
            : index === activeIndex
              ? "active"
              : "upcoming";

        return (
          <div key={item.id} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "relative flex size-2 items-center justify-center rounded-full transition-colors duration-300",
                  state === "upcoming" ? "bg-border" : "bg-primary",
                )}
              >
                {state === "active" ? (
                  <motion.span
                    layoutId="onboarding-progress-ring"
                    className="absolute -inset-1.5 rounded-full border border-primary/50"
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                  />
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium tracking-wide transition-colors duration-300 sm:text-xs",
                  state === "upcoming"
                    ? "text-muted-foreground/60"
                    : "text-foreground",
                )}
              >
                {item.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "h-px w-6 shrink-0 rounded-full transition-colors duration-500 sm:w-10",
                  index < activeIndex ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
