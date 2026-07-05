import { apiFetch } from "@/lib/api";
import { setAuthSession } from "@/lib/auth";
import type { LoginResponse } from "@/lib/types/auth";

export interface LoginInput {
  email: string;
  password: string;
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const result = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  });

  setAuthSession(result.accessToken, result.refreshToken, result.user);
  return result;
}
