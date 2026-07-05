export const dashboardNavItems = [
  {
    title: "Inbox",
    href: "/dashboard",
    icon: "inbox" as const,
    exact: true,
    roles: ["ADMIN", "DEVELOPER"] as const,
  },
  {
    title: "Board",
    href: "/dashboard/board",
    icon: "board" as const,
    roles: ["ADMIN", "DEVELOPER"] as const,
  },
  {
    title: "Tickets",
    href: "/dashboard/tickets",
    icon: "tickets" as const,
    roles: ["ADMIN", "DEVELOPER"] as const,
  },
  {
    title: "Portals",
    href: "/dashboard/portals",
    icon: "portals" as const,
    roles: ["ADMIN"] as const,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: "team" as const,
    roles: ["ADMIN"] as const,
  },
  {
    title: "Audit",
    href: "/dashboard/audit",
    icon: "audit" as const,
    roles: ["ADMIN"] as const,
  },
] as const;

export type DashboardNavIcon = (typeof dashboardNavItems)[number]["icon"];

export const ADMIN_ONLY_PATH_PREFIXES = [
  "/dashboard/portals",
  "/dashboard/team",
  "/dashboard/audit",
] as const;

export function isAdminOnlyPath(pathname: string): boolean {
  return ADMIN_ONLY_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
