import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Repeat } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { StorageWriteError } from "@/data";
import { useSaveWorkoutDraft, useWorkoutDraft } from "@/hooks/useWorkoutDraft";
import { draftFromRepeat, isDraftEmpty } from "@/lib/draft";
import type { Workout } from "@/types/domain";

interface RepeatWorkoutButtonProps {
  workout: Workout;
  className?: string;
}

export function RepeatWorkoutButton({ workout, className }: RepeatWorkoutButtonProps) {
  const navigate = useNavigate();
  const draft = useWorkoutDraft();
  const saveDraft = useSaveWorkoutDraft();
  const [confirmingReplace, setConfirmingReplace] = useState(false);

  const repeat = async () => {
    try {
      await saveDraft.mutateAsync(draftFromRepeat(workout));
    } catch (cause) {
      toast.error(cause instanceof StorageWriteError ? cause.message : "Could not repeat workout");
      return;
    }
    await navigate({ to: "/" });
  };

  const requestRepeat = () => {
    if (draft.data && !isDraftEmpty(draft.data)) setConfirmingReplace(true);
    else void repeat();
  };

  return (
    <>
      <Button
        className={className}
        disabled={draft.isPending || saveDraft.isPending}
        onClick={requestRepeat}
      >
        <Repeat /> Repeat
      </Button>
      <ConfirmDialog
        open={confirmingReplace}
        onOpenChange={setConfirmingReplace}
        title="Replace current workout?"
        description="Repeating this workout discards the exercises and sets you have not saved."
        confirmLabel="Replace"
        onConfirm={() => void repeat()}
      />
    </>
  );
}
