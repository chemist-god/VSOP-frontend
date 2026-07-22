"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  History,
  RefreshCw,
} from "lucide-react";
import { fetchAuditLogs, fetchInsights, type InsightsTrendDays } from "@/lib/api/audit";
import { queryKeys } from "@/lib/query-keys";
import { formatDateTime } from "@/lib/format";
import { InsightsPanel } from "@/components/vsop/audit/insights-panel";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PAGE_SIZE = 20;

function actionLabel(action: string) {
  return action.replaceAll(".", " · ").replaceAll("_", " ");
}

export function AuditView() {
  const [page, setPage] = useState(1);
  const [trendDays, setTrendDays] = useState<InsightsTrendDays>(14);

  const auditQuery = useQuery({
    queryKey: queryKeys.audit.list(page, PAGE_SIZE),
    queryFn: () => fetchAuditLogs(page, PAGE_SIZE),
  });

  const insightsQuery = useQuery({
    queryKey: queryKeys.audit.insights(trendDays),
    queryFn: () => fetchInsights(trendDays),
  });

  const audit = auditQuery.data;
  const items = audit?.items ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Audit"
        description="Activity timeline, portal operations, and team performance insights."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
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

      <Tabs defaultValue="activity" className="space-y-5">
        <TabsList className="h-9 rounded-xl bg-muted/70 p-1">
          <TabsTrigger value="activity" className="rounded-lg px-3">
            Activity
          </TabsTrigger>
          <TabsTrigger value="insights" className="rounded-lg px-3">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4 outline-none">
          <InsightsPanel
            data={insightsQuery.data}
            isLoading={insightsQuery.isLoading}
            isError={insightsQuery.isError}
            trendDays={trendDays}
            onTrendDaysChange={setTrendDays}
            onRetry={() => insightsQuery.refetch()}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 outline-none">
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
      </Tabs>
    </div>
  );
}
