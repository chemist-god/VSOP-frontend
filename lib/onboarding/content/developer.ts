import type { RoleOnboardingContent } from "./types";

export const developerOnboardingContent: RoleOnboardingContent = {
  tour: [
    {
      target: "sidebar",
      title: "Your workspace",
      description:
        "Everything you need lives in this rail — inbox, board, and tickets are always one click away.",
      side: "right",
    },
    {
      target: "nav-inbox",
      title: "Inbox",
      description:
        "New activity lands here first: fresh tickets, assignments, and anything waiting on you.",
      side: "right",
    },
    {
      target: "nav-board",
      title: "Board",
      description:
        "A kanban view of every ticket by status — drag through Open → In Progress → Resolved.",
      side: "right",
    },
    {
      target: "nav-tickets",
      title: "Tickets",
      description:
        "The full list view, built for filtering, sorting, and bulk triage.",
      side: "right",
    },
    {
      target: "topbar-search",
      title: "Jump anywhere",
      description: "⌘K opens search — find a ticket, portal, or teammate in seconds.",
      side: "bottom",
    },
    {
      target: "user-menu",
      title: "You're all set",
      description: "Your profile and sign-out live here. Let's see how you'll actually work.",
      side: "top",
    },
  ],
  spotlights: [
    {
      target: "kpi-strip",
      title: "Your workload, at a glance",
      description:
        "Open assignments, overdue items, and today's resolutions — the first thing worth checking each morning.",
      side: "bottom",
    },
    {
      target: "ticket-list",
      title: "Triage fast",
      description:
        "Severity and status badges are color-coded so the tickets that need you most stand out immediately.",
      side: "top",
    },
    {
      target: "activity-feed",
      title: "Stay in the loop",
      description:
        "New assignments and resolutions show up here in real time, so nothing slips through.",
      side: "left",
    },
  ],
};
