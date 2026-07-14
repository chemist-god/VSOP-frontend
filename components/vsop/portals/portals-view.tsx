"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Copy,
  ExternalLink,
  KeyRound,
  Loader2,
  MoreHorizontal,
  Plus,
  Power,
  PowerOff,
} from "lucide-react";
import {
  fetchPortals,
  registerPortal,
  rotatePortalKey,
  updatePortalStatus,
} from "@/lib/api/portals";
import { queryKeys } from "@/lib/query-keys";
import { toastError, toastSuccess } from "@/lib/toast";
import { ApiError } from "@/lib/api";
import type { PortalListItem } from "@/lib/types/portals";
import { AdminOnlyNotice } from "@/components/vsop/shared/admin-only-notice";
import { EmptyState } from "@/components/vsop/shared/empty-state";
import { TablePagination } from "@/components/vsop/shared/table-pagination";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuthUser } from "@/hooks/use-auth-user";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function PortalsView() {
  const { isAdmin } = useAuthUser();
  const queryClient = useQueryClient();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [page, setPage] = useState(1);
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

  const portals = portalsQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(portals.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return portals.slice(start, start + PAGE_SIZE);
  }, [portals, currentPage]);

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

  async function copyIntakeLink(slug: string) {
    const url = `${window.location.origin}/submit?portal=${slug}`;
    await navigator.clipboard.writeText(url);
    toastSuccess("Intake link copied");
  }

  if (!isAdmin) {
    return (
      <AdminOnlyNotice
        title="Portals"
        description="Portal registry management is limited to VSOP admins."
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:gap-6">
      {/* Compact header */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium tracking-tight sm:text-xl">
              Portals
            </h1>
            {portals.length > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted/60 px-1.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                {portals.length}
              </span>
            ) : null}
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Client portals, intake links, and API keys.
          </p>
          <p className="text-xs text-muted-foreground sm:hidden">
            Intake links & API keys
          </p>
        </div>

        <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 shrink-0 gap-1.5 px-2.5">
              <Plus className="size-3.5" />
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">Register portal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register portal</DialogTitle>
              <DialogDescription>
                Create a client portal entry and generate its intake API key.
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
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                className="w-full sm:w-auto"
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
      </header>

      {apiKeyReveal ? (
        <PortalApiKeyReveal
          data={apiKeyReveal}
          onDismiss={() => setApiKeyReveal(null)}
        />
      ) : null}

      {portalsQuery.isLoading ? (
        <div className="space-y-2 rounded-xl border border-border/40 p-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-lg sm:h-14" />
          ))}
        </div>
      ) : null}

      {!portalsQuery.isLoading && portals.length === 0 ? (
        <EmptyState
          icon={<Building2 className="size-5" />}
          title="No portals registered"
          description="Register a client portal to start collecting structured support tickets."
        />
      ) : null}

      {!portalsQuery.isLoading && portals.length > 0 ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-border/50 bg-card/30">
            <ul className="divide-y divide-border/30">
              {paged.map((portal) => (
                <PortalRow
                  key={portal.id}
                  portal={portal}
                  isStatusPending={statusMutation.isPending}
                  isRotatePending={rotateMutation.isPending}
                  onCopyLink={() => copyIntakeLink(portal.slug)}
                  onActivate={() =>
                    statusMutation.mutate({
                      id: portal.id,
                      status: "ACTIVE",
                    })
                  }
                  onDeactivate={() =>
                    setPortalToDeactivate({
                      id: portal.id,
                      companyName: portal.companyName,
                      slug: portal.slug,
                    })
                  }
                  onRotate={() =>
                    rotateMutation.mutate({
                      id: portal.id,
                      companyName: portal.companyName,
                      slug: portal.slug,
                    })
                  }
                />
              ))}
            </ul>
          </div>

          <TablePagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={portals.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            className="px-0.5"
          />
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

function PortalRow({
  portal,
  isStatusPending,
  isRotatePending,
  onCopyLink,
  onActivate,
  onDeactivate,
  onRotate,
}: {
  portal: PortalListItem;
  isStatusPending: boolean;
  isRotatePending: boolean;
  onCopyLink: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onRotate: () => void;
}) {
  const active = portal.status === "ACTIVE";

  return (
    <li className="px-3 py-3 sm:px-4 sm:py-3.5">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border",
            active
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-border/50 bg-muted/40 text-muted-foreground",
          )}
        >
          <Building2 className="size-3.5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="truncate text-[13px] font-medium tracking-tight text-foreground sm:text-sm">
                  {portal.companyName}
                </h2>
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 px-1.5 text-[10px] font-normal",
                    active
                      ? "border-emerald-500/30 text-emerald-400"
                      : "border-border/60 text-muted-foreground",
                  )}
                >
                  {portal.status}
                </Badge>
              </div>
              <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                {portal.slug}
              </p>
            </div>

            {/* Desktop quick actions */}
            <div className="hidden shrink-0 items-center gap-1 sm:flex">
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-8"
                aria-label="Copy intake link"
                onClick={onCopyLink}
              >
                <Copy className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-8"
                asChild
              >
                <a
                  href={`/submit?portal=${portal.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open intake form"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
              <PortalActionsMenu
                portal={portal}
                isStatusPending={isStatusPending}
                isRotatePending={isRotatePending}
                onCopyLink={onCopyLink}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
                onRotate={onRotate}
              />
            </div>

            {/* Mobile overflow menu */}
            <div className="sm:hidden">
              <PortalActionsMenu
                portal={portal}
                isStatusPending={isStatusPending}
                isRotatePending={isRotatePending}
                onCopyLink={onCopyLink}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
                onRotate={onRotate}
                showLinkActions
              />
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-1.5 sm:mt-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
            <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
              {portal.clientAdminEmail}
            </p>
            <code className="hidden truncate rounded-md bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-block">
              /submit?portal={portal.slug}
            </code>
          </div>

          {/* Mobile quick row: copy + open */}
          <div className="mt-2.5 flex items-center gap-2 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              className="h-7 flex-1 gap-1.5 text-[11px]"
              onClick={onCopyLink}
            >
              <Copy className="size-3" />
              Copy link
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 flex-1 gap-1.5 text-[11px]"
              asChild
            >
              <a
                href={`/submit?portal=${portal.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-3" />
                Open
              </a>
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

function PortalActionsMenu({
  portal,
  isStatusPending,
  isRotatePending,
  onCopyLink,
  onActivate,
  onDeactivate,
  onRotate,
  showLinkActions = false,
}: {
  portal: PortalListItem;
  isStatusPending: boolean;
  isRotatePending: boolean;
  onCopyLink: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onRotate: () => void;
  showLinkActions?: boolean;
}) {
  const active = portal.status === "ACTIVE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="size-8"
          aria-label={`Actions for ${portal.companyName}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {showLinkActions ? (
          <>
            <DropdownMenuItem onClick={onCopyLink}>
              <Copy className="size-3.5" />
              Copy intake link
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={`/submit?portal=${portal.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-3.5" />
                Open intake form
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem
          disabled={isRotatePending}
          onClick={onRotate}
        >
          <KeyRound className="size-3.5" />
          Rotate API key
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {active ? (
          <DropdownMenuItem
            variant="destructive"
            disabled={isStatusPending}
            onClick={onDeactivate}
          >
            <PowerOff className="size-3.5" />
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled={isStatusPending} onClick={onActivate}>
            <Power className="size-3.5" />
            Activate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
