"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Copy, Terminal } from "lucide-react";
import { toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";

const FIELD_META: Array<{
  keys: string[];
  label: string;
  primary?: boolean;
}> = [
  { keys: ["page_url", "pageUrl"], label: "Page", primary: true },
  { keys: ["staff_id", "staffId"], label: "Staff ID" },
  { keys: ["last_error", "lastError"], label: "Last error" },
  { keys: ["user_agent", "userAgent"], label: "Device" },
];

function pickField(
  browserInfo: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = browserInfo[key];
    if (value === undefined || value === null || value === "") continue;
    return String(value);
  }
  return null;
}

function shortDevice(userAgent: string) {
  if (/iPhone|iPad/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Mac OS/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Browser";
}

export function ContextMetadata({
  browserInfo,
}: {
  browserInfo: Record<string, unknown> | null;
}) {
  const [open, setOpen] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fields = useMemo(() => {
    if (!browserInfo) return [];
    return FIELD_META.map((meta) => {
      const value = pickField(browserInfo, meta.keys);
      if (!value) return null;
      return {
        id: meta.keys[0],
        label: meta.label,
        value,
        primary: Boolean(meta.primary),
        display:
          meta.keys[0].includes("user_agent") || meta.keys[0].includes("userAgent")
            ? shortDevice(value)
            : value,
      };
    }).filter(Boolean) as Array<{
      id: string;
      label: string;
      value: string;
      primary: boolean;
      display: string;
    }>;
  }, [browserInfo]);

  if (!browserInfo || Object.keys(browserInfo).length === 0) {
    return null;
  }

  async function copyValue(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(id);
    toastSuccess("Copied");
    window.setTimeout(() => setCopiedKey(null), 1400);
  }

  const summary =
    fields.find((field) => field.primary)?.display ??
    fields[0]?.display ??
    "Technical details";

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-border/50 bg-card/40">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-muted/20 sm:px-4"
        aria-expanded={open}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background/50 text-muted-foreground">
          <Terminal className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">
            Technical details
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
            {open ? "Submission context for debugging" : summary}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="min-w-0 space-y-2 overflow-hidden border-t border-border/40 px-3.5 py-3 sm:px-4">
          {fields.length > 0 ? (
            <ul className="space-y-2">
              {fields.map((field) => (
                <li
                  key={field.id}
                  className="flex min-w-0 items-start gap-2 rounded-xl border border-border/40 bg-background/40 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {field.label}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm leading-snug text-foreground",
                        field.primary ? "break-all" : "truncate",
                      )}
                      title={field.value}
                    >
                      {field.display}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Copy ${field.label}`}
                    onClick={() => copyValue(field.id, field.value)}
                    className={cn(
                      "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg",
                      "text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
                      "active:scale-95",
                      copiedKey === field.id && "text-emerald-400",
                    )}
                  >
                    {copiedKey === field.id ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">
              No structured fields — open raw JSON below.
            </p>
          )}

          <button
            type="button"
            onClick={() => setShowRaw((current) => !current)}
            className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                showRaw && "rotate-180",
              )}
            />
            {showRaw ? "Hide raw JSON" : "Show raw JSON"}
          </button>

          {showRaw ? (
            <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-border/40 bg-background/60">
              <pre className="max-h-48 max-w-full overflow-y-auto overflow-x-hidden p-3 font-mono text-[11px] leading-relaxed break-all whitespace-pre-wrap text-muted-foreground">
                {JSON.stringify(browserInfo, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
