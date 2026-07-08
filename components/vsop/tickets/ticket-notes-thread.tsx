"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { addTicketNote } from "@/lib/api/tickets";
import { queryKeys } from "@/lib/query-keys";
import type { TicketNote } from "@/lib/types/tickets";
import type { TeamMember } from "@/lib/types/team";
import { formatDateTime } from "@/lib/format";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TicketNotesThread({
  ticketId,
  notes,
  teamById,
}: {
  ticketId: string;
  notes: TicketNote[];
  teamById: Record<string, TeamMember>;
}) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const mutation = useMutation({
    mutationFn: (value: string) => addTicketNote(ticketId, value),
    onSuccess: () => {
      setContent("");
      toastSuccess("Note added");
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
    },
    onError: (error) => {
      toastError(
        "Could not add note",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No internal notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-border/50 bg-muted/20 px-3 py-3"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{teamById[note.authorId]?.name ?? "Team member"}</span>
                <span>{formatDateTime(note.createdAt)}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!content.trim()) return;
          mutation.mutate(content.trim());
        }}
      >
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Add an internal note for the team…"
          rows={4}
        />
        <Button type="submit" disabled={mutation.isPending || !content.trim()}>
          {mutation.isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Saving…
            </>
          ) : (
            "Add note"
          )}
        </Button>
      </form>
    </div>
  );
}
