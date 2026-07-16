"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { createTicket } from "@/lib/api/tickets";
import { fetchPortals } from "@/lib/api/portals";
import { fetchTeamMembers } from "@/lib/api/team";
import { queryKeys } from "@/lib/query-keys";
import {
  TICKET_SEVERITIES,
  type CreateTicketInput,
  type TicketSeverity,
} from "@/lib/types/tickets";
import { defaultDueDateIso } from "@/lib/format";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { DateTimePicker } from "@/components/vsop/shared/date-time-picker";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CreateTicketDialogProps = {
  onCreated?: (ticketId: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the built-in trigger when controlled externally (e.g. command palette). */
  hideTrigger?: boolean;
};

export function CreateTicketDialog({
  onCreated,
  open: openProp,
  onOpenChange,
  hideTrigger = false,
}: CreateTicketDialogProps) {
  const queryClient = useQueryClient();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const [description, setDescription] = useState("");
  const [portalId, setPortalId] = useState<string>("none");
  const [severity, setSeverity] = useState<TicketSeverity>("MEDIUM");
  const [assigneeId, setAssigneeId] = useState<string>("none");
  const [dueDate, setDueDate] = useState(defaultDueDateIso());

  const portalsQuery = useQuery({
    queryKey: queryKeys.portals.list(),
    queryFn: fetchPortals,
    enabled: open,
  });

  const teamQuery = useQuery({
    queryKey: queryKeys.team.list(),
    queryFn: fetchTeamMembers,
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (input: CreateTicketInput) => createTicket(input),
    onSuccess: (result) => {
      toastSuccess("Ticket created", {
        description: result.referenceId,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox.all });
      setOpen(false);
      resetForm();
      onCreated?.(result.ticketId);
    },
    onError: (error) => {
      toastError(
        "Could not create ticket",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  function resetForm() {
    setDescription("");
    setPortalId("none");
    setSeverity("MEDIUM");
    setAssigneeId("none");
    setDueDate(defaultDueDateIso());
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;

    const input: CreateTicketInput = {
      description: trimmed,
      severity,
    };
    if (portalId !== "none") input.portalId = portalId;
    if (assigneeId !== "none") {
      input.assigneeId = assigneeId;
      input.dueDate = new Date(dueDate).toISOString();
    }
    mutation.mutate(input);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {hideTrigger ? null : (
        <DialogTrigger asChild>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            New ticket
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create ticket</DialogTitle>
            <DialogDescription>
              Add an internal task for the team. Optionally link a portal and
              assign someone now.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-description">What needs to be done?</Label>
              <Textarea
                id="ticket-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task, context, and expected outcome…"
                className="min-h-[120px] resize-none"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select
                  value={severity}
                  onValueChange={(value) =>
                    setSeverity(value as TicketSeverity)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_SEVERITIES.filter((s) => s !== "UNSET").map(
                      (item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Portal (optional)</Label>
                <Select value={portalId} onValueChange={setPortalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Internal only" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Internal only</SelectItem>
                    {(portalsQuery.data ?? []).map((portal) => (
                      <SelectItem key={portal.id} value={portal.id}>
                        {portal.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Assign to (optional)</Label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {(teamQuery.data ?? [])
                      .filter((member) => member.isActive)
                      .map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {assigneeId !== "none" ? (
                <div className="space-y-2">
                  <Label>Due date</Label>
                  <DateTimePicker valueIso={dueDate} onChange={setDueDate} />
                </div>
              ) : null}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!description.trim() || mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Create ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
