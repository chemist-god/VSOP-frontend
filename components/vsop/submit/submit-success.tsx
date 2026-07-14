"use client";

import { useState } from "react";
import { Check, CheckCircle2, Copy } from "lucide-react";
import { toastSuccess } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SubmitSuccessProps = {
  companyName: string;
  referenceId: string;
  onSubmitAnother?: () => void;
};

export function SubmitSuccess({
  companyName,
  referenceId,
  onSubmitAnother,
}: SubmitSuccessProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(referenceId);
    setCopied(true);
    toastSuccess("Reference copied");
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-1 py-4">
      <section
        className={cn(
          "w-full max-w-[22rem] rounded-[1.75rem] border border-border/40 bg-card/85 px-6 py-8 text-center",
          "shadow-[0_24px_60px_-36px_rgba(0,0,0,0.65)] backdrop-blur-md sm:px-8 sm:py-10",
        )}
        aria-live="polite"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/15">
          <CheckCircle2 className="size-6" strokeWidth={1.75} />
        </div>

        <Badge
          variant="secondary"
          className="mt-5 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
        >
          {companyName}
        </Badge>

        <h1 className="mt-3 text-[1.25rem] font-semibold tracking-tight text-foreground sm:text-[1.4rem]">
          Issue submitted
        </h1>
        <p className="mx-auto mt-2 max-w-[16.5rem] text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          Thanks — your report for{" "}
          <span className="font-medium text-foreground/90">{companyName}</span>{" "}
          is with support now.
        </p>

        <div className="mx-auto mt-6 flex max-w-full items-center justify-center gap-1.5">
          <code className="truncate font-mono text-[11px] tracking-tight text-muted-foreground/90">
            {referenceId}
          </code>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={copied ? "Copied" : "Copy reference"}
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-md",
                    "text-muted-foreground/70 transition-colors",
                    "hover:bg-foreground/[0.06] hover:text-foreground",
                    "active:scale-95",
                    copied && "text-emerald-400 hover:text-emerald-400",
                  )}
                >
                  {copied ? (
                    <Check className="size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {copied ? "Copied" : "Copy reference"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground/80">
          You can close this page.
        </p>

        {onSubmitAnother ? (
          <button
            type="button"
            onClick={onSubmitAnother}
            className="mt-4 text-[11px] font-medium text-muted-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Submit another issue
          </button>
        ) : null}
      </section>
    </div>
  );
}
