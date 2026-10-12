import { cn } from "@/lib/utils";

const WIDTH = 100;
const HEIGHT = 32;
// Keeps the line clear of the top edge and leaves the fill something to stand on.
const INSET = 4;

const linePoints = (values: readonly number[]): string => {
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * WIDTH;
      const y = HEIGHT - INSET - ((value - min) / range) * (HEIGHT - 2 * INSET);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

interface SparklineProps {
  values: readonly number[];
  className?: string;
}

// Decoration behind a figure, not a chart to read: no axes, no tooltip, hidden from screen readers.
export function Sparkline({ values, className }: SparklineProps) {
  if (values.length < 2) return null;
  const line = linePoints(values);
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className={cn("pointer-events-none text-primary", className)}
    >
      <polygon
        points={`0,${HEIGHT} ${line} ${WIDTH},${HEIGHT}`}
        fill="currentColor"
        opacity={0.08}
      />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.45}
      />
    </svg>
  );
}
