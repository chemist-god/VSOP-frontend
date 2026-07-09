"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { submitIntake, type SubmitIntakeError } from "@/lib/api/intake";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function formatPortalLabel(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SubmitForm() {
  const searchParams = useSearchParams();
  const portalSlug = searchParams.get("portal")?.trim().toLowerCase() ?? "";

  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const portalLabel = useMemo(
    () => (portalSlug ? formatPortalLabel(portalSlug) : ""),
    [portalSlug],
  );

  const mutation = useMutation({
    mutationFn: submitIntake,
    onSuccess: (result) => {
      setReferenceId(result.referenceId);
    },
    onError: (error: unknown) => {
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as SubmitIntakeError).message)
          : "Could not submit your issue.";
      toastError("Submission failed", { description: message });
    },
  });

  function addFiles(incoming: FileList | File[]) {
    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_FILE_SIZE) {
        toastError("File too large", {
          description: "Each screenshot must be 5 MB or smaller.",
        });
        continue;
      }
      if (next.length >= MAX_FILES) break;
      next.push(file);
    }
    setFiles(next.slice(0, MAX_FILES));
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  if (!portalSlug) {
    return (
      <Card className="border-border/60 bg-card/85 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Portal not found</CardTitle>
          <CardDescription>
            This support link is missing a portal identifier. Ask your VeriTrack
            contact for the correct URL, for example{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              /submit?portal=your-company
            </code>
            .
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (referenceId) {
    return (
      <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
        <CardHeader className="space-y-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-2xl">Thank you — we received your issue</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Your ticket reference is{" "}
            <span className="font-mono font-medium text-foreground">
              {referenceId}
            </span>
            . The VeriTrack support team will review it and follow up through
            your portal admin contact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You can close this page now. Please keep the reference ID for your
            records.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/85 shadow-xl shadow-indigo-500/5 backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Support request
        </p>
        <CardTitle className="text-2xl sm:text-3xl">
          Report an issue for {portalLabel}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed sm:text-base">
          Describe what went wrong on your VeriTrack portal. Attach up to three
          screenshots if they help the team reproduce the issue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!description.trim()) return;

            mutation.mutate({
              portalSlug,
              description: description.trim(),
              contactName: contactName.trim() || undefined,
              browserInfo: {
                page_url: window.location.href,
                user_agent: window.navigator.userAgent,
                submitted_at: new Date().toISOString(),
              },
              screenshots: files,
            });
          }}
        >
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="description">What happened?</FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell us what you were trying to do, what you expected, and what went wrong…"
                rows={6}
                className="min-h-[160px] resize-y"
                required
              />
              <FieldDescription>
                Include steps to reproduce if you can. Minimum detail helps us
                resolve faster.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="contactName">
                Your name (optional)
              </FieldLabel>
              <Input
                id="contactName"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Who should we mention in follow-up?"
              />
            </Field>

            <Field>
              <FieldLabel>Screenshots (optional)</FieldLabel>
              <div
                className={cn(
                  "rounded-xl border border-dashed border-border/70 bg-muted/10 p-4 transition-colors",
                  "hover:border-border hover:bg-muted/20",
                )}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (event.dataTransfer.files?.length) {
                    addFiles(event.dataTransfer.files);
                  }
                }}
              >
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Drag screenshots here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG or JPG · up to {MAX_FILES} files · 5 MB each
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <ImagePlus />
                      Add screenshots
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={(event) => {
                          if (event.target.files) addFiles(event.target.files);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </Button>
                </div>

                {files.length > 0 ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/70 px-3 py-2"
                      >
                        <span className="truncate text-xs text-foreground">
                          {file.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeFile(index)}
                        >
                          <X />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="h-11 w-full sm:h-10"
            size="lg"
            disabled={mutation.isPending || !description.trim()}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send />
                Submit support request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
