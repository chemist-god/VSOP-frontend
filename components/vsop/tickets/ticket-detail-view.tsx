"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchTicket, updateTicketSeverity, updateTicketStatus } from "@/lib/api/tickets";
import { fetchPortals } from "@/lib/api/portals";
import { fetchTeamMembers } from "@/lib/api/team";
import { queryKeys } from "@/lib/query-keys";
import {
  TICKET_SEVERITIES,
  TICKET_STATUSES,
  type TicketSeverity,
  type TicketStatus,
} from "@/lib/types/tickets";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { AssignTicketPanel } from "@/components/vsop/tickets/assign-ticket-panel";
import { ContextMetadata } from "@/components/vsop/tickets/context-metadata";
import { DueCountdown } from "@/components/vsop/tickets/due-countdown";
import { ResolveTicketDialog } from "@/components/vsop/tickets/resolve-ticket-dialog";
import { ScreenshotGallery } from "@/components/vsop/tickets/screenshot-gallery";
import { TicketDetailHeader } from "@/components/vsop/tickets/ticket-detail-header";
import { TicketNotesThread } from "@/components/vsop/tickets/ticket-notes-thread";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthUser } from "@/hooks/use-auth-user";

export function TicketDetailView({ ticketId }: { ticketId: string }) {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuthUser();

  const ticketQuery = useQuery({
    queryKey: queryKeys.tickets.detail(ticketId),
    queryFn: () => fetchTicket(ticketId),
  });

  const portalsQuery = useQuery({
    queryKey: queryKeys.portals.list(),
    queryFn: fetchPortals,
  });

  const teamQuery = useQuery({
    queryKey: queryKeys.team.list(),
    queryFn: fetchTeamMembers,
  });

  const portal = useMemo(
    () =>
      portalsQuery.data?.find(
        (item) => item.id === ticketQuery.data?.portalId,
      ),
    [portalsQuery.data, ticketQuery.data?.portalId],
  );

  const teamById = useMemo(() => {
    const map: Record<string, NonNullable<typeof teamQuery.data>[number]> = {};
    for (const member of teamQuery.data ?? []) {
      map[member.id] = member;
    }
    return map;
  }, [teamQuery.data]);

  const activeAssignment = ticketQuery.data?.assignments.find(
    (assignment) => assignment.isActive,
  );

  const statusMutation = useMutation({
    mutationFn: (status: TicketStatus) => updateTicketStatus(ticketId, status),
    onSuccess: () => {
      toastSuccess("Status updated");
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
    onError: (error) => {
      toastError(
        "Could not update status",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  const severityMutation = useMutation({
    mutationFn: (severity: TicketSeverity) =>
      updateTicketSeverity(ticketId, severity),
    onSuccess: () => {
      toastSuccess("Severity updated");
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
    },
    onError: (error) => {
      toastError(
        "Could not update severity",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  if (ticketQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (ticketQuery.isError || !ticketQuery.data) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Could not load this ticket.</span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/tickets">Back to tickets</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const ticket = ticketQuery.data;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="px-0" asChild>
        <Link href="/dashboard/tickets">
          <ArrowLeft />
          Back to tickets
        </Link>
      </Button>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <TicketDetailHeader ticket={ticket} portal={portal} />

          <Card className="border-border/50 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">
                {ticket.source === "INTERNAL" ? "Task details" : "Client message"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.contactName ? (
                <p className="text-sm text-muted-foreground">
                  From {ticket.contactName}
                </p>
              ) : null}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {ticket.screenshotUrls.length > 0 ? (
          <Card className="border-border/50 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Screenshots</CardTitle>
            </CardHeader>
            <CardContent>
              <ScreenshotGallery urls={ticket.screenshotUrls} />
            </CardContent>
          </Card>
          ) : null}

          {ticket.browserInfo ? (
            <Card className="border-border/50 bg-card/40">
              <CardHeader>
                <CardTitle className="text-base">Context metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <ContextMetadata browserInfo={ticket.browserInfo} />
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-border/50 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Internal notes</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketNotesThread
                ticketId={ticketId}
                notes={ticket.notes}
                teamById={teamById}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="border-border/50 bg-card/40">
            <CardHeader>
              <CardTitle className="text-base">Ticket controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={ticket.status}
                  onValueChange={(value) =>
                    statusMutation.mutate(value as TicketStatus)
                  }
                  disabled={statusMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isAdmin ? (
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={ticket.severity}
                    onValueChange={(value) =>
                      severityMutation.mutate(value as TicketSeverity)
                    }
                    disabled={severityMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_SEVERITIES.map((severity) => (
                        <SelectItem key={severity} value={severity}>
                          {severity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              {activeAssignment ? (
                <div className="space-y-3 rounded-xl border border-border/50 bg-card/30 p-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={teamById[activeAssignment.assigneeId]?.name}
                      email={teamById[activeAssignment.assigneeId]?.email}
                      role={teamById[activeAssignment.assigneeId]?.role}
                      size={40}
                    />
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Assigned to
                      </p>
                      <p className="truncate text-sm font-medium">
                        {teamById[activeAssignment.assigneeId]?.name ??
                          "Assigned developer"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {teamById[activeAssignment.assigneeId]?.role ?? "DEVELOPER"}
                      </p>
                    </div>
                  </div>
                  <DueCountdown dueDateIso={activeAssignment.dueDate} />
                </div>
              ) : null}

              {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" ? (
                <ResolveTicketDialog ticketId={ticketId} />
              ) : null}

              {ticket.resolutionNote ? (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-3">
                  <p className="text-xs uppercase tracking-wide text-emerald-300">
                    Resolution
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">
                    {ticket.resolutionNote}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {isAdmin ? (
            <AssignTicketPanel
              ticketId={ticketId}
              teamMembers={teamQuery.data ?? []}
              currentAssigneeId={activeAssignment?.assigneeId}
              currentDueDate={activeAssignment?.dueDate}
            />
          ) : null}
        </aside>
      </div>

      {(statusMutation.isPending || severityMutation.isPending) && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm shadow-lg">
          <Loader2 className="size-4 animate-spin" />
          Saving changes…
        </div>
      )}
    </div>
  );
}
