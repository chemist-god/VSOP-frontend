import type { TicketDetail } from "@/lib/types/tickets";
import type { PortalListItem } from "@/lib/types/portals";
import { formatDateTime } from "@/lib/format";
import { SeverityBadge } from "@/components/vsop/tickets/severity-badge";
import { TicketStatusBadge } from "@/components/vsop/tickets/ticket-status-badge";

export function TicketDetailHeader({
  ticket,
  portal,
}: {
  ticket: TicketDetail;
  portal?: PortalListItem;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-mono text-xl font-medium tracking-tight sm:text-2xl">
          {ticket.referenceId}
        </h1>
        <TicketStatusBadge status={ticket.status} />
        <SeverityBadge severity={ticket.severity} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>{portal?.companyName ?? "Unknown portal"}</span>
        {portal?.slug ? <span>/{portal.slug}</span> : null}
        <span>Opened {formatDateTime(ticket.createdAt)}</span>
      </div>
    </div>
  );
}
