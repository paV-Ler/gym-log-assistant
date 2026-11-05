import { Surface } from "@/components/Surface";
import { formatDay } from "@/lib/date";
import { formatNumber } from "@/lib/number";
import type { PersonalRecords } from "@/lib/progress";

interface RecordItem {
  label: string;
  value: string;
  meta: string;
}

const recordItems = ({ maxWeight, bestE1RM, maxVolume }: PersonalRecords): RecordItem[] => [
  {
    label: "Heaviest weight",
    value: `${formatNumber(maxWeight.value)} kg × ${maxWeight.reps}`,
    meta: formatDay(maxWeight.date),
  },
  {
    label: "Best estimated 1RM",
    value: `${formatNumber(bestE1RM.value)} kg`,
    meta: `${formatNumber(bestE1RM.weight)} kg × ${bestE1RM.reps} · ${formatDay(bestE1RM.date)}`,
  },
  {
    label: "Most volume in a session",
    value: `${formatNumber(maxVolume.value)} kg`,
    meta: formatDay(maxVolume.date),
  },
];

// One card instead of three tiles: on a phone the records take three short rows, not a screen.
export function RecordStats({ records }: { records: PersonalRecords }) {
  return (
    <Surface as="section" aria-label="Personal records" padding="flush" className="mb-6">
      <ul className="divide-y divide-border md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
        {recordItems(records).map((item) => (
          <li
            key={item.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-4 py-3 md:grid-cols-1 md:content-start md:px-5 md:py-4"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="tabular row-span-2 text-right text-lg font-semibold md:row-span-1 md:mt-2 md:text-left md:text-2xl">
              {item.value}
            </p>
            <p className="tabular mt-0.5 truncate text-xs text-muted-foreground md:mt-1">
              {item.meta}
            </p>
          </li>
        ))}
      </ul>
    </Surface>
  );
}
