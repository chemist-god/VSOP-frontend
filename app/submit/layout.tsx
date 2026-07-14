import type { Metadata } from "next";
import { VsopLogo } from "@/components/templates/triggerly/sections/logo";

export const metadata: Metadata = {
  title: "Report an issue — VeriTrack Support",
  description:
    "Submit a support ticket to the VeriTrack team for your client portal.",
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-background">
      <div className="hero-glow pointer-events-none opacity-50 sm:opacity-60" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-2xl flex-col px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-6 sm:pb-5">
        <header className="flex shrink-0 items-center justify-between gap-3 pb-4 sm:pb-5">
          <div
            className="inline-flex min-w-0 items-center"
            aria-label="VSOP support"
          >
            <VsopLogo size="md" className="max-w-[7.5rem] sm:max-w-[10rem]" />
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground sm:text-xs">
            Client intake
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
          <div className="flex min-h-full flex-col">{children}</div>
        </main>

        <footer className="shrink-0 border-t border-border/40 pt-3 text-center text-[11px] leading-relaxed text-muted-foreground sm:pt-4 sm:text-xs">
          Your issue is routed to the VeriTrack support team. This page is for
          support submissions only.
        </footer>
      </div>
    </div>
  );
}
