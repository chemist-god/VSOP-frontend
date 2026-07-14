"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Columns3,
  History,
  Inbox,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Ticket,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNavItems, type DashboardNavIcon } from "@/lib/nav";
import { useAuthUser } from "@/hooks/use-auth-user";
import { clearAuthSession } from "@/lib/auth";
import { toastSuccess } from "@/lib/toast";
import { fetchInbox } from "@/lib/api/inbox";
import { queryKeys } from "@/lib/query-keys";
import { LogoIcon, VsopLogo } from "@/components/templates/triggerly/sections/logo";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { ThemeToggle } from "@/components/vsop/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  collapsed = false,
  onToggleCollapsed,
}: {
  className?: string;
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthUser();
  const role = user?.role ?? "DEVELOPER";

  const inboxQuery = useQuery({
    queryKey: queryKeys.inbox.list(),
    queryFn: fetchInbox,
    refetchInterval: 60_000,
    retry: false,
  });
  const unreadCount = inboxQuery.data?.unreadCount ?? 0;

  const visibleItems = dashboardNavItems.filter((item) =>
    (item.roles as readonly string[]).includes(role),
  );

  function handleLogout() {
    clearAuthSession();
    toastSuccess("Signed out", { description: "See you next time." });
    router.replace("/login");
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-transparent",
        className,
      )}
    >
      {/* Brand + collapse */}
      <div
        className={cn(
          "flex shrink-0 items-center gap-1 px-2 pt-3",
          collapsed ? "flex-col gap-2" : "justify-between px-3",
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={cn(
            "flex items-center rounded-xl transition-colors hover:bg-muted/40",
            collapsed
              ? "size-10 justify-center"
              : "min-w-0 flex-1 gap-2 px-1.5 py-1.5",
          )}
          aria-label="VSOP dashboard"
        >
          {collapsed ? (
            <LogoIcon className="size-9" />
          ) : (
            <div className="min-w-0">
              <VsopLogo size="md" className="max-w-[9.5rem]" />
              <p className="mt-0.5 truncate pl-0.5 text-[10px] text-muted-foreground">
                Support operations
              </p>
            </div>
          )}
        </Link>

        {onToggleCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground"
                onClick={onToggleCollapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <PanelLeftOpen className="size-4" />
                ) : (
                  <PanelLeftClose className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Expand" : "Collapse"}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>

      {/* Search — icon only when collapsed */}
      <div className={cn("shrink-0 px-2 pt-3", !collapsed && "px-3")}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex size-10 w-full items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                aria-label="Search"
              >
                <Search className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Search</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-2.5 py-2 text-xs text-muted-foreground">
            <Search className="size-3.5 shrink-0" />
            <span className="truncate">Search…</span>
            <kbd className="ml-auto rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px]">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      <ScrollArea className="min-h-0 flex-1 px-2 py-3">
        {!collapsed ? (
          <p className="mb-2 px-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
            Platform
          </p>
        ) : null}
        <nav className={cn("space-y-1", collapsed && "flex flex-col items-center")}>
          {visibleItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active =
              "exact" in item && item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const showUnread =
              item.href === "/dashboard" && unreadCount > 0;

            const link = (
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center rounded-xl text-sm transition-colors",
                  collapsed
                    ? "size-10 justify-center"
                    : "gap-2.5 px-2.5 py-2",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <span className="relative">
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active ? "text-sidebar-primary" : "",
                    )}
                  />
                  {collapsed && showUnread ? (
                    <span className="absolute -right-1 -top-1 size-2 rounded-full bg-sidebar-primary" />
                  ) : null}
                </span>
                {!collapsed ? (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {showUnread ? (
                      <span className="rounded-md bg-sidebar-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-sidebar-primary">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </Link>
            );

            if (!collapsed) {
              return (
                <div key={item.href}>{link}</div>
              );
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </ScrollArea>

      <div
        className={cn(
          "shrink-0 space-y-2 p-2 pb-3",
          !collapsed && "px-3",
        )}
      >
        <ThemeToggle
          variant={collapsed ? "icon" : "row"}
          showTooltip={collapsed}
          className={cn(collapsed && "mx-auto")}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-auto rounded-xl hover:bg-muted/40",
                collapsed
                  ? "size-10 justify-center p-0"
                  : "w-full justify-start gap-2.5 px-2 py-2",
              )}
            >
              <UserAvatar
                name={user?.name}
                email={user?.email}
                role={user?.role}
                size={collapsed ? 28 : 28}
              />
              {!collapsed ? (
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-xs font-medium text-foreground">
                    {user?.name ?? "Team member"}
                  </span>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {user?.role ?? "VSOP"}
                  </span>
                </span>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={collapsed ? "center" : "start"}
            side="top"
            className="w-56"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" onClick={onNavigate}>
                <UserRound />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
