import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlannedExercise } from "@/types/domain";

interface PlannedExerciseRowProps {
  exercise: PlannedExercise;
  onRemove: () => void;
}

export function PlannedExerciseRow({ exercise, onRemove }: PlannedExerciseRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: exercise.exerciseId,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "flex items-center gap-1 py-1 pl-1 pr-1 text-sm",
        isDragging && "relative z-10 rounded-md bg-hover shadow-lg",
      )}
    >
      {/* touch-none: without it a phone scrolls the dialog instead of dragging the row. */}
      <Hint label="Drag to reorder">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={`Reorder ${exercise.exerciseName}`}
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical />
        </Button>
      </Hint>
      <span className="min-w-0 flex-1 break-words">{exercise.exerciseName}</span>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label={`Remove ${exercise.exerciseName}`}
        onClick={onRemove}
        className="shrink-0 text-muted-foreground hover:text-danger"
      >
        <X />
      </Button>
    </li>
  );
}
