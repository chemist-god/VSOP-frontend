"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type ScreenshotUploaderProps = {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
};

export function ScreenshotUploader({
  files,
  onChange,
  disabled = false,
}: ScreenshotUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      for (const url of previews) URL.revokeObjectURL(url);
    };
  }, [previews]);

  function addFiles(incoming: FileList | File[]) {
    if (disabled) return;
    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (!file.type.startsWith("image/")) {
        toastError("Unsupported file", {
          description: "Please upload PNG or JPG screenshots only.",
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toastError("File too large", {
          description: "Each screenshot must be 5 MB or smaller.",
        });
        continue;
      }
      if (next.length >= MAX_FILES) {
        toastError("Limit reached", {
          description: `You can attach up to ${MAX_FILES} screenshots.`,
        });
        break;
      }
      next.push(file);
    }
    onChange(next.slice(0, MAX_FILES));
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
    if (previewIndex === index) setPreviewIndex(null);
    else if (previewIndex !== null && previewIndex > index) {
      setPreviewIndex(previewIndex - 1);
    }
  }

  const remaining = MAX_FILES - files.length;
  const canAdd = remaining > 0 && !disabled;

  return (
    <>
      <div
        className={cn(
          "rounded-2xl border border-dashed p-3 transition-colors sm:p-4",
          dragging
            ? "border-sidebar-primary/50 bg-sidebar-primary/5"
            : "border-border/70 bg-muted/10 hover:border-border hover:bg-muted/15",
          disabled && "pointer-events-none opacity-60",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files?.length) {
            addFiles(event.dataTransfer.files);
          }
        }}
      >
        {files.length === 0 ? (
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-3 rounded-xl px-3 py-8 text-center",
              "transition-colors active:bg-foreground/[0.03] sm:py-10",
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-background/70 text-muted-foreground sm:size-14">
              <ImagePlus className="size-5 sm:size-6" />
            </span>
            <span className="space-y-1">
              <span className="block text-sm font-medium text-foreground sm:text-[15px]">
                Tap to add screenshots
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                PNG or JPG · up to {MAX_FILES} · 5 MB each
              </span>
              <span className="mt-1 hidden text-[11px] text-muted-foreground/80 sm:block">
                Or drag and drop images here
              </span>
            </span>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                {files.length} of {MAX_FILES} attached
              </p>
              {canAdd ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl"
                  onClick={() => inputRef.current?.click()}
                >
                  <ImagePlus className="size-3.5" />
                  Add more
                </Button>
              ) : null}
            </div>

            <ul className="grid grid-cols-3 gap-2 sm:gap-3">
              {files.map((file, index) => (
                <li key={`${file.name}-${file.lastModified}-${index}`}>
                  <div className="group relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-background/60 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setPreviewIndex(index)}
                      className="absolute inset-0"
                      aria-label={`Preview ${file.name}`}
                    >
                      <img
                        src={previews[index]}
                        alt={file.name}
                        className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-1.5 pb-1.5 pt-5">
                        <span className="block truncate text-[10px] font-medium text-white/95">
                          {file.name}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() => removeFile(index)}
                      className={cn(
                        "absolute right-1.5 top-1.5 z-10 inline-flex size-7 items-center justify-center rounded-full",
                        "border border-white/15 bg-black/55 text-white backdrop-blur-sm",
                        "transition-colors hover:bg-black/75 active:scale-95",
                      )}
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}

              {canAdd
                ? Array.from({ length: remaining }).map((_, slot) => (
                    <li key={`slot-${slot}`}>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                          "flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl",
                          "border border-dashed border-border/60 bg-background/30 text-muted-foreground",
                          "transition-colors hover:border-border hover:bg-muted/20 active:scale-[0.98]",
                        )}
                        aria-label="Add another screenshot"
                      >
                        <ImagePlus className="size-4" />
                        <span className="text-[10px] font-medium">Add</span>
                      </button>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      <Dialog
        open={previewIndex !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewIndex(null);
        }}
      >
        <DialogContent className="max-w-[min(92vw,48rem)] gap-3 rounded-2xl p-3 sm:p-5">
          <DialogHeader className="px-1">
            <DialogTitle className="truncate text-base">
              {previewIndex !== null
                ? files[previewIndex]?.name ?? "Screenshot"
                : "Screenshot"}
            </DialogTitle>
          </DialogHeader>
          {previewIndex !== null && previews[previewIndex] ? (
            <img
              src={previews[previewIndex]}
              alt={files[previewIndex]?.name ?? "Screenshot full size"}
              className="max-h-[min(70vh,32rem)] w-full rounded-xl object-contain bg-muted/20"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
