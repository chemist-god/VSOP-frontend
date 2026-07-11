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
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="hero-glow opacity-60" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center transition-opacity hover:opacity-80"
            aria-label="VSOP support"
          >
            <VsopLogo size="md" className="max-w-[8.5rem] sm:max-w-[10rem]" />
          </Link>
          <span className="text-xs text-muted-foreground">Client intake</span>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="mt-10 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
          Your issue is routed to the VeriTrack support team. Do not share
          internal dashboard links with clients.
        </footer>
      </div>
    </div>
  );
}
