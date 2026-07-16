import type { SearchStoredItem, SearchViewer } from "@/lib/search/types";

const STORAGE_KEY = "vsop_search_pinned";

const BASE_PINNED: SearchStoredItem[] = [
  {
    id: "pinned-tickets",
    type: "page",
    title: "Tickets",
    subtitle: "Track and resolve issues",
    entityType: "page",
    entityId: "tickets",
    actionId: "go-tickets",
  },
  {
    id: "pinned-board",
    type: "page",
    title: "Board",
    subtitle: "Kanban status board",
    entityType: "page",
    entityId: "board",
    actionId: "go-board",
  },
  {
    id: "pinned-inbox",
    type: "page",
    title: "Inbox",
    subtitle: "Activity and notifications",
    entityType: "page",
    entityId: "inbox",
    actionId: "go-inbox",
  },
];

const ADMIN_PINNED: SearchStoredItem[] = [
  {
    id: "pinned-portals",
    type: "page",
    title: "Portals",
    subtitle: "Client portal registry",
    entityType: "page",
    entityId: "portals",
    actionId: "go-portals",
  },
  {
    id: "pinned-team",
    type: "page",
    title: "Team",
    subtitle: "Members and invites",
    entityType: "page",
    entityId: "team",
    actionId: "go-team",
  },
];

function readOverrides(): SearchStoredItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SearchStoredItem[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Seeded shortcuts; admin pages gated by permissions. */
export function getPinnedItems(viewer: SearchViewer): SearchStoredItem[] {
  const overrides = readOverrides();
  if (overrides) {
    return overrides.filter((item) => {
      if (item.actionId === "go-portals" || item.entityId === "portals") {
        return viewer.permissions.canViewPortals;
      }
      if (item.actionId === "go-team" || item.entityId === "team") {
        return viewer.permissions.canViewTeam;
      }
      if (item.actionId === "go-audit" || item.entityId === "audit") {
        return viewer.permissions.canViewAudit;
      }
      return true;
    });
  }

  const items = [...BASE_PINNED];
  if (viewer.permissions.canViewPortals) {
    items.push(ADMIN_PINNED[0]!);
  }
  if (viewer.permissions.canViewTeam) {
    items.push(ADMIN_PINNED[1]!);
  }
  return items;
}
