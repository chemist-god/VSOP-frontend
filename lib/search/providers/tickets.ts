import type { SearchProvider } from "@/lib/search/types";
import { scoreField } from "@/lib/search/rank";

export const ticketsProvider: SearchProvider = {
  id: "tickets",
  groupLabel: "Tickets",
  enabled: () => true,
  async findCandidates(ctx) {
    if (!ctx.query) return [];

    const tickets = await ctx.data.getTickets();
    return tickets
      .filter((ticket) => {
        const fields = [
          ticket.referenceId,
          ticket.description,
          ticket.status,
          ticket.severity,
          ticket.id,
        ];
        return fields.some((field) => scoreField(ctx.query, field) > 0);
      })
      .map((ticket) => ({
        id: `ticket-${ticket.id}`,
        type: "ticket" as const,
        title: ticket.referenceId,
        subtitle:
          ticket.description.length > 80
            ? `${ticket.description.slice(0, 80)}…`
            : ticket.description,
        keywords: [ticket.status, ticket.severity, ticket.source],
        badge: ticket.status,
        entityType: "ticket" as const,
        entityId: ticket.id,
      }));
  },
};
