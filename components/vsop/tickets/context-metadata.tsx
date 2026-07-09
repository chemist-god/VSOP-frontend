"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContextMetadata({
  browserInfo,
}: {
  browserInfo: Record<string, unknown> | null;
}) {
  const [showRaw, setShowRaw] = useState(false);

  if (!browserInfo || Object.keys(browserInfo).length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No browser context captured.</p>
    );
  }

  const preferredKeys = [
    "page_url",
    "pageUrl",
    "user_agent",
    "userAgent",
    "staff_id",
    "staffId",
    "last_error",
    "lastError",
  ];

  const entries = preferredKeys
    .map((key) => {
      const value = browserInfo[key];
      if (value === undefined || value === null || value === "") return null;
      return { key, value: String(value) };
    })
    .filter(Boolean) as Array<{ key: string; value: string }>;

  return (
    <div className="space-y-3">
      {entries.length > 0 ? (
        <dl className="grid gap-2 sm:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.key}
              className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
            >
              <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {entry.key.replaceAll("_", " ")}
              </dt>
              <dd className="mt-1 break-all text-sm text-foreground">
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <Button
        variant="ghost"
        size="sm"
        className="px-0 text-muted-foreground hover:text-foreground"
        onClick={() => setShowRaw((current) => !current)}
      >
        {showRaw ? <ChevronUp /> : <ChevronDown />}
        {showRaw ? "Hide raw JSON" : "Show raw JSON"}
      </Button>

      {showRaw ? (
        <pre className="overflow-x-auto rounded-lg border border-border/50 bg-background p-3 text-xs text-muted-foreground">
          {JSON.stringify(browserInfo, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
