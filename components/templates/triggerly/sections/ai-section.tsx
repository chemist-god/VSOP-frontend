import * as motion from "motion/react-client"
import { ChevronRight, Check, Zap, ArrowRight, Webhook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Stripe } from "../svgs/stripe"
import { Notion } from "../svgs/notion"
import { Slack } from "../svgs/slack"

const agentChips = [
  { label: "When new Stripe payment", selected: false, color: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
  { label: "Create invoice", selected: true, color: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
  { label: "Notify Slack", selected: false, color: "bg-violet-500/20 border-violet-500/40 text-violet-300" },
]

export function AISection() {
  return (
    <div className="relative z-20 py-40 bg-background">
      <div className="gradient-overlay-top" />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground text-sm">Artificial intelligence</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-medium tracking-tight text-foreground max-w-3xl mb-8">
            Describe a workflow. Triggerly builds it.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground max-w-md mb-8">
            <span className="text-foreground font-medium">Triggerly AI turns a plain-English description into a ready-to-run flow.</span> Say what you want to automate and let AI wire the nodes.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Button variant="outline" className="mb-16" asChild>
              <a href="#">Learn more <ChevronRight className="w-4 h-4" /></a>
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mb-24">
            <div className="mockup-wrapper">
              <div className="mockup-inner">
                <div className="mockup-overlay" />
                <div className="mockup-fade" />
                <div className="bg-muted/50 border border-secondary rounded-t-xl px-5 py-4">
                  <span className="text-muted-foreground italic">Describe your workflow...</span>
                </div>
                <div className="bg-card/80 border border-t-0 border-secondary rounded-b-xl py-1">
                  {agentChips.map((chip, index) => (
                    <div key={chip.label} style={chip.selected ? { transform: "scale(1.04) rotateX(17deg)", background: "linear-gradient(#343434 0%, #2d2d2d 100%)", borderRadius: "6px", height: "48px", position: "relative", boxShadow: "inset 0 -2.75px 4.75px rgba(255, 255, 255, 0.14), inset 0 -0.752px 0.752px rgba(255, 255, 255, 0.1), 0 54px 73px 3px rgba(0, 0, 0, 0.5)", zIndex: 20, marginLeft: "-12px", marginRight: "-12px" } : { opacity: 1 - index * 0.15, height: "42px" }}>
                      <div className="flex items-center justify-between h-full px-6 gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full border ${chip.color}`}>{chip.label}</span>
                        </div>
                        {chip.selected && <ArrowRight className="w-4 h-4 text-zinc-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="border-t border-r border-b border-border/60 pt-12 pr-12 pb-16">
                <h3 className="text-foreground/90 font-medium text-xl mb-3">AI-generated flows</h3>
                <p className="text-muted-foreground text-base mb-8">Describe what you need in plain English. Triggerly AI picks the right triggers, actions, and branches to build a working workflow.</p>
                <div className="bg-card/30 border border-border/60 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5L8 0Z" /></svg>
                    <span className="text-muted-foreground text-sm">Generated by <span className="text-card-foreground">Triggerly AI</span></span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-muted-foreground/50 text-sm w-20">Trigger</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <Zap className="w-3 h-3" /><Stripe className="w-3.5 h-3.5" /><span className="text-white">New payment</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-muted-foreground/50 text-sm w-20">Then</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 bg-muted/30 rounded-md px-2 py-1 text-sm text-emerald-400 border border-emerald-500/20">
                        <Check className="w-3 h-3" /> Create invoice
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-muted-foreground/50 text-sm w-20">Then</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 bg-muted/30 rounded-md px-2 py-1 text-sm text-muted-foreground/50">
                        <Slack className="w-3.5 h-3.5" /> Notify channel
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-4 ml-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 bg-violet-500/20 rounded-full flex items-center justify-center"><Zap className="w-3 h-3 text-violet-400" /></span>
                      <span className="text-card-foreground text-sm font-medium">3 nodes, 2 branches</span>
                    </div>
                    <p className="text-muted-foreground text-xs mb-4">AI suggestion confidence: 94%. Click to apply this flow to your workspace.</p>
                    <Button variant="secondary" className="w-full">
                      <Check className="w-4 h-4" /> Apply flow
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t border-b border-border/60 pt-12 pl-12 pb-16">
                <h3 className="text-foreground/90 font-medium text-xl mb-3">Webhooks & API</h3>
                <p className="text-muted-foreground text-base mb-8">Connect any external service with webhooks, or use the Triggerly API to trigger workflows from your own backend.</p>
                <div className="bg-card/30 border border-border/60 rounded-xl p-5 font-mono text-sm">
                  <p className="text-muted-foreground/50 mb-3">{'// POST /api/triggers/webhook'}</p>
                  <div className="space-y-1 mb-6">
                    <p><span className="text-orange-400/70">&quot;event&quot;</span><span className="text-zinc-500">: </span><span className="text-green-400/70">&quot;stripe.payment.created&quot;</span></p>
                    <p className="pl-4"><span className="text-orange-400/70">&quot;endpoint&quot;</span><span className="text-zinc-500">: </span><span className="text-green-400/70">&quot;https://hooks.triggerly.app/w/&quot;</span></p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-0.5 h-5 bg-muted-foreground/50" />
                      <span className="text-muted-foreground/50">Custom nodes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-full"><Webhook className="w-3.5 h-3.5" /> Webhook</Button>
                      <Button variant="outline" size="sm" className="rounded-full"><Notion className="w-3.5 h-3.5" /> Database</Button>
                      <Button variant="outline" size="sm" className="rounded-full"><Zap className="w-3.5 h-3.5" /> HTTP</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
