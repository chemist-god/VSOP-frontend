import { Suspense } from "react";
import { PortalsView } from "@/components/vsop/portals/portals-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function PortalsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <PortalsView />
    </Suspense>
  );
}
