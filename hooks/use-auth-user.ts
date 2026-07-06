"use client";

import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/types/auth";

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  return {
    user,
    isAdmin: user?.role === "ADMIN",
    isReady: user !== null,
  };
}
