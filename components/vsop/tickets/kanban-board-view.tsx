"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Columns3, LayoutList, RefreshCw } from "lucide-react";
import Link from "next/link";
import { fetchPortals } from "@/lib/api/portals";
import { fetchTickets, updateTicketStatus } from "@/lib/api/tickets";
import { queryKeys } from "@/lib/query-keys";
import type { TicketStatus } from "@/lib/types/tickets";
import { DEVELOPER_TICKET_STATUSES } from "@/lib/types/tickets";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { KanbanColumn } from "@/components/vsop/tickets/kanban-column";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthUser } from "@/hooks/use-auth-user";

const BOARD_COLUMNS: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "PENDING_REVIEW",
  "RESOLVED",
  "CLOSED",
];

export function KanbanBoardView() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuthUser();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TicketStatus | null>(null);

  const ticketsQuery = useQuery({
    queryKey: queryKeys.tickets.list({}),
    queryFn: () => fetchTickets(),
  });

  const portalsQuery = useQuery({
    queryKey: queryKeys.portals.list(),
    queryFn: fetchPortals,
    retry: false,
  });

  const portalsById = useMemo(() => {
    const map: Record<string, import("@/lib/types/portals").PortalListItem> = {};
    for (const portal of portalsQuery.data ?? []) {
      map[portal.id] = portal;
    }
    return map;
  }, [portalsQuery.data]);

  const ticketsByStatus = useMemo(() => {
    const groups: Record<TicketStatus, typeof ticketsQuery.data> = {
      OPEN: [],
      IN_PROGRESS: [],
      PENDING_REVIEW: [],
      RESOLVED: [],
      CLOSED: [],
    };
    for (const ticket of ticketsQuery.data ?? []) {
      groups[ticket.status]?.push(ticket);
    }
    return groups as Record<
      TicketStatus,
      NonNullable<typeof ticketsQuery.data>
    >;
  }, [ticketsQuery.data]);

  const statusMutation = useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: TicketStatus;
    }) => updateTicketStatus(ticketId, status),
    onSuccess: (_data, variables) => {
      toastSuccess("Ticket moved", {
        description: `Moved to ${variables.status.replaceAll("_", " ").toLowerCase()}.`,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
    onError: (error) => {
      toastError(
        "Could not move ticket",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  function handleDrop(status: TicketStatus) {
    const ticketId = draggingId;
    setDropTarget(null);
    setDraggingId(null);
    if (!ticketId) return;

    const ticket = ticketsQuery.data?.find((item) => item.id === ticketId);
    if (!ticket || ticket.status === status) return;

    if (status === "RESOLVED") {
      toastError("Complete from ticket detail", {
        description:
          "Open the ticket and use Mark resolved / Mark complete so the closing note is recorded.",
      });
      return;
    }

    if (!isAdmin && !DEVELOPER_TICKET_STATUSES.includes(status)) {
      toastError("Admin action required", {
        description: "Only an admin can close tickets after review.",
      });
      return;
    }

    statusMutation.mutate({ ticketId, status });
  }

  const tickets = ticketsQuery.data ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Board"
        description="Drag tickets across New Request → In Progress → Pending Review → Complete. Click a card for full detail."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <LayoutList />
                Inbox
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

      {ticketsQuery.isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[420px] w-[280px] shrink-0 rounded-2xl sm:w-[300px]"
            />
          ))}
        </div>
      ) : null}

      {ticketsQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>Could not load the board. Check your connection and try again.</span>
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
          icon={<Columns3 className="size-5" />}
          title="No tickets on the board"
          description="When clients submit issues, they appear here as New Request cards you can drag into progress."
        />
      ) : null}

      {!ticketsQuery.isLoading &&
      !ticketsQuery.isError &&
      tickets.length > 0 ? (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 sm:-mx-0 sm:px-0">
          {BOARD_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tickets={ticketsByStatus[status]}
              portalsById={portalsById}
              draggingId={draggingId}
              dropTarget={dropTarget}
              onDragStart={setDraggingId}
              onDragEnd={() => {
                setDraggingId(null);
                setDropTarget(null);
              }}
              onDragOverColumn={setDropTarget}
              onDrop={handleDrop}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
