import { useExercises } from "@/hooks/useExercises";
import { cn } from "@/lib/utils";
import type { ExerciseGroup } from "@/lib/workout";
import type { Exercise } from "@/types/domain";
import { ExerciseListMessage } from "./ExerciseListMessage";

interface ExerciseListProps {
  groups: ExerciseGroup[];
  addedIds: Set<string>;
  // Ids in the order they were picked; leave out when a tap picks one exercise and closes.
  selectedIds?: string[] | undefined;
  onSelect: (exercise: Exercise) => void;
  rowClassName?: string;
}

export function ExerciseList({
  groups,
  addedIds,
  selectedIds,
  onSelect,
  rowClassName,
}: ExerciseListProps) {
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
          const order = selectedIds ? selectedIds.indexOf(exercise.id) + 1 : 0;
          return (
            <li key={exercise.id}>
              <button
                type="button"
                disabled={added}
                aria-pressed={selectedIds ? order > 0 : undefined}
                onClick={() => onSelect(exercise)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-hover disabled:pointer-events-none disabled:opacity-40",
                  order > 0 && "bg-accent text-accent-foreground hover:bg-accent",
                  rowClassName,
                )}
              >
                {exercise.name}
                {added && <span className="text-xs text-muted-foreground">Added</span>}
                {order > 0 && (
                  <span
                    aria-hidden="true"
                    className="tabular flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-xs font-semibold"
                  >
                    {order}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  ));
}
