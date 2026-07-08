import * as motion from "motion/react-client"
import { ChevronRight, Plus } from "lucide-react"
import { Slack } from "../svgs/slack"
import { GitHub } from "../svgs/github"
import { Stripe } from "../svgs/stripe"
import { Notion } from "../svgs/notion"
import { Figma } from "../svgs/figma"
import { Supabase } from "../svgs/supabase"

const featureCards = [
  {
    title: "Visual node editor",
    illustration: <NodeEditorIllustration />,
  },
  {
    title: "Connect any app",
    illustration: <ConnectAppsIllustration />,
  },
  {
    title: "Branching & logic",
    illustration: <BranchingIllustration />,
  },
]

function NodeEditorIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
      <svg width="100%" height="100%" viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-full">
        <defs>
          <pattern id="node-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="360" height="300" fill="url(#node-grid)" />
        <path d="M120 110 C 165 110, 165 150, 210 150" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M250 150 C 250 190, 150 190, 150 210" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <g>
          <rect x="30" y="80" width="90" height="46" rx="8" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.45)" strokeWidth="1" />
          <circle cx="48" cy="103" r="6" fill="rgba(245,158,11,0.2)" />
          <path d="M45 100 L45 106 M42 103 L48 103" stroke="rgba(245,158,11,0.9)" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="62" y="93" width="48" height="7" rx="2" fill="white" fillOpacity="0.5" />
          <rect x="62" y="105" width="34" height="5" rx="2" fill="white" fillOpacity="0.22" />
        </g>
        <g>
          <rect x="210" y="125" width="90" height="50" rx="8" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.7)" strokeWidth="1.2" />
          <rect x="210" y="125" width="90" height="50" rx="8" stroke="rgba(59,130,246,0.25)" strokeWidth="4" />
          <rect x="226" y="139" width="12" height="12" rx="3" fill="rgba(59,130,246,0.25)" />
          <path d="M230 143 L230 147 M228 145 L232 145" stroke="rgba(147,197,253,1)" strokeWidth="1" strokeLinecap="round" />
          <rect x="246" y="139" width="42" height="7" rx="2" fill="white" fillOpacity="0.55" />
          <rect x="246" y="151" width="30" height="5" rx="2" fill="white" fillOpacity="0.22" />
        </g>
        <g>
          <rect x="105" y="210" width="90" height="46" rx="8" fill="rgba(255,255,255,0.03)" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
          <rect x="121" y="223" width="12" height="12" rx="3" fill="white" fillOpacity="0.12" />
          <rect x="141" y="226" width="42" height="7" rx="2" fill="white" fillOpacity="0.4" />
          <rect x="141" y="238" width="30" height="5" rx="2" fill="white" fillOpacity="0.18" />
        </g>
      </svg>
    </div>
  )
}

function ConnectAppsIllustration() {
  const apps = [
    { Icon: Slack, angle: -90 },
    { Icon: GitHub, angle: -30 },
    { Icon: Stripe, angle: 30 },
    { Icon: Notion, angle: 90 },
    { Icon: Figma, angle: 150 },
    { Icon: Supabase, angle: 210 },
  ]
  const cx = 180, cy = 150, r = 95
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-full">
        {apps.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180
          const x = cx + r * Math.cos(rad)
          const y = cy + r * Math.sin(rad)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="white" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 4" />
        })}
        {apps.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180
          const x = cx + r * Math.cos(rad)
          const y = cy + r * Math.sin(rad)
          return (
            <g key={i} transform={`translate(${x - 18} ${y - 18})`}>
              <rect width="36" height="36" rx="9" fill="rgba(255,255,255,0.04)" stroke="white" strokeOpacity="0.16" strokeWidth="1" />
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r="34" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.5)" strokeWidth="1.2" />
        <circle cx={cx} cy={cy} r="34" stroke="rgba(59,130,246,0.2)" strokeWidth="4" fill="none" />
        <path d={`M${cx - 9} ${cy} L${cx - 3} ${cy + 7} L${cx + 9} ${cy - 7}`} stroke="rgba(147,197,253,1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {apps.map((a, i) => {
            const rad = (a.angle * Math.PI) / 180
            const x = cx + r * Math.cos(rad)
            const y = cy + r * Math.sin(rad)
            return (
              <div key={i} className="absolute" style={{ left: `${(x / 360) * 100}%`, top: `${(y / 300) * 100}%`, transform: "translate(-50%, -50%)" }}>
                <a.Icon className="w-4 h-4 opacity-70" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BranchingIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 360 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-full">
        <path d="M180 88 L90 170 C 90 190, 90 210, 90 215" stroke="rgba(52,211,153,0.45)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M180 88 L270 170 C 270 190, 270 210, 270 215" stroke="white" strokeOpacity="0.22" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="4 4" />
        <rect x="48" y="138" width="54" height="14" rx="3" fill="rgba(52,211,153,0.08)" />
        <rect x="54" y="142" width="42" height="6" rx="2" fill="rgba(52,211,153,0.7)" />
        <rect x="258" y="138" width="54" height="14" rx="3" fill="rgba(255,255,255,0.03)" />
        <rect x="266" y="142" width="38" height="6" rx="2" fill="white" fillOpacity="0.4" />
        <path d="M180 40 L216 64 L180 88 L144 64 Z" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.6)" strokeWidth="1.2" />
        <rect x="166" y="58" width="28" height="7" rx="2" fill="rgba(147,197,253,0.9)" />
        <rect x="173" y="68" width="14" height="5" rx="2" fill="rgba(147,197,253,0.5)" />
        <rect x="45" y="215" width="90" height="46" rx="8" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.35)" strokeWidth="1" />
        <rect x="61" y="228" width="12" height="12" rx="3" fill="rgba(52,211,153,0.2)" />
        <path d="M65 234 L67.5 236.5 L71 232" stroke="rgba(52,211,153,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="81" y="231" width="42" height="7" rx="2" fill="white" fillOpacity="0.45" />
        <rect x="81" y="243" width="30" height="5" rx="2" fill="white" fillOpacity="0.18" />
        <rect x="225" y="215" width="90" height="46" rx="8" fill="rgba(255,255,255,0.03)" stroke="white" strokeOpacity="0.16" strokeWidth="1" />
        <rect x="241" y="228" width="12" height="12" rx="3" fill="white" fillOpacity="0.1" />
        <rect x="261" y="231" width="42" height="7" rx="2" fill="white" fillOpacity="0.4" />
        <rect x="261" y="243" width="30" height="5" rx="2" fill="white" fillOpacity="0.18" />
      </svg>
    </div>
  )
}

export function FeatureCardsSection() {
  return (
    <div className="relative z-20 py-40 bg-background">
      <div className="gradient-overlay-top" />
      <div className="w-full flex justify-center px-6">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-medium tracking-tight text-foreground max-w-md">
              Everything you need to automate
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-md">
              <p className="text-muted-foreground leading-relaxed">
                Triggerly is built around a drag-and-drop node editor, a growing library of app integrations, and the branching logic to handle any edge case.{" "}
                <a href="#" className="text-foreground inline-flex items-center gap-1 hover:underline">See how it works <ChevronRight className="w-4 h-4" /></a>
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-card/50 border border-border hover:border-muted transition-colors cursor-pointer group overflow-hidden relative flex flex-col justify-end feature-card">
                <div className="absolute top-0 left-0 w-full flex card-mask">
                  {card.illustration}
                </div>
                <div className="relative z-10 flex items-center justify-between w-full card-content">
                  <h3 className="text-foreground font-medium text-lg leading-tight">{card.title}</h3>
                  <div className="w-8 h-8 rounded-full border border-secondary flex items-center justify-center text-muted-foreground group-hover:border-card-foreground/40 group-hover:text-card-foreground transition-colors flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
