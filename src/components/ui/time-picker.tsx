import { useState } from "react";
import { Clock } from "lucide-react";
import { PickerTrigger } from "@/components/ui/picker-trigger";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimeColumn } from "@/components/ui/time-column";
import { isTimeOfDay } from "@/lib/date";

const twoDigits = (value: number): string => String(value).padStart(2, "0");

const HOURS = Array.from({ length: 24 }, (_, hour) => twoDigits(hour));
const FALLBACK_HOUR = "12";

// Includes the current minute when it falls between steps.
const minuteOptions = (step: number, current: string | undefined): string[] => {
  const options = Array.from({ length: Math.ceil(60 / step) }, (_, index) =>
    twoDigits(index * step),
  );
  if (current && !options.includes(current)) options.push(current);
  return options.sort();
};

interface TimePickerProps {
  // 24-hour HH:mm; anything else shows the placeholder.
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  id?: string;
  "aria-invalid"?: boolean;
}

// Picking an hour keeps the popover open; picking a minute closes it.
export function TimePicker({
  value,
  onChange,
  minuteStep = 5,
  id,
  "aria-invalid": invalid,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [hour, minute] = isTimeOfDay(value) ? value.split(":") : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PickerTrigger
          id={id}
          icon={Clock}
          value={hour && minute ? value : undefined}
          placeholder="Pick a time"
          aria-invalid={invalid}
        />
      </PopoverTrigger>
      <PopoverContent
        className="flex w-auto gap-1 p-3"
        align="start"
        // Start on the selected hour so the arrow keys work straight away.
        onOpenAutoFocus={(event) => {
          const start = event.currentTarget as HTMLElement | null;
          const option = start?.querySelector<HTMLElement>('[role="option"][tabindex="0"]');
          if (!option) return;
          event.preventDefault();
          option.focus({ preventScroll: true });
        }}
      >
        <TimeColumn
          label="Hour"
          options={HOURS}
          selected={hour}
          onSelect={(next) => onChange(`${next}:${minute ?? "00"}`)}
        />
        <div className="w-px bg-border" aria-hidden="true" />
        <TimeColumn
          label="Min"
          options={minuteOptions(minuteStep, minute)}
          selected={minute}
          onSelect={(next) => {
            onChange(`${hour ?? FALLBACK_HOUR}:${next}`);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
