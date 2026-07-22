"use client"

import {
  memo,
  useMemo,
  useState,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
} from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export type ContributionData = {
  [date: string]: {
    level: ContributionLevel
    label?: string
    count?: number
  }
}

export type ThemeColors = {
  level0: string
  level1: string
  level2: string
  level3: string
  level4: string
}

export type CellShape = "rounded" | "circle"

export type GithubCalendarProps = {
  username?: string
  data?: ContributionData
  startDate?: string
  endDate?: string
  startsOnSunday?: boolean
  cellSize?: number
  cellGap?: number
  cellShape?: CellShape
  theme?: "github" | "blue" | "sunset" | "purple" | "gray" | "vsop" | ThemeColors
  showMonthLabels?: boolean
  /** Show Mon / Wed / Fri labels beside the grid (GitHub-style). */
  showWeekdayLabels?: boolean
  showStats?: boolean
  showLegend?: boolean
  /** Replaces the default “this year on GitHub” stats copy when set. */
  statsLabel?: string
  className?: string
}

// ─── Built-in themes ──────────────────────────────────────────────────────────

const THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#ebedf0",
    level1: "#9be9a8",
    level2: "#40c463",
    level3: "#30a14e",
    level4: "#216e39",
  },
  blue: {
    level0: "#eff6ff",
    level1: "#bfdbfe",
    level2: "#60a5fa",
    level3: "#2563eb",
    level4: "#1e3a8a",
  },
  sunset: {
    level0: "#fff7ed",
    level1: "#fed7aa",
    level2: "#fb923c",
    level3: "#ea580c",
    level4: "#7c2d12",
  },
  purple: {
    level0: "#faf5ff",
    level1: "#e9d5ff",
    level2: "#a855f7",
    level3: "#7e22ce",
    level4: "#3b0764",
  },
  gray: {
    level0: "#f3f4f6",
    level1: "#d1d5db",
    level2: "#9ca3af",
    level3: "#4b5563",
    level4: "#111827",
  },
  vsop: {
    level0: "#eef2ff",
    level1: "#c7d2fe",
    level2: "#a5b4fc",
    level3: "#818cf8",
    level4: "#4f46e5",
  },
}

const DARK_THEMES: Record<string, ThemeColors> = {
  github: {
    level0: "#161b22",
    level1: "#0e4429",
    level2: "#006d32",
    level3: "#26a641",
    level4: "#39d353",
  },
  blue: {
    level0: "#161e2b",
    level1: "#1e3a5f",
    level2: "#1d4ed8",
    level3: "#3b82f6",
    level4: "#93c5fd",
  },
  sunset: {
    level0: "#261a13",
    level1: "#7c2d12",
    level2: "#c2410c",
    level3: "#f97316",
    level4: "#fdba74",
  },
  purple: {
    level0: "#191124",
    level1: "#3b0764",
    level2: "#6b21a8",
    level3: "#a855f7",
    level4: "#d8b4fe",
  },
  gray: {
    level0: "#13181f",
    level1: "#374151",
    level2: "#6b7280",
    level3: "#9ca3af",
    level4: "#e5e7eb",
  },
  vsop: {
    level0: "#1a1b2e",
    level1: "#312e81",
    level2: "#4338ca",
    level3: "#6366f1",
    level4: "#a5b4fc",
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number)
  const y = parts[0] ?? 0
  const m = parts[1] ?? 1
  const d = parts[2] ?? 1
  return new Date(y, m - 1, d)
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatFriendlyDate(dateStr: string): string {
  const date = parseDate(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  })
}

function formatContributionTooltip(
  dateStr: string,
  count: number | undefined,
  label: string | undefined,
): string {
  const when = formatFriendlyDate(dateStr)
  if (label) {
    // If callers already passed a full sentence, keep it; otherwise append date.
    if (/\bon\b/i.test(label) || label.toLowerCase().includes(when.toLowerCase())) {
      return label
    }
    return `${label} on ${when}`
  }
  if (count === undefined || count <= 0) {
    return `No contributions on ${when}`
  }
  return `${count} contribution${count === 1 ? "" : "s"} on ${when}`
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

// ─── API fetch ────────────────────────────────────────────────────────────────

type APIResponse = {
  total: Record<string, number>
  contributions: { date: string; count: number; level: number }[]
}

async function fetchContributions(username: string): Promise<ContributionData> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`,
  )
  if (!res.ok) {
    throw new Error(
      `Could not fetch contributions for "${username}" (${res.status})`,
    )
  }
  const json: APIResponse = await res.json()

  const result: ContributionData = {}
  for (const entry of json.contributions) {
    result[entry.date] = {
      level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel,
      count: entry.count,
    }
  }
  return result
}

// ─── Build calendar grid ──────────────────────────────────────────────────────

function buildGrid(
  startDate: string,
  endDate: string,
  startsOnSunday: boolean,
): {
  weeks: (string | null)[][]
  monthLabels: { label: string; weekIndex: number }[]
  gridStart: string
} {
  const start = parseDate(startDate)
  const end = parseDate(endDate)

  const startDay = startsOnSunday ? 0 : 1
  const startDow = start.getDay()
  const offset = (((startDow - startDay) % 7) + 7) % 7
  const gridStart = addDays(start, -offset)

  const weeks: (string | null)[][] = []
  const monthLabels: { label: string; weekIndex: number }[] = []

  let current = new Date(gridStart)
  let weekIndex = 0
  let lastMonth = -1

  while (
    current <= end ||
    (weeks.length > 0 && (weeks[weeks.length - 1]?.length ?? 0) < 7)
  ) {
    const week: (string | null)[] = []

    for (let d = 0; d < 7; d++) {
      const dateStr = formatDate(current)
      const isInRange = current >= start && current <= end
      week.push(isInRange ? dateStr : null)

      if (isInRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth()
        monthLabels.push({
          label: MONTH_NAMES[current.getMonth()]!,
          weekIndex,
        })
      }

      current = addDays(current, 1)
    }

    weeks.push(week)
    weekIndex++

    if (
      current > end &&
      weeks.length > 0 &&
      (weeks[weeks.length - 1]?.every(
        (d) => d === null || parseDate(d) > end,
      ) ??
        false)
    )
      break
  }

  return { weeks, monthLabels, gridStart: formatDate(gridStart) }
}

type TooltipState = {
  visible: boolean
  date: string
  count: number | undefined
  label: string | undefined
  x: number
  y: number
}

function CalendarSkeleton({
  cellSize = 12,
  cellGap = 3,
  className,
}: {
  cellSize?: number
  cellGap?: number
  className?: string
}) {
  const step = cellSize + cellGap
  const weeks = 53
  const days = 7
  return (
    <div className={cn("mx-auto w-fit animate-pulse space-y-3", className)}>
      <div className="flex gap-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="overflow-x-auto">
        <svg
          width={weeks * step - cellGap}
          height={16 + days * step - cellGap}
          className="overflow-visible"
        >
          {Array.from({ length: weeks }).map((_, wi) =>
            Array.from({ length: days }).map((_, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * step}
                y={16 + di * step}
                width={cellSize}
                height={cellSize}
                rx={cellSize * 0.2}
                className="fill-muted"
              />
            )),
          )}
        </svg>
      </div>
    </div>
  )
}

export const GithubCalendar = memo(function GithubCalendar({
  username,
  data: dataProp,
  startDate,
  endDate,
  startsOnSunday = true,
  cellSize = 12,
  cellGap = 3,
  cellShape = "rounded",
  theme = "vsop",
  showMonthLabels = true,
  showWeekdayLabels = true,
  showStats = true,
  showLegend = true,
  statsLabel,
  className,
}: GithubCalendarProps) {
  useId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.body.classList.contains("dark"),
      )
    }

    checkDark()

    const observer = new MutationObserver(checkDark)
    const opts = { attributes: true, attributeFilter: ["class"] }
    observer.observe(document.documentElement, opts)
    observer.observe(document.body, opts)

    return () => observer.disconnect()
  }, [])

  const [fetchedData, setFetchedData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(!!username)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) {
      setLoading(false)
      return
    }
    setFetchedData(null)
    setFetchError(null)
    setLoading(true)

    fetchContributions(username)
      .then((d) => setFetchedData(d))
      .catch((e) =>
        setFetchError(e instanceof Error ? e.message : String(e)),
      )
      .finally(() => setLoading(false))
  }, [username])

  const data: ContributionData = dataProp ?? fetchedData ?? {}

  const resolvedEnd = endDate ?? formatDate(new Date())
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate
    const d = parseDate(resolvedEnd)
    d.setFullYear(d.getFullYear() - 1)
    d.setDate(d.getDate() + 1)
    return formatDate(d)
  }, [startDate, resolvedEnd])

  const lightColors: ThemeColors =
    typeof theme === "object" ? theme : (THEMES[theme] ?? THEMES.vsop!)
  const darkColors: ThemeColors =
    typeof theme === "object"
      ? theme
      : (DARK_THEMES[theme] ?? DARK_THEMES.vsop!)

  const activeColors = isDark ? darkColors : lightColors

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    date: "",
    count: undefined,
    label: undefined,
    x: 0,
    y: 0,
  })

  const { weeks, monthLabels, gridStart } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, startsOnSunday),
    [resolvedStart, resolvedEnd, startsOnSunday],
  )

  const stats = useMemo(() => {
    const entries = Object.entries(data)
    const total = entries.reduce(
      (sum, [, v]) => sum + (v.count ?? (v.level > 0 ? 1 : 0)),
      0,
    )
    const activeDays = entries.filter(([, v]) => v.level > 0).length
    const maxStreak = (() => {
      let max = 0
      let cur = 0
      const sorted = entries
        .filter(([, v]) => v.level > 0)
        .map(([d]) => d)
        .sort()
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
          cur = 1
          max = 1
          continue
        }
        const prev = parseDate(sorted[i - 1]!)
        const curr = parseDate(sorted[i]!)
        const diff = (curr.getTime() - prev.getTime()) / 86400000
        if (diff === 1) {
          cur++
          max = Math.max(max, cur)
        } else cur = 1
      }
      return max
    })()
    return { total, activeDays, maxStreak }
  }, [data])

  const step = cellSize + cellGap
  const monthLabelHeight = showMonthLabels ? 20 : 0
  const svgWidth = weeks.length * step - cellGap
  const svgHeight = monthLabelHeight + 7 * step - cellGap

  // GitHub-style sparse weekday labels (Mon / Wed / Fri)
  const weekdayLabels = useMemo(() => {
    // Sunday start: Sun=0 Mon=1 Tue=2 Wed=3 Thu=4 Fri=5 Sat=6
    // Monday start: Mon=0 Tue=1 Wed=2 Thu=3 Fri=4 Sat=5 Sun=6
    return startsOnSunday
      ? [
          { label: "Mon", row: 1 },
          { label: "Wed", row: 3 },
          { label: "Fri", row: 5 },
        ]
      : [
          { label: "Mon", row: 0 },
          { label: "Wed", row: 2 },
          { label: "Fri", row: 4 },
        ]
  }, [startsOnSunday])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [fetchedData, dataProp, weeks.length])

  if (loading) {
    return (
      <CalendarSkeleton
        cellSize={cellSize}
        cellGap={cellGap}
        className={className}
      />
    )
  }

  if (fetchError) {
    return (
      <div
        className={cn(
          "mx-auto flex w-fit items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
          className,
        )}
      >
        {fetchError}
      </div>
    )
  }

  const cellRx = cellShape === "circle" ? cellSize / 2 : cellSize * 0.2

  return (
    <div
      className={cn(
        "w-full overflow-x-hidden rounded-xl border border-border/50 bg-card/40",
        className,
      )}
    >
      <div className="mx-auto flex w-fit max-w-full flex-col gap-3 p-3">
        <div className="flex max-w-full items-start gap-1 sm:gap-1.5">
          {showWeekdayLabels ? (
            <div
              className="relative shrink-0 select-none"
              style={{ width: 22, height: svgHeight }}
              aria-hidden
            >
              {weekdayLabels.map(({ label, row }) => (
                <span
                  key={label}
                  className="absolute right-0 text-[8px] font-medium leading-none tracking-wide text-muted-foreground sm:text-[9px]"
                  style={{
                    top: monthLabelHeight + row * step + cellSize / 2,
                    transform: "translateY(-50%)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}

          <div
            ref={scrollRef}
            className="relative min-w-0 flex-1 overflow-x-auto"
            style={
              {
                scrollbarWidth: "thin",
              } as CSSProperties
            }
          >
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="overflow-visible"
            >
              {showMonthLabels &&
                (() => {
                  const byWeek = new Map<number, string>()
                  monthLabels.forEach(({ label, weekIndex }) =>
                    byWeek.set(weekIndex, label),
                  )
                  return Array.from(byWeek.entries()).map(
                    ([weekIndex, label]) => (
                      <text
                        key={`${label}-${weekIndex}`}
                        x={weekIndex * step}
                        y={10}
                        fontSize={11}
                        fill={isDark ? "#a1a1aa" : "#71717a"}
                        fontFamily="inherit"
                      >
                        {label}
                      </text>
                    ),
                  )
                })()}

              {weeks.map((week, wi) =>
                week.map((date, di) => {
                  const entry = date ? data[date] : undefined
                  const level: ContributionLevel = entry?.level ?? 0
                  const cellCenterX = wi * step + cellSize / 2
                  const cellTopY = monthLabelHeight + di * step

                  if (!date) {
                    const cellDate = formatDate(
                      addDays(parseDate(gridStart), wi * 7 + di),
                    )
                    if (cellDate > resolvedEnd) return null
                  }

                  return (
                    <rect
                      key={`${wi}-${di}`}
                      x={wi * step}
                      y={cellTopY}
                      width={cellSize}
                      height={cellSize}
                      rx={cellRx}
                      fill={
                        activeColors[`level${level}` as keyof ThemeColors]
                      }
                      className={date ? "cursor-default" : undefined}
                      style={{ transition: "opacity 0.1s" }}
                      onMouseEnter={() => {
                        if (!date) return
                        setTooltip({
                          visible: true,
                          date,
                          count: entry?.count,
                          label: entry?.label,
                          x: cellCenterX,
                          y: cellTopY,
                        })
                      }}
                      onMouseLeave={() =>
                        setTooltip((t) => ({ ...t, visible: false }))
                      }
                    />
                  )
                }),
              )}
            </svg>

            {tooltip.visible ? (
              <TooltipProvider>
                <Tooltip open>
                  <TooltipTrigger asChild>
                    <div
                      className="pointer-events-none absolute z-50"
                      style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        width: 1,
                        height: 1,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[16rem] text-xs">
                    <div className="font-medium leading-snug">
                      {formatContributionTooltip(
                        tooltip.date,
                        tooltip.count,
                        tooltip.label,
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}
          </div>
        </div>

        <div className="flex items-start justify-between gap-x-4">
          {showLegend ? (
            <div className="mt-0.5 flex shrink-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>Less</span>
              {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                <svg key={level} width={cellSize} height={cellSize}>
                  <rect
                    width={cellSize}
                    height={cellSize}
                    rx={cellRx}
                    fill={activeColors[`level${level}`]}
                  />
                </svg>
              ))}
              <span>More</span>
            </div>
          ) : null}

          {showStats ? (
            <div className="ml-auto flex flex-1 flex-wrap justify-end gap-x-1 text-sm text-muted-foreground">
              {statsLabel ? (
                <>
                  <span className="font-semibold tabular-nums text-foreground">
                    {stats.total.toLocaleString()}
                  </span>
                  <span>{statsLabel}</span>
                </>
              ) : (
                <>
                  {username ? (
                    <span className="font-semibold text-foreground">
                      @{username}
                    </span>
                  ) : null}
                  <span>contributed</span>
                  <span className="font-semibold tabular-nums text-foreground">
                    {stats.total.toLocaleString()}
                  </span>
                  <span>this year on</span>
                  {username ? (
                    <a
                      href={`https://github.com/${username}`}
                      className="font-medium text-foreground underline"
                    >
                      GitHub
                    </a>
                  ) : (
                    <span>VSOP</span>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
})

GithubCalendar.displayName = "GithubCalendar"

/** Map a raw daily count into a 0–4 heat level (VSOP scale). */
export function contributionLevelFromCount(count: number): ContributionLevel {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}
