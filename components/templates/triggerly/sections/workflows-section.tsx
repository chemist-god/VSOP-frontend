"use client";

import { useState, Fragment } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Zap,
  GitBranch,
  Webhook,
  Clock,
  Code,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slack } from "../svgs/slack";
import { GitHub } from "../svgs/github";
import { Stripe } from "../svgs/stripe";
import { Notion } from "../svgs/notion";
import { Supabase } from "../svgs/supabase";
import { Figma } from "../svgs/figma";
import type React from "react";

const carouselCards = [
  {
    id: 1,
    category: "Messaging",
    title: "Slack message to Linear issue",
    mockup: "slack-linear",
  },
  {
    id: 2,
    category: "Payments",
    title: "Stripe payment to receipt and Notion",
    mockup: "stripe-notion",
  },
  {
    id: 3,
    category: "Code",
    title: "Pull request checks and notify",
    mockup: "github-notify",
  },
  {
    id: 4,
    category: "Forms",
    title: "Form submission to CRM and email",
    mockup: "form-crm",
  },
  {
    id: 5,
    category: "Data",
    title: "Scheduled database snapshot sync",
    mockup: "schedule-sync",
  },
  {
    id: 6,
    category: "Design",
    title: "Figma comment to task",
    mockup: "figma-task",
  },
  {
    id: 7,
    category: "Developer",
    title: "Build your own with the API",
    mockup: "api",
  },
];

function MiniFlow({
  nodes,
}: {
  nodes: { icon?: React.ElementType; label: string; color?: string }[];
}) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      {nodes.map((node, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-muted-foreground/50 text-xs">→</span>}
          <div className="flex items-center gap-1.5 bg-muted/60 rounded-md px-2 py-1.5">
            {node.icon && <node.icon className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className="text-xs text-card-foreground text-nowrap">
              {node.label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function CardMockup({ type }: { type: string }) {
  switch (type) {
    case "slack-linear":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: Slack, label: "New message" },
              { icon: GitBranch, label: "Filter" },
              { icon: GitHub, label: "Create issue" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-muted-foreground">When message in #ops</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-card-foreground">Runs in 1.2s</span>
            <span className="text-[10px] text-muted-foreground/50 ml-auto">•••</span>
          </div>
        </div>
      );
    case "stripe-notion":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: Stripe, label: "Payment" },
              { icon: GitBranch, label: "Branch" },
              { icon: MessageSquare, label: "Receipt" },
              { icon: Notion, label: "Log" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-muted-foreground">Successful payment</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-card-foreground">2 actions in parallel</span>
          </div>
        </div>
      );
    case "github-notify":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: GitHub, label: "PR opened" },
              { icon: GitBranch, label: "Checks" },
              { icon: Slack, label: "Notify" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-muted-foreground">Pull request opened</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-card-foreground">Runs on every PR</span>
          </div>
        </div>
      );
    case "form-crm":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: Webhook, label: "Form submit" },
              { icon: GitBranch, label: "Branch" },
              { icon: LayoutGrid, label: "Add to CRM" },
              { icon: MessageSquare, label: "Email" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-muted-foreground">Webhook received</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-card-foreground">4 steps, 2 parallel</span>
          </div>
        </div>
      );
    case "schedule-sync":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: Clock, label: "Cron" },
              { icon: Supabase, label: "Snapshot" },
              { icon: Webhook, label: "Sync" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
              Schedule
            </span>
            <span className="text-xs text-muted-foreground">Every 6 hours</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-card-foreground">Sequential execution</span>
          </div>
        </div>
      );
    case "figma-task":
      return (
        <div className="flex flex-col gap-3 p-4">
          <MiniFlow
            nodes={[
              { icon: Figma, label: "Comment" },
              { icon: GitBranch, label: "Filter" },
              { icon: GitHub, label: "Create task" },
            ]}
          />
          <div className="mt-2 flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
            <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">
              Trigger
            </span>
            <span className="text-xs text-muted-foreground">New comment added</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span className="text-xs text-card-foreground">Runs in 0.8s</span>
          </div>
        </div>
      );
    case "api":
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-muted/50 rounded-lg px-4 py-3 border border-secondary/50">
              <Code className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              POST /api/triggers
            </span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function WorkflowsSection() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollLeft = () => setScrollPosition(Math.max(0, scrollPosition - 1));
  const scrollRight = () =>
    setScrollPosition(Math.min(carouselCards.length - 4, scrollPosition + 1));

  return (
    <section className="relative py-24 bg-background">
      <div className="gradient-overlay-top" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
          <div className="lg:max-w-xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-sm text-muted-foreground">
                Templates & integrations
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground">
              Start from a template
            </h2>
          </div>
          <p className="text-muted-foreground lg:max-w-sm lg:pt-12">
            Pick a pre-built template, customize the nodes, and go live in
            minutes. No wiring from scratch.
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${scrollPosition * (100 / 4)}%)` }}
          >
            {carouselCards.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0 w-[calc(25%-12px)] min-w-[280px]"
              >
                <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden h-[340px] flex flex-col">
                  <div className="flex-1 relative overflow-hidden">
                    <CardMockup type={card.mockup} />
                    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none card-fade" />
                  </div>
                  <div className="p-4 border-t border-border/30">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">
                          {card.category}
                        </p>
                        <p className="text-sm text-foreground/90 leading-snug">
                          {card.title}
                        </p>
                      </div>
                      <Button variant="outline" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button variant="outline" size="icon" onClick={scrollLeft} disabled={scrollPosition === 0}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} disabled={scrollPosition >= carouselCards.length - 4}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
