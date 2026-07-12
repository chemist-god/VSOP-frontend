"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Copy, ExternalLink, Loader2, Plus } from "lucide-react";
import {
  fetchPortals,
  registerPortal,
  rotatePortalKey,
  updatePortalStatus,
} from "@/lib/api/portals";
import { queryKeys } from "@/lib/query-keys";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import { AdminOnlyNotice } from "@/components/vsop/shared/admin-only-notice";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { PageHeader } from "@/components/vsop/shared/page-header";
import { DeactivatePortalConfirmModal } from "@/components/vsop/portals/deactivate-portal-confirm-modal";
import {
  PortalApiKeyReveal,
  type PortalApiKeyRevealData,
} from "@/components/vsop/portals/portal-api-key-reveal";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuthUser } from "@/hooks/use-auth-user";
import { cn } from "@/lib/utils";

export function PortalsView() {
  const { isAdmin } = useAuthUser();
  const queryClient = useQueryClient();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [apiKeyReveal, setApiKeyReveal] =
    useState<PortalApiKeyRevealData | null>(null);
  const [portalToDeactivate, setPortalToDeactivate] = useState<{
    id: string;
    companyName: string;
    slug: string;
  } | null>(null);
  const [form, setForm] = useState({
    slug: "",
    companyName: "",
    clientAdminEmail: "",
    description: "",
  });

  const portalsQuery = useQuery({
    queryKey: queryKeys.portals.list(),
    queryFn: fetchPortals,
    enabled: isAdmin,
  });

  const registerMutation = useMutation({
    mutationFn: registerPortal,
    onSuccess: (result, variables) => {
      toastSuccess("Portal registered", {
        description: `${variables.companyName} is ready for intake.`,
      });
      setApiKeyReveal({
        apiKey: result.apiKey,
        companyName: variables.companyName.trim(),
        slug: result.slug,
        source: "registered",
      });
      setRegisterOpen(false);
      setForm({
        slug: "",
        companyName: "",
        clientAdminEmail: "",
        description: "",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.portals.all });
    },
    onError: (error) => {
      toastError(
        "Registration failed",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => updatePortalStatus(id, status),
    onSuccess: (_data, variables) => {
      toastSuccess(
        variables.status === "INACTIVE"
          ? "Portal deactivated"
          : "Portal activated",
        variables.status === "INACTIVE"
          ? {
              description:
                "Ticket intake for this company is paused until reactivated.",
            }
          : undefined,
      );
      setPortalToDeactivate(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.portals.all });
    },
    onError: (error) => {
      toastError(
        "Update failed",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  const rotateMutation = useMutation({
    mutationFn: async (portal: {
      id: string;
      companyName: string;
      slug: string;
    }) => {
      const result = await rotatePortalKey(portal.id);
      return { ...result, companyName: portal.companyName, slug: portal.slug };
    },
    onSuccess: (result) => {
      setApiKeyReveal({
        apiKey: result.apiKey,
        companyName: result.companyName,
        slug: result.slug,
        source: "rotated",
      });
      toastSuccess("API key rotated", {
        description: `New key issued for ${result.companyName}.`,
      });
    },
    onError: (error) => {
      toastError(
        "Rotation failed",
        error instanceof ApiError ? { description: error.message } : undefined,
      );
    },
  });

  if (!isAdmin) {
    return (
      <AdminOnlyNotice
        title="Portals"
        description="Portal registry management is limited to VSOP admins."
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        title="Portals"
        description="Manage registered client portals, intake configuration, and API keys."
        actions={
          <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus />
                Register portal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register portal</DialogTitle>
                <DialogDescription>
                  Create a new client portal entry and generate its intake API key.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="acme-corp"
                    value={form.slug}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        slug: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    value={form.companyName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        companyName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAdminEmail">Client admin email</Label>
                  <Input
                    id="clientAdminEmail"
                    type="email"
                    value={form.clientAdminEmail}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        clientAdminEmail: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => registerMutation.mutate(form)}
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Registering…
                    </>
                  ) : (
                    "Register portal"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {apiKeyReveal ? (
        <PortalApiKeyReveal
          data={apiKeyReveal}
          onDismiss={() => setApiKeyReveal(null)}
        />
      ) : null}

      {portalsQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : null}

      {!portalsQuery.isLoading && (portalsQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={<Building2 className="size-5" />}
          title="No portals registered"
          description="Register a client portal to start collecting structured support tickets."
        />
      ) : null}

      {!portalsQuery.isLoading && (portalsQuery.data?.length ?? 0) > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card/40">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Slug</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="hidden md:table-cell">Admin email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Intake link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portalsQuery.data?.map((portal) => (
                  <TableRow key={portal.id}>
                    <TableCell className="font-mono text-xs">
                      {portal.slug}
                    </TableCell>
                    <TableCell>{portal.companyName}</TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {portal.clientAdminEmail}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          portal.status === "ACTIVE"
                            ? "border-emerald-500/30 text-emerald-300"
                            : "border-zinc-500/30 text-zinc-400"
                        }
                      >
                        {portal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
                          /submit?portal={portal.slug}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Copy intake link"
                          onClick={async () => {
                            const url = `${window.location.origin}/submit?portal=${portal.slug}`;
                            await navigator.clipboard.writeText(url);
                            toastSuccess("Intake link copied");
                          }}
                        >
                          <Copy className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" asChild>
                          <a
                            href={`/submit?portal=${portal.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open intake form"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {portal.status === "ACTIVE" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "border-destructive/25 bg-destructive/10 text-destructive",
                              "hover:bg-destructive/15 hover:text-destructive",
                            )}
                            onClick={() =>
                              setPortalToDeactivate({
                                id: portal.id,
                                companyName: portal.companyName,
                                slug: portal.slug,
                              })
                            }
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={statusMutation.isPending}
                            onClick={() =>
                              statusMutation.mutate({
                                id: portal.id,
                                status: "ACTIVE",
                              })
                            }
                          >
                            Activate
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={rotateMutation.isPending}
                          onClick={() =>
                            rotateMutation.mutate({
                              id: portal.id,
                              companyName: portal.companyName,
                              slug: portal.slug,
                            })
                          }
                        >
                          Rotate key
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : null}

      <DeactivatePortalConfirmModal
        open={Boolean(portalToDeactivate)}
        companyName={portalToDeactivate?.companyName ?? null}
        slug={portalToDeactivate?.slug ?? null}
        isPending={statusMutation.isPending}
        onClose={() => {
          if (!statusMutation.isPending) setPortalToDeactivate(null);
        }}
        onConfirm={() => {
          if (!portalToDeactivate) return;
          statusMutation.mutate({
            id: portalToDeactivate.id,
            status: "INACTIVE",
          });
        }}
      />
    </div>
  );
}
