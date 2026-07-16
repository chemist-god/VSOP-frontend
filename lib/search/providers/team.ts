import type { SearchProvider } from "@/lib/search/types";
import { scoreField } from "@/lib/search/rank";

export const teamProvider: SearchProvider = {
  id: "team",
  groupLabel: "Team",
  enabled: (ctx) => ctx.viewer.permissions.canViewTeam,
  async findCandidates(ctx) {
    if (!ctx.query) return [];

    const members = await ctx.data.getTeamMembers();
    return members
      .filter((member) => {
        const fields = [member.name, member.email, member.role, member.id];
        return fields.some((field) => scoreField(ctx.query, field) > 0);
      })
      .map((member) => ({
        id: `team-${member.id}`,
        type: "team" as const,
        title: member.name,
        subtitle: member.email,
        keywords: [member.role, member.isActive ? "active" : "inactive"],
        badge: member.role,
        entityType: "team" as const,
        entityId: member.id,
      }));
  },
};
