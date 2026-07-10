"use client";

import { useEffect, useState } from "react";
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
import { TooltipProvider } from "@/components/ui/tooltip";

const SIDEBAR_COLLAPSED_KEY = "vsop_sidebar_collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const isBoard = pathname.startsWith("/dashboard/board");
  const isAudit = pathname.startsWith("/dashboard/audit");
  const isWide = isBoard || isAudit;

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-svh overflow-hidden bg-background">
        {/* Icon / expanded rail — no competing top-bar border junction */}
        <aside
          className={cn(
            "hidden h-svh shrink-0 transition-[width] duration-200 ease-out lg:flex",
            ready && collapsed ? "w-[72px]" : "w-[240px]",
          )}
        >
          <SidebarNav
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
          />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="h-svh w-[280px] border-border/50 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarNav
              className="h-full w-full"
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Floating rounded workspace — ReUI-style curved edges */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/40 shadow-sm shadow-black/20">
            <TopBar onOpenMobileNav={() => setMobileOpen(true)} />
            <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div
                className={cn(
                  "mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-7",
                  isWide ? "max-w-none" : "max-w-7xl",
                )}
              >
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
