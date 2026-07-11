"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** Dark wordmark — use on light surfaces */
const LOGO_FOR_LIGHT_UI = "/images/logo/vsop-logo-black.png";
/** Light wordmark — use on dark surfaces */
const LOGO_FOR_DARK_UI = "/images/logo/vsop-logo-light.png";

/**
 * Responsive logo presets (height-driven; width follows aspect).
 * `icon` crops to the blue circle + V for collapsed rails.
 */
export const vsopLogoSizes = {
  icon: {
    height: 36,
    width: 36,
    className: "size-9",
  },
  sm: {
    height: 28,
    width: 52,
    className: "h-7 w-auto max-w-[7.5rem]",
  },
  md: {
    height: 34,
    width: 64,
    className: "h-8 w-auto max-w-[9rem] sm:h-9 sm:max-w-[10rem]",
  },
  lg: {
    height: 42,
    width: 78,
    className: "h-9 w-auto max-w-[11rem] sm:h-10 sm:max-w-[12.5rem]",
  },
  xl: {
    height: 52,
    width: 96,
    className: "h-11 w-auto max-w-[13rem] sm:h-12 sm:max-w-[15rem]",
  },
} as const;

export type VsopLogoSize = keyof typeof vsopLogoSizes;

type VsopLogoProps = {
  size?: VsopLogoSize;
  className?: string;
  priority?: boolean;
  /** Accessible name */
  alt?: string;
};

function useLogoSrc() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default dark UI (app default) until hydrated
  const isDark = !mounted || resolvedTheme !== "light";
  return isDark ? LOGO_FOR_DARK_UI : LOGO_FOR_LIGHT_UI;
}

/**
 * Full VSOP wordmark (circle + Vsop text), theme-aware.
 */
export function VsopLogo({
  size = "md",
  className,
  priority = false,
  alt = "VSOP",
}: VsopLogoProps) {
  const src = useLogoSrc();
  const preset = vsopLogoSizes[size];

  if (size === "icon") {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full bg-transparent",
          preset.className,
          className,
        )}
        aria-label={alt}
      >
        <Image
          src={src}
          alt={alt}
          width={1080}
          height={582}
          priority={priority}
          className="pointer-events-none absolute inset-0 size-[175%] max-w-none select-none object-cover object-[22%_48%]"
        />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={preset.width * 8}
      height={preset.height * 8}
      priority={priority}
      className={cn(
        "pointer-events-none select-none object-contain object-left",
        preset.className,
        className,
      )}
    />
  );
}

/** Compact circle mark — collapsed sidebar / tight headers */
export function LogoIcon({ className }: { className?: string }) {
  return <VsopLogo size="icon" className={className} />;
}

/** Wordmark + optional label for marketing surfaces */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <VsopLogo size="md" priority />
    </span>
  );
}
