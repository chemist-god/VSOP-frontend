"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseIsoLocal(iso: string): Date {
  return new Date(iso);
}

function toIsoFromParts(date: Date, hours: number, minutes: number): string {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next.toISOString();
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

type DateTimePickerProps = {
  id?: string;
  label?: string;
  valueIso: string;
  onChange: (iso: string) => void;
  className?: string;
};

export function DateTimePicker({
  id,
  label,
  valueIso,
  onChange,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => parseIsoLocal(valueIso), [valueIso]);
  const hour = selected.getHours();
  const minute =
    MINUTES.includes(selected.getMinutes())
      ? selected.getMinutes()
      : Math.round(selected.getMinutes() / 15) * 15;

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "h-10 w-full justify-start gap-2 px-3 font-normal",
              !valueIso && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
            <span className="truncate">
              {format(selected, "MMM d, yyyy · HH:mm")}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(toIsoFromParts(date, hour, minute % 60));
            }}
          />
          <div className="flex items-center gap-2 border-t border-border/50 p-3">
            <Select
              value={String(hour)}
              onValueChange={(value) => {
                onChange(toIsoFromParts(selected, Number(value), minute % 60));
              }}
            >
              <SelectTrigger className="w-[88px]" size="sm">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {pad(h)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">:</span>
            <Select
              value={String(minute % 60)}
              onValueChange={(value) => {
                onChange(toIsoFromParts(selected, hour, Number(value)));
              }}
            >
              <SelectTrigger className="w-[88px]" size="sm">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {MINUTES.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {pad(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              className="ml-auto"
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
