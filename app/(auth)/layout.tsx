import Link from "next/link";
import { VsopLogo } from "@/components/templates/triggerly/sections/logo";
import { ThemeToggle } from "@/components/vsop/shared/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="hero-glow opacity-70" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center transition-opacity hover:opacity-80"
            aria-label="VSOP home"
          >
            <VsopLogo size="lg" priority className="max-w-[9rem] sm:max-w-[11rem]" />
          </Link>
          <ThemeToggle className="size-8 rounded-lg" />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
