import type { UserRole } from "@/lib/types/auth";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface CreateTeamMemberInput {
  name: string;
  email: string;
  role: UserRole;
}
