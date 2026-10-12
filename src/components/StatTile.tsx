import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/Sparkline";
import { Surface } from "@/components/Surface";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

export interface CountedValue {
  amount: number;
  format: (amount: number) => string;
}

export interface TileTrend {
  direction: "up" | "down";
  // Green only where up is plainly good, such as more training; body weight has no good direction.
  positive?: boolean;
}

interface StatTileProps {
  label: string;
  value: string | CountedValue;
  detail?: string;
  footnote?: string;
  trend?: TileTrend | undefined;
  series?: readonly number[] | undefined;
  emphasis?: boolean;
}

const TREND_ICON = { up: ArrowUpRight, down: ArrowDownRight };

function CountUp({ amount, format }: CountedValue) {
  return <>{format(useCountUp(amount))}</>;
}

export function StatTile({
  label,
  value,
  detail,
  footnote,
  trend,
  series,
  emphasis = false,
}: StatTileProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;
  const trendIcon = TrendIcon && <TrendIcon aria-hidden="true" className="size-3.5 shrink-0" />;

  return (
    <Surface className="relative overflow-hidden">
      {series && <Sparkline values={series} className="absolute inset-x-0 bottom-0 h-8 w-full" />}
      {/* The sparkline gets a band of its own under the text, so it never runs through it. */}
      <div className={cn("relative", series && "pb-8")}>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-2 flex items-center gap-1.5 text-xl font-semibold tabular md:text-2xl",
            emphasis && "text-primary",
          )}
        >
          <span className="min-w-0 break-words">
            {typeof value === "string" ? value : <CountUp {...value} />}
          </span>
          {!detail && trendIcon && <span className="text-muted-foreground">{trendIcon}</span>}
        </p>
        {detail && (
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs tabular",
              trend?.positive ? "text-positive" : "text-muted-foreground",
            )}
          >
            {trendIcon}
            {detail}
          </p>
        )}
        {footnote && <p className="mt-2 text-xs text-muted-foreground">{footnote}</p>}
      </div>
    </Surface>
  );
}
