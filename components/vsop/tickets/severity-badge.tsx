import { cva } from "class-variance-authority";
import type { TicketSeverity } from "@/lib/types/tickets";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const severityVariants = cva("", {
  variants: {
    severity: {
      UNSET: "border-border/60 bg-muted/40 text-muted-foreground",
      CRITICAL: "border-red-500/30 bg-red-500/10 text-red-300",
      HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-300",
      MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      LOW: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    },
  },
});

export function SeverityBadge({
  severity,
  className,
}: {
  severity: TicketSeverity;
  className?: string;
}) {
  const label = severity === "UNSET" ? "Unset" : severity;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        severityVariants({ severity }),
        className,
      )}
    >
      {label}
    </Badge>
  );
}
