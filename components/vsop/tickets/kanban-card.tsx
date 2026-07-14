"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageIcon, Paperclip } from "lucide-react";
import type { PortalListItem } from "@/lib/types/portals";
import type { TicketListItem } from "@/lib/types/tickets";
import { formatRelativeAge, truncate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SeverityBadge } from "@/components/vsop/tickets/severity-badge";

type KanbanCardProps = {
  ticket: TicketListItem;
  portal?: PortalListItem;
  isDragging?: boolean;
  onDragStart: (ticketId: string) => void;
  onDragEnd: () => void;
};

export function KanbanCard({
  ticket,
  portal,
  isDragging,
  onDragStart,
  onDragEnd,
}: KanbanCardProps) {
  const router = useRouter();
  const thumb = ticket.screenshotUrls[0];

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/ticket-id", ticket.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart(ticket.id);
      }}
      onDragEnd={onDragEnd}
      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
      className={cn(
        "group cursor-grab rounded-xl border border-border/50 bg-card/90 p-3 shadow-sm shadow-black/10 transition-all active:cursor-grabbing",
        "hover:border-border hover:bg-card hover:shadow-md hover:shadow-black/15",
        isDragging && "opacity-40 ring-2 ring-primary/40",
      )}
    >
      {thumb ? (
        <div className="mb-3 overflow-hidden rounded-lg border border-border/40 bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt=""
            className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="mb-2 flex items-start justify-between gap-2">
        <Link
          href={`/dashboard/tickets/${ticket.id}`}
          onClick={(event) => event.stopPropagation()}
          className="font-mono text-[11px] font-medium text-primary hover:underline"
        >
          {ticket.referenceId}
        </Link>
        <SeverityBadge severity={ticket.severity} />
      </div>

      <p className="text-sm leading-snug text-foreground">
        {truncate(ticket.description, 96)}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-muted-foreground">
            {ticket.source === "INTERNAL"
              ? portal?.companyName
                ? `Internal · ${portal.companyName}`
                : "Internal"
              : (portal?.companyName ?? "Portal")}
          </p>
          <p className="text-[10px] text-muted-foreground/80">
            {formatRelativeAge(ticket.createdAt)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
          {ticket.screenshotUrls.length > 0 ? (
            <span className="inline-flex items-center gap-0.5 text-[10px]">
              <ImageIcon className="size-3" />
              {ticket.screenshotUrls.length}
            </span>
          ) : (
            <Paperclip className="size-3 opacity-30" />
          )}
        </div>
      </div>
    </article>
  );
}
