import { X } from "lucide-react";
import type { Exercise } from "@/types/domain";

interface SelectedExercisesProps {
  exercises: Exercise[];
  onRemove: (exerciseId: string) => void;
}

export function SelectedExercises({ exercises, onRemove }: SelectedExercisesProps) {
  return (
    <div className="shrink-0">
      <p role="status" className="text-xs text-muted-foreground">
        {exercises.length === 0
          ? "Pick exercises in the order you will do them."
          : `${exercises.length} selected, added in this order:`}
      </p>
      {exercises.length > 0 && (
        <ol
          aria-label="Selected exercises"
          className="mt-2 flex max-h-24 flex-wrap gap-2 overflow-y-auto"
        >
          {exercises.map((exercise, index) => (
            <li key={exercise.id}>
              <button
                type="button"
                aria-label={`Remove ${exercise.name}`}
                onClick={() => onRemove(exercise.id)}
                className="mobile-control inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-left text-xs text-accent-foreground"
              >
                <span aria-hidden="true" className="tabular font-semibold">
                  {index + 1}
                </span>
                {exercise.name}
                <X aria-hidden="true" className="size-3 shrink-0" />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
