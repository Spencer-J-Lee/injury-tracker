import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  formatShortDate,
  formatTimestamp,
  isWithinRange,
  type TrendRange,
} from "@/lib/dates";
import { chartColors as colors } from "@/components/charts/chartColors";

const RANGES: { value: TrendRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "all", label: "All" },
];

export interface TrendChartAxis {
  id: "left" | "right";
  domain: [number, number];
  ticks: number[];
  tickFormatter?: (value: number) => string;
  color: string;
}

export interface TrendChartSeries {
  dataKey: string;
  legendLabel: string;
  color: string;
  yAxisId: "left" | "right";
  tooltipFormatter: (value: number) => string;
}

type ChartPoint = { timestamp: string } & Record<string, string | number | undefined>;

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  series: TrendChartSeries[];
}

function ChartTooltip({ active, payload, series }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div
      className="rounded-lg border px-4 py-3 text-lg shadow-md"
      style={{
        background: colors.surface,
        borderColor: colors.grid,
        color: colors.secondary,
      }}
    >
      <p style={{ color: colors.muted }}>{formatTimestamp(point.timestamp)}</p>
      {series.map((s) => {
        const value = point[s.dataKey];
        return value === undefined ? null : (
          <p
            key={s.dataKey}
            className="font-semibold"
            style={{ color: s.color }}
          >
            {s.tooltipFormatter(value as number)}
          </p>
        );
      })}
    </div>
  );
}

interface TrendChartProps<T> {
  title: string;
  emptyText: string;
  entries: T[] | undefined;
  getTimestamp: (entry: T) => string;
  toPoint: (entry: T) => Record<string, number | undefined>;
  isRated: (entry: T) => boolean;
  series: TrendChartSeries[];
  axes: TrendChartAxis[];
  referenceLine?: { yAxisId: "left" | "right"; y: number };
}

export function TrendChart<T>({
  title,
  emptyText,
  entries,
  getTimestamp,
  toPoint,
  isRated,
  series,
  axes,
  referenceLine,
}: TrendChartProps<T>) {
  const [range, setRange] = useState<TrendRange>("7d");

  const data = useMemo<ChartPoint[]>(() => {
    return (entries ?? [])
      .filter((e) => isRated(e) && isWithinRange(getTimestamp(e), range))
      .map((e) => ({ timestamp: getTimestamp(e), ...toPoint(e) }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [entries, range, getTimestamp, toPoint, isRated]);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-ink-emphasis text-lg font-semibold">
          {title}
        </h3>
        <SegmentedControl options={RANGES} value={range} onChange={setRange} />
      </div>

      {data.length === 0 ? (
        <p className="text-ink-muted text-lg">{emptyText}</p>
      ) : (
        <>
          <div className="text-ink-muted mb-3.5 flex items-center gap-5">
            {series.map((s) => (
              <span key={s.dataKey} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: s.color }}
                />
                {s.legendLabel}
              </span>
            ))}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={colors.grid} strokeWidth={1} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatShortDate}
                  interval="preserveStartEnd"
                  minTickGap={32}
                  tick={{ fill: colors.muted, fontSize: 12 }}
                  axisLine={{ stroke: colors.grid }}
                  tickLine={false}
                  tickMargin={6}
                />
                {axes.map((axis) => (
                  <YAxis
                    key={axis.id}
                    yAxisId={axis.id}
                    orientation={axis.id === "right" ? "right" : undefined}
                    domain={axis.domain}
                    ticks={axis.ticks}
                    tickFormatter={axis.tickFormatter}
                    tick={{ fill: axis.color, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width="auto"
                  />
                ))}
                {referenceLine && (
                  <ReferenceLine
                    yAxisId={referenceLine.yAxisId}
                    y={referenceLine.y}
                    stroke={colors.grid}
                    strokeDasharray="4 4"
                  />
                )}
                <Tooltip content={<ChartTooltip series={series} />} />
                {series.map((s) => (
                  <Line
                    key={s.dataKey}
                    yAxisId={s.yAxisId}
                    type="monotone"
                    dataKey={s.dataKey}
                    stroke={s.color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dot={{
                      r: 3,
                      fill: s.color,
                      stroke: colors.surface,
                      strokeWidth: 1,
                    }}
                    activeDot={{
                      r: 5,
                      fill: s.color,
                      stroke: colors.surface,
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  );
}
