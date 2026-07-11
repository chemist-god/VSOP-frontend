import Link from "next/link";
import { VsopLogo } from "./logo";
import { ThemeToggle } from "@/components/vsop/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="w-full flex justify-center px-6 py-3.5">
        <div className="w-full max-w-4xl flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center"
            aria-label="VSOP home"
          >
            <VsopLogo size="md" priority className="max-w-[8.5rem] sm:max-w-[10rem]" />
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeToggle className="size-8 rounded-lg" />
            <Button asChild size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
