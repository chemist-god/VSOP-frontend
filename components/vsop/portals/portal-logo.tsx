"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PortalLogoProps = {
  companyName: string;
  logoUrl?: string | null;
  active?: boolean;
  className?: string;
  size?: "sm" | "md";
};

export function PortalLogo({
  companyName,
  logoUrl,
  active = true,
  className,
  size = "sm",
}: PortalLogoProps) {
  const [failed, setFailed] = useState(false);
  const dim = size === "md" ? "size-10" : "size-8";
  const showImage = Boolean(logoUrl) && !failed;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border",
        dim,
        active
          ? "border-border/50 bg-background/80"
          : "border-border/40 bg-muted/40 opacity-80",
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl!}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className={cn(
            "flex size-full items-center justify-center",
            active
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-muted/50 text-muted-foreground",
          )}
          aria-hidden
        >
          <Building2 className={size === "md" ? "size-4" : "size-3.5"} />
          <span className="sr-only">{companyName}</span>
        </span>
      )}
    </div>
  );
}
