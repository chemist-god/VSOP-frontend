import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="relative min-h-dvh overflow-x-hidden bg-background">
      <div className="hero-glow opacity-50 sm:opacity-60" />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:py-8">
        <header className="mb-5 flex items-center justify-between gap-3 sm:mb-8 sm:gap-4">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center transition-opacity hover:opacity-80"
            aria-label="VSOP support"
          >
            <VsopLogo size="md" className="max-w-[7.5rem] sm:max-w-[10rem]" />
          </Link>
          <span className="shrink-0 text-[11px] text-muted-foreground sm:text-xs">
            Client intake
          </span>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-8 border-t border-border/50 pt-5 text-center text-[11px] leading-relaxed text-muted-foreground sm:mt-10 sm:pt-6 sm:text-xs">
          Your issue is routed to the VeriTrack support team. Do not share
          internal dashboard links with clients.
        </footer>
      </div>
    </div>
  );
}
