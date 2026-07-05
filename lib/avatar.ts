/**
 * DiceBear Notionists avatars — stable per email/id seed.
 * https://www.dicebear.com/styles/notionists/
 */
export function dicebearAvatarUrl(
  seed: string,
  options?: { size?: number; background?: string },
): string {
  const size = options?.size ?? 128;
  const background = options?.background ?? "1a1a2e";
  const params = new URLSearchParams({
    seed: seed.trim().toLowerCase() || "vsop",
    size: String(size),
    backgroundColor: background,
  });
  return `https://api.dicebear.com/9.x/notionists/svg?${params.toString()}`;
}

export function roleAvatarBackground(role?: string): string {
  if (role === "ADMIN") return "312e81"; // indigo
  if (role === "DEVELOPER") return "164e63"; // cyan/slate
  return "1a1a2e";
}
