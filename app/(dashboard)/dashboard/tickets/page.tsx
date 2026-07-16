import { Suspense } from "react";
import { TicketsView } from "@/components/vsop/tickets/tickets-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function TicketsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <TicketsView />
    </Suspense>
  );
}
