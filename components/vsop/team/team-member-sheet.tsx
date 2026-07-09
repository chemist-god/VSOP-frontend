"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ExternalLink } from "lucide-react";
import { fetchTeamMemberDetail } from "@/lib/api/team";
import { queryKeys } from "@/lib/query-keys";
import { formatDateTime, formatRelativeAge, truncate } from "@/lib/format";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { DueCountdown } from "@/components/vsop/tickets/due-countdown";
import { SeverityBadge } from "@/components/vsop/tickets/severity-badge";
import { TicketStatusBadge } from "@/components/vsop/tickets/ticket-status-badge";
import type { TicketSeverity, TicketStatus } from "@/lib/types/tickets";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function actionLabel(action: string) {
  return action.replaceAll(".", " · ").replaceAll("_", " ");
}

export function TeamMemberSheet({
  memberId,
  open,
  onOpenChange,
}: {
  memberId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const detailQuery = useQuery({
    queryKey: queryKeys.team.detail(memberId ?? ""),
    queryFn: () => fetchTeamMemberDetail(memberId!),
    enabled: open && Boolean(memberId),
  });

  const data = detailQuery.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border/50 px-5 py-4 text-left">
          <SheetTitle>Team member</SheetTitle>
          <SheetDescription>
            Assignments and activity history for this developer.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5.5rem)]">
          <div className="space-y-5 px-5 py-5">
            {detailQuery.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            ) : null}

            {detailQuery.isError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription className="flex flex-col gap-2">
                  <span>Could not load this team member.</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() => detailQuery.refetch()}
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            {data ? (
              <>
                <div className="flex items-start gap-3">
                  <UserAvatar
                    name={data.member.name}
                    email={data.member.email}
                    role={data.member.role}
                    size={56}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold">
                      {data.member.name}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {data.member.email}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{data.member.role}</Badge>
                      <Badge
                        variant="outline"
                        className={
                          data.member.isActive
                            ? "border-emerald-500/30 text-emerald-300"
                            : ""
                        }
                      >
                        {data.member.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    {
                      label: "Open",
                      value: data.stats.openAssignments,
                    },
                    {
                      label: "Resolved",
                      value: data.stats.resolvedCount,
                    },
                    {
                      label: "Overdue",
                      value: data.stats.overdueCount,
                    },
                    {
                      label: "MTTR",
                      value:
                        data.stats.mttrHours == null
                          ? "—"
                          : `${data.stats.mttrHours}h`,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-border/50 bg-card/50 px-3 py-2.5"
                    >
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <Tabs defaultValue="assignments" className="space-y-3">
                  <TabsList className="w-full">
                    <TabsTrigger value="assignments" className="flex-1">
                      Assignments
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex-1">
                      Activity
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="assignments" className="space-y-2">
                    {data.assignments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No assignments yet.
                      </p>
                    ) : null}
                    {data.assignments.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-border/50 bg-card/40 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`/dashboard/tickets/${item.ticket.id}`}
                              className="font-mono text-xs font-medium text-primary hover:underline"
                            >
                              {item.ticket.referenceId}
                            </Link>
                            <p className="mt-1 text-sm leading-snug">
                              {truncate(item.ticket.description, 90)}
                            </p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {item.ticket.portalName}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link href={`/dashboard/tickets/${item.ticket.id}`}>
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </Button>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <TicketStatusBadge
                            status={item.ticket.status as TicketStatus}
                          />
                          <SeverityBadge
                            severity={item.ticket.severity as TicketSeverity}
                          />
                        </div>
                        {item.isActive ? (
                          <DueCountdown
                            dueDateIso={item.dueDate}
                            className="mt-3"
                          />
                        ) : item.ticket.resolutionNote ? (
                          <p className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-2 text-xs text-emerald-100/90">
                            {truncate(item.ticket.resolutionNote, 120)}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-0">
                    <div className="relative space-y-0 border-l border-border/50 ml-2 pl-4">
                      {data.activity.length === 0 && data.notes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No activity recorded yet.
                        </p>
                      ) : null}

                      {[
                        ...data.activity.map((item) => ({
                          id: item.id,
                          kind: "audit" as const,
                          createdAt: item.createdAt,
                          title: actionLabel(item.action),
                          subtitle: item.ticketReferenceId,
                          body: null as string | null,
                          ticketId: item.ticketId,
                        })),
                        ...data.notes.map((note) => ({
                          id: note.id,
                          kind: "note" as const,
                          createdAt: note.createdAt,
                          title: "Internal note",
                          subtitle: note.ticketReferenceId,
                          body: note.content,
                          ticketId: note.ticketId,
                        })),
                      ]
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .slice(0, 30)
                        .map((event) => (
                          <div key={`${event.kind}-${event.id}`} className="relative pb-5">
                            <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full border border-background bg-indigo-400" />
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-[10px]">
                                {event.title}
                              </Badge>
                              {event.subtitle ? (
                                <Link
                                  href={`/dashboard/tickets/${event.ticketId}`}
                                  className="font-mono text-[11px] text-primary hover:underline"
                                >
                                  {event.subtitle}
                                </Link>
                              ) : null}
                            </div>
                            {event.body ? (
                              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                {truncate(event.body, 140)}
                              </p>
                            ) : null}
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {formatRelativeAge(event.createdAt)} ·{" "}
                              {formatDateTime(event.createdAt)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : null}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
