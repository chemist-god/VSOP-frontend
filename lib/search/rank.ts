import type { SearchCandidate, SearchEntityType } from "@/lib/search/types";

export type RankBoosts = {
  /** Candidate ids opened recently (most recent first). */
  recentIds: string[];
  /** Candidate id → open count for frequency boost. */
  frequency: Record<string, number>;
};

export type RankedCandidate = SearchCandidate & { score: number };

const GROUP_CAPS: Record<string, number> = {
  Pages: 8,
  Tickets: 6,
  Portals: 6,
  Team: 6,
  Actions: 4,
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Match quality for a single field against normalized query. */
export function scoreField(query: string, text: string | undefined): number {
  if (!query || !text) return 0;
  const t = text.toLowerCase();
  if (t === query) return 1000;
  if (t.startsWith(query)) return 900;
  const boundary = new RegExp(`(?:^|[\\s\\-_/])${escapeRegex(query)}`);
  if (boundary.test(t)) return 700;
  if (t.includes(query)) return 500;
  return 0;
}

export function scoreCandidate(
  candidate: SearchCandidate,
  query: string,
  boosts: RankBoosts,
): number {
  if (!query) return 0;

  const fields = [
    candidate.title,
    candidate.subtitle,
    candidate.entityId,
    candidate.badge,
    ...(candidate.keywords ?? []),
  ];

  let best = 0;
  for (const field of fields) {
    best = Math.max(best, scoreField(query, field));
  }
  if (best === 0) return 0;

  if (boosts.recentIds.includes(candidate.id)) {
    best += 100;
  }
  if ((boosts.frequency[candidate.id] ?? 0) >= 3) {
    best += 50;
  }

  return best;
}

/**
 * Score, drop non-matches, sort within groups, apply per-group caps.
 * Stable group order is applied by the palette renderer.
 */
export function rankCandidates(
  candidates: SearchCandidate[],
  query: string,
  groupById: Map<string, string>,
  boosts: RankBoosts,
): RankedCandidate[] {
  const scored: RankedCandidate[] = [];

  for (const candidate of candidates) {
    const score = scoreCandidate(candidate, query, boosts);
    if (score > 0) {
      scored.push({ ...candidate, score });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });

  const counts = new Map<string, number>();
  const capped: RankedCandidate[] = [];

  for (const item of scored) {
    const group = groupById.get(item.id) ?? item.type;
    const cap = GROUP_CAPS[group] ?? 6;
    const used = counts.get(group) ?? 0;
    if (used >= cap) continue;
    counts.set(group, used + 1);
    capped.push(item);
  }

  return capped;
}

export const TYPED_GROUP_ORDER = [
  "Pages",
  "Tickets",
  "Portals",
  "Team",
  "Actions",
] as const;

export function groupLabelForType(type: SearchEntityType): string {
  switch (type) {
    case "page":
      return "Pages";
    case "ticket":
      return "Tickets";
    case "portal":
      return "Portals";
    case "team":
      return "Team";
    case "action":
      return "Actions";
  }
}
