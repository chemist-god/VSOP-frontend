import Link from "next/link";
import { LogoIcon } from "./logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="w-full flex justify-center px-6 py-4">
        <div className="w-full max-w-4xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon />
            <span className="text-foreground font-semibold">VeriTrack VSOP</span>
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
