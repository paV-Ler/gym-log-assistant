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
import type { BodyWeightEntry } from "@/types/domain";

const TICK_GAP = { mobile: 50, desktop: 20 };

/** Body weight moves by a kilo or two, so the axis stays tight around the data. */
const AXIS_HEADROOM_SHARE = 0.01;

function EntryTooltip(props: TooltipProps<BodyWeightEntry>) {
  const entry = activeRow(props);
  if (!entry) return null;
  return (
    <ChartTooltip title={formatDay(entry.date)}>
      <p>{formatNumber(entry.weight)} kg</p>
    </ChartTooltip>
  );
}

interface BodyWeightChartProps {
  entries: BodyWeightEntry[];
}

// Default export so the page can lazy-load Recharts.
export default function BodyWeightChart({ entries }: BodyWeightChartProps) {
  const mobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const scale = axisScale(
    entries.map((entry) => entry.weight),
    yTickCount(mobile),
    AXIS_HEADROOM_SHARE,
  );
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={entries} margin={CHART_MARGIN}>
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
          <Tooltip content={<EntryTooltip />} cursor={{ stroke: AXIS_STROKE }} />
          <Area
            type="monotone"
            dataKey="weight"
            stroke={SERIES_COLOR}
            strokeWidth={2}
            fill={AREA_FILL}
            fillOpacity={1}
            dot={{ r: 3, fill: SERIES_COLOR, stroke: SERIES_COLOR }}
            activeDot={{ r: 5 }}
            isAnimationActive={!reducedMotion}
            {...SERIES_ANIMATION}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
