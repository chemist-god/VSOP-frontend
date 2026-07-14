"use client";

import { useRouter } from "next/navigation";
import type { PortalListItem } from "@/lib/types/portals";
import type { TicketListItem } from "@/lib/types/tickets";
import { formatRelativeAge } from "@/lib/format";
import { SeverityBadge } from "@/components/vsop/tickets/severity-badge";
import { TicketStatusBadge } from "@/components/vsop/tickets/ticket-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TicketTableProps = {
  tickets: TicketListItem[];
  portalsById: Record<string, PortalListItem>;
};

export function TicketTable({ tickets, portalsById }: TicketTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50 shadow-sm shadow-black/5">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[120px]">Reference</TableHead>
              <TableHead className="min-w-[140px]">Source</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Age</TableHead>
              <TableHead className="hidden lg:table-cell max-w-[280px]">
                Summary
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => {
              const portal = ticket.portalId
                ? portalsById[ticket.portalId]
                : undefined;
              const sourceLabel =
                ticket.source === "INTERNAL"
                  ? "Internal"
                  : (portal?.companyName ?? "Portal");

              return (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                  onClick={() =>
                    router.push(`/dashboard/tickets/${ticket.id}`)
                  }
                >
                  <TableCell className="font-mono text-xs font-medium text-foreground">
                    {ticket.referenceId}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{sourceLabel}</span>
                      {ticket.source === "INTERNAL" ? (
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-[10px] font-normal"
                        >
                          Task
                        </Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={ticket.severity} />
                  </TableCell>
                  <TableCell>
                    <TicketStatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatRelativeAge(ticket.createdAt)}
                  </TableCell>
                  <TableCell className="hidden max-w-[280px] truncate text-xs text-muted-foreground lg:table-cell">
                    {ticket.description}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
