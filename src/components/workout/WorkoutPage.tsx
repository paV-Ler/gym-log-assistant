import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/PageStatus";
import { useWorkoutDraft } from "@/hooks/useWorkoutDraft";
import { WorkoutForm } from "./WorkoutForm";

export function WorkoutPage() {
  const draft = useWorkoutDraft();

  return (
    <>
      <PageHeader title="Workout" description="Log a training session" />
      {draft.isPending ? (
        <LoadingState label="Loading…" />
      ) : (
        // Rendered only once the stored draft is known, because the form reads it on mount.
        <WorkoutForm initial={draft.data ?? null} />
      )}
    </>
  );
}
