"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, PanelLeft } from "lucide-react";
import { getStoredUser } from "@/lib/auth";
import { dashboardNavItems } from "@/lib/nav";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { Button } from "@/components/ui/button";

function currentPageTitle(pathname: string): string {
  const match = [...dashboardNavItems]
    .reverse()
    .find((item) =>
      "exact" in item && item.exact
        ? pathname === item.href
        : pathname.startsWith(item.href),
    );
  if (pathname.startsWith("/dashboard/profile")) return "Profile";
  if (
    pathname.startsWith("/dashboard/tickets/") &&
    pathname !== "/dashboard/tickets"
  ) {
    return "Ticket";
  }
  return match?.title ?? "Dashboard";
}

export function TopBar({ onOpenMobileNav }: { onOpenMobileNav?: () => void }) {
  const pathname = usePathname();
  const user = getStoredUser();
  const title = currentPageTitle(pathname);

  return (
    <header className="z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/40 px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        {onOpenMobileNav ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground lg:hidden"
            aria-label="Open navigation"
            onClick={onOpenMobileNav}
          >
            <PanelLeft className="size-4" />
          </Button>
        ) : null}

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-sm"
        >
          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="size-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
          <span className="truncate font-medium text-foreground">{title}</span>
        </nav>
      </div>

      <Link
        href="/dashboard/profile"
        className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors hover:bg-muted/40 sm:gap-2.5 sm:px-2"
      >
        <UserAvatar
          name={user?.name}
          email={user?.email}
          role={user?.role}
          size={28}
        />
        <span className="hidden max-w-[140px] truncate text-xs font-medium sm:inline">
          {user?.name ?? "Profile"}
        </span>
      </Link>
    </header>
  );
}
