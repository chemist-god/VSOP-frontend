export type SearchEntityType =
  | "page"
  | "ticket"
  | "portal"
  | "team"
  | "action";

/** Provider output — never includes score. */
export type SearchCandidate = {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string;
  keywords?: string[];
  /** e.g. OPEN, ACTIVE, ADMIN */
  badge?: string;
  entityType?: SearchEntityType;
  entityId?: string;
  /** Pages/actions without a single entity id */
  actionId?: string;
};

/** After Ranker — palette wires onSelect. */
export type SearchResult = SearchCandidate & {
  score: number;
  onSelect: () => void;
};

export type SearchViewer = {
  userId: string;
  permissions: {
    canViewTeam: boolean;
    canViewPortals: boolean;
    canViewAudit: boolean;
    canCreateTicket: boolean;
    canRegisterPortal: boolean;
    canInviteMember: boolean;
  };
};

export type SearchDataSource = {
  getTickets: () => Promise<
    Array<{
      id: string;
      referenceId: string;
      description: string;
      status: string;
      severity: string;
      source: string;
    }>
  >;
  getPortals: () => Promise<
    Array<{
      id: string;
      slug: string;
      companyName: string;
      status: string;
      clientAdminEmail: string;
    }>
  >;
  getTeamMembers: () => Promise<
    Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      isActive: boolean;
    }>
  >;
};

export type SearchProviderContext = {
  /** Normalized (trimmed, lowercased) query */
  query: string;
  viewer: SearchViewer;
  data: SearchDataSource;
};

export type SearchProvider = {
  id: string;
  groupLabel: string;
  enabled: (ctx: SearchProviderContext) => boolean;
  findCandidates: (
    ctx: SearchProviderContext,
  ) => SearchCandidate[] | Promise<SearchCandidate[]>;
};

export type RouteIntent = {
  entityType?: SearchEntityType;
  entityId?: string;
  actionId?: string;
};

/** Serializable recent/pinned entry (no React nodes). */
export type SearchStoredItem = {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string;
  badge?: string;
  entityType?: SearchEntityType;
  entityId?: string;
  actionId?: string;
};
