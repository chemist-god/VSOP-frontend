import {
  Building2,
  Columns3,
  History,
  Inbox,
  Search,
  Ticket,
  Users,
} from "lucide-react";
import type { UserRole } from "@/lib/types/auth";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PreviewNavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

const BASE_NAV: PreviewNavItem[] = [
  { key: "nav-inbox", label: "Inbox", icon: Inbox, active: true },
  { key: "nav-board", label: "Board", icon: Columns3 },
  { key: "nav-tickets", label: "Tickets", icon: Ticket },
];

const ADMIN_NAV: PreviewNavItem[] = [
  { key: "nav-team", label: "Team", icon: Users },
  { key: "nav-portals", label: "Portals", icon: Building2 },
  { key: "nav-audit", label: "Audit", icon: History },
];

const KPI_CARDS = [
  { label: "Open", value: "18", accent: "text-foreground" },
  { label: "Overdue", value: "3", accent: "text-red-400" },
  { label: "Resolved today", value: "7", accent: "text-emerald-400" },
  { label: "Avg. resolution", value: "4.2h", accent: "text-foreground" },
];

const TICKET_ROWS: Array<{
  ref: string;
  summary: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  assignee: string;
}> = [
  {
    ref: "VT-1042",
    summary: "Checkout script failing on Safari",
    severity: "CRITICAL",
    status: "IN_PROGRESS",
    assignee: "AM",
  },
  {
    ref: "VT-1041",
    summary: "Dashboard totals mismatch after sync",
    severity: "HIGH",
    status: "OPEN",
    assignee: "KD",
  },
  {
    ref: "VT-1039",
    summary: "Client asked to re-enable 2FA",
    severity: "MEDIUM",
    status: "OPEN",
    assignee: "RF",
  },
  {
    ref: "VT-1035",
    summary: "Update portal branding logo",
    severity: "LOW",
    status: "RESOLVED",
    assignee: "AM",
  },
];

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: "border-red-500/30 bg-red-500/10 text-red-300",
  HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  LOW: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

const STATUS_STYLES: Record<string, string> = {
  OPEN: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  IN_PROGRESS: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  RESOLVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

const ACTIVITY_ITEMS = [
  { who: "Kwame", action: "resolved", ref: "VT-1033", time: "2m ago" },
  { who: "Amara", action: "assigned you", ref: "VT-1042", time: "18m ago" },
  { who: "System", action: "flagged SLA risk on", ref: "VT-1041", time: "1h ago" },
];

/**
 * A frozen, inert replica of the real dashboard shell — built from the same
 * design-system primitives (Card/Badge/Avatar) so the tour spotlights actual
 * product chrome instead of abstract placeholder boxes. `data-tour`
 * attributes are the anchors driver.js targets.
 */
export function DashboardPreview({ role }: { role: UserRole }) {
  const navItems = role === "ADMIN" ? [...BASE_NAV, ...ADMIN_NAV] : BASE_NAV;

  return (
    <div
      inert
      aria-hidden="true"
      className="pointer-events-none w-full select-none"
    >
      <div className="flex h-[420px] w-full overflow-hidden rounded-2xl border border-border/50 bg-card/40 shadow-2xl shadow-black/30 sm:h-[480px] lg:h-[540px]">
        {/* Sidebar rail */}
        <aside
          data-tour="sidebar"
          className="flex w-[52px] shrink-0 flex-col items-center gap-1 border-r border-border/40 bg-sidebar py-3 sm:w-[190px] sm:items-stretch sm:px-2.5"
        >
          <div className="mb-3 flex items-center gap-2 px-1 sm:px-1.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
              V
            </div>
            <span className="hidden truncate text-xs font-medium text-sidebar-foreground sm:inline">
              VSOP
            </span>
          </div>

          <nav className="flex flex-col items-center gap-1 sm:items-stretch">
            {navItems.map((item) => (
              <div
                key={item.key}
                data-tour={item.key}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium sm:px-2.5",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "size-3.5 shrink-0",
                    item.active && "text-sidebar-primary",
                  )}
                />
                <span className="hidden truncate sm:inline">{item.label}</span>
              </div>
            ))}
          </nav>

          <div
            data-tour="user-menu"
            className="mt-auto flex items-center justify-center gap-2 rounded-lg px-1 py-1.5 sm:justify-start sm:px-2"
          >
            <Avatar size="sm" className="size-6 shrink-0">
              <AvatarFallback className="text-[9px]">YO</AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-[11px] font-medium text-sidebar-foreground">
                You
              </p>
              <p className="truncate text-[9px] text-muted-foreground">{role}</p>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border/40 px-3">
            <p className="truncate text-xs font-medium text-foreground">Inbox</p>
            <div
              data-tour="topbar-search"
              className="flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/30 px-2 py-1 text-[10px] text-muted-foreground"
            >
              <Search className="size-3" />
              <span className="hidden sm:inline">Search…</span>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
            {/* KPI strip */}
            <div
              data-tour="kpi-strip"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {KPI_CARDS.map((kpi) => (
                <Card
                  key={kpi.label}
                  size="sm"
                  className="border-border/40 bg-card/60 px-3 py-2"
                >
                  <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p className={cn("text-base font-semibold tabular-nums", kpi.accent)}>
                    {kpi.value}
                  </p>
                </Card>
              ))}
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[1fr_180px]">
              {/* Ticket list */}
              <Card
                data-tour="ticket-list"
                size="sm"
                className="min-h-0 border-border/40 bg-card/60 py-2"
              >
                <div className="flex items-center justify-between px-3 pb-1.5">
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Recent tickets
                  </p>
                  <Badge variant="outline" className="text-[9px]">
                    4 open
                  </Badge>
                </div>
                <div className="flex flex-col divide-y divide-border/30">
                  {TICKET_ROWS.map((row) => (
                    <div
                      key={row.ref}
                      className="flex items-center gap-2 px-3 py-1.5"
                    >
                      <span className="w-14 shrink-0 truncate text-[9px] font-medium text-muted-foreground">
                        {row.ref}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[10.5px] text-foreground">
                        {row.summary}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "hidden shrink-0 rounded-full text-[8px] sm:inline-flex",
                          SEVERITY_STYLES[row.severity],
                        )}
                      >
                        {row.severity}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0 rounded-full text-[8px]",
                          STATUS_STYLES[row.status],
                        )}
                      >
                        {row.status.replace("_", " ")}
                      </Badge>
                      <Avatar size="sm" className="hidden size-5 shrink-0 sm:flex">
                        <AvatarFallback className="text-[8px]">
                          {row.assignee}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Activity feed */}
              <Card
                data-tour="activity-feed"
                size="sm"
                className="flex min-h-0 flex-col border-border/40 bg-card/60 py-2"
              >
                <p className="px-3 pb-1.5 text-[10px] font-medium text-muted-foreground">
                  Activity
                </p>
                <div className="flex flex-col gap-2 px-3">
                  {ACTIVITY_ITEMS.map((item, index) => (
                    <div key={index} className="text-[10px] leading-relaxed">
                      <span className="font-medium text-foreground">{item.who}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>{" "}
                      <span className="font-medium text-foreground">{item.ref}</span>
                      <p className="text-[9px] text-muted-foreground/70">{item.time}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
