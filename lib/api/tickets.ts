import { apiFetch } from "@/lib/api";
import type {
  CreateTicketInput,
  TicketDetail,
  TicketFilters,
  TicketListItem,
  TicketSeverity,
  TicketStatus,
} from "@/lib/types/tickets";

function buildQuery(filters?: TicketFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.portalId) params.set("portalId", filters.portalId);
  if (filters.status) params.set("status", filters.status);
  if (filters.severity) params.set("severity", filters.severity);
  if (filters.assigneeId) params.set("assigneeId", filters.assigneeId);
  if (filters.source) params.set("source", filters.source);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function fetchTickets(filters?: TicketFilters) {
  return apiFetch<TicketListItem[]>(`/tickets${buildQuery(filters)}`);
}

export function fetchTicket(id: string) {
  return apiFetch<TicketDetail>(`/tickets/${id}`);
}

export function createTicket(input: CreateTicketInput) {
  return apiFetch<{
    ticketId: string;
    referenceId: string;
    portalId: string | null;
    source: string;
    createdAt: string;
  }>("/tickets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTicketStatus(id: string, status: TicketStatus) {
  return apiFetch<{ id: string; status: TicketStatus }>(`/tickets/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updateTicketSeverity(id: string, severity: TicketSeverity) {
  return apiFetch(`/tickets/${id}/severity`, {
    method: "PATCH",
    body: JSON.stringify({ severity }),
  });
}

export function addTicketNote(id: string, content: string) {
  return apiFetch(`/tickets/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function assignTicket(
  id: string,
  input: { assigneeId: string; dueDate: string },
) {
  return apiFetch(`/tickets/${id}/assign`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function resolveTicket(id: string, resolutionNote: string) {
  return apiFetch(`/tickets/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ resolutionNote }),
  });
}
