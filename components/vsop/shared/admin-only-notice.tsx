import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export function AdminOnlyNotice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card className="border-border/50 bg-card/40">
        <CardContent className="flex items-start gap-3 py-6">
          <ShieldAlert className="mt-0.5 size-5 text-amber-400" />
          <div>
            <p className="font-medium">Admin access required</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account can work tickets in the inbox, but this section is
              reserved for VSOP administrators.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
