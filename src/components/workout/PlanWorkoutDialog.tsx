import { Plus } from "lucide-react";
import { FieldError, FormAlert } from "@/components/FormMessages";
import { SortableList } from "@/components/SortableList";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { PLAN_TITLE_MAX_LENGTH } from "@/lib/limits";
import type { PlannedWorkout } from "@/types/domain";
import { ExercisePicker } from "./ExercisePicker";
import { PlannedExerciseRow } from "./PlannedExerciseRow";
import { usePlanWorkoutForm } from "./usePlanWorkoutForm";

interface PlanWorkoutDialogProps {
  // The plan to edit; leave out to plan a new workout.
  plan?: PlannedWorkout;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanWorkoutDialog({ plan, open, onOpenChange }: PlanWorkoutDialogProps) {
  const form = usePlanWorkoutForm({ plan, onSaved: () => onOpenChange(false) });

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) form.clearErrors();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{form.editing ? "Edit planned workout" : "Plan a workout"}</DialogTitle>
            <DialogDescription>
              It counts in your statistics only after you log its sets.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.submit} noValidate className="space-y-5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="plan-date">Date</Label>
                <DatePicker
                  id="plan-date"
                  min={form.today}
                  value={form.date}
                  onChange={form.setDate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-time">Time</Label>
                <TimePicker
                  id="plan-time"
                  aria-invalid={!!form.timeError}
                  value={form.time}
                  onChange={form.changeTime}
                />
                {form.timeError && <FieldError>{form.timeError}</FieldError>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-title">
                Title <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="plan-title"
                maxLength={PLAN_TITLE_MAX_LENGTH}
                value={form.title}
                onChange={(event) => form.setTitle(event.target.value)}
                placeholder="Leg day"
              />
            </div>

            <div className="space-y-2">
              <Label asChild>
                <p>Exercises</p>
              </Label>
              {form.exercises.length > 0 && (
                <SortableList
                  ids={form.exercises.map((exercise) => exercise.exerciseId)}
                  layout="vertical"
                  onMove={form.moveExercise}
                >
                  <ul className="divide-y divide-border rounded-md border border-border">
                    {form.exercises.map((exercise) => (
                      <PlannedExerciseRow
                        key={exercise.exerciseId}
                        exercise={exercise}
                        onRemove={() => form.removeExercise(exercise.exerciseId)}
                      />
                    ))}
                  </ul>
                </SortableList>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => form.setPickerOpen(true)}
              >
                <Plus /> Add exercises
              </Button>
              {form.exercisesError && <FieldError>{form.exercisesError}</FieldError>}
            </div>

            {form.saveError && <FormAlert>{form.saveError}</FormAlert>}
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.saving}>
                {form.editing ? "Save changes" : "Plan workout"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ExercisePicker
        title="Add exercises"
        multiple
        open={form.pickerOpen}
        onOpenChange={form.setPickerOpen}
        addedIds={form.addedIds}
        onSelect={form.addExercises}
      />
    </>
  );
}
