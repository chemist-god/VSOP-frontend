"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { VsopLogo } from "@/components/templates/triggerly/sections/logo";
import { ThemeToggle } from "@/components/vsop/shared/theme-toggle";
import "@/components/vsop/onboarding/driver-theme.css";

/**
 * Immersive shell for the first-login experience: isolated from
 * `(dashboard)`'s AppShell so the tour never fights the real chrome for
 * attention. Only checks that someone is signed in — `FirstLoginExperience`
 * owns the authoritative `needsOnboarding` redirect once profile data loads.
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="hero-glow opacity-60" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
          <div aria-label="VSOP">
            <VsopLogo size="lg" priority className="max-w-[9rem] sm:max-w-[11rem]" />
          </div>
          <ThemeToggle className="size-8 rounded-lg" />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
