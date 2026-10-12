import { useState, type FormEvent } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useCreatePlannedWorkout, useUpdatePlannedWorkout } from "@/hooks/usePlannedWorkouts";
import { isIsoDate, isTimeOfDay, todayLocal, tomorrowLocal } from "@/lib/date";
import { exerciseSnapshot } from "@/lib/draft";
import type { Exercise, PlannedExercise, PlannedWorkout } from "@/types/domain";

const DEFAULT_TIME = "18:00";

interface PlanWorkoutFormOptions {
  // The plan being edited; leave out to plan a new workout.
  plan?: PlannedWorkout | undefined;
  onSaved: () => void;
}

export const usePlanWorkoutForm = ({ plan, onSaved }: PlanWorkoutFormOptions) => {
  const create = useCreatePlannedWorkout();
  const update = useUpdatePlannedWorkout();
  const [pickedDate, setDate] = useState(() => plan?.date ?? tomorrowLocal());
  const [time, setTime] = useState(plan?.time ?? DEFAULT_TIME);
  const [title, setTitle] = useState(plan?.title ?? "");
  const [exercises, setExercises] = useState<PlannedExercise[]>(plan?.exercises ?? []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [timeError, setTimeError] = useState("");
  const [exercisesError, setExercisesError] = useState("");
  const [saveError, setSaveError] = useState("");

  // The dialog stays mounted, so a date picked days ago can have slipped into the past.
  const today = todayLocal();
  const date = pickedDate >= today ? pickedDate : tomorrowLocal();

  const clearErrors = () => {
    setTimeError("");
    setExercisesError("");
    setSaveError("");
  };

  const reset = () => {
    setDate(tomorrowLocal());
    setTime(DEFAULT_TIME);
    setTitle("");
    setExercises([]);
    clearErrors();
  };

  const changeTime = (next: string) => {
    setTime(next);
    setTimeError("");
  };

  const addExercises = (picked: Exercise[]) => {
    setExercises((current) => [...current, ...picked.map(exerciseSnapshot)]);
    setExercisesError("");
    setPickerOpen(false);
  };

  const removeExercise = (exerciseId: string) =>
    setExercises((current) => current.filter((item) => item.exerciseId !== exerciseId));

  const moveExercise = (from: number, to: number) =>
    setExercises((current) => arrayMove(current, from, to));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();
    const validTime = isTimeOfDay(time);
    if (!validTime) setTimeError("Pick a time");
    if (exercises.length === 0) setExercisesError("Add at least one exercise");
    if (!validTime || exercises.length === 0 || !isIsoDate(date)) return;

    const name = title.trim();
    const data = { date, time, exercises, ...(name ? { title: name } : {}) };
    try {
      if (plan) {
        await update.mutateAsync({ id: plan.id, data });
        toast.success("Plan updated");
        onSaved();
      } else {
        await create.mutateAsync(data);
        toast.success("Workout planned");
        onSaved();
        reset();
      }
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Could not save the plan. Try again.");
    }
  };

  return {
    editing: !!plan,
    today,
    date,
    setDate,
    time,
    changeTime,
    title,
    setTitle,
    exercises,
    addExercises,
    removeExercise,
    moveExercise,
    addedIds: new Set(exercises.map((exercise) => exercise.exerciseId)),
    pickerOpen,
    setPickerOpen,
    timeError,
    exercisesError,
    saveError,
    saving: create.isPending || update.isPending,
    clearErrors,
    submit,
  };
};
