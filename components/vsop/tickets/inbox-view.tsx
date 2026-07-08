"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Columns3, Inbox, RefreshCw } from "lucide-react";
import { fetchPortals } from "@/lib/api/portals";
import { fetchTeamMembers } from "@/lib/api/team";
import { fetchTickets } from "@/lib/api/tickets";
import { queryKeys } from "@/lib/query-keys";
import type { TicketFilters as TicketFilterValues } from "@/lib/types/tickets";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { TicketFilters } from "@/components/vsop/tickets/ticket-filters";
import { TicketTable } from "@/components/vsop/tickets/ticket-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthUser } from "@/hooks/use-auth-user";

type InboxViewProps = {
  title?: string;
  description?: string;
  defaultFilters?: TicketFilterValues;
};

export function InboxView({
  title = "Inbox",
  description = "Incoming support tickets across all VeriTrack client portals.",
  defaultFilters = {},
}: InboxViewProps) {
  const { isAdmin } = useAuthUser();
  const [filters, setFilters] = useState<TicketFilterValues>(defaultFilters);

  const filterQuery = useMemo(
    () => ({
      portalId: filters.portalId,
      status: filters.status,
      severity: filters.severity,
      assigneeId: filters.assigneeId,
    }),
    [filters],
  );

  const ticketsQuery = useQuery({
    queryKey: queryKeys.tickets.list(filterQuery),
    queryFn: () => fetchTickets(filters),
  });

  const portalsQuery = useQuery({
    queryKey: queryKeys.portals.list(),
    queryFn: fetchPortals,
    retry: false,
  });

  const teamQuery = useQuery({
    queryKey: queryKeys.team.list(),
    queryFn: fetchTeamMembers,
    retry: false,
    enabled: isAdmin,
  });

  const portalsById = useMemo(() => {
    const map: Record<string, import("@/lib/types/portals").PortalListItem> =
      {};
    for (const portal of portalsQuery.data ?? []) {
      map[portal.id] = portal;
    }
    return map;
  }, [portalsQuery.data]);

  const tickets = ticketsQuery.data ?? [];
  const stats = useMemo(
    () => ({
      open: tickets.filter((ticket) => ticket.status === "OPEN").length,
      inProgress: tickets.filter((ticket) => ticket.status === "IN_PROGRESS")
        .length,
      urgent: tickets.filter(
        (ticket) =>
          ticket.severity === "CRITICAL" || ticket.severity === "HIGH",
      ).length,
      resolvedToday: tickets.filter((ticket) => {
        if (!ticket.resolvedAt) return false;
        const resolved = new Date(ticket.resolvedAt);
        const today = new Date();
        return (
          resolved.getDate() === today.getDate() &&
          resolved.getMonth() === today.getMonth() &&
          resolved.getFullYear() === today.getFullYear()
        );
      }).length,
    }),
    [tickets],
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/board">
                <Columns3 />
                Board
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => ticketsQuery.refetch()}
              disabled={ticketsQuery.isFetching}
            >
              <RefreshCw
                className={ticketsQuery.isFetching ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open", value: stats.open, tone: "text-amber-400" },
          {
            label: "In progress",
            value: stats.inProgress,
            tone: "text-blue-400",
          },
          { label: "Urgent", value: stats.urgent, tone: "text-red-400" },
          {
            label: "Resolved today",
            value: stats.resolvedToday,
            tone: "text-emerald-400",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-border/50 bg-card/50 shadow-sm shadow-black/5"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-normal text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticketsQuery.isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className={`text-2xl font-medium tracking-tight ${stat.tone}`}>
                  {stat.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <TicketFilters
        filters={filters}
        onChange={setFilters}
        portals={portalsQuery.data ?? []}
        teamMembers={teamQuery.data ?? []}
        showAssigneeFilter={isAdmin}
      />

      {ticketsQuery.isLoading ? (
        <div className="space-y-2 rounded-xl border border-border/50 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : null}

      {ticketsQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Could not load tickets. Check your connection and try again.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => ticketsQuery.refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!ticketsQuery.isLoading &&
      !ticketsQuery.isError &&
      tickets.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="No tickets yet"
          description="When client portals submit issues, they will appear here for triage and assignment."
        />
      ) : null}

      {!ticketsQuery.isLoading && !ticketsQuery.isError && tickets.length > 0 ? (
        <TicketTable tickets={tickets} portalsById={portalsById} />
      ) : null}
    </div>
  );
}
