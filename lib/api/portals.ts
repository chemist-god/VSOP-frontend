import { apiFetch } from "@/lib/api";
import type {
  PortalListItem,
  RegisterPortalInput,
  RegisterPortalResult,
  UpdatePortalInput,
} from "@/lib/types/portals";

export function fetchPortals() {
  return apiFetch<PortalListItem[]>("/portals");
}

export function registerPortal(input: RegisterPortalInput) {
  return apiFetch<RegisterPortalResult>("/portals", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updatePortal(id: string, input: UpdatePortalInput) {
  return apiFetch<PortalListItem>(`/portals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function updatePortalStatus(id: string, status: "ACTIVE" | "INACTIVE") {
  return apiFetch(`/portals/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function rotatePortalKey(id: string) {
  return apiFetch<{ apiKey: string }>(`/portals/${id}/rotate-key`, {
    method: "POST",
  });
}
