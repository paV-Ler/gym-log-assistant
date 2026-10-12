import { Play, Trash2 } from "lucide-react";
import { Hint } from "@/components/Hint";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatWeekdayDay } from "@/lib/date";
import { countdown, UNTITLED_PLAN } from "@/lib/planned";
import { cn } from "@/lib/utils";
import type { PlannedWorkout } from "@/types/domain";

interface PlanRowProps {
  plan: PlannedWorkout;
  now: Date;
  inProgress: boolean;
  onStart: () => void;
  onDelete: () => void;
}

export function PlanRow({ plan, now, inProgress, onStart, onDelete }: PlanRowProps) {
  const { due, label } = countdown(plan, now);
  const title = plan.title ?? UNTITLED_PLAN;
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 py-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
          <span className="min-w-0 break-words">{title}</span>
          <Badge
            variant="outline"
            className={cn("tabular", due ? "border-primary/50 text-primary" : "font-normal")}
          >
            {inProgress ? "In progress" : label}
          </Badge>
        </div>
        <p className="tabular mt-1 text-xs text-muted-foreground">
          {formatWeekdayDay(plan.date)} · {plan.time}
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {plan.exercises.map((exercise) => exercise.exerciseName).join(", ")}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!inProgress && (
          <Button size="sm" variant={due ? "default" : "outline"} onClick={onStart}>
            <Play /> Start
          </Button>
        )}
        <Hint label="Delete plan">
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Delete planned workout ${title}`}
            onClick={onDelete}
            className="text-muted-foreground hover:text-danger"
          >
            <Trash2 />
          </Button>
        </Hint>
      </div>
    </li>
  );
}
