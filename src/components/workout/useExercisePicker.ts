import { useState } from "react";
import { useExercises } from "@/hooks/useExercises";
import { groupExercises } from "@/lib/workout";
import type { Exercise } from "@/types/domain";

interface ExercisePickerOptions {
  multiple: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (exercises: Exercise[]) => void;
}

export const useExercisePicker = ({ multiple, onOpenChange, onSelect }: ExercisePickerOptions) => {
  const { data: exercises = [] } = useExercises();
  const [search, setSearch] = useState("");
  // Kept in the order the exercises were picked: that is the order they are added in.
  const [selected, setSelected] = useState<Exercise[]>([]);

  const reset = () => {
    setSearch("");
    setSelected([]);
  };

  const changeOpen = (next: boolean) => {
    onOpenChange(next);
    if (!next) reset();
  };

  const remove = (exerciseId: string) =>
    setSelected((current) => current.filter((item) => item.id !== exerciseId));

  const pick = (exercise: Exercise) => {
    if (!multiple) {
      onSelect([exercise]);
      reset();
      return;
    }
    // The search stays as typed, so several matches can be picked in a row.
    setSelected((current) =>
      current.some((item) => item.id === exercise.id)
        ? current.filter((item) => item.id !== exercise.id)
        : [...current, exercise],
    );
  };

  const confirm = () => {
    onSelect(selected);
    reset();
  };

  return {
    groups: groupExercises(exercises, search),
    search,
    setSearch,
    selected,
    selectedIds: selected.map((exercise) => exercise.id),
    confirmLabel:
      selected.length === 0
        ? "Add exercises"
        : `Add ${selected.length} ${selected.length === 1 ? "exercise" : "exercises"}`,
    changeOpen,
    pick,
    remove,
    confirm,
  };
};
