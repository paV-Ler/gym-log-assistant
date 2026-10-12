import { SortableList } from "@/components/SortableList";
import type { Exercise } from "@/types/domain";
import { SelectedExerciseChip } from "./SelectedExerciseChip";

interface SelectedExercisesProps {
  exercises: Exercise[];
  onRemove: (exerciseId: string) => void;
  onMove: (from: number, to: number) => void;
}

export function SelectedExercises({ exercises, onRemove, onMove }: SelectedExercisesProps) {
  return (
    <div className="shrink-0">
      <p role="status" className="text-xs text-muted-foreground">
        {exercises.length === 0
          ? "Pick exercises in the order you will do them."
          : `${exercises.length} selected, added in this order. Drag to reorder.`}
      </p>
      {exercises.length > 0 && (
        <SortableList ids={exercises.map((exercise) => exercise.id)} layout="wrap" onMove={onMove}>
          {/* data-vaul-no-drag: on phones a drag here must not pull the sheet down. */}
          <ol
            data-vaul-no-drag
            aria-label="Selected exercises"
            className="mt-2 flex max-h-24 flex-wrap gap-2 overflow-y-auto"
          >
            {exercises.map((exercise) => (
              <SelectedExerciseChip
                key={exercise.id}
                exercise={exercise}
                onRemove={() => onRemove(exercise.id)}
              />
            ))}
          </ol>
        </SortableList>
      )}
    </div>
  );
}
