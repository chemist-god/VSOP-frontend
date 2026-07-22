"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { resolveTicket } from "@/lib/api/tickets";
import { queryKeys } from "@/lib/query-keys";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { isClientFacingTicket, type TicketSource } from "@/lib/types/tickets";
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

type ResolveTicketDialogProps = {
  ticketId: string;
  source: TicketSource;
  portalId: string | null;
};

export function ResolveTicketDialog({
  ticketId,
  source,
  portalId,
}: ResolveTicketDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const notifiesClient = isClientFacingTicket(source, portalId);

  const mutation = useMutation({
    mutationFn: () => resolveTicket(ticketId, resolutionNote.trim()),
    onSuccess: (result) => {
      const emailed = result.clientNotified ?? notifiesClient;
      if (emailed) {
        toastSuccess("Ticket resolved", {
          description: "The client will be notified by email.",
        });
      } else {
        toastSuccess("Task completed", {
          description: "Marked complete — no client email was sent.",
        });
      }
      setOpen(false);
      setResolutionNote("");
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
    onError: (error) => {
      toastError(
        notifiesClient ? "Could not resolve ticket" : "Could not complete task",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          {notifiesClient ? "Mark resolved" : "Mark complete"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {notifiesClient ? "Resolve ticket" : "Complete task"}
          </DialogTitle>
          <DialogDescription>
            {notifiesClient
              ? "Add a resolution note for the client email. Minimum 10 characters."
              : "Add a short completion note for the team record. Minimum 10 characters."}
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={resolutionNote}
          onChange={(event) => setResolutionNote(event.target.value)}
          placeholder={
            notifiesClient
              ? "Describe what was fixed and any follow-up steps…"
              : "Summarize what was done on this internal task…"
          }
          rows={5}
        />
        <DialogFooter>
          <Button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || resolutionNote.trim().length < 10}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {notifiesClient ? "Resolving…" : "Completing…"}
              </>
            ) : notifiesClient ? (
              "Mark resolved & email client"
            ) : (
              "Mark complete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
