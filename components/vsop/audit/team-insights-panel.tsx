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
import { AlertCircle, Info, Users } from "lucide-react";
import type { InsightsTeamMember, InsightsTeamPayload } from "@/lib/api/audit";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { cn } from "@/lib/utils";

const MEMBER_PALETTE = [
  "#818cf8",
  "#34d399",
  "#fbbf24",
  "#fb923c",
  "#f87171",
  "#22d3ee",
  "#a78bfa",
  "#94a3b8",
];

const DONUT_TOP_N = 5;
const OTHERS_ID = "__others__";
const OTHERS_FILL = "#64748b";
const SHARE_LIST_MAX = 20;

type TeamInsightsPanelProps = {
  data?: InsightsTeamPayload;
  rangeLabel: string;
  onSelectMember?: (userId: string) => void;
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

function formatMttr(hours: number | null) {
  if (hours == null) return "—";
  return `${hours}h`;
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
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltipShell
      active
      label={label ? formatShortDate(String(label)) : undefined}
    >
      <div className="flex items-center justify-between gap-6 text-xs">
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full bg-[#34d399]" />
          Resolved
        </span>
        <span className="tabular-nums font-medium text-foreground">
          {payload[0]?.value ?? 0}
        </span>
      </div>
    </ChartTooltipShell>
  );
}

function MemberBarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: InsightsTeamMember & { shortName: string };
  }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <ChartTooltipShell active label={row.name}>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">Resolved</span>
          <span className="tabular-nums font-medium text-foreground">
            {row.resolvedInRange}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">Open</span>
          <span className="tabular-nums font-medium text-foreground">
            {row.openAssigned}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">Overdue</span>
          <span className="tabular-nums font-medium text-foreground">
            {row.overdue}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">MTTR</span>
          <span className="tabular-nums font-medium text-foreground">
            {formatMttr(row.mttrHours)}
          </span>
        </div>
      </div>
    </ChartTooltipShell>
  );
}

function ShareTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <ChartTooltipShell active>
      <div className="flex items-center justify-between gap-6 text-xs">
        <span className="truncate font-medium text-foreground">
          {entry.name}
        </span>
        <span className="tabular-nums font-medium text-foreground">
          {entry.value ?? 0}
        </span>
      </div>
    </ChartTooltipShell>
  );
}

export function TeamInsightsPanel({
  data,
  rangeLabel,
  onSelectMember,
}: TeamInsightsPanelProps) {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const kpis = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: "Open assigned",
        value: data.kpis.openAssigned,
        hint: "Active workload",
        tone: "info" as const,
        display: data.kpis.openAssigned.toLocaleString(),
      },
      {
        label: "Resolved",
        value: data.kpis.resolvedInRange,
        hint: rangeLabel,
        tone: "good" as const,
        display: data.kpis.resolvedInRange.toLocaleString(),
      },
      {
        label: "Overdue",
        value: data.kpis.overdue,
        hint: data.kpis.overdue > 0 ? "Needs attention" : "On track",
        tone: (data.kpis.overdue > 0 ? "warn" : "neutral") as
          | "warn"
          | "neutral",
        display: data.kpis.overdue.toLocaleString(),
      },
      {
        label: "Avg MTTR",
        value: data.kpis.avgMttrHours ?? 0,
        hint: "Mean time to resolve",
        tone: "neutral" as const,
        display: formatMttr(data.kpis.avgMttrHours),
      },
    ];
  }, [data, rangeLabel]);

  const trendData = useMemo(
    () =>
      (data?.trend ?? []).map((point) => ({
        ...point,
        label: formatShortDate(point.date),
      })),
    [data],
  );

  const contributionData = useMemo(
    () =>
      (data?.byMember ?? [])
        .filter((row) => row.resolvedInRange > 0 || row.openAssigned > 0)
        .slice(0, 20)
        .map((row) => ({
          ...row,
          shortName:
            row.name.length > 18 ? `${row.name.slice(0, 16)}…` : row.name,
        })),
    [data],
  );

  const resolvers = useMemo(() => {
    const rows = (data?.byMember ?? [])
      .filter((row) => row.resolvedInRange > 0)
      .sort((a, b) => b.resolvedInRange - a.resolvedInRange);
    return rows.map((row, index) => ({
      ...row,
      fill: MEMBER_PALETTE[index % MEMBER_PALETTE.length],
    }));
  }, [data]);

  const shareList = useMemo(
    () => resolvers.slice(0, SHARE_LIST_MAX),
    [resolvers],
  );

  const shareTotal = useMemo(
    () => resolvers.reduce((sum, row) => sum + row.resolvedInRange, 0),
    [resolvers],
  );

  const donutData = useMemo(() => {
    if (resolvers.length === 0) return [];
    const top = resolvers.slice(0, DONUT_TOP_N);
    const rest = resolvers.slice(DONUT_TOP_N);
    const othersCount = rest.reduce((sum, row) => sum + row.resolvedInRange, 0);
    if (othersCount <= 0) return top;
    return [
      ...top,
      {
        userId: OTHERS_ID,
        name: `Others (${rest.length})`,
        email: "",
        role: "",
        isActive: true,
        openAssigned: 0,
        resolvedInRange: othersCount,
        overdue: 0,
        mttrHours: null,
        fill: OTHERS_FILL,
      },
    ];
  }, [resolvers]);

  const listNeedsScroll = shareList.length > 5;
  const hiddenResolvers = Math.max(0, resolvers.length - shareList.length);

  const chartHeight = Math.max(220, Math.min(contributionData.length * 44, 520));

  if (!data) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/40 px-4 py-16 text-center text-sm text-muted-foreground">
        No team performance data yet.
      </div>
    );
  }

  const hasActivity =
    data.kpis.resolvedInRange > 0 ||
    data.kpis.openAssigned > 0 ||
    data.byMember.some((m) => m.openAssigned > 0 || m.resolvedInRange > 0);

  return (
    <div className="grid items-stretch gap-4 xl:grid-cols-3">
      <section className="flex h-full flex-col gap-6 rounded-2xl border border-border/50 bg-card/50 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] xl:col-span-2 sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-medium tracking-tight text-foreground">
              Team throughput
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Workload and resolution pace across the team
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#34d399]" />
              Resolved
            </span>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-0">
          {kpis.map((kpi, index) => (
            <div
              key={kpi.label}
              className={cn(
                "min-w-0 rounded-xl border border-border/40 bg-background/20 px-3 py-3 sm:px-4",
                "lg:rounded-none lg:border-0 lg:bg-transparent lg:px-5 lg:py-0",
                index === 0 && "lg:pl-0",
                index === kpis.length - 1 && "lg:pr-0",
                index > 0 && "lg:border-l lg:border-border/40",
              )}
            >
              <p className="text-[11px] font-medium leading-snug text-muted-foreground sm:text-xs">
                {kpi.label}
              </p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-foreground sm:text-3xl">
                {kpi.display}
              </p>
              <p
                className={cn(
                  "mt-1 text-[11px] font-medium tabular-nums sm:mt-1.5 sm:text-xs",
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

        <div className="relative min-h-[220px] flex-1 sm:min-h-[260px]">
          {!hasActivity ? (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <AlertCircle className="size-5 opacity-60" />
              <p>No team resolution activity in this range.</p>
            </div>
          ) : (
            <>
              <svg width={0} height={0} className="absolute" aria-hidden>
                <defs>
                  <linearGradient
                    id="vsopTeamResolvedFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="55%" stopColor="#10b981" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 8, right: 8, left: -18, bottom: 4 }}
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
                    dy={4}
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
                    dataKey="resolved"
                    stroke="#34d399"
                    strokeWidth={2.25}
                    fill="url(#vsopTeamResolvedFill)"
                    activeDot={{ r: 4, strokeWidth: 0, fill: "#6ee7b7" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </section>

      <section className="flex h-full min-h-0 flex-col rounded-2xl border border-border/50 bg-card/50 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:p-6">
        <header className="flex shrink-0 items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-medium tracking-tight text-foreground">
              Resolution share
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Who closed work in this range
            </p>
          </div>
          {resolvers.length > 0 ? (
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium tabular-nums text-emerald-400">
              {resolvers.length} member{resolvers.length === 1 ? "" : "s"}
            </span>
          ) : null}
        </header>

        <div className="mt-5 flex shrink-0 items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background/40">
            <Users className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Resolved tickets
            </p>
            <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {data.kpis.resolvedInRange.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-4 hidden h-44 w-full max-w-[200px] shrink-0 sm:block">
          {donutData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No resolutions yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="resolvedInRange"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="82%"
                  paddingAngle={4}
                  stroke="transparent"
                  onMouseEnter={(_, index) =>
                    setActiveMemberId(donutData[index]?.userId ?? null)
                  }
                  onMouseLeave={() => setActiveMemberId(null)}
                >
                  {donutData.map((entry) => (
                    <Cell
                      key={entry.userId}
                      fill={entry.fill}
                      opacity={
                        activeMemberId && activeMemberId !== entry.userId
                          ? 0.35
                          : 1
                      }
                      className="outline-none transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={<ShareTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="relative mt-4 min-h-0 flex-1">
          {shareList.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground sm:hidden">
              No resolutions yet
            </p>
          ) : (
            <>
              <ul
                className={cn(
                  "space-y-1 overflow-y-auto overscroll-contain pr-1",
                  "max-h-[13.5rem] sm:max-h-[12.5rem]",
                )}
              >
                {shareList.map((row) => (
                  <li key={row.userId}>
                    <button
                      type="button"
                      onClick={() => onSelectMember?.(row.userId)}
                      onMouseEnter={() => setActiveMemberId(row.userId)}
                      onMouseLeave={() => setActiveMemberId(null)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-xs transition-colors",
                        "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        activeMemberId === row.userId && "bg-muted/40",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ background: row.fill }}
                        />
                        <UserAvatar
                          name={row.name}
                          email={row.email}
                          role={row.role}
                          size={22}
                          className="size-[22px] shrink-0"
                        />
                        <span className="truncate text-muted-foreground">
                          {row.name}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 tabular-nums">
                        <span className="font-medium text-foreground">
                          {row.resolvedInRange}
                        </span>
                        <span className="w-8 text-right text-muted-foreground">
                          {shareOf(row.resolvedInRange, shareTotal)}%
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {listNeedsScroll ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-card via-card/80 to-transparent"
                />
              ) : null}

              {hiddenResolvers > 0 || resolvers.length > DONUT_TOP_N ? (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {hiddenResolvers > 0
                    ? `+${hiddenResolvers} more in contribution below`
                    : "Full ranking in contribution below"}
                </p>
              ) : null}
            </>
          )}
        </div>

        <p className="mt-auto flex shrink-0 items-start gap-2 border-t border-border/40 pt-4 text-[11px] leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 opacity-70" />
          Top contributors on the chart; list scrolls as the team grows. Tap a
          member for detail.
        </p>
      </section>

      <section className="rounded-2xl border border-border/50 bg-card/50 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] xl:col-span-3 sm:p-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-medium tracking-tight text-foreground">
              Contribution by member
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Resolved tickets in {rangeLabel.toLowerCase()}
            </p>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {contributionData.length} shown
          </span>
        </header>

        {contributionData.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No assigned or resolved work to chart yet.
          </p>
        ) : (
          <>
            <div
              className="hidden w-full sm:block"
              style={{ height: Math.min(chartHeight, 480) }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contributionData}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
                  barCategoryGap="28%"
                >
                  <defs>
                    <linearGradient
                      id="vsopMemberBar"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.75} />
                      <stop offset="100%" stopColor="#a5b4fc" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 8"
                    horizontal={false}
                    stroke="currentColor"
                    className="text-border/40"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    width={108}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<MemberBarTooltip />}
                    cursor={{ fill: "currentColor", opacity: 0.04 }}
                  />
                  <Bar
                    dataKey="resolvedInRange"
                    fill="url(#vsopMemberBar)"
                    radius={[4, 8, 8, 4]}
                    maxBarSize={28}
                    cursor="pointer"
                    onClick={(entry) => {
                      const payload = entry as {
                        userId?: string;
                        payload?: { userId?: string };
                      };
                      const id = payload.userId ?? payload.payload?.userId;
                      if (id) onSelectMember?.(id);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="relative sm:hidden">
              <ul
                className={cn(
                  "divide-y divide-border/40 overflow-y-auto overscroll-contain border-t border-border/40",
                  "max-h-[min(22rem,55dvh)]",
                )}
              >
                {contributionData.map((row) => (
                  <li key={row.userId}>
                    <button
                      type="button"
                      onClick={() => onSelectMember?.(row.userId)}
                      className="flex w-full items-center gap-3 py-3 text-left transition-colors active:bg-muted/30"
                    >
                      <UserAvatar
                        name={row.name}
                        email={row.email}
                        role={row.role}
                        size={36}
                        className="size-9 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {row.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {row.openAssigned} open · {formatMttr(row.mttrHours)}{" "}
                          MTTR
                          {row.overdue > 0 ? ` · ${row.overdue} overdue` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                        {row.resolvedInRange}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {contributionData.length > 5 ? (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card via-card/85 to-transparent"
                  />
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    Scroll for more · {contributionData.length} members
                  </p>
                </>
              ) : null}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
