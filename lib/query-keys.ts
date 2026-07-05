export const queryKeys = {
  tickets: {
    all: ["tickets"] as const,
    list: (filters: Record<string, string | undefined>) =>
      ["tickets", "list", filters] as const,
    detail: (id: string) => ["tickets", "detail", id] as const,
  },
  portals: {
    all: ["portals"] as const,
    list: () => ["portals", "list"] as const,
  },
  team: {
    all: ["team"] as const,
    list: () => ["team", "members"] as const,
    roster: () => ["team", "roster"] as const,
    detail: (id: string) => ["team", "detail", id] as const,
  },
  profile: {
    me: () => ["profile", "me"] as const,
  },
  audit: {
    all: ["audit"] as const,
    list: (page: number, pageSize: number) =>
      ["audit", "list", page, pageSize] as const,
    insights: () => ["audit", "insights"] as const,
  },
};
