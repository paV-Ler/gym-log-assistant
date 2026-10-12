export const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };
export const AXIS_STROKE = "var(--border)";
export const SERIES_COLOR = "var(--chart-1)";
export const CHART_MARGIN = { top: 10, right: 16, left: 0, bottom: 0 };
// Keeps the first and last date labels clear of the axis.
export const X_AXIS_PADDING = { left: 12, right: 12 };

export const AREA_GRADIENT_ID = "series-area";
export const AREA_FILL = `url(#${AREA_GRADIENT_ID})`;
export const AREA_GRADIENT_STOPS = [
  { offset: "0%", opacity: 0.28 },
  { offset: "100%", opacity: 0 },
] as const;

export const SERIES_ANIMATION = { animationDuration: 700, animationEasing: "ease-out" } as const;

export const GRID_PROPS = { stroke: AXIS_STROKE, strokeDasharray: "3 3", vertical: false };

export const yTickCount = (mobile: boolean): number => (mobile ? 4 : 5);

export interface TooltipProps<Row> {
  active?: boolean;
  payload?: { payload: Row }[];
}

export const activeRow = <Row>({ active, payload }: TooltipProps<Row>): Row | undefined =>
  active ? payload?.[0]?.payload : undefined;

// `minShare` is the least headroom as a share of the largest value. Lower it for data that
// moves little, such as body weight, or the trend flattens out.
const paddedDomain = (values: readonly number[], minShare: number): [number, number] => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = Math.max((max - min) * 0.15, max * minShare, 1);
  return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
};

const NICE_STEPS = [1, 2, 2.5, 5, 10];

export interface AxisScale {
  domain: [number, number];
  ticks: number[];
}

// Evenly spaced round ticks that cover the padded data, e.g. 55, 60, 65, 70, 75, 80.
export const axisScale = (
  values: readonly number[],
  tickCount: number,
  minShare = 0.05,
): AxisScale => {
  const [low, high] = paddedDomain(values, minShare);
  const rough = (high - low) / Math.max(1, tickCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = magnitude * (NICE_STEPS.find((nice) => nice * magnitude >= rough) ?? 10);
  const first = Math.max(0, Math.floor(low / step) * step);
  const ticks = [first];
  while ((ticks.at(-1) ?? high) < high)
    ticks.push(Number((first + ticks.length * step).toFixed(6)));
  return { domain: [first, ticks.at(-1) ?? high], ticks };
};
