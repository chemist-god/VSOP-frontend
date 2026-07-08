"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Columns3,
  History,
  Inbox,
  Search,
  Ticket,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNavItems, type DashboardNavIcon } from "@/lib/nav";
import { useAuthUser } from "@/hooks/use-auth-user";
import { LogoIcon } from "@/components/templates/triggerly/sections/logo";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const iconMap: Record<DashboardNavIcon, React.ElementType> = {
  inbox: Inbox,
  board: Columns3,
  tickets: Ticket,
  portals: Building2,
  team: Users,
  audit: History,
};

export function SidebarNav({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuthUser();
  const role = user?.role ?? "DEVELOPER";

  const visibleItems = dashboardNavItems.filter((item) =>
    (item.roles as readonly string[]).includes(role),
  );

  return (
    <aside
      className={cn(
        "flex h-full w-[220px] shrink-0 flex-col border-r border-border/50 bg-card/80 backdrop-blur-sm lg:w-60",
        className,
      )}
    >
      <div className="border-b border-border/50 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
        >
          <LogoIcon className="size-5" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              VeriTrack VSOP
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              Support operations
            </p>
          </div>
        </Link>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-2 text-xs text-muted-foreground">
          <Search className="size-3.5 shrink-0" />
          <span className="truncate">Search tickets…</span>
          <Badge
            variant="secondary"
            className="ml-auto hidden px-1.5 py-0 text-[10px] sm:inline-flex"
          >
            ⌘K
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-0.5 pb-3">
          {visibleItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium ring-1 ring-sidebar-ring/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-sidebar-primary" : "",
                  )}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-border/50 p-3">
        {isAdmin ? (
          <div className="rounded-lg border border-indigo-500/15 bg-indigo-500/5 px-2.5 py-2 text-xs text-indigo-200/80">
            <span className="font-medium">Client intake</span>
            <p className="mt-0.5 text-[11px] text-indigo-200/60">
              Share <code className="text-indigo-100">/submit?portal=slug</code>{" "}
              with each portal client.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border/40 bg-muted/20 px-2.5 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Developer workspace</span>
            <p className="mt-0.5 text-[11px]">
              Update ticket status, notes, and resolutions.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
