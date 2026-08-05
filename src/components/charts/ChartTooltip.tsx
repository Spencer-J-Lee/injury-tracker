import { formatTimestamp } from '@/lib/dates';
import { chartColors as colors } from '@/components/charts/chartColors';
import type {
  ChartPoint,
  TrendChartSeries,
} from '@/components/charts/TrendChart';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  series: TrendChartSeries[];
}

export function ChartTooltip({ active, payload, series }: ChartTooltipProps) {
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
