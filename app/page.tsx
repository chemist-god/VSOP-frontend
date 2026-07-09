import { Navbar } from "@/components/templates/triggerly/sections/navbar";
import { Hero } from "@/components/templates/triggerly/sections/hero";

export default function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden bg-background">
      <Navbar />
      <Hero />
      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        VeriTrack VSOP · Internal support operations ·{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}
