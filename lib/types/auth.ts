export type UserRole = "ADMIN" | "DEVELOPER";

export type OnboardingStep =
  | "PRODUCT_TOUR"
  | "SPOTLIGHTS"
  | "AGREEMENT"
  | "COMPLETE";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tourCompleted: boolean;
  onboardingStep: OnboardingStep;
  acceptedTermsAt: string | null;
  termsVersion: string | null;
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
