import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import {
  activeRow,
  AREA_FILL,
  AREA_GRADIENT_ID,
  AREA_GRADIENT_STOPS,
  axisScale,
  AXIS_STROKE,
  AXIS_TICK,
  CHART_MARGIN,
  GRID_PROPS,
  SERIES_ANIMATION,
  SERIES_COLOR,
  yTickCount,
  X_AXIS_PADDING,
  type TooltipProps,
} from "@/components/charts/chart-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { formatDay, formatDayMonth } from "@/lib/date";
import { formatNumber } from "@/lib/number";
import type { ExercisePoint } from "@/lib/progress";

export type Metric = "topWeight" | "bestE1RM" | "volume";

const TICK_GAP = { mobile: 50, desktop: 5 };

function PointTooltip(props: TooltipProps<ExercisePoint>) {
  const point = activeRow(props);
  if (!point) return null;
  return (
    <ChartTooltip title={formatDay(point.date)}>
      <p>
        Top: {formatNumber(point.topWeight)} kg × {point.topReps}
      </p>
      <p>Est. 1RM: {formatNumber(point.bestE1RM)} kg</p>
      <p>Volume: {formatNumber(point.volume)} kg</p>
    </ChartTooltip>
  );
}

interface ProgressChartProps {
  points: ExercisePoint[];
  metric: Metric;
}

// Default export so the page can lazy-load Recharts.
export default function ProgressChart({ points, metric }: ProgressChartProps) {
  const mobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const scale = axisScale(
    points.map((point) => point[metric]),
    yTickCount(mobile),
  );
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id={AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              {AREA_GRADIENT_STOPS.map((stop) => (
                <stop
                  key={stop.offset}
                  offset={stop.offset}
                  stopColor={SERIES_COLOR}
                  stopOpacity={stop.opacity}
                />
              ))}
            </linearGradient>
          </defs>
          <CartesianGrid {...GRID_PROPS} />
          <XAxis
            minTickGap={mobile ? TICK_GAP.mobile : TICK_GAP.desktop}
            dataKey="date"
            padding={X_AXIS_PADDING}
            tick={AXIS_TICK}
            stroke={AXIS_STROKE}
            tickFormatter={formatDayMonth}
          />
          <YAxis
            domain={scale.domain}
            ticks={scale.ticks}
            tick={AXIS_TICK}
            stroke={AXIS_STROKE}
            width={56}
            tickFormatter={formatNumber}
            unit=" kg"
          />
          <Tooltip content={<PointTooltip />} cursor={{ stroke: AXIS_STROKE }} />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={SERIES_COLOR}
            strokeWidth={2}
            fill={AREA_FILL}
            fillOpacity={1}
            dot={{ r: 4, fill: SERIES_COLOR, stroke: SERIES_COLOR }}
            activeDot={{ r: 6 }}
            isAnimationActive={!reducedMotion}
            {...SERIES_ANIMATION}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
