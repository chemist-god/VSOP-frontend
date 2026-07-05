export type PortalStatus = "ACTIVE" | "INACTIVE";

export interface PortalListItem {
  id: string;
  slug: string;
  companyName: string;
  clientAdminEmail: string;
  description: string | null;
  status: PortalStatus;
}

export interface RegisterPortalInput {
  slug: string;
  companyName: string;
  clientAdminEmail: string;
  description?: string;
}

export interface RegisterPortalResult {
  portalId: string;
  slug: string;
  apiKey: string;
}
