"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { assignTicket } from "@/lib/api/tickets";
import { queryKeys } from "@/lib/query-keys";
import type { TeamMember } from "@/lib/types/team";
import { defaultDueDateIso } from "@/lib/format";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { DateTimePicker } from "@/components/vsop/shared/date-time-picker";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AssignTicketPanel({
  ticketId,
  teamMembers,
  currentAssigneeId,
  currentDueDate,
}: {
  ticketId: string;
  teamMembers: TeamMember[];
  currentAssigneeId?: string;
  currentDueDate?: string;
}) {
  const queryClient = useQueryClient();
  const [assigneeId, setAssigneeId] = useState(currentAssigneeId ?? "");
  const [dueDate, setDueDate] = useState(
    currentDueDate ?? defaultDueDateIso(),
  );

  const selected = teamMembers.find((member) => member.id === assigneeId);

  const mutation = useMutation({
    mutationFn: () =>
      assignTicket(ticketId, {
        assigneeId,
        dueDate: new Date(dueDate).toISOString(),
      }),
    onSuccess: () => {
      toastSuccess("Ticket assigned", {
        description: "The assignee has been notified.",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox.all });
    },
    onError: (error) => {
      toastError(
        "Assignment failed",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-card/40 p-4">
      <div>
        <h3 className="text-sm font-medium">Assign ticket</h3>
        <p className="text-xs text-muted-foreground">
          Admin only — route this issue to a developer.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Select value={assigneeId} onValueChange={setAssigneeId}>
          <SelectTrigger id="assignee" className="h-11">
            <SelectValue placeholder="Select team member">
              {selected ? (
                <span className="flex items-center gap-2">
                  <UserAvatar
                    name={selected.name}
                    email={selected.email}
                    role={selected.role}
                    size={22}
                  />
                  <span className="truncate">
                    {selected.name} · {selected.role}
                  </span>
                </span>
              ) : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {teamMembers
              .filter((member) => member.isActive)
              .map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <span className="flex items-center gap-2">
                    <UserAvatar
                      name={member.name}
                      email={member.email}
                      role={member.role}
                      size={22}
                    />
                    {member.name} · {member.role}
                  </span>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <DateTimePicker
        id="dueDate"
        label="Due date"
        valueIso={dueDate}
        onChange={setDueDate}
      />

      <Button
        className="w-full"
        disabled={!assigneeId || mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Assigning…
          </>
        ) : (
          "Assign & notify"
        )}
      </Button>
    </div>
  );
}
