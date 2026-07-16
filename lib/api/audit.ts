import { apiFetch } from "@/lib/api";

export interface AuditActor {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  ticketId: string | null;
  ticketReferenceId: string | null;
  actorType: "USER" | "SYSTEM";
  actorId: string | null;
  actor: AuditActor | null;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditListResponse {
  items: AuditLogItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface InsightsPayload {
  totals: {
    tickets: number;
    resolvedLast7Days: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  byStatus: Array<{ status: string; count: number }>;
  bySeverity: Array<{ severity: string; count: number }>;
  byPortal: Array<{
    portalId: string;
    companyName: string;
    slug: string;
    count: number;
  }>;
  trendDays?: number;
  trend: Array<{ date: string; created: number; resolved: number }>;
}

export function fetchAuditLogs(page = 1, pageSize = 20) {
  return apiFetch<AuditListResponse>(
    `/audit?page=${page}&limit=${pageSize}`,
  );
}

export type InsightsTrendDays = 7 | 14 | 30;

export function fetchInsights(days: InsightsTrendDays = 14) {
  return apiFetch<InsightsPayload>(`/insights?days=${days}`);
}
