import type {
  SearchCandidate,
  SearchProvider,
  SearchViewer,
} from "@/lib/search/types";
import { scoreField } from "@/lib/search/rank";

type ActionDef = {
  id: string;
  title: string;
  subtitle: string;
  actionId: string;
  keywords: string[];
  permission?:
    | "canCreateTicket"
    | "canRegisterPortal"
    | "canInviteMember";
  /** Shown in idle Suggestions when permission allows */
  idleSuggestion?: boolean;
};

const ACTIONS: ActionDef[] = [
  {
    id: "action-create-ticket",
    title: "Create Ticket",
    subtitle: "Open the new ticket dialog",
    actionId: "create-ticket",
    keywords: ["new", "add", "task"],
    permission: "canCreateTicket",
    idleSuggestion: true,
  },
  {
    id: "action-register-portal",
    title: "Register Portal",
    subtitle: "Add a client portal",
    actionId: "register-portal",
    keywords: ["new", "client", "company"],
    permission: "canRegisterPortal",
    idleSuggestion: true,
  },
  {
    id: "action-invite-member",
    title: "Invite Member",
    subtitle: "Send a team invite",
    actionId: "invite-member",
    keywords: ["new", "user", "email"],
    permission: "canInviteMember",
    idleSuggestion: true,
  },
  {
    id: "action-open-board",
    title: "Open Board",
    subtitle: "Jump to the kanban board",
    actionId: "go-board",
    keywords: ["kanban", "status"],
    idleSuggestion: true,
  },
  {
    id: "action-open-inbox",
    title: "Open Inbox",
    subtitle: "Jump to activity inbox",
    actionId: "go-inbox",
    keywords: ["notifications", "home"],
    idleSuggestion: true,
  },
];

function toCandidate(action: ActionDef): SearchCandidate {
  return {
    id: action.id,
    type: "action",
    title: action.title,
    subtitle: action.subtitle,
    keywords: action.keywords,
    actionId: action.actionId,
  };
}

function isAllowed(
  action: ActionDef,
  permissions: SearchViewer["permissions"],
): boolean {
  if (!action.permission) return true;
  return permissions[action.permission];
}

export const actionsProvider: SearchProvider = {
  id: "actions",
  groupLabel: "Actions",
  enabled: () => true,
  findCandidates(ctx) {
    const allowed = ACTIONS.filter((action) =>
      isAllowed(action, ctx.viewer.permissions),
    );

    if (!ctx.query) {
      return allowed
        .filter((action) => action.idleSuggestion)
        .map(toCandidate);
    }

    return allowed
      .filter((action) => {
        const candidate = toCandidate(action);
        const fields = [
          candidate.title,
          candidate.subtitle,
          ...(candidate.keywords ?? []),
        ];
        return fields.some((field) => scoreField(ctx.query, field) > 0);
      })
      .map(toCandidate);
  },
};

export function getIdleSuggestions(
  permissions: SearchViewer["permissions"],
): SearchCandidate[] {
  return ACTIONS.filter(
    (action) => action.idleSuggestion && isAllowed(action, permissions),
  ).map(toCandidate);
}
