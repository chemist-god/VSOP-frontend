"use client";

import type { PortalListItem } from "@/lib/types/portals";
import type { TeamMember } from "@/lib/types/team";
import type { TicketFilters as TicketFilterValues } from "@/lib/types/tickets";
import {
  TICKET_SEVERITIES,
  TICKET_SOURCES,
  TICKET_STATUSES,
} from "@/lib/types/tickets";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TicketFiltersProps = {
  filters: TicketFilterValues;
  portals: PortalListItem[];
  teamMembers: TeamMember[];
  onChange: (filters: TicketFilterValues) => void;
  showAssigneeFilter?: boolean;
  showMineFilter?: boolean;
  currentUserId?: string;
};

export function TicketFilters({
  filters,
  portals,
  teamMembers,
  onChange,
  showAssigneeFilter = true,
  showMineFilter = false,
  currentUserId,
}: TicketFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.portalId ||
      filters.status ||
      filters.severity ||
      filters.assigneeId ||
      filters.source,
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card/40 p-3 sm:flex-row sm:flex-wrap sm:items-center">
      {showMineFilter && currentUserId ? (
        <Button
          type="button"
          size="sm"
          variant={
            filters.assigneeId === currentUserId ? "default" : "outline"
          }
          onClick={() =>
            onChange({
              ...filters,
              assigneeId:
                filters.assigneeId === currentUserId
                  ? undefined
                  : currentUserId,
            })
          }
        >
          Assigned to me
        </Button>
      ) : null}

      <Select
        value={filters.status ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            status:
              value === "all"
                ? undefined
                : (value as TicketFilterValues["status"]),
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {TICKET_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replaceAll("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.severity ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            severity:
              value === "all"
                ? undefined
                : (value as TicketFilterValues["severity"]),
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All severities</SelectItem>
          {TICKET_SEVERITIES.map((severity) => (
            <SelectItem key={severity} value={severity}>
              {severity}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.source ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            source:
              value === "all"
                ? undefined
                : (value as TicketFilterValues["source"]),
          })
        }
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          {TICKET_SOURCES.map((source) => (
            <SelectItem key={source} value={source}>
              {source === "INTERNAL" ? "Internal tasks" : "Portal intake"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.portalId ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            portalId: value === "all" ? undefined : value,
          })
        }
      >
        <SelectTrigger className="w-full sm:min-w-[180px] sm:w-[200px]">
          <SelectValue placeholder="Portal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All portals</SelectItem>
          {portals.map((portal) => (
            <SelectItem key={portal.id} value={portal.id}>
              {portal.companyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showAssigneeFilter ? (
        <Select
          value={filters.assigneeId ?? "all"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              assigneeId: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            {Array.isArray(teamMembers)
              ? teamMembers
                  .filter((member) => member.isActive)
                  .map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))
              : null}
          </SelectContent>
        </Select>
      ) : null}

      {hasActiveFilters ? (
        <Button
          variant="ghost"
          size="sm"
          className="sm:ml-auto"
          onClick={() => onChange({})}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
