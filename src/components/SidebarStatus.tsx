import { Link } from "@tanstack/react-router";
import { Surface } from "@/components/Surface";
import { useNow } from "@/hooks/useNow";
import { usePlannedWorkouts } from "@/hooks/usePlannedWorkouts";
import { useWorkouts } from "@/hooks/useWorkouts";
import { weeklyStreak } from "@/lib/dashboard";
import { countdown, UNTITLED_PLAN } from "@/lib/planned";
import { cn } from "@/lib/utils";

const CAPTION = "text-xs text-muted-foreground";
const FIGURE = "mt-1 truncate text-sm font-medium text-sidebar-foreground";

export function SidebarStatus() {
  const { data: plans = [] } = usePlannedWorkouts();
  const { data: workouts = [] } = useWorkouts();
  const now = useNow();
  const next = plans[0];
  const streak = weeklyStreak(workouts, now);
  if (!next && streak === 0) return null;

  return (
    <Surface padding="compact" className="mt-auto">
      {next && (
        <Link to="/" className="block rounded-sm">
          <p className={CAPTION}>Next workout</p>
          <p className={FIGURE}>{next.title ?? UNTITLED_PLAN}</p>
          <p className={cn(CAPTION, "tabular mt-0.5")}>{countdown(next, now).label}</p>
        </Link>
      )}
      {streak > 0 && (
        <div className={cn(next && "mt-3 border-t border-border pt-3")}>
          <p className={CAPTION}>Weekly streak</p>
          <p className={cn(FIGURE, "tabular")}>
            {streak} {streak === 1 ? "week" : "weeks"}
          </p>
        </div>
      )}
    </Surface>
  );
}
