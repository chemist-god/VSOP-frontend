import type { QueryClient } from "@tanstack/react-query";
import { fetchPortals } from "@/lib/api/portals";
import { fetchTeamMembers } from "@/lib/api/team";
import { fetchTickets } from "@/lib/api/tickets";
import { queryKeys } from "@/lib/query-keys";
import type { SearchDataSource } from "@/lib/search/types";

/**
 * Thin facade over React Query caches.
 * Providers call this — never useQuery / apiFetch for list data.
 */
export function createSearchDataSource(
  queryClient: QueryClient,
): SearchDataSource {
  return {
    getTickets() {
      return queryClient.ensureQueryData({
        queryKey: queryKeys.tickets.list({}),
        queryFn: () => fetchTickets(),
      });
    },
    getPortals() {
      return queryClient.ensureQueryData({
        queryKey: queryKeys.portals.list(),
        queryFn: fetchPortals,
      });
    },
    getTeamMembers() {
      return queryClient.ensureQueryData({
        queryKey: queryKeys.team.list(),
        queryFn: fetchTeamMembers,
      });
    },
  };
}

/** Prefetch list caches so the first keystroke is instant. */
export async function warmSearchDataSource(
  data: SearchDataSource,
  permissions: {
    canViewPortals: boolean;
    canViewTeam: boolean;
  },
): Promise<void> {
  const tasks: Promise<unknown>[] = [data.getTickets()];
  if (permissions.canViewPortals) tasks.push(data.getPortals());
  if (permissions.canViewTeam) tasks.push(data.getTeamMembers());
  await Promise.allSettled(tasks);
}
