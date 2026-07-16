"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Clock,
  Columns3,
  History,
  Inbox,
  Pin,
  Plus,
  Sparkles,
  Ticket,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useCommandPalette } from "@/hooks/use-command-palette";
import {
  createSearchDataSource,
  warmSearchDataSource,
} from "@/lib/search/data-source";
import { resolveRoute } from "@/lib/search/navigation";
import { viewerFromRole } from "@/lib/search/permissions";
import { getPinnedItems } from "@/lib/search/pinned";
import { getIdleSuggestions } from "@/lib/search/providers/actions";
import {
  getRecentEntries,
  pushRecent,
  recentFrequencyMap,
  recentIdsOrdered,
} from "@/lib/search/recent";
import {
  TYPED_GROUP_ORDER,
  rankCandidates,
  type RankedCandidate,
} from "@/lib/search/rank";
import { gatherCandidates } from "@/lib/search/registry";
import type {
  SearchCandidate,
  SearchEntityType,
  SearchStoredItem,
} from "@/lib/search/types";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<SearchEntityType, LucideIcon> = {
  page: Inbox,
  ticket: Ticket,
  portal: Building2,
  team: Users,
  action: Plus,
};

const PAGE_ICONS: Record<string, LucideIcon> = {
  inbox: Inbox,
  board: Columns3,
  tickets: Ticket,
  portals: Building2,
  team: Users,
  audit: History,
  profile: UserRound,
};

function iconFor(item: SearchCandidate | SearchStoredItem): LucideIcon {
  if (item.type === "page" && item.entityId && PAGE_ICONS[item.entityId]) {
    return PAGE_ICONS[item.entityId]!;
  }
  if (item.actionId === "go-board") return Columns3;
  if (item.actionId === "go-inbox") return Inbox;
  if (item.actionId === "create-ticket") return Ticket;
  if (item.actionId === "register-portal") return Building2;
  if (item.actionId === "invite-member") return Users;
  return TYPE_ICONS[item.type] ?? Sparkles;
}

type DisplayGroup = {
  heading: string;
  items: Array<SearchCandidate | RankedCandidate>;
};

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthUser();
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<DisplayGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const viewer = useMemo(
    () => viewerFromRole(user?.id ?? "anonymous", user?.role),
    [user?.id, user?.role],
  );

  const dataSource = useMemo(
    () => createSearchDataSource(queryClient),
    [queryClient],
  );

  const handleSelect = useCallback(
    (candidate: SearchCandidate | SearchStoredItem) => {
      pushRecent(candidate);
      const { href } = resolveRoute({
        entityType: candidate.entityType ?? candidate.type,
        entityId: candidate.entityId,
        actionId: candidate.actionId,
      });
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router, setOpen],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    void warmSearchDataSource(dataSource, viewer.permissions);
  }, [open, dataSource, viewer.permissions]);

  useEffect(() => {
    if (!open) return;

    const normalized = query.trim().toLowerCase();
    let cancelled = false;

    async function run() {
      setLoading(true);

      if (!normalized) {
        const recent = getRecentEntries();
        const pinned = getPinnedItems(viewer);
        const suggestions = getIdleSuggestions(viewer.permissions);
        if (cancelled) return;
        const idle: DisplayGroup[] = [];
        if (recent.length) {
          idle.push({ heading: "Recent", items: recent });
        }
        if (pinned.length) {
          idle.push({ heading: "Pinned", items: pinned });
        }
        if (suggestions.length) {
          idle.push({ heading: "Suggestions", items: suggestions });
        }
        setGroups(idle);
        setLoading(false);
        return;
      }

      const ctx = {
        query: normalized,
        viewer,
        data: dataSource,
      };

      const bundles = await gatherCandidates(ctx);
      if (cancelled) return;

      const groupById = new Map<string, string>();
      const flat: SearchCandidate[] = [];
      for (const bundle of bundles) {
        for (const candidate of bundle.candidates) {
          groupById.set(candidate.id, bundle.groupLabel);
          flat.push(candidate);
        }
      }

      const ranked = rankCandidates(flat, normalized, groupById, {
        recentIds: recentIdsOrdered(),
        frequency: recentFrequencyMap(),
      });

      const byGroup = new Map<string, RankedCandidate[]>();
      for (const item of ranked) {
        const label = groupById.get(item.id) ?? "Other";
        const list = byGroup.get(label) ?? [];
        list.push(item);
        byGroup.set(label, list);
      }

      const typed: DisplayGroup[] = [];
      for (const label of TYPED_GROUP_ORDER) {
        const items = byGroup.get(label);
        if (items?.length) {
          typed.push({ heading: label, items });
        }
      }

      setGroups(typed);
      setLoading(false);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [open, query, viewer, dataSource]);

  const isIdle = !query.trim();
  const hasResults = groups.some((group) => group.items.length > 0);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Jump to pages, tickets, portals, team, or run an action."
      className="w-[calc(100%-1.5rem)] max-w-lg gap-0 overflow-hidden p-0 sm:max-w-xl"
      showCloseButton={false}
    >
      <Command
        shouldFilter={false}
        className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent"
      >
        <CommandInput
          placeholder="Search tickets, portals, team, pages…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[min(60vh,22rem)] sm:max-h-80">
          {!loading && !hasResults ? (
            <CommandEmpty className="px-4 py-8">
              <p className="font-medium text-foreground">No matches</p>
              <p className="mt-1 text-muted-foreground">
                Try a ticket reference (VT-…), portal name, teammate, or page.
              </p>
            </CommandEmpty>
          ) : null}

          {groups.map((group, index) => (
            <div key={group.heading}>
              {index > 0 ? <CommandSeparator /> : null}
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => {
                  const Icon =
                    group.heading === "Pinned"
                      ? Pin
                      : group.heading === "Suggestions"
                        ? Sparkles
                        : iconFor(item);
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(item)}
                      className="min-h-11 gap-3 rounded-lg px-2.5 py-2.5 sm:min-h-9"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {item.title}
                        </span>
                        {item.subtitle ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </span>
                        ) : null}
                      </span>
                      {group.heading === "Recent" ? (
                        <Clock className="size-3.5 shrink-0 text-muted-foreground/70" />
                      ) : null}
                      {item.badge ? (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "shrink-0 rounded-md px-1.5 text-[10px] font-medium",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ))}

          {isIdle && !hasResults && !loading ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Start typing to search tickets, portals, and more.
            </div>
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
