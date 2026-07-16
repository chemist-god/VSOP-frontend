import { Suspense } from "react";
import { TeamView } from "@/components/vsop/team/team-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <TeamView />
    </Suspense>
  );
}
