import type { UserRole } from "@/lib/types/auth";
import type { SearchViewer } from "@/lib/search/types";

export function viewerFromRole(
  userId: string,
  role: UserRole | undefined,
): SearchViewer {
  const isAdmin = role === "ADMIN";
  return {
    userId,
    permissions: {
      canViewTeam: isAdmin,
      canViewPortals: isAdmin,
      canViewAudit: isAdmin,
      canCreateTicket: isAdmin,
      canRegisterPortal: isAdmin,
      canInviteMember: isAdmin,
    },
  };
}
