import type { RouteIntent } from "@/lib/search/types";

export type ResolvedRoute = { href: string };

/**
 * Builds dashboard routes from entity/action intent.
 * Providers never construct /dashboard/... strings.
 */
export function resolveRoute(intent: RouteIntent): ResolvedRoute {
  if (intent.actionId) {
    switch (intent.actionId) {
      case "go-inbox":
        return { href: "/dashboard" };
      case "go-board":
        return { href: "/dashboard/board" };
      case "go-tickets":
        return { href: "/dashboard/tickets" };
      case "go-portals":
        return { href: "/dashboard/portals" };
      case "go-team":
        return { href: "/dashboard/team" };
      case "go-audit":
        return { href: "/dashboard/audit" };
      case "go-profile":
        return { href: "/dashboard/profile" };
      case "create-ticket":
        return { href: "/dashboard/tickets?new=1" };
      case "register-portal":
        return { href: "/dashboard/portals?register=1" };
      case "invite-member":
        return { href: "/dashboard/team?invite=1" };
      default:
        break;
    }
  }

  if (intent.entityType === "ticket" && intent.entityId) {
    return { href: `/dashboard/tickets/${intent.entityId}` };
  }

  if (intent.entityType === "portal") {
    return { href: "/dashboard/portals" };
  }

  if (intent.entityType === "team" && intent.entityId) {
    return {
      href: `/dashboard/team?member=${encodeURIComponent(intent.entityId)}`,
    };
  }

  if (intent.entityType === "page" && intent.entityId) {
    const pageRoutes: Record<string, string> = {
      inbox: "/dashboard",
      board: "/dashboard/board",
      tickets: "/dashboard/tickets",
      portals: "/dashboard/portals",
      team: "/dashboard/team",
      audit: "/dashboard/audit",
      profile: "/dashboard/profile",
    };
    const href = pageRoutes[intent.entityId];
    if (href) return { href };
  }

  return { href: "/dashboard" };
}
