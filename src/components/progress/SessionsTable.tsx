import { Link } from "@tanstack/react-router";
import { SectionTitle } from "@/components/SectionTitle";
import { RECORD_ROW, RECORD_TEXT } from "@/components/record-row";
import { Surface } from "@/components/Surface";
import { formatDay } from "@/lib/date";
import { formatNumber } from "@/lib/number";
import type { ExercisePoint, PersonalRecords } from "@/lib/progress";
import { cn } from "@/lib/utils";

const isRecordDate = (records: PersonalRecords | null, date: string): boolean => {
  if (!records) return false;
  return [records.maxWeight, records.bestE1RM, records.maxVolume].some(
    (record) => record.date === date,
  );
};

function SessionDate({ point }: { point: ExercisePoint }) {
  const [workoutId] = point.workoutIds;
  const label = formatDay(point.date);
  if (!workoutId) return <>{label}</>;
  return (
    <Link
      to="/history/$workoutId"
      params={{ workoutId }}
      className="hover:text-primary hover:underline"
    >
      {label}
    </Link>
  );
}

interface SessionsTableProps {
  /** Ascending by date; the table lists them newest first. */
  points: ExercisePoint[];
  records: PersonalRecords | null;
}

// On phones `mobile-sessions` turns each row into a grid captioned by `data-label`.
export function SessionsTable({ points, records }: SessionsTableProps) {
  return (
    <Surface as="section">
      <SectionTitle title="Sessions" className="mb-3" />
      <div className="overflow-x-auto">
        <table className="mobile-sessions w-full text-sm tabular" aria-label="Sessions">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 pl-3 font-normal">Date</th>
              <th className="pb-2 font-normal">Sets</th>
              <th className="pb-2 font-normal">Top weight</th>
              <th className="pb-2 font-normal">Est. 1RM</th>
              <th className="pb-2 pr-3 text-right font-normal">Volume</th>
            </tr>
          </thead>
          <tbody>
            {[...points].reverse().map((point) => {
              const record = isRecordDate(records, point.date);
              return (
                <tr
                  key={point.date}
                  data-record={record || undefined}
                  className={cn("border-t border-border", record && RECORD_ROW)}
                >
                  <td className="py-2 pl-3">
                    <SessionDate point={point} />
                    {record && <span className={cn("ml-2 text-xs", RECORD_TEXT)}>Record</span>}
                  </td>
                  <td data-label="Sets">{point.sets}</td>
                  <td data-label="Top weight">
                    {formatNumber(point.topWeight)} kg × {point.topReps}
                  </td>
                  <td data-label="Est. 1RM">{formatNumber(point.bestE1RM)} kg</td>
                  <td data-label="Volume" className="pr-3 text-right">
                    {formatNumber(point.volume)} kg
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}
