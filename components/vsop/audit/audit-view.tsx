"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle, ChevronLeft, ChevronRight, History, RefreshCw } from "lucide-react";
import { fetchAuditLogs, fetchInsights } from "@/lib/api/audit";
import { queryKeys } from "@/lib/query-keys";
import { formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAGE_SIZE = 20;

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#f87171",
  HIGH: "#fb923c",
  MEDIUM: "#fbbf24",
  LOW: "#34d399",
  UNSET: "#71717a",
};

function actionLabel(action: string) {
  return action.replaceAll(".", " · ").replaceAll("_", " ");
}

export function AuditView() {
  const [page, setPage] = useState(1);

  const auditQuery = useQuery({
    queryKey: queryKeys.audit.list(page, PAGE_SIZE),
    queryFn: () => fetchAuditLogs(page, PAGE_SIZE),
  });

  const insightsQuery = useQuery({
    queryKey: queryKeys.audit.insights(),
    queryFn: fetchInsights,
  });

  const insights = insightsQuery.data;
  const audit = auditQuery.data;
  const items = audit?.items ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Audit"
        description="Activity timeline and operational insights across portals."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              auditQuery.refetch();
              insightsQuery.refetch();
            }}
          >
            <RefreshCw
              className={
                auditQuery.isFetching || insightsQuery.isFetching
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </Button>
        }
      />

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          {auditQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : null}

          {auditQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>
                Could not load audit activity.
              </AlertDescription>
            </Alert>
          ) : null}

          {!auditQuery.isLoading &&
          !auditQuery.isError &&
          items.length === 0 ? (
            <EmptyState
              icon={<History className="size-5" />}
              title="No activity yet"
              description="Ticket creates, status changes, resolutions, and invites will appear here."
            />
          ) : null}

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-xl border border-border/50 bg-card/40 p-3 sm:p-4"
              >
                <UserAvatar
                  name={item.actor?.name ?? item.actorType}
                  email={item.actor?.email}
                  role={item.actor?.role}
                  size={36}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {actionLabel(item.action)}
                    </Badge>
                    {item.ticketReferenceId ? (
                      <span className="font-mono text-xs text-primary">
                        {item.ticketReferenceId}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-foreground">
                    <span className="font-medium">
                      {item.actor?.name ?? item.actorType}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      on {item.entityType}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {audit && audit.total > 0 ? (
            <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card/30 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {(audit.page - 1) * audit.pageSize + 1}–
                {Math.min(audit.page * audit.pageSize, audit.total)} of{" "}
                {audit.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || auditQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft />
                  Prev
                </Button>
                <span className="text-xs tabular-nums text-muted-foreground">
                  Page {audit.page} / {audit.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    page >= audit.totalPages || auditQuery.isFetching
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(audit.totalPages, current + 1),
                    )
                  }
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insightsQuery.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : null}

          {insights ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Total tickets", value: insights.totals.tickets },
                  { label: "Open", value: insights.totals.open },
                  { label: "In progress", value: insights.totals.inProgress },
                  {
                    label: "Resolved (7d)",
                    value: insights.totals.resolvedLast7Days,
                  },
                ].map((stat) => (
                  <Card
                    key={stat.label}
                    className="border-border/50 bg-card/50"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-normal text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-medium tracking-tight">
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <Card className="border-border/50 bg-card/40">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Tickets by portal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={insights.byPortal}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="slug" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="oklch(0.65 0.18 275)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40">
                  <CardHeader>
                    <CardTitle className="text-base">By severity</CardTitle>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={insights.bySeverity}
                          dataKey="count"
                          nameKey="severity"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                        >
                          {insights.bySeverity.map((entry) => (
                            <Cell
                              key={entry.severity}
                              fill={
                                SEVERITY_COLORS[entry.severity] ?? "#71717a"
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/40 xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">
                      14-day volume trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={insights.trend}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="created"
                          stroke="#818cf8"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="resolved"
                          stroke="#34d399"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
