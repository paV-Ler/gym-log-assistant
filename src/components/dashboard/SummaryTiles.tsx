import { StatTile, type TileTrend } from "@/components/StatTile";
import type { WeekBucket } from "@/lib/dashboard";
import { formatNumber } from "@/lib/number";

/** "+2 vs last week", "−150 kg vs last week" or "±0 vs last week". */
const weekDelta = (difference: number, unit = ""): string => {
  const sign = difference > 0 ? "+" : difference < 0 ? "−" : "±";
  return `${sign}${formatNumber(Math.abs(difference))}${unit} vs last week`;
};

// A week that is still running is usually behind the last one, so only a lead is coloured.
const weekTrend = (difference: number): TileTrend | undefined => {
  if (difference > 0) return { direction: "up", positive: true };
  if (difference < 0) return { direction: "down" };
  return undefined;
};

interface SummaryTilesProps {
  weeks: readonly WeekBucket[];
  workoutsThisMonth: number;
  streak: number;
}

export function SummaryTiles({ weeks, workoutsThisMonth, streak }: SummaryTilesProps) {
  const [lastWeek, thisWeek] = weeks.slice(-2);
  if (!lastWeek || !thisWeek) return null;
  const workoutsDifference = thisWeek.workouts - lastWeek.workouts;
  const volumeDifference = thisWeek.volume - lastWeek.volume;

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 min-[350px]:grid-cols-2 md:gap-4 lg:grid-cols-4">
      <StatTile
        label="Workouts this week"
        value={{ amount: thisWeek.workouts, format: String }}
        detail={weekDelta(workoutsDifference)}
        trend={weekTrend(workoutsDifference)}
        series={weeks.map((week) => week.workouts)}
      />
      <StatTile label="Workouts this month" value={{ amount: workoutsThisMonth, format: String }} />
      <StatTile
        label="Volume this week"
        value={{ amount: thisWeek.volume, format: (kg) => `${formatNumber(kg)} kg` }}
        detail={weekDelta(volumeDifference, " kg")}
        trend={weekTrend(volumeDifference)}
        series={weeks.map((week) => week.volume)}
      />
      <StatTile
        label="Weekly streak"
        value={{
          amount: streak,
          format: (count) => `${count} ${count === 1 ? "week" : "weeks"}`,
        }}
      />
    </div>
  );
}
