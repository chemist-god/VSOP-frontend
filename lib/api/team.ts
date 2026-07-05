import { apiFetch } from "@/lib/api";
import type { AuthUser, UserRole } from "@/lib/types/auth";

export interface ProfileUser extends AuthUser {
  isActive: boolean;
  createdAt: string;
}

export interface PendingInvite {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  expiresAt: string;
  createdAt: string;
  status: "PENDING" | "EXPIRED";
}

export interface TeamListResponse {
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  }>;
  pendingInvites: PendingInvite[];
}

export interface InvitePreview {
  name: string;
  email: string;
  role: UserRole;
  expiresAt: string;
}

export function fetchTeamRoster() {
  return apiFetch<TeamListResponse>("/users");
}

export function inviteTeamMember(input: {
  name: string;
  email: string;
  role: UserRole;
}) {
  return apiFetch<{ invitationId: string; expiresAt: string }>("/users/invite", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchMyProfile() {
  return apiFetch<ProfileUser>("/users/me");
}

export function updateMyProfile(name: string) {
  return apiFetch<AuthUser>("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export function changeMyPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  return apiFetch<{ success: boolean }>("/users/me/password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function previewInvite(token: string) {
  return apiFetch<InvitePreview>(
    `/invites/preview?token=${encodeURIComponent(token)}`,
  );
}

export function acceptInvite(input: { token: string; password: string }) {
  return apiFetch<{
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }>("/invites/accept", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchTeamMembers() {
  return fetchTeamRoster().then((data) => {
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.members) ? data.members : [];
  });
}

export interface TeamMemberDetail {
  member: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
  };
  stats: {
    openAssignments: number;
    resolvedCount: number;
    overdueCount: number;
    mttrHours: number | null;
  };
  assignments: Array<{
    id: string;
    isActive: boolean;
    dueDate: string;
    assignedAt: string;
    ticket: {
      id: string;
      referenceId: string;
      status: string;
      severity: string;
      description: string;
      resolutionNote: string | null;
      portalName: string;
      portalSlug: string;
      createdAt: string;
      resolvedAt: string | null;
    };
  }>;
  activity: Array<{
    id: string;
    action: string;
    ticketId: string | null;
    ticketReferenceId: string | null;
    beforeState: Record<string, unknown> | null;
    afterState: Record<string, unknown> | null;
    createdAt: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    ticketId: string;
    ticketReferenceId: string;
    createdAt: string;
  }>;
}

export function fetchTeamMemberDetail(id: string) {
  return apiFetch<TeamMemberDetail>(`/users/${id}`);
}
