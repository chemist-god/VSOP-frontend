"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle, Info, Ticket } from "lucide-react";
import type { InsightsPayload } from "@/lib/api/audit";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#f87171",
  HIGH: "#fb923c",
  MEDIUM: "#fbbf24",
  LOW: "#34d399",
  UNSET: "#71717a",
};

const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "UNSET"] as const;

type InsightsPanelProps = {
  data?: InsightsPayload;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
};

function shareOf(part: number, whole: number) {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

function formatShortDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function severityLabel(severity: string) {
  if (severity === "UNSET") return "Unset";
  return severity.charAt(0) + severity.slice(1).toLowerCase();
}

function ChartTooltipShell({
  active,
  label,
  children,
}: {
  active?: boolean;
  label?: string;
  children: ReactNode;
}) {
  if (!active) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 px-3 py-2.5 shadow-xl backdrop-blur-md">
      {label ? (
        <p className="mb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground">
          {label}
        </p>
      ) : null}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipShell active label={label ? formatShortDate(String(label)) : undefined}>
      {payload.map((entry) => (
        <div
          key={String(entry.dataKey)}
          className="flex items-center justify-between gap-6 text-xs"
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <span
              className="size-2 rounded-full"
              style={{ background: entry.color }}
            />
            {entry.dataKey === "created" ? "Created" : "Resolved"}
          </span>
          <span className="tabular-nums font-medium text-foreground">
            {entry.value ?? 0}
          </span>
        </div>
      ))}
    </ChartTooltipShell>
  );
}

function SeverityTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; payload?: { severity: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const severity = entry.payload?.severity ?? String(entry.name ?? "");
  return (
    <ChartTooltipShell active>
      <div className="flex items-center gap-2 text-xs">
        <span
          className="size-2 rounded-full"
          style={{
            background: SEVERITY_COLORS[severity] ?? "#71717a",
          }}
        />
        <span className="font-medium tracking-wide text-foreground">
          {severityLabel(severity).toUpperCase()}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Tickets{" "}
        <span className="tabular-nums font-medium text-foreground">
          {entry.value ?? 0}
        </span>
      </p>
    </ChartTooltipShell>
  );
}

function PortalTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: { companyName: string; slug: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  return (
    <ChartTooltipShell active label={row?.companyName ?? row?.slug}>
      <div className="flex items-center justify-between gap-6 text-xs">
        <span className="text-muted-foreground">Tickets</span>
        <span className="tabular-nums font-medium text-foreground">
          {payload[0]?.value ?? 0}
        </span>
      </div>
    </ChartTooltipShell>
  );
}

export function InsightsPanel({
  data,
  isLoading,
  isError,
  onRetry,
}: InsightsPanelProps) {
  const [activeSeverity, setActiveSeverity] = useState<string | null>(null);

  const kpis = useMemo(() => {
    if (!data) return [];
    const total = data.totals.tickets;
    return [
      {
        label: "Total tickets",
        value: data.totals.tickets,
        hint: "All time",
        tone: "neutral" as const,
      },
      {
        label: "Open",
        value: data.totals.open,
        hint: `${shareOf(data.totals.open, total)}% of total`,
        tone: "info" as const,
      },
      {
        label: "In progress",
        value: data.totals.inProgress,
        hint: `${shareOf(data.totals.inProgress, total)}% of total`,
        tone: "warn" as const,
      },
      {
        label: "Resolved (7d)",
        value: data.totals.resolvedLast7Days,
        hint: "Last 7 days",
        tone: "good" as const,
      },
    ];
  }, [data]);

  const trendData = useMemo(
    () =>
      (data?.trend ?? []).map((point) => ({
        ...point,
        label: formatShortDate(point.date),
      })),
    [data],
  );

  const severityData = useMemo(() => {
    const rows = [...(data?.bySeverity ?? [])];
    rows.sort(
      (a, b) =>
        SEVERITY_ORDER.indexOf(a.severity as (typeof SEVERITY_ORDER)[number]) -
        SEVERITY_ORDER.indexOf(b.severity as (typeof SEVERITY_ORDER)[number]),
    );
    return rows.filter((row) => row.count > 0);
  }, [data]);

  const severityTotal = useMemo(
    () => severityData.reduce((sum, row) => sum + row.count, 0),
    [severityData],
  );

  const portalData = useMemo(
    () =>
      [...(data?.byPortal ?? [])]
        .sort((a, b) => b.count - a.count)
        .map((row) => ({
          ...row,
          short: row.slug.length > 14 ? `${row.slug.slice(0, 12)}…` : row.slug,
        })),
    [data],
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-border/50 bg-card/40 p-5 xl:col-span-2 sm:p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="space-y-4 rounded-2xl border border-border/50 bg-card/40 p-5 sm:p-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mx-auto size-48 rounded-full" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5 xl:col-span-3 sm:p-6">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertDescription className="flex flex-wrap items-center gap-3">
          Could not load insights. Check your connection and try again.
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="text-sm font-medium underline underline-offset-2"
            >
              Retry
            </button>
          ) : null}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {/* Primary: volume + KPIs + trend */}
      <section className="flex flex-col gap-6 rounded-2xl border border-border/50 bg-card/50 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] xl:col-span-2 sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-medium tracking-tight text-foreground">
              Ticket volume
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Open pipeline and recent resolution activity
            </p>
          </div>
          <span className="inline-flex h-8 items-center rounded-lg border border-border/60 bg-background/40 px-3 text-xs font-medium text-muted-foreground">
            Last 14 days
          </span>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {kpis.map((kpi, index) => (
            <div
              key={kpi.label}
              className={cn(
                "min-w-0 lg:px-5",
                index === 0 && "lg:pl-0",
                index === kpis.length - 1 && "lg:pr-0",
                index > 0 && "lg:border-l lg:border-border/40",
              )}
            >
              <p className="text-xs font-medium text-muted-foreground">
                {kpi.label}
              </p>
              <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums text-foreground">
                {kpi.value.toLocaleString()}
              </p>
              <p
                className={cn(
                  "mt-1.5 text-xs font-medium tabular-nums",
                  kpi.tone === "good" && "text-emerald-400",
                  kpi.tone === "info" && "text-sky-400",
                  kpi.tone === "warn" && "text-amber-400",
                  kpi.tone === "neutral" && "text-muted-foreground",
                )}
              >
                {kpi.hint}
              </p>
            </div>
          ))}
        </div>

        <div className="relative min-h-[240px] flex-1 sm:min-h-[280px]">
          <svg width={0} height={0} className="absolute" aria-hidden>
            <defs>
              <linearGradient id="vsopCreatedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.45} />
                <stop offset="55%" stopColor="#6366f1" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="vsopResolvedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                <stop offset="55%" stopColor="#10b981" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
          </svg>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 8"
                vertical={false}
                stroke="currentColor"
                className="text-border/40"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                content={<TrendTooltip />}
                cursor={{
                  stroke: "currentColor",
                  strokeOpacity: 0.2,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="created"
                stroke="#818cf8"
                strokeWidth={2.25}
                fill="url(#vsopCreatedFill)"
                activeDot={{ r: 4, strokeWidth: 0, fill: "#a5b4fc" }}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#34d399"
                strokeWidth={2.25}
                fill="url(#vsopResolvedFill)"
                activeDot={{ r: 4, strokeWidth: 0, fill: "#6ee7b7" }}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute bottom-0 right-0 flex items-center gap-4 pb-1 pr-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#818cf8]" />
              Created
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#34d399]" />
              Resolved
            </span>
          </div>
        </div>
      </section>

      {/* Side: severity mix */}
      <section className="flex flex-col rounded-2xl border border-border/50 bg-card/50 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-medium tracking-tight text-foreground">
              By severity
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Active ticket mix
            </p>
          </div>
          {severityTotal > 0 ? (
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium tabular-nums text-emerald-400">
              {severityData.length} levels
            </span>
          ) : null}
        </header>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background/40">
            <Ticket className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Classified tickets
            </p>
            <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {severityTotal.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-4 h-52 w-full max-w-[240px]">
          {severityData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No severity data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  dataKey="count"
                  nameKey="severity"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={4}
                  stroke="transparent"
                  onMouseEnter={(_, index) =>
                    setActiveSeverity(severityData[index]?.severity ?? null)
                  }
                  onMouseLeave={() => setActiveSeverity(null)}
                >
                  {severityData.map((entry) => (
                    <Cell
                      key={entry.severity}
                      fill={SEVERITY_COLORS[entry.severity] ?? "#71717a"}
                      opacity={
                        activeSeverity && activeSeverity !== entry.severity
                          ? 0.35
                          : 1
                      }
                      className="outline-none transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={<SeverityTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <ul className="mt-2 space-y-2">
          {severityData.map((row) => (
            <li
              key={row.severity}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-xs transition-colors",
                activeSeverity === row.severity && "bg-muted/40",
              )}
              onMouseEnter={() => setActiveSeverity(row.severity)}
              onMouseLeave={() => setActiveSeverity(null)}
            >
              <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    background: SEVERITY_COLORS[row.severity] ?? "#71717a",
                  }}
                />
                <span className="truncate">{severityLabel(row.severity)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 tabular-nums">
                <span className="font-medium text-foreground">{row.count}</span>
                <span className="w-8 text-right text-muted-foreground">
                  {shareOf(row.count, severityTotal)}%
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-auto flex items-start gap-2 border-t border-border/40 pt-4 text-[11px] leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 opacity-70" />
          Mix reflects all tickets grouped by severity across portals.
        </p>
      </section>

      {/* Full-width: portals */}
      <section className="rounded-2xl border border-border/50 bg-card/50 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] xl:col-span-3 sm:p-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-medium tracking-tight text-foreground">
              Tickets by portal
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Volume across registered client portals
            </p>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {portalData.length} portal{portalData.length === 1 ? "" : "s"}
          </span>
        </header>

        {portalData.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No portal ticket data yet.
          </p>
        ) : (
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={portalData}
                margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
                barCategoryGap="28%"
              >
                <defs>
                  <linearGradient id="vsopPortalBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a5b4fc" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.75} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 8"
                  vertical={false}
                  stroke="currentColor"
                  className="text-border/40"
                />
                <XAxis
                  dataKey="short"
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "currentColor" }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  content={<PortalTooltip />}
                  cursor={{ fill: "currentColor", opacity: 0.04 }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#vsopPortalBar)"
                  radius={[8, 8, 4, 4]}
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
