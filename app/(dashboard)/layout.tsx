"use client";

import { AuthGate } from "@/components/vsop/auth/auth-gate";
import { AppShell } from "@/components/vsop/layout/app-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
