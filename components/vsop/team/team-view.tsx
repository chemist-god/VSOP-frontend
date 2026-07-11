"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Plus, Trash2, Users } from "lucide-react";
import {
  inviteTeamMember,
  fetchTeamRoster,
  updateTeamMemberStatus,
} from "@/lib/api/team";
import { queryKeys } from "@/lib/query-keys";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { AdminOnlyNotice } from "@/components/vsop/shared/admin-only-notice";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { UserAvatar } from "@/components/vsop/shared/user-avatar";
import { RemoveMemberConfirmModal } from "@/components/vsop/team/remove-member-confirm-modal";
import { TeamMemberSheet } from "@/components/vsop/team/team-member-sheet";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthUser } from "@/hooks/use-auth-user";
import { cn } from "@/lib/utils";

export function TeamView() {
  const { user, isAdmin } = useAuthUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "DEVELOPER" as "ADMIN" | "DEVELOPER",
  });

  const teamQuery = useQuery({
    queryKey: queryKeys.team.roster(),
    queryFn: fetchTeamRoster,
    enabled: isAdmin,
  });

  const inviteMutation = useMutation({
    mutationFn: inviteTeamMember,
    onSuccess: () => {
      toastSuccess("Invitation sent", {
        description: "They have 48 hours to accept and set a password.",
      });
      setOpen(false);
      setForm({ name: "", email: "", role: "DEVELOPER" });
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
    onError: (error) => {
      toastError(
        "Could not send invite",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => updateTeamMemberStatus(memberId, false),
    onSuccess: (_data, memberId) => {
      toastSuccess("Member removed", {
        description: "They can no longer sign in to VSOP.",
      });
      setMemberToRemove(null);
      if (selectedMemberId === memberId) {
        setSelectedMemberId(null);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
    },
    onError: (error) => {
      toastError(
        "Could not remove member",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  if (!isAdmin) {
    return (
      <AdminOnlyNotice
        title="Team"
        description="Team management is limited to VSOP admins."
      />
    );
  }

  const members = teamQuery.data?.members ?? [];
  const pending = teamQuery.data?.pendingInvites ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Team"
        description="Invite admins and developers by email. They set their own password."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus />
                Invite member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite team member</DialogTitle>
                <DialogDescription>
                  We email a secure link (expires in 48 hours). No temporary
                  passwords.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="ada@veritrack.cloud"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        role: value as "ADMIN" | "DEVELOPER",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEVELOPER">Developer</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={
                    inviteMutation.isPending ||
                    !form.name.trim() ||
                    !form.email.trim()
                  }
                  onClick={() =>
                    inviteMutation.mutate({
                      name: form.name.trim(),
                      email: form.email.trim(),
                      role: form.role,
                    })
                  }
                >
                  {inviteMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Mail />
                      Send invite
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {teamQuery.isLoading ? (
        <Skeleton className="h-48 w-full rounded-xl" />
      ) : null}

      {!teamQuery.isLoading && members.length === 0 && pending.length === 0 ? (
        <EmptyState
          icon={<Users className="size-5" />}
          title="No team members yet"
          description="Invite your first admin or developer to get started."
        />
      ) : null}

      {members.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-14 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const isSelf = user?.id === member.id;
                const canRemove = member.isActive && !isSelf;

                return (
                  <TableRow
                    key={member.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setSelectedMemberId(member.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={member.name}
                          email={member.email}
                          role={member.role}
                          size={36}
                        />
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{member.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          member.isActive
                            ? "border-emerald-500/30 text-emerald-300"
                            : "border-border/60 text-muted-foreground"
                        }
                      >
                        {member.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {canRemove ? (
                        <button
                          type="button"
                          aria-label={`Remove ${member.name}`}
                          title="Remove from team"
                          className={cn(
                            "inline-flex size-9 items-center justify-center rounded-xl",
                            "bg-destructive/10 text-destructive",
                            "transition-colors hover:bg-destructive/15",
                            "active:scale-95",
                          )}
                          onClick={(event) => {
                            event.stopPropagation();
                            setMemberToRemove({
                              id: member.id,
                              name: member.name,
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      ) : (
                        <span className="inline-block size-9" aria-hidden />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}

      {pending.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Pending invitations
          </h3>
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card/40">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invitee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={invite.name}
                          email={invite.email}
                          role={invite.role}
                          size={32}
                        />
                        <div>
                          <p className="text-sm font-medium">{invite.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {invite.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invite.role}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(invite.expiresAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          invite.status === "EXPIRED"
                            ? "border-red-500/30 text-red-300"
                            : "border-amber-500/30 text-amber-300"
                        }
                      >
                        {invite.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : null}

      <TeamMemberSheet
        memberId={selectedMemberId}
        open={Boolean(selectedMemberId)}
        onOpenChange={(next) => {
          if (!next) setSelectedMemberId(null);
        }}
      />

      <RemoveMemberConfirmModal
        open={Boolean(memberToRemove)}
        memberName={memberToRemove?.name ?? null}
        isPending={removeMutation.isPending}
        onClose={() => {
          if (!removeMutation.isPending) setMemberToRemove(null);
        }}
        onConfirm={() => {
          if (memberToRemove) removeMutation.mutate(memberToRemove.id);
        }}
      />
    </div>
  );
}
