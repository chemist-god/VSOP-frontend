import type { SearchCandidate, SearchStoredItem } from "@/lib/search/types";

const STORAGE_KEY = "vsop_search_recent";
const MAX_RECENT = 8;

export type RecentEntry = SearchStoredItem & {
  openedAt: number;
  openCount: number;
};

function readAll(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(entries: RecentEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_RECENT)));
  } catch {
    /* ignore quota */
  }
}

export function getRecentEntries(): RecentEntry[] {
  return readAll()
    .slice()
    .sort((a, b) => b.openedAt - a.openedAt)
    .slice(0, MAX_RECENT);
}

export function pushRecent(candidate: SearchCandidate | SearchStoredItem) {
  const existing = readAll();
  const prev = existing.find((item) => item.id === candidate.id);
  const next: RecentEntry = {
    id: candidate.id,
    type: candidate.type,
    title: candidate.title,
    subtitle: candidate.subtitle,
    badge: candidate.badge,
    entityType: candidate.entityType,
    entityId: candidate.entityId,
    actionId: candidate.actionId,
    openedAt: Date.now(),
    openCount: (prev?.openCount ?? 0) + 1,
  };
  const filtered = existing.filter((item) => item.id !== candidate.id);
  writeAll([next, ...filtered]);
}

export function recentFrequencyMap(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const entry of readAll()) {
    map[entry.id] = entry.openCount;
  }
  return map;
}

export function recentIdsOrdered(): string[] {
  return getRecentEntries().map((entry) => entry.id);
}
