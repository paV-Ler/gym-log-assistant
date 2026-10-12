import { useEffect, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface TimeColumnProps {
  label: string;
  options: string[];
  selected: string | undefined;
  onSelect: (option: string) => void;
}

export function TimeColumn({ label, options, selected, onSelect }: TimeColumnProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const option = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!list || !option) return;
    list.scrollTop = option.offsetTop - list.clientHeight / 2 + option.clientHeight / 2;
    // Runs once, on open: later selections must not move the list under the pointer.
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    const edge = { Home: 0, End: options.length - 1 }[event.key];
    if (move === undefined && edge === undefined) return;
    event.preventDefault();
    const buttons = [...(listRef.current?.querySelectorAll<HTMLElement>("button") ?? [])];
    const current = buttons.indexOf(document.activeElement as HTMLElement);
    const next = edge ?? Math.min(buttons.length - 1, Math.max(0, current + (move ?? 0)));
    buttons[next]?.focus();
  };

  // Tab reaches one option per column; arrows move between the rest.
  const tabStop = selected && options.includes(selected) ? selected : options[0];

  return (
    <div className="flex flex-col">
      <p className="pb-2 text-center text-xs text-muted-foreground">{label}</p>
      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="relative flex h-56 flex-col gap-0.5 overflow-y-auto px-1"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="option"
            aria-selected={option === selected}
            tabIndex={option === tabStop ? 0 : -1}
            onClick={() => onSelect(option)}
            className={cn(
              "mobile-control tabular flex h-8 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md text-sm transition-colors",
              option === selected
                ? "bg-primary font-medium text-primary-foreground"
                : "hover:bg-hover",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
