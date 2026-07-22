"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { submitTicketForReview } from "@/lib/api/tickets";
import { queryKeys } from "@/lib/query-keys";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function SubmitForReviewDialog({ ticketId }: { ticketId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const mutation = useMutation({
    mutationFn: () => submitTicketForReview(ticketId, reviewNote.trim()),
    onSuccess: () => {
      toastSuccess("Submitted for review", {
        description: "An admin has been notified to review your work.",
      });
      setOpen(false);
      setReviewNote("");
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
    onError: (error) => {
      toastError(
        "Could not submit for review",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          Submit for review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit for review</DialogTitle>
          <DialogDescription>
            Describe what you fixed. An admin will review before emailing the
            client. Minimum 10 characters.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={reviewNote}
          onChange={(event) => setReviewNote(event.target.value)}
          placeholder="Summarize the changes you made and anything the admin should verify…"
          rows={5}
        />
        <DialogFooter>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || reviewNote.trim().length < 10}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit for admin review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
