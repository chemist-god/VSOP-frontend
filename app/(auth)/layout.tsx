import Link from "next/link";
import { LogoIcon } from "@/components/templates/triggerly/sections/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="hero-glow opacity-70" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex justify-center px-6 py-6 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
          >
            <LogoIcon />
            VeriTrack VSOP
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
