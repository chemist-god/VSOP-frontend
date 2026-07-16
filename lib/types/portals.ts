export type PortalStatus = "ACTIVE" | "INACTIVE";

export interface PortalListItem {
  id: string;
  slug: string;
  companyName: string;
  clientAdminEmail: string;
  description: string | null;
  logoUrl: string | null;
  status: PortalStatus;
}

export interface RegisterPortalInput {
  slug: string;
  companyName: string;
  clientAdminEmail: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdatePortalInput {
  companyName: string;
  clientAdminEmail: string;
  description?: string | null;
  logoUrl?: string | null;
}

export interface RegisterPortalResult {
  portalId: string;
  slug: string;
  apiKey: string;
}
