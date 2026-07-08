"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "@/components/vsop/layout/sidebar-nav";
import { TopBar } from "@/components/vsop/layout/top-bar";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isBoard = pathname.startsWith("/dashboard/board");

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex">
        <SidebarNav />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarNav
            className="w-full border-r-0"
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div
            className={cn(
              "mx-auto w-full px-4 py-6 sm:px-6 lg:py-8",
              isBoard ? "max-w-none" : "max-w-7xl",
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
