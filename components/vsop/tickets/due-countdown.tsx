"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type DueCountdownProps = {
  dueDateIso: string;
  className?: string;
};

function partsUntil(due: Date, now: Date) {
  const diff = due.getTime() - now.getTime();
  const overdue = diff < 0;
  const abs = Math.abs(diff);
  const totalMinutes = Math.floor(abs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { overdue, days, hours, minutes, totalMs: diff };
}

export function DueCountdown({ dueDateIso, className }: DueCountdownProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const due = useMemo(() => new Date(dueDateIso), [dueDateIso]);
  const { overdue, days, hours, minutes, totalMs } = partsUntil(due, now);

  const hoursLeft = totalMs / 3_600_000;
  const tone = overdue
    ? "overdue"
    : hoursLeft <= 4
      ? "critical"
      : hoursLeft <= 24
        ? "warning"
        : "ok";

  const toneClass =
    tone === "overdue"
      ? "border-red-500/40 bg-zinc-950 text-red-300 shadow-[0_0_24px_-8px_rgba(239,68,68,0.55)]"
      : tone === "critical"
        ? "border-orange-500/35 bg-zinc-950 text-orange-200 shadow-[0_0_20px_-10px_rgba(249,115,22,0.5)]"
        : tone === "warning"
          ? "border-amber-500/30 bg-zinc-900 text-amber-100"
          : "border-zinc-700/80 bg-zinc-950 text-zinc-100";

  const label = overdue ? "Overdue" : "Due in";
  const segments = [
    days > 0 ? `${days}d` : null,
    `${hours}h`,
    `${minutes}m`,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5 font-mono text-xs tracking-wide",
        toneClass,
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-400">
          {label}
        </span>
        <span
          className={cn(
            "size-1.5 rounded-full",
            tone === "overdue" || tone === "critical"
              ? "animate-pulse bg-current"
              : "bg-emerald-400/80",
          )}
        />
      </div>
      <p className="mt-1 text-sm font-semibold tabular-nums">
        {segments.join(" ")}
      </p>
      <p className="mt-0.5 text-[10px] text-zinc-500">
        {due.toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
