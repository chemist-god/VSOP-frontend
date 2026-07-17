"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getStoredUser, isAuthenticated, updateStoredUser } from "@/lib/auth";
import { isAdminOnlyPath } from "@/lib/nav";
import { fetchMyProfile } from "@/lib/api/team";
import { needsOnboarding } from "@/lib/onboarding/needs-onboarding";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function guard() {
      if (!isAuthenticated()) {
        router.replace("/login");
        return;
      }

      const user = getStoredUser();
      if (needsOnboarding(user)) {
        router.replace("/onboarding");
        return;
      }

      // Refresh once so a stale local flag (e.g. terms just re-versioned)
      // can't leave someone stuck on the dashboard past onboarding.
      try {
        const fresh = await fetchMyProfile();
        if (cancelled) return;
        updateStoredUser(fresh);
        if (needsOnboarding(fresh)) {
          router.replace("/onboarding");
          return;
        }
      } catch {
        /* fall back to the locally stored flags if the refresh fails */
      }

      if (user?.role !== "ADMIN" && isAdminOnlyPath(pathname)) {
        router.replace("/dashboard");
        return;
      }

      if (!cancelled) setReady(true);
    }

    guard();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return children;
}
