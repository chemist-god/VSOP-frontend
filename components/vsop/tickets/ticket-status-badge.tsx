import { cva, type VariantProps } from "class-variance-authority";
import type { TicketStatus } from "@/lib/types/tickets";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusVariants = cva("", {
  variants: {
    status: {
      OPEN: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      IN_PROGRESS: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      PENDING_REVIEW: "border-violet-500/30 bg-violet-500/10 text-violet-300",
      RESOLVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      CLOSED: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
    },
  },
});

export function TicketStatusBadge({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  const label = status.replaceAll("_", " ");

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        statusVariants({ status }),
        className,
      )}
    >
      {label}
    </Badge>
  );
}
