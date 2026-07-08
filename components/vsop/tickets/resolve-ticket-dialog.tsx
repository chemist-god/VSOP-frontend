"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { resolveTicket } from "@/lib/api/tickets";
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

export function ResolveTicketDialog({ ticketId }: { ticketId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");

  const mutation = useMutation({
    mutationFn: () => resolveTicket(ticketId, resolutionNote.trim()),
    onSuccess: () => {
      toastSuccess("Ticket resolved", {
        description: "The client will be notified by email.",
      });
      setOpen(false);
      setResolutionNote("");
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
    },
    onError: (error) => {
      toastError(
        "Could not resolve ticket",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Mark resolved</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve ticket</DialogTitle>
          <DialogDescription>
            Add a resolution note for the client email. Minimum 10 characters.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={resolutionNote}
          onChange={(event) => setResolutionNote(event.target.value)}
          placeholder="Describe what was fixed and any follow-up steps…"
          rows={5}
        />
        <DialogFooter>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || resolutionNote.trim().length < 10}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Resolving…
              </>
            ) : (
              "Mark resolved & email client"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
