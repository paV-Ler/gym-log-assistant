import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/domain";

interface SelectedExerciseChipProps {
  exercise: Exercise;
  onRemove: () => void;
}

export function SelectedExerciseChip({ exercise, onRemove }: SelectedExerciseChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: exercise.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "mobile-control inline-flex items-center rounded-full bg-accent text-xs text-accent-foreground",
        isDragging && "relative z-10 shadow-lg",
      )}
    >
      {/* touch-none: without it a phone scrolls the list instead of dragging the chip. */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none self-stretch rounded-l-full py-1 pl-3 pr-1 text-left active:cursor-grabbing"
      >
        {exercise.name}
      </button>
      <button
        type="button"
        aria-label={`Remove ${exercise.name}`}
        onClick={onRemove}
        className="flex self-stretch items-center rounded-r-full pl-1 pr-2.5"
      >
        <X aria-hidden="true" className="size-3 shrink-0" />
      </button>
    </li>
  );
}
