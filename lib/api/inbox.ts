import { apiFetch } from "@/lib/api";
import type { InboxResponse } from "@/lib/types/inbox";

export function fetchInbox() {
  return apiFetch<InboxResponse>("/inbox");
}

export function markInboxItemRead(id: string) {
  return apiFetch<{ id: string; readAt: string | null }>(`/inbox/${id}/read`, {
    method: "PATCH",
  });
}

export function markAllInboxRead() {
  return apiFetch<{ marked: number }>("/inbox/read-all", {
    method: "PATCH",
  });
}
