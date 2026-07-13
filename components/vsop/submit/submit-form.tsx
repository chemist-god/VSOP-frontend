"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitIntake, type SubmitIntakeError } from "@/lib/api/intake";
import { toastError } from "@/lib/toast";
import { ScreenshotUploader } from "@/components/vsop/submit/screenshot-uploader";
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
      setFiles([]);
    },
    onError: (error: unknown) => {
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as SubmitIntakeError).message)
          : "Could not submit your issue.";
      toastError("Submission failed", { description: message });
    },
  });

  if (!portalSlug) {
    return (
      <Card className="border-border/60 bg-card/85 backdrop-blur-sm">
        <CardHeader className="space-y-2 px-4 py-5 sm:px-6 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl">Portal not found</CardTitle>
          <CardDescription className="text-sm leading-relaxed sm:text-[15px]">
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
        <CardHeader className="space-y-3 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="size-6" />
          </div>
          <CardTitle className="text-xl leading-tight sm:text-2xl">
            Thank you — we received your issue
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed sm:text-base">
            Your ticket reference is{" "}
            <span className="break-all font-mono font-medium text-foreground">
              {referenceId}
            </span>
            . The VeriTrack support team will review it and follow up through
            your portal admin contact.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            You can close this page now. Please keep the reference ID for your
            records.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/85 shadow-xl shadow-indigo-500/5 backdrop-blur-sm">
      <CardHeader className="space-y-2 px-4 pt-5 pb-3 sm:space-y-2.5 sm:px-6 sm:pt-6 sm:pb-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">
          Support request
        </p>
        <CardTitle className="text-[1.35rem] leading-snug tracking-tight sm:text-3xl sm:leading-tight">
          Report an issue for {portalLabel}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed sm:text-base">
          Describe what went wrong. Screenshots help a lot — you can attach up
          to three.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">
        <form
          className="space-y-5 sm:space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!description.trim() || mutation.isPending) return;

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
              <FieldLabel htmlFor="description" className="text-sm sm:text-[15px]">
                What happened?
              </FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What were you trying to do, what did you expect, and what went wrong?"
                rows={5}
                className="min-h-[140px] resize-y rounded-xl text-[15px] leading-relaxed sm:min-h-[160px] sm:text-sm"
                required
              />
              <FieldDescription className="text-xs leading-relaxed sm:text-[13px]">
                Include steps to reproduce if you can. A little detail helps us
                resolve faster.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel
                htmlFor="contactName"
                className="text-sm sm:text-[15px]"
              >
                Your name{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id="contactName"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="Who should we mention in follow-up?"
                className="h-11 rounded-xl text-[15px] sm:h-10 sm:text-sm"
                autoComplete="name"
              />
            </Field>

            <Field>
              <FieldLabel className="text-sm sm:text-[15px]">
                Screenshots{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <ScreenshotUploader
                files={files}
                onChange={setFiles}
                disabled={mutation.isPending}
              />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="h-12 w-full rounded-xl text-[15px] sm:h-11 sm:text-sm"
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
