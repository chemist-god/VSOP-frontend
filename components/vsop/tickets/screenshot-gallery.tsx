"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ScreenshotGallery({ urls }: { urls: string[] }) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  if (urls.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No screenshots attached.</p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {urls.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setActiveUrl(url)}
            className="group relative aspect-video overflow-hidden rounded-lg border border-border/50 bg-muted/20"
          >
            <img
              src={url}
              alt={`Screenshot ${index + 1}`}
              className="size-full object-cover transition-transform group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <Dialog open={Boolean(activeUrl)} onOpenChange={() => setActiveUrl(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Screenshot preview</DialogTitle>
          </DialogHeader>
          {activeUrl ? (
            <img
              src={activeUrl}
              alt="Screenshot full size"
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
