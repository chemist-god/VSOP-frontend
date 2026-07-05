export function formatRelativeAge(isoDate: string): string {
  const created = new Date(isoDate).getTime();
  const diffMs = Date.now() - created;
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function truncate(text: string, max = 80): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function defaultDueDateIso(hoursFromNow = 24): string {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date.toISOString();
}

export function toDateTimeLocalValue(isoDate: string): string {
  const date = new Date(isoDate);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
