"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { toggleThemeWithTransition } from "@/lib/theme-transition";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ThemeToggleProps = {
  className?: string;
  /** `icon` = compact control; `row` = expanded sidebar with label */
  variant?: "icon" | "row";
  /** Show tooltip (useful when collapsed sidebar) */
  showTooltip?: boolean;
};

export function ThemeToggle({
  className,
  variant = "icon",
  showTooltip = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Light mode" : "Dark mode";

  function handleToggle() {
    toggleThemeWithTransition(resolvedTheme, setTheme);
  }

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size={variant === "row" ? "sm" : "icon-sm"}
        className={cn(
          "shrink-0 text-muted-foreground",
          variant === "row" && "h-auto w-full justify-start gap-2.5 rounded-xl px-2 py-2",
          variant === "icon" && "size-10 rounded-xl",
          className,
        )}
        aria-hidden
        disabled
      >
        <Sun className="size-4 opacity-0" />
        {variant === "row" ? (
          <span className="text-xs opacity-0">Theme</span>
        ) : null}
      </Button>
    );
  }

  const button = (
    <Button
      type="button"
      variant="ghost"
      size={variant === "row" ? "sm" : "icon-sm"}
      className={cn(
        "shrink-0 text-muted-foreground hover:text-foreground",
        variant === "row" &&
          "h-auto w-full justify-start gap-2.5 rounded-xl px-2 py-2 text-xs font-medium",
        variant === "icon" && "size-10 rounded-xl",
        className,
      )}
      aria-label={label}
      onClick={handleToggle}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {variant === "row" ? <span>{label}</span> : null}
    </Button>
  );

  if (!showTooltip || variant === "row") {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
