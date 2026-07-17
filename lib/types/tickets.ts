export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type TicketSeverity =
  | "UNSET"
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type TicketCategory =
  | "CHECK_IN"
  | "CHECK_OUT"
  | "SCRIPT_DOWN"
  | "UX"
  | "DASHBOARD"
  | "SUBSCRIPTION"
  | "OTHER"
  | "UNSET";

export type TicketSource = "INTAKE" | "INTERNAL";

export interface TicketListItem {
  id: string;
  referenceId: string;
  portalId: string | null;
  source: TicketSource;
  createdById: string | null;
  status: TicketStatus;
  severity: TicketSeverity;
  category: TicketCategory;
  tags: string[];
  description: string;
  contactName: string | null;
  screenshotUrls: string[];
  createdAt: string;
  resolvedAt: string | null;
}

export interface TicketNote {
  id: string;
  content: string;
  authorId: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketAssignment {
  id: string;
  assigneeId: string;
  assignedBy: string;
  dueDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface TicketDetail extends TicketListItem {
  browserInfo: Record<string, unknown> | null;
  resolutionNote: string | null;
  notes: TicketNote[];
  assignments: TicketAssignment[];
}

export interface TicketFilters {
  portalId?: string;
  status?: TicketStatus;
  severity?: TicketSeverity;
  assigneeId?: string;
  source?: TicketSource;
}

export interface CreateTicketInput {
  description: string;
  portalId?: string;
  severity?: TicketSeverity;
  category?: TicketCategory;
  assigneeId?: string;
  dueDate?: string;
  screenshots?: File[];
}

export const TICKET_STATUSES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export const TICKET_SEVERITIES: TicketSeverity[] = [
  "UNSET",
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
];

export const TICKET_SOURCES: TicketSource[] = ["INTAKE", "INTERNAL"];
