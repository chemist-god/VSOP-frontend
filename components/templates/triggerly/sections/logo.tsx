import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoIcon className="size-6 mt-0.5" />
      <span className="font-semibold tracking-tight text-foreground mt-1">
        VeriTrack
        <span className="opacity-45"> VSOP</span>
      </span>
    </span>
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn("size-6", className)}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VeriTrack VSOP"
    >
      <rect
        x="0.75"
        y="0.75"
        width="26.5"
        height="26.5"
        rx="5.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 9h12M8 14h8M8 19h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="20" cy="19" r="2.25" fill="currentColor" />
    </svg>
  );
};
