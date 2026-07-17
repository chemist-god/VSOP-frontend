"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, LayoutDashboard, Home, FileText } from "lucide-react";
import { VsopLogo } from "@/components/templates/triggerly/sections/logo";
import { ThemeToggle } from "@/components/vsop/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/ease";

export type NotFoundVariant = "internal" | "intake";

type NotFoundViewProps = {
  variant?: NotFoundVariant;
  /** Portal slug from intake cookie — used for submit CTA href */
  portalSlug?: string | null;
};

export function NotFoundView({
  variant = "internal",
  portalSlug = null,
}: NotFoundViewProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const isIntake = variant === "intake";

  const submitHref = portalSlug
    ? `/submit?portal=${encodeURIComponent(portalSlug)}`
    : "/submit";

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* Atmosphere */}
      <div className="hero-glow opacity-80" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.45]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in oklch, var(--sidebar-primary) 18%, transparent), transparent 42%), radial-gradient(circle at 80% 70%, color-mix(in oklch, var(--foreground) 6%, transparent), transparent 40%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        {isIntake ? (
          <div
            className="inline-flex min-w-0 items-center"
            aria-label="VSOP support"
          >
            <VsopLogo
              size="lg"
              priority
              className="max-w-[8.5rem] sm:max-w-[11rem]"
            />
          </div>
        ) : (
          <Link
            href="/"
            className="inline-flex min-w-0 items-center transition-opacity hover:opacity-80"
            aria-label="VSOP home"
          >
            <VsopLogo
              size="lg"
              priority
              className="max-w-[8.5rem] sm:max-w-[11rem]"
            />
          </Link>
        )}
        {isIntake ? (
          <span className="shrink-0 text-[11px] text-muted-foreground sm:text-xs">
            Client intake
          </span>
        ) : (
          <ThemeToggle className="size-8 rounded-lg" />
        )}
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-4 sm:px-8 sm:pb-20">
        <div className="flex w-full max-w-lg flex-col items-center text-center">
          {/* Visual anchor — lost ticket motif */}
          <motion.div
            className="relative mb-10 flex h-36 w-full max-w-[280px] items-center justify-center sm:mb-12 sm:h-40"
            initial={
              reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            aria-hidden
          >
            <motion.div
              className="absolute size-40 rounded-full bg-[color-mix(in_oklch,var(--sidebar-primary)_14%,transparent)] blur-2xl sm:size-48"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.08, 1], opacity: [0.55, 0.85, 0.55] }
              }
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="relative flex h-[4.5rem] w-[11.5rem] items-center gap-3 rounded-2xl border border-border/60 bg-card/80 px-4 shadow-lg shadow-black/10 backdrop-blur-md sm:h-20 sm:w-[13rem]"
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5] }
              }
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,#7dd3fc,#1d4ed8)] shadow-inner sm:size-11">
                <span className="text-[10px] font-semibold tracking-wide text-white/90">
                  ?
                </span>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="h-2 w-16 rounded-full bg-muted-foreground/25 sm:w-20" />
                <div className="mt-2 h-1.5 w-24 rounded-full bg-muted-foreground/15 sm:w-28" />
                <div className="mt-1.5 h-1.5 w-14 rounded-full bg-muted-foreground/10" />
              </div>
              <div className="absolute -right-1 top-1/2 h-8 w-2 -translate-y-1/2 rounded-l-full border border-border/50 bg-background/80" />
            </motion.div>

            <motion.span
              className="absolute -right-1 top-2 rounded-full border border-border/50 bg-card/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm sm:right-2 sm:top-3"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.4, ease: EASE_OUT }}
            >
              404
            </motion.span>

            <motion.span
              className="absolute bottom-2 left-2 size-2 rounded-full bg-sky-400/70 sm:bottom-3 sm:left-4"
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -10, 0], opacity: [0.4, 1, 0.4] }
              }
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.span
              className="absolute right-6 bottom-6 size-1.5 rounded-full bg-foreground/30 sm:right-8"
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -8, 0], opacity: [0.3, 0.9, 0.3] }
              }
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />
          </motion.div>

          <motion.h1
            className="text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl"
            initial={
              reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.08, duration: 0.5, ease: EASE_OUT }}
          >
            {isIntake
              ? "This link isn\u2019t part of support"
              : "This page slipped the queue"}
          </motion.h1>

          <motion.p
            className="mt-3 max-w-[36ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-[15px]"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.45, ease: EASE_OUT }}
          >
            {isIntake
              ? "You\u2019re on the client intake flow. That page isn\u2019t available here \u2014 head back to the support form to report your issue."
              : "That route isn\u2019t in VSOP \u2014 it may have moved, or it was never built. Let\u2019s get you back to something real."}
          </motion.p>

          <motion.div
            className="mt-8 flex w-full flex-col items-stretch gap-2.5 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:justify-center"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45, ease: EASE_OUT }}
          >
            {isIntake ? (
              <Button size="lg" className="h-10 gap-2 px-4" asChild>
                <Link href={submitHref}>
                  <FileText data-icon="inline-start" />
                  Back to support form
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="h-10 gap-2 px-4" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard data-icon="inline-start" />
                    Open dashboard
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-10 gap-2 px-4"
                  asChild
                >
                  <Link href="/">
                    <Home data-icon="inline-start" />
                    Home
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-10 gap-2 px-4 text-muted-foreground"
                  onClick={() => router.back()}
                >
                  <ArrowLeft data-icon="inline-start" />
                  Go back
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 px-5 pb-6 text-center text-[11px] leading-relaxed text-muted-foreground/80 sm:px-8">
        {isIntake
          ? "Your issue is routed to the VeriTrack support team. This page is for support submissions only."
          : "VeriTrack VSOP · Internal support operations"}
      </footer>
    </div>
  );
}
