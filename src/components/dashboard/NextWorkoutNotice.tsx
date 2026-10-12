import { Link } from "@tanstack/react-router";
import { Notice } from "@/components/Notice";
import { Button } from "@/components/ui/button";
import { useNow } from "@/hooks/useNow";
import { usePlannedWorkouts } from "@/hooks/usePlannedWorkouts";
import { countdown, UNTITLED_PLAN } from "@/lib/planned";

export function NextWorkoutNotice() {
  const { data: plans = [] } = usePlannedWorkouts();
  const now = useNow();
  const next = plans[0];
  if (!next) return null;

  return (
    <Notice
      action={
        <Button asChild variant="link" className="h-auto p-0">
          <Link to="/">Open</Link>
        </Button>
      }
    >
      <span className="text-muted-foreground">Next workout: </span>
      {next.title ?? UNTITLED_PLAN}
      <span className="tabular text-muted-foreground">
        {" "}
        · {countdown(next, now).label.toLowerCase()}
      </span>
    </Notice>
  );
}
