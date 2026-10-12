import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SectionTitle } from "@/components/SectionTitle";
import { Surface } from "@/components/Surface";
import { Button } from "@/components/ui/button";
import { StorageWriteError } from "@/data";
import { useNow } from "@/hooks/useNow";
import { useDeletePlannedWorkout, usePlannedWorkouts } from "@/hooks/usePlannedWorkouts";
import { UNTITLED_PLAN } from "@/lib/planned";
import type { PlannedWorkout } from "@/types/domain";
import { PlanRow } from "./PlanRow";
import { PlanWorkoutDialog } from "./PlanWorkoutDialog";

interface UpcomingWorkoutsProps {
  activePlanId: string | undefined;
  onStart: (plan: PlannedWorkout) => void;
}

export function UpcomingWorkouts({ activePlanId, onStart }: UpcomingWorkoutsProps) {
  const { data: plans = [] } = usePlannedWorkouts();
  const deletePlan = useDeletePlannedWorkout();
  const now = useNow();
  const [planning, setPlanning] = useState(false);
  const [deleting, setDeleting] = useState<PlannedWorkout | null>(null);
  // The plan stays set while the dialog closes, so its closing animation still has content.
  const [editing, setEditing] = useState<{ plan: PlannedWorkout; session: number } | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (plan: PlannedWorkout) => {
    // A new session remounts the dialog, dropping what an earlier, cancelled edit left in it.
    setEditing((current) => ({ plan, session: (current?.session ?? 0) + 1 }));
    setEditOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deletePlan.mutateAsync(deleting.id);
      toast.success("Plan deleted");
    } catch (cause) {
      toast.error(cause instanceof StorageWriteError ? cause.message : "Could not delete plan");
    }
  };

  return (
    <Surface as="section" aria-label="Upcoming workouts" className="mb-6">
      <SectionTitle
        title="Upcoming"
        action={
          <Button variant="outline" size="sm" onClick={() => setPlanning(true)}>
            <CalendarPlus /> Plan workout
          </Button>
        }
      />

      {plans.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Nothing planned. Plan a workout to see how long is left until it.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {plans.map((plan) => (
            <PlanRow
              key={plan.id}
              plan={plan}
              now={now}
              inProgress={plan.id === activePlanId}
              onStart={() => onStart(plan)}
              onEdit={() => openEdit(plan)}
              onDelete={() => setDeleting(plan)}
            />
          ))}
        </ul>
      )}

      <PlanWorkoutDialog open={planning} onOpenChange={setPlanning} />
      {editing && (
        <PlanWorkoutDialog
          key={editing.session}
          plan={editing.plan}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete planned workout?"
        description={`“${deleting?.title ?? UNTITLED_PLAN}” will be removed from your upcoming workouts.`}
        confirmLabel="Delete"
        onConfirm={() => void confirmDelete()}
      />
    </Surface>
  );
}
