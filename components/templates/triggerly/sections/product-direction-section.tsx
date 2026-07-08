import { ChevronRight } from "lucide-react"

export function ProductDirectionSection() {
  return (
    <section className="relative py-40 px-6 md:px-12 lg:px-24 bg-background">
      <div className="gradient-overlay-top" />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground text-sm">Scheduling & monitoring</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </div>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground mb-8 max-w-3xl">
          Run workflows on your schedule
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mb-16">
          <span className="text-foreground font-medium">Trigger on a schedule, a webhook, or an event.</span> Watch every execution in real time and debug failures instantly.
        </p>

        <div className="relative w-full mb-16 timeline-stage">
          <div className="relative timeline-transform">
            <div className="relative h-[400px]">
              <div className="absolute w-[1px] timeline-dash"
                style={{ left: "55%", top: "-100px" }}
              />
              <div className="absolute top-0 left-0 right-0 flex items-end">
                <div className="flex items-end gap-[3px] absolute bottom-0 left-[5%] right-0">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="bg-muted-foreground/30" style={{ width: "1px", height: i % 7 === 0 ? "16px" : "8px" }} />
                  ))}
                </div>
              </div>
              <div className="absolute text-muted-foreground text-sm" style={{ left: "8%", top: "80px" }}>12:00</div>
              <div className="absolute text-muted-foreground text-sm" style={{ left: "18%", top: "55px" }}>12:05</div>
              <div className="absolute text-muted-foreground text-sm" style={{ left: "32%", top: "35px" }}>12:10</div>
              <div className="absolute text-muted-foreground text-sm" style={{ left: "48%", top: "15px" }}>12:15</div>
              <div className="absolute timeline-label" style={{ left: "58%", top: "-10px" }}>12:20</div>
              <div className="absolute text-muted-foreground text-sm" style={{ left: "70%", top: "-5px" }}>12:25</div>
              <div className="absolute text-muted-foreground/50 text-sm" style={{ left: "88%", top: "-25px" }}>12:30</div>

              <div className="absolute rounded-lg bg-muted/90 border border-secondary/50 px-4 py-3 flex items-center gap-3"
                style={{ left: "5%", top: "100px", width: "45%", height: "48px" }}>
                <div className="w-4 h-4 rotate-45 bg-emerald-500/60" />
                <span className="text-card-foreground text-sm font-medium">Slack trigger fired</span>
                <div className="absolute right-3 flex items-center gap-1">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Success</span>
                </div>
              </div>
              <div className="absolute rounded-lg bg-muted/70 border border-secondary/40 px-4 py-3 flex items-center gap-3"
                style={{ left: "15%", top: "155px", width: "25%", height: "44px" }}>
                <div className="w-3 h-3 rotate-45 bg-emerald-500/60" />
                <span className="text-muted-foreground text-sm">Filter passed</span>
              </div>
              <div className="absolute rounded-lg bg-muted/90 border border-secondary/50 px-4 py-3 flex items-center justify-between"
                style={{ left: "45%", top: "155px", width: "45%", height: "48px" }}>
                <span className="text-muted-foreground text-sm">GitHub create issue</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rotate-45 bg-emerald-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-emerald-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-emerald-500/60" />
                </div>
              </div>
              <div className="absolute rounded-lg bg-muted/70 border border-secondary/40 px-4 py-3 flex items-center justify-between"
                style={{ left: "35%", top: "240px", width: "28%", height: "48px" }}>
                <span className="text-muted-foreground text-sm">Notion add page</span>
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 rotate-45 bg-emerald-500/60" />
                  <div className="w-2.5 h-2.5 rotate-45 bg-emerald-500/60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="border-t border-r border-b border-border pt-10 pr-10 pb-16">
            <h3 className="text-xl font-medium text-foreground/90 mb-3">Execution history</h3>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">Browse past runs, filter by status or trigger, and drill into any execution to see per-node timing and output.</p>
            <div className="rounded-xl border border-border bg-card/50 p-5">
              <h4 className="text-lg font-medium text-foreground/90 mb-5">Recent runs</h4>
              <div className="space-y-2">
                {[
                  { id: "RUN-2041", status: "Success", statusColor: "bg-emerald-500", time: "2s ago" },
                  { id: "RUN-2040", status: "Success", statusColor: "bg-emerald-500", time: "5m ago" },
                  { id: "RUN-2039", status: "Failed", statusColor: "bg-red-500", time: "12m ago" },
                  { id: "RUN-2038", status: "Success", statusColor: "bg-emerald-500", time: "15m ago" },
                ].map((run) => (
                  <div key={run.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${run.statusColor}`} />
                    <span className="text-card-foreground text-sm flex-1">{run.id}</span>
                    <span className="text-muted-foreground text-xs">{run.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-b border-border pt-10 pl-10 pb-16">
            <h3 className="text-xl font-medium text-foreground/90 mb-3">Run details</h3>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">Inspect every node in an execution. See inputs, outputs, timing, and error logs at a glance.</p>
            <div className="relative h-48">
              <div className="absolute rounded-lg bg-muted/40 border border-secondary/30 px-4 py-2" style={{ top: 0, left: "10%", width: "80%" }}>
                <span className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  Triggered by
                </span>
              </div>
              <div className="absolute rounded-lg bg-muted/60 border border-secondary/40 px-4 py-2" style={{ top: "30px", left: "5%", width: "85%" }}>
                <span className="flex items-center gap-2 text-muted-foreground text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70" />
                  Ran 3 nodes
                </span>
              </div>
              <div className="absolute rounded-xl bg-muted/90 border border-secondary/50 px-5 py-4" style={{ top: "60px", left: 0, width: "95%" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><svg className="w-3 h-3 text-emerald-500" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" /></svg></span>
                  <span className="text-emerald-500 font-medium text-sm">All nodes completed</span>
                </div>
                <p className="text-card-foreground text-sm mb-3">RUN-2041 completed in 1.2s</p>
                <span className="text-muted-foreground text-xs">Triggered 2s ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="8" /><polyline points="10 6 10 10 13 10" /></svg>
              <span className="text-foreground/90 font-medium">Cron schedules</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">Run workflows every minute, hour, or day.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v6l3 3" /><circle cx="10" cy="12" r="6" /></svg>
              <span className="text-foreground/90 font-medium">Webhooks</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">Trigger instantly from any external event.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3"><div className="w-4 h-4 rotate-45 bg-muted-foreground" /><span className="text-foreground/90 font-medium">Retry policies</span></div>
            <p className="text-muted-foreground text-sm leading-relaxed">Automatic retries with backoff on failure.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><rect x="2" y="10" width="3" height="8" rx="1" /><rect x="7" y="6" width="3" height="12" rx="1" /><rect x="12" y="8" width="3" height="10" rx="1" /><rect x="17" y="4" width="3" height="14" rx="1" /></svg>
              <span className="text-foreground/90 font-medium">Execution logs</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">Full history with per-node timing and output.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
