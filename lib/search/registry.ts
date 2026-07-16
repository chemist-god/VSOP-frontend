import { actionsProvider } from "@/lib/search/providers/actions";
import { pagesProvider } from "@/lib/search/providers/pages";
import { portalsProvider } from "@/lib/search/providers/portals";
import { teamProvider } from "@/lib/search/providers/team";
import { ticketsProvider } from "@/lib/search/providers/tickets";
import type {
  SearchCandidate,
  SearchProvider,
  SearchProviderContext,
} from "@/lib/search/types";

const providers: SearchProvider[] = [
  pagesProvider,
  ticketsProvider,
  portalsProvider,
  teamProvider,
  actionsProvider,
];

export function collectProviders(
  ctx: SearchProviderContext,
): SearchProvider[] {
  return providers.filter((provider) => provider.enabled(ctx));
}

export type ProviderCandidates = {
  providerId: string;
  groupLabel: string;
  candidates: SearchCandidate[];
};

/**
 * Run all enabled providers with Promise.allSettled so one failure
 * cannot blank the palette.
 */
export async function gatherCandidates(
  ctx: SearchProviderContext,
): Promise<ProviderCandidates[]> {
  const enabled = collectProviders(ctx);

  const settled = await Promise.allSettled(
    enabled.map(async (provider) => {
      const candidates = await provider.findCandidates(ctx);
      return {
        providerId: provider.id,
        groupLabel: provider.groupLabel,
        candidates,
      } satisfies ProviderCandidates;
    }),
  );

  const results: ProviderCandidates[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.push(result.value);
    }
  }
  return results;
}

export function getSearchProviders(): SearchProvider[] {
  return providers;
}
