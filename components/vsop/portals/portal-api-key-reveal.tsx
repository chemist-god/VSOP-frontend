"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, X } from "lucide-react";
import { toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PortalApiKeyRevealData = {
  apiKey: string;
  companyName: string;
  slug: string;
  source: "registered" | "rotated";
};

type PortalApiKeyRevealProps = {
  data: PortalApiKeyRevealData;
  onDismiss: () => void;
};

export function PortalApiKeyReveal({
  data,
  onDismiss,
}: PortalApiKeyRevealProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(data.apiKey);
    setCopied(true);
    toastSuccess("API key copied", {
      description: `Saved for ${data.companyName}`,
    });
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-amber-500/25",
        "bg-gradient-to-br from-amber-500/[0.08] via-card/60 to-card/40",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
      )}
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
              <KeyRound className="size-4" />
            </div>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  {data.source === "registered"
                    ? "Portal registered"
                    : "API key rotated"}
                </h2>
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 text-[10px] font-medium uppercase tracking-wide text-amber-200"
                >
                  Copy once
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                This key belongs to{" "}
                <span className="font-medium text-foreground">
                  {data.companyName}
                </span>
                . Store it securely — it won’t be shown again.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss API key"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-background/40 px-3 py-2.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Portal
          </span>
          <span className="text-sm font-medium text-foreground">
            {data.companyName}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <code className="rounded-md bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {data.slug}
          </code>
        </div>

        <div className="space-y-2">
          <LabelRow />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <code
              className={cn(
                "min-w-0 flex-1 break-all rounded-xl border border-border/60",
                "bg-background/70 px-3.5 py-3 font-mono text-[12px] leading-relaxed",
                "text-foreground selection:bg-amber-500/20",
              )}
            >
              {data.apiKey}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "h-auto shrink-0 rounded-xl px-4 sm:min-w-28",
                copied &&
                  "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15 hover:text-emerald-300",
              )}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy key
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LabelRow() {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium text-muted-foreground">Intake API key</p>
      <p className="text-[11px] text-amber-200/80">Shown only once</p>
    </div>
  );
}
