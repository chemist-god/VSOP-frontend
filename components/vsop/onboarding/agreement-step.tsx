"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, ScrollText } from "lucide-react";
import { acceptOnboardingTerms } from "@/lib/api/onboarding";
import { TERMS } from "@/lib/onboarding/terms";
import { trackOnboardingEvent } from "@/lib/onboarding/analytics";
import { toastError } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { EASE_OUT } from "@/lib/ease";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AuthUser } from "@/lib/types/auth";

const BOTTOM_THRESHOLD_PX = 32;

export function AgreementStep({
  onAccepted,
}: {
  onAccepted: (user: AuthUser) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    trackOnboardingEvent("onboarding.terms_opened");
  }, []);

  const checkReachedBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Content fits without scrolling — treat as already finished.
    const canScroll = el.scrollHeight - el.clientHeight > BOTTOM_THRESHOLD_PX;
    if (!canScroll) {
      setReachedBottom((already) => {
        if (!already) trackOnboardingEvent("onboarding.terms_reached_bottom");
        return true;
      });
      return;
    }

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= BOTTOM_THRESHOLD_PX) {
      setReachedBottom((already) => {
        if (!already) trackOnboardingEvent("onboarding.terms_reached_bottom");
        return true;
      });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkReachedBottom();

    const resizeObserver = new ResizeObserver(() => checkReachedBottom());
    resizeObserver.observe(el);
    if (el.firstElementChild) resizeObserver.observe(el.firstElementChild);

    return () => resizeObserver.disconnect();
  }, [checkReachedBottom]);

  useEffect(() => {
    if (!reachedBottom) return;
    const timer = setTimeout(() => setShowCheckbox(true), 380);
    return () => clearTimeout(timer);
  }, [reachedBottom]);

  const mutation = useMutation({
    mutationFn: () => acceptOnboardingTerms(TERMS.version),
    onSuccess: (user) => {
      trackOnboardingEvent("onboarding.terms_accepted");
      onAccepted(user);
    },
    onError: (error) => {
      toastError(
        "Couldn't record your acceptance",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  return (
    <Dialog open onOpenChange={() => { }}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="flex h-[min(85dvh,40rem)] w-[calc(100%-1.5rem)] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogHeader className="shrink-0 gap-1.5 border-b border-border/50 px-5 pt-5 pb-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ScrollText className="size-4" />
            </div>
            <DialogTitle className="text-balance">{TERMS.title}</DialogTitle>
          </div>
          <DialogDescription>
            Please read the full agreement below. Scroll to the end to continue.
          </DialogDescription>
        </DialogHeader>

        {/* Native overflow scroll — Radix ScrollArea + flex-1 often fails to
            constrain height, which caused the stacked/clipped terms UI. */}
        <div
          ref={scrollRef}
          onScroll={checkReachedBottom}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 [-webkit-overflow-scrolling:touch]"
        >
          <div className="space-y-5 py-5 pb-8 text-sm leading-relaxed text-foreground">
            <p className="text-xs text-muted-foreground">
              Effective {TERMS.effectiveDate} · Version {TERMS.version}
            </p>
            {TERMS.sections.map((section) => (
              <div key={section.heading} className="space-y-1.5">
                <h3 className="text-sm font-semibold text-foreground">
                  {section.heading}
                </h3>
                {section.body.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}

            <AnimatePresence>
              {reachedBottom ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                >
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  You&apos;ve reached the end.
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="shrink-0 border-t border-border/50 bg-muted/30 px-5 py-4 sm:px-6">
          <AnimatePresence mode="wait">
            {showCheckbox ? (
              <motion.div
                key="acknowledge"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="flex flex-col gap-3"
              >
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => setChecked(value === true)}
                    className="mt-0.5"
                  />
                  <span className="text-muted-foreground">
                    I&apos;ve read and agree to the VSOP Terms of Service.
                  </span>
                </label>

                <AnimatePresence>
                  {checked ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                    >
                      <Button
                        size="lg"
                        className="w-full"
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate()}
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="animate-spin" />
                            Finishing up…
                          </>
                        ) : (
                          "Accept & continue"
                        )}
                      </Button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ) : (
              <p className="py-1 text-center text-xs text-muted-foreground">
                Scroll to the end of the agreement to continue.
              </p>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
