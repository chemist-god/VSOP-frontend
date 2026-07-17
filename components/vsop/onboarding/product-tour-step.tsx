"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Compass } from "lucide-react";
import type { OnboardingSlide } from "@/lib/onboarding/content";
import { trackOnboardingEvent } from "@/lib/onboarding/analytics";
import { EASE_OUT } from "@/lib/ease";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTourDriver } from "./use-tour-driver";

export function ProductTourStep({
  name,
  slides,
  onComplete,
}: {
  name: string;
  slides: OnboardingSlide[];
  onComplete: () => void;
}) {
  const [started, setStarted] = useState(false);

  useTourDriver({
    slides: started ? slides : [],
    onFinished: onComplete,
  });

  if (started) return null;

  const firstName = name.split(" ")[0] || name;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="pointer-events-auto"
      >
        <Card className="max-w-sm border-border/60 bg-popover/95 px-1 py-1 text-center shadow-2xl shadow-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 px-5 py-6">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Compass className="size-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                Welcome, {firstName}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Let&apos;s take a 30-second look around your new workspace before
                you dive in.
              </p>
            </div>
            <Button
              size="lg"
              className="mt-1 w-full"
              onClick={() => {
                setStarted(true);
                trackOnboardingEvent("onboarding.tour_started");
              }}
            >
              Start the tour
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
