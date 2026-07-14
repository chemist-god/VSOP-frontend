"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Bell,
  CheckCheck,
  Inbox,
  RefreshCw,
  UserPlus,
  CircleCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  fetchInbox,
  markAllInboxRead,
  markInboxItemRead,
} from "@/lib/api/inbox";
import { queryKeys } from "@/lib/query-keys";
import type { InboxNotification } from "@/lib/types/inbox";
import { formatCompactAge, formatRelativeAge } from "@/lib/format";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { TablePagination } from "@/components/vsop/shared/table-pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "unread";

const PAGE_SIZE = 12;

export function ActivityInboxView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<FilterTab>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const inboxQuery = useQuery({
    queryKey: queryKeys.inbox.list(),
    queryFn: fetchInbox,
  });

  const markReadMutation = useMutation({
    mutationFn: markInboxItemRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox.all });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllInboxRead,
    onSuccess: () => {
      toastSuccess("Inbox cleared");
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox.all });
    },
    onError: (error) => {
      toastError(
        "Could not mark all as read",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  const items = inboxQuery.data?.items ?? [];
  const unreadCount = inboxQuery.data?.unreadCount ?? 0;

  const filtered = useMemo(() => {
    if (tab === "unread") return items.filter((item) => !item.readAt);
    return items;
  }, [items, tab]);

  useEffect(() => {
    setPage(1);
  }, [tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const selected =
    filtered.find((item) => item.id === selectedId) ?? paged[0] ?? null;

  function markReadIfNeeded(item: InboxNotification) {
    if (!item.readAt) markReadMutation.mutate(item.id);
  }

  /** Desktop: select + preview. Mobile: open ticket immediately. */
  function handleRowActivate(item: InboxNotification, isMobile: boolean) {
    setSelectedId(item.id);
    markReadIfNeeded(item);
    if (isMobile && item.ticketId) {
      router.push(`/dashboard/tickets/${item.ticketId}`);
    }
  }

  function openTicket(item: InboxNotification) {
    if (!item.ticketId) return;
    markReadIfNeeded(item);
    router.push(`/dashboard/tickets/${item.ticketId}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-6">
      {/* Compact Linear-style header */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium tracking-tight sm:text-xl">
              Inbox
            </h1>
            {unreadCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary/15 px-1.5 text-[11px] font-medium tabular-nums text-sidebar-primary">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Assignments, portal tickets, and updates that need you.
          </p>
          <p className="text-xs text-muted-foreground sm:hidden">
            What needs your attention
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {unreadCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-xs sm:px-2.5"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
            >
              <CheckCheck className="size-3.5" />
              <span className="hidden sm:inline">Mark all read</span>
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2 sm:px-2.5"
            onClick={() => inboxQuery.refetch()}
            disabled={inboxQuery.isFetching}
            aria-label="Refresh inbox"
          >
            <RefreshCw
              className={cn(
                "size-3.5",
                inboxQuery.isFetching && "animate-spin",
              )}
            />
            <span className="hidden sm:inline text-xs">Refresh</span>
          </Button>
        </div>
      </header>

      {/* Segmented filter — compact pills */}
      <div className="inline-flex w-fit items-center rounded-lg border border-border/50 bg-muted/30 p-0.5">
        {(["all", "unread"] as const).map((key) => {
          const active = tab === key;
          const count = key === "all" ? items.length : unreadCount;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {key === "all" ? "All" : "Unread"}
              <span
                className={cn(
                  "tabular-nums text-[10px]",
                  active ? "text-muted-foreground" : "text-muted-foreground/70",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {inboxQuery.isLoading ? (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="space-y-1 rounded-xl border border-border/40 p-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="hidden h-64 rounded-xl lg:block" />
        </div>
      ) : null}

      {inboxQuery.isError ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>Could not load inbox.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => inboxQuery.refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!inboxQuery.isLoading &&
      !inboxQuery.isError &&
      filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title={tab === "unread" ? "You're all caught up" : "Inbox is empty"}
          description={
            tab === "unread"
              ? "No unread notifications right now."
              : "When tickets are assigned to you or new portal issues arrive, they show up here."
          }
        />
      ) : null}

      {!inboxQuery.isLoading &&
      !inboxQuery.isError &&
      filtered.length > 0 ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            {/* List — native smooth scroll, no clipped timestamps */}
            <div
              className={cn(
                "scroll-smooth overscroll-contain",
                "max-h-[min(62vh,560px)] overflow-y-auto",
                "border-border/40 lg:border-r",
                "[-webkit-overflow-scrolling:touch]",
              )}
            >
              <ul className="divide-y divide-border/30">
                <AnimatePresence initial={false} mode="popLayout">
                  {paged.map((item, index) => {
                    const isActive = selected?.id === item.id;
                    const unread = !item.readAt;
                    return (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.18,
                          delay: Math.min(index * 0.02, 0.16),
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const mobile =
                              typeof window !== "undefined" &&
                              window.matchMedia("(max-width: 1023px)").matches;
                            handleRowActivate(item, mobile);
                          }}
                          className={cn(
                            "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2.5 gap-y-0.5 px-3 py-2.5 text-left transition-colors sm:gap-x-3 sm:px-3.5 sm:py-3",
                            "active:bg-muted/50",
                            isActive
                              ? "bg-muted/55 lg:bg-muted/50"
                              : "hover:bg-muted/30",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-[7px] size-1.5 shrink-0 rounded-full",
                              unread
                                ? "bg-sidebar-primary"
                                : "bg-transparent",
                            )}
                            aria-hidden
                          />

                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5">
                              <TypeIcon
                                type={item.type}
                                className="size-3 shrink-0 text-muted-foreground/80"
                              />
                              <span
                                className={cn(
                                  "truncate text-[13px] leading-snug tracking-tight",
                                  unread
                                    ? "font-medium text-foreground"
                                    : "font-normal text-foreground/85",
                                )}
                              >
                                {item.title}
                              </span>
                            </span>
                            <span className="mt-0.5 line-clamp-1 pl-[18px] text-[11px] leading-snug text-muted-foreground sm:text-xs">
                              {item.body}
                            </span>
                          </span>

                          <time
                            dateTime={item.createdAt}
                            title={formatRelativeAge(item.createdAt)}
                            className="shrink-0 pt-0.5 text-right text-[10px] tabular-nums leading-none text-muted-foreground/80 sm:text-[11px]"
                          >
                            {formatCompactAge(item.createdAt)}
                          </time>
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>

            {/* Desktop reading pane */}
            <div className="hidden min-h-[280px] flex-col p-5 lg:flex xl:p-6">
              {selected ? (
                <>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-lg border border-border/50 bg-background/70 p-2 text-muted-foreground">
                      <TypeIcon type={selected.type} className="size-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h2 className="text-sm font-medium tracking-tight sm:text-base">
                        {selected.title}
                      </h2>
                      <p className="text-[11px] text-muted-foreground">
                        {formatRelativeAge(selected.createdAt)}
                        {selected.readAt ? " · Read" : " · Unread"}
                      </p>
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-foreground/90">
                    {selected.body}
                  </p>
                  {selected.ticketId ? (
                    <div className="mt-5 border-t border-border/40 pt-4">
                      <Button size="sm" onClick={() => openTicket(selected)}>
                        Open ticket
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                  Select a notification to preview
                </div>
              )}
            </div>
          </div>

          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            className="px-0.5"
          />
        </div>
      ) : null}
    </div>
  );
}

function TypeIcon({
  type,
  className,
}: {
  type: InboxNotification["type"];
  className?: string;
}) {
  const cls = cn("size-3.5", className);
  if (type === "TICKET_ASSIGNED") return <UserPlus className={cls} />;
  if (type === "TICKET_RESOLVED") return <CircleCheck className={cls} />;
  return <Bell className={cls} />;
}
