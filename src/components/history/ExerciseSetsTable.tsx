import { RECORD_ROW, RECORD_TEXT } from "@/components/record-row";
import { bestEpley1RM, epley1RM } from "@/lib/calc";
import { cn } from "@/lib/utils";
import type { WorkoutSet } from "@/types/domain";

// On phones `mobile-detail-table` turns each row into a grid captioned by `data-label`.
export function ExerciseSetsTable({ sets }: { sets: WorkoutSet[] }) {
  const best = bestEpley1RM(sets);
  // Only the first of equal sets is marked, so identical sets do not all light up.
  const bestIndex =
    sets.length > 1 && best > 0
      ? sets.findIndex((set) => epley1RM(set.weight, set.reps) === best)
      : -1;
  return (
    <div className="overflow-x-auto">
      <table className="mobile-detail-table w-full text-sm tabular">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="pb-2 pl-3 font-normal">#</th>
            <th className="pb-2 font-normal">Weight (kg)</th>
            <th className="pb-2 font-normal">Reps</th>
            <th className="pb-2 pr-3 text-right font-normal">Est. 1RM</th>
          </tr>
        </thead>
        <tbody>
          {sets.map((set, index) => {
            const estimate = epley1RM(set.weight, set.reps);
            const isBest = index === bestIndex;
            return (
              <tr
                key={set.id}
                data-record={isBest || undefined}
                className={cn("border-t border-border", isBest && RECORD_ROW)}
              >
                <td className={cn("py-2 pl-3", isBest && RECORD_TEXT)}>{index + 1}</td>
                <td data-label="Weight (kg)">{set.weight}</td>
                <td data-label="Reps">{set.reps}</td>
                <td data-label="Est. 1RM" className="pr-3 text-right">
                  {isBest && <span className={cn("mr-2 text-xs", RECORD_TEXT)}>Best set</span>}
                  {estimate.toFixed(1)} kg
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
