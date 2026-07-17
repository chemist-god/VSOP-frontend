import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NotFoundView } from "@/components/vsop/shared/not-found-view";
import {
  INTAKE_LOCK_COOKIE,
  INTAKE_PORTAL_COOKIE,
} from "@/lib/intake-lock";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This route isn't available.",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const jar = await cookies();
  const isIntakeLocked = jar.get(INTAKE_LOCK_COOKIE)?.value === "1";
  const portalSlug = jar.get(INTAKE_PORTAL_COOKIE)?.value?.trim() || null;

  return (
    <NotFoundView
      variant={isIntakeLocked ? "intake" : "internal"}
      portalSlug={portalSlug}
    />
  );
}
