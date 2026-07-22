"use client";

import { Plus } from "lucide-react";
import type { PortalListItem } from "@/lib/types/portals";
import type { TicketListItem, TicketStatus } from "@/lib/types/tickets";
import { cn } from "@/lib/utils";
import { KanbanCard } from "@/components/vsop/tickets/kanban-card";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLUMN_META: Record<
  TicketStatus,
  { title: string; dot: string; ring: string }
> = {
  OPEN: {
    title: "New Request",
    dot: "bg-red-500",
    ring: "ring-red-500/30",
  },
  IN_PROGRESS: {
    title: "In Progress",
    dot: "bg-orange-500",
    ring: "ring-orange-500/30",
  },
  PENDING_REVIEW: {
    title: "Pending Review",
    dot: "bg-violet-500",
    ring: "ring-violet-500/30",
  },
  RESOLVED: {
    title: "Complete",
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/30",
  },
  CLOSED: {
    title: "Closed",
    dot: "bg-zinc-500",
    ring: "ring-zinc-500/30",
  },
};

type KanbanColumnProps = {
  status: TicketStatus;
  tickets: TicketListItem[];
  portalsById: Record<string, PortalListItem>;
  draggingId: string | null;
  dropTarget: TicketStatus | null;
  onDragStart: (ticketId: string) => void;
  onDragEnd: () => void;
  onDragOverColumn: (status: TicketStatus) => void;
  onDrop: (status: TicketStatus) => void;
};

export function KanbanColumn({
  status,
  tickets,
  portalsById,
  draggingId,
  dropTarget,
  onDragStart,
  onDragEnd,
  onDragOverColumn,
  onDrop,
}: KanbanColumnProps) {
  const meta = COLUMN_META[status];
  const isActiveDrop = dropTarget === status && draggingId !== null;

  return (
    <section
      className={cn(
        "flex h-full min-h-[420px] w-[280px] shrink-0 flex-col rounded-2xl border border-border/40 bg-muted/15 sm:w-[300px]",
        isActiveDrop && `ring-2 ${meta.ring} bg-muted/25`,
      )}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOverColumn(status);
      }}
      onDragLeave={() => {
        /* parent clears on drag end */
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(status);
      }}
    >
      <header className="flex items-center gap-2 px-3 py-3">
        <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />
        <h3 className="text-sm font-semibold text-foreground">{meta.title}</h3>
        <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {tickets.length}
        </span>
        <span className="ml-auto text-muted-foreground/50">
          <Plus className="size-3.5" />
        </span>
      </header>

      <ScrollArea className="flex-1 px-2.5 pb-3">
        <div className="flex flex-col gap-2.5 pr-1">
          {tickets.map((ticket) => (
            <KanbanCard
              key={ticket.id}
              ticket={ticket}
              portal={
                ticket.portalId ? portalsById[ticket.portalId] : undefined
              }
              isDragging={draggingId === ticket.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}

          {tickets.length === 0 ? (
            <div
              className={cn(
                "flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border/50 px-3 py-6 text-center text-xs text-muted-foreground",
                isActiveDrop && "border-solid bg-background/40",
              )}
            >
              {isActiveDrop ? "Drop here" : "No tickets"}
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </section>
  );
}
