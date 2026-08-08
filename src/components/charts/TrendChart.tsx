import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  formatShortDate,
  isWithinRange,
  type TrendRange,
} from '@/lib/dates';
import { chartColors as colors } from '@/components/charts/chartColors';
import { ChartTooltip } from '@/components/charts/ChartTooltip';

type SegmentedControlTone = 'accent' | 'orange';

function buildRanges(
  tone: SegmentedControlTone,
): { value: TrendRange; label: string; tone: SegmentedControlTone }[] {
  return [
    { value: '7d', label: '7d', tone },
    { value: '30d', label: '30d', tone },
    { value: '90d', label: '90d', tone },
    { value: 'all', label: 'All', tone },
  ];
}

export interface TrendChartAxis {
  id: 'left' | 'right';
  domain: [number, number];
  ticks: number[];
  tickFormatter?: (value: number) => string;
  color: string;
}

export interface TrendChartSeries {
  dataKey: string;
  legendLabel: string;
  color: string;
  yAxisId: 'left' | 'right';
  tooltipFormatter: (value: number) => string;
}

export type ChartPoint = { timestamp: string } & Record<
  string,
  string | number | undefined
>;

interface TrendChartProps<T> {
  title: string;
  emptyText: string;
  entries: T[] | undefined;
  getTimestamp: (entry: T) => string;
  toPoint: (entry: T) => Record<string, number | undefined>;
  isRated: (entry: T) => boolean;
  series: TrendChartSeries[];
  axes: TrendChartAxis[];
  referenceLine?: { yAxisId: 'left' | 'right'; y: number };
  rangeControlTone?: SegmentedControlTone;
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
  rangeControlTone = 'accent',
}: TrendChartProps<T>) {
  const [range, setRange] = useState<TrendRange>('30d');
  const ranges = useMemo(
    () => buildRanges(rangeControlTone),
    [rangeControlTone],
  );

  const data = useMemo<ChartPoint[]>(() => {
    return (entries ?? [])
      .filter((e) => isRated(e) && isWithinRange(getTimestamp(e), range))
      .map((e) => ({ timestamp: getTimestamp(e), ...toPoint(e) }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [entries, range, getTimestamp, toPoint, isRated]);

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between">
        <h3 className="font-heading text-ink-emphasis text-lg font-semibold">
          {title}
        </h3>
        <SegmentedControl options={ranges} value={range} onChange={setRange} />
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
                <ReferenceArea
                  yAxisId={axes[0].id}
                  x1={data[0].timestamp}
                  x2={data[data.length - 1].timestamp}
                  y1={axes[0].domain[0]}
                  y2={axes[0].domain[1]}
                  fill={colors.plotBackground}
                  stroke="none"
                  ifOverflow="visible"
                />
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
                    orientation={axis.id === 'right' ? 'right' : undefined}
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
