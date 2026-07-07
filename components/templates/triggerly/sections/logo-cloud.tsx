import * as motion from "motion/react-client"
import { Vercel } from "../svgs/vercel"
import { Linear } from "../svgs/linear"
import { Supabase } from "../svgs/supabase"
import { GitHub } from "../svgs/github"
import { Stripe } from "../svgs/stripe"
import { Slack } from "../svgs/slack"
import { Figma } from "../svgs/figma"
import { Notion } from "../svgs/notion"

const brands = [
  { name: "Vercel", icon: Vercel },
  { name: "Linear", icon: Linear },
  { name: "Supabase", icon: Supabase },
  { name: "GitHub", icon: GitHub },
  { name: "Stripe", icon: Stripe },
  { name: "Slack", icon: Slack },
  { name: "Figma", icon: Figma },
  { name: "Notion", icon: Notion },
]

export function LogoCloud() {
  return (
    <div className="relative z-20 pb-24 pt-8 bg-background">
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-4xl text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-lg text-card-foreground mb-2">Powering automation at fast-moving teams.</motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground mb-16">From indie teams to scaled enterprises.</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group cursor-pointer">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-10 items-center justify-items-center transition-all duration-300 group-hover:blur-[2.5px] group-hover:opacity-50">
              {brands.map((brand) => {
                const Icon = brand.icon
                return (
                  <div key={brand.name} className="text-foreground font-semibold text-xl flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {brand.name}
                  </div>
                )
              })}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="px-5 py-2.5 bg-muted/80 backdrop-blur-sm border border-secondary rounded-full text-sm text-card-foreground flex items-center gap-2">
                Meet our customers <span aria-hidden="true">›</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
