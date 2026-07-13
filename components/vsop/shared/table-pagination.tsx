"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TablePaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function buildPageItems(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("ellipsis");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);

  return items;
}

export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const items = buildPageItems(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 sm:flex-row sm:justify-between",
        className,
      )}
    >
      <p className="order-2 text-xs tabular-nums text-muted-foreground sm:order-1">
        Showing{" "}
        <span className="font-medium text-foreground">
          {start}–{end}
        </span>{" "}
        of <span className="font-medium text-foreground">{totalItems}</span>
      </p>

      <nav
        aria-label="Pagination"
        className="order-1 flex items-center gap-1 sm:order-2 sm:gap-1.5"
      >
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-xl px-2.5 text-sm font-medium",
            "text-foreground transition-colors",
            "hover:bg-foreground/[0.06] disabled:pointer-events-none disabled:opacity-35",
            "active:scale-[0.98]",
          )}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {items.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-xl text-sm font-medium tabular-nums transition-colors",
                  "active:scale-[0.96]",
                  item === page
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-foreground/[0.06]",
                )}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-xl px-2.5 text-sm font-medium",
            "text-foreground transition-colors",
            "hover:bg-foreground/[0.06] disabled:pointer-events-none disabled:opacity-35",
            "active:scale-[0.98]",
          )}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  );
}
