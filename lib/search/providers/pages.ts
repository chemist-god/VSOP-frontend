import type { SearchCandidate, SearchProvider } from "@/lib/search/types";
import { scoreField } from "@/lib/search/rank";

const PAGES: Array<{
  id: string;
  title: string;
  subtitle: string;
  entityId: string;
  actionId: string;
  keywords: string[];
  requires?: "canViewPortals" | "canViewTeam" | "canViewAudit";
}> = [
  {
    id: "page-inbox",
    title: "Inbox",
    subtitle: "Activity and notifications",
    entityId: "inbox",
    actionId: "go-inbox",
    keywords: ["home", "notifications", "activity"],
  },
  {
    id: "page-board",
    title: "Board",
    subtitle: "Kanban status board",
    entityId: "board",
    actionId: "go-board",
    keywords: ["kanban", "columns", "status"],
  },
  {
    id: "page-tickets",
    title: "Tickets",
    subtitle: "Track and resolve issues",
    entityId: "tickets",
    actionId: "go-tickets",
    keywords: ["issues", "tasks", "list"],
  },
  {
    id: "page-portals",
    title: "Portals",
    subtitle: "Client portal registry",
    entityId: "portals",
    actionId: "go-portals",
    keywords: ["clients", "companies", "intake"],
    requires: "canViewPortals",
  },
  {
    id: "page-team",
    title: "Team",
    subtitle: "Members and invites",
    entityId: "team",
    actionId: "go-team",
    keywords: ["people", "members", "users"],
    requires: "canViewTeam",
  },
  {
    id: "page-audit",
    title: "Audit",
    subtitle: "Operational history",
    entityId: "audit",
    actionId: "go-audit",
    keywords: ["history", "log", "events"],
    requires: "canViewAudit",
  },
  {
    id: "page-profile",
    title: "Profile",
    subtitle: "Your account settings",
    entityId: "profile",
    actionId: "go-profile",
    keywords: ["account", "settings", "me"],
  },
];

function matches(query: string, candidate: SearchCandidate): boolean {
  if (!query) return false;
  const fields = [
    candidate.title,
    candidate.subtitle,
    candidate.entityId,
    ...(candidate.keywords ?? []),
  ];
  return fields.some((field) => scoreField(query, field) > 0);
}

export const pagesProvider: SearchProvider = {
  id: "pages",
  groupLabel: "Pages",
  enabled: () => true,
  findCandidates(ctx) {
    if (!ctx.query) return [];

    return PAGES.filter((page) => {
      if (page.requires && !ctx.viewer.permissions[page.requires]) {
        return false;
      }
      const candidate: SearchCandidate = {
        id: page.id,
        type: "page",
        title: page.title,
        subtitle: page.subtitle,
        keywords: page.keywords,
        entityType: "page",
        entityId: page.entityId,
        actionId: page.actionId,
      };
      return matches(ctx.query, candidate);
    }).map((page) => ({
      id: page.id,
      type: "page" as const,
      title: page.title,
      subtitle: page.subtitle,
      keywords: page.keywords,
      entityType: "page" as const,
      entityId: page.entityId,
      actionId: page.actionId,
    }));
  },
};
