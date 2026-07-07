"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      offset={16}
      mobileOffset={12}
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-400" />,
        info: <InfoIcon className="size-4 text-indigo-300" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-red-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-muted-foreground" />,
      }}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "vsop-toast group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:border-border/60 group-[.toaster]:bg-card/95 group-[.toaster]:text-foreground group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-md",
          title: "group-[.toast]:text-sm group-[.toast]:font-medium",
          description:
            "group-[.toast]:text-xs group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:rounded-lg group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:rounded-lg group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:rounded-lg group-[.toast]:border-border/50 group-[.toast]:bg-muted/50 group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:border-emerald-500/20 group-[.toaster]:bg-emerald-500/5",
          error:
            "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive/5",
          info: "group-[.toaster]:border-indigo-500/20 group-[.toaster]:bg-indigo-500/5",
          warning:
            "group-[.toaster]:border-amber-500/20 group-[.toaster]:bg-amber-500/5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
