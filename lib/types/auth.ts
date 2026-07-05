export type UserRole = "ADMIN" | "DEVELOPER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface ApiErrorBody {
  code?: string;
  message?: string;
}
