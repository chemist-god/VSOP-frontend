import type { SearchProvider } from "@/lib/search/types";
import { scoreField } from "@/lib/search/rank";

export const portalsProvider: SearchProvider = {
  id: "portals",
  groupLabel: "Portals",
  enabled: (ctx) => ctx.viewer.permissions.canViewPortals,
  async findCandidates(ctx) {
    if (!ctx.query) return [];

    const portals = await ctx.data.getPortals();
    return portals
      .filter((portal) => {
        const fields = [
          portal.companyName,
          portal.slug,
          portal.clientAdminEmail,
          portal.status,
          portal.id,
        ];
        return fields.some((field) => scoreField(ctx.query, field) > 0);
      })
      .map((portal) => ({
        id: `portal-${portal.id}`,
        type: "portal" as const,
        title: portal.companyName,
        subtitle: portal.slug,
        keywords: [portal.clientAdminEmail, portal.status],
        badge: portal.status,
        entityType: "portal" as const,
        entityId: portal.id,
      }));
  },
};
