"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Columns3, RefreshCw, Ticket } from "lucide-react";
import { fetchPortals } from "@/lib/api/portals";
import { fetchTeamMembers } from "@/lib/api/team";
import { fetchTickets } from "@/lib/api/tickets";
import { queryKeys } from "@/lib/query-keys";
import type { TicketFilters as TicketFilterValues } from "@/lib/types/tickets";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { TablePagination } from "@/components/vsop/shared/table-pagination";
import { CreateTicketDialog } from "@/components/vsop/tickets/create-ticket-dialog";
import { TicketFilters } from "@/components/vsop/tickets/ticket-filters";
import { TicketTable } from "@/components/vsop/tickets/ticket-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthUser } from "@/hooks/use-auth-user";

const PAGE_SIZE = 10;

export function TicketsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin, user } = useAuthUser();
  const [filters, setFilters] = useState<TicketFilterValues>({});
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    if (searchParams.get("new") !== "1") return;
    setCreateOpen(true);
    router.replace("/dashboard/tickets", { scroll: false });
  }, [isAdmin, searchParams, router]);

  const filterQuery = useMemo(
    () => ({
      portalId: filters.portalId,
      status: filters.status,
      severity: filters.severity,
      assigneeId: filters.assigneeId,
      source: filters.source,
    }),
    [filters],
  );

  useEffect(() => {
    setPage(1);
  }, [filterQuery]);

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
  const totalPages = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedTickets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return tickets.slice(start, start + PAGE_SIZE);
  }, [tickets, currentPage]);

  const stats = useMemo(
    () => ({
      open: tickets.filter((ticket) => ticket.status === "OPEN").length,
      inProgress: tickets.filter((ticket) => ticket.status === "IN_PROGRESS")
        .length,
      pendingReview: tickets.filter(
        (ticket) => ticket.status === "PENDING_REVIEW",
      ).length,
      urgent: tickets.filter(
        (ticket) =>
          ticket.severity === "CRITICAL" || ticket.severity === "HIGH",
      ).length,
    }),
    [tickets],
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Tickets"
        description="Track portal issues and internal tasks — assign, monitor, and resolve."
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
            {isAdmin ? (
              <CreateTicketDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={(ticketId) =>
                  router.push(`/dashboard/tickets/${ticketId}`)
                }
              />
            ) : null}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Open", value: stats.open, tone: "text-amber-600 dark:text-amber-400" },
          {
            label: "In progress",
            value: stats.inProgress,
            tone: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "Pending review",
            value: stats.pendingReview,
            tone: "text-violet-600 dark:text-violet-400",
          },
          {
            label: "Urgent",
            value: stats.urgent,
            tone: "text-red-600 dark:text-red-400",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-border/50 bg-card/50 shadow-sm shadow-black/5"
          >
            <CardHeader className="pb-1.5 sm:pb-2">
              <CardTitle className="text-[11px] font-normal leading-snug text-muted-foreground sm:text-xs">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ticketsQuery.isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p
                  className={`text-2xl font-medium tracking-tight tabular-nums ${stat.tone}`}
                >
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
        showMineFilter={Boolean(user?.id)}
        currentUserId={user?.id}
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
          icon={<Ticket className="size-5" />}
          title="No tickets yet"
          description={
            isAdmin
              ? "Create an internal task, or wait for portal submissions to land here."
              : "When tickets are assigned to you, they will appear here."
          }
        />
      ) : null}

      {!ticketsQuery.isLoading && !ticketsQuery.isError && tickets.length > 0 ? (
        <div className="space-y-4">
          <TicketTable tickets={pagedTickets} portalsById={portalsById} />
          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={tickets.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
}
