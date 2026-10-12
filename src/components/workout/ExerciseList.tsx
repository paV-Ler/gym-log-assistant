import { useExercises } from "@/hooks/useExercises";
import { cn } from "@/lib/utils";
import type { ExerciseGroup } from "@/lib/workout";
import type { Exercise } from "@/types/domain";
import { ExerciseListMessage } from "./ExerciseListMessage";

interface ExerciseListProps {
  groups: ExerciseGroup[];
  addedIds: Set<string>;
  onSelect: (exercise: Exercise) => void;
  rowClassName?: string;
}

export function ExerciseList({ groups, addedIds, onSelect, rowClassName }: ExerciseListProps) {
  const { isPending, isError } = useExercises();
  if (isPending) return <ExerciseListMessage role="status">Loading exercises…</ExerciseListMessage>;
  if (isError) {
    return <ExerciseListMessage role="alert">Could not load exercises.</ExerciseListMessage>;
  }
  if (groups.length === 0) return <ExerciseListMessage>No exercises found.</ExerciseListMessage>;

  return groups.map(({ muscleGroup, items }) => (
    <div key={muscleGroup}>
      <h3 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {muscleGroup}
      </h3>
      <ul>
        {items.map((exercise) => {
          const added = addedIds.has(exercise.id);
          return (
            <li key={exercise.id}>
              <button
                type="button"
                disabled={added}
                onClick={() => onSelect(exercise)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40",
                  rowClassName,
                )}
              >
                {exercise.name}
                {added && <span className="text-xs text-muted-foreground">Added</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  ));
}
