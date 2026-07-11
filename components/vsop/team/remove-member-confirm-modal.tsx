"use client";

import { Loader2, Trash2 } from "lucide-react";
import { MorphingModal } from "@/components/motion/morphing-modal";

type RemoveMemberConfirmModalProps = {
  open: boolean;
  memberName: string | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function RemoveMemberConfirmModal({
  open,
  memberName,
  isPending,
  onClose,
  onConfirm,
}: RemoveMemberConfirmModalProps) {
  return (
    <MorphingModal
      viewId={open ? "confirm-remove" : null}
      onClose={() => {
        if (!isPending) onClose();
      }}
      placement="center"
    >
      {open ? (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Remove member
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              aria-label="Close"
              className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] disabled:opacity-50"
            >
              ✕
            </button>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">
              {memberName ?? "this member"}
            </span>{" "}
            from the team? They will lose access to VSOP immediately and cannot
            sign in again until reactivated.
          </p>

          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/15 active:scale-[0.98] disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              {isPending ? "Removing…" : "Remove from team"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex w-full items-center justify-center rounded-2xl bg-foreground/[0.04] px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.08] active:scale-[0.98] disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </MorphingModal>
  );
}
