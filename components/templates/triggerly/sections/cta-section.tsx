import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            Automate the busywork. Ship the work that matters.
          </h2>
          <div className="flex items-center gap-3">
            <Button variant="outline">Contact sales</Button>
            <Button>Get started</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
