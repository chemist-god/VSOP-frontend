import type { RoleOnboardingContent } from "./types";
import { developerOnboardingContent } from "./developer";

export const adminOnboardingContent: RoleOnboardingContent = {
  tour: [
    ...developerOnboardingContent.tour.slice(0, -1),
    {
      target: "nav-team",
      title: "Team",
      description: "Invite teammates, manage roles, and keep track of who's active.",
      side: "right",
    },
    {
      target: "nav-portals",
      title: "Portals",
      description: "Every client portal you support, plus their API keys, in one place.",
      side: "right",
    },
    {
      target: "nav-audit",
      title: "Audit",
      description: "A full trail of activity across the workspace, with trend insights.",
      side: "right",
    },
    developerOnboardingContent.tour[developerOnboardingContent.tour.length - 1],
  ],
  spotlights: [
    ...developerOnboardingContent.spotlights,
    {
      target: "nav-team",
      title: "Grow the team",
      description:
        "Send an invite and new teammates land here with the right role from day one.",
      side: "right",
    },
    {
      target: "nav-audit",
      title: "See the bigger picture",
      description:
        "Resolution trends, severity breakdowns, and workload balance — updated as your team works.",
      side: "right",
    },
  ],
};
