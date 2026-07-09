import { Suspense } from "react";
import { SubmitForm } from "@/components/vsop/submit/submit-form";
import { Skeleton } from "@/components/ui/skeleton";

function SubmitFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<SubmitFallback />}>
      <SubmitForm />
    </Suspense>
  );
}
