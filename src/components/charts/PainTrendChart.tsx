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
import { TogglePill } from "@/components/ui/TogglePill";
import { useLogEntriesForInjury } from "@/hooks/useLogEntriesForInjury";
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

interface ChartPoint {
  timestamp: string;
  painLevel?: number;
  painFrequency?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  colors: typeof colors;
}

function ChartTooltip({ active, payload, colors }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-sm shadow-md"
      style={{
        background: colors.surface,
        borderColor: colors.grid,
        color: colors.secondary,
      }}
    >
      <p style={{ color: colors.muted }} className="text-xs">
        {formatTimestamp(point.timestamp)}
      </p>
      {point.painLevel !== undefined && (
        <p className="font-semibold" style={{ color: colors.line }}>
          {point.painLevel}/10 intensity
        </p>
      )}
      {point.painFrequency !== undefined && (
        <p className="font-semibold" style={{ color: colors.frequencyLine }}>
          {point.painFrequency}% frequency
        </p>
      )}
    </div>
  );
}

export function PainTrendChart({ injuryId }: { injuryId: string }) {
  const [range, setRange] = useState<TrendRange>("7d");
  const entries = useLogEntriesForInjury(injuryId);

  const data = useMemo<ChartPoint[]>(() => {
    return (entries ?? [])
      .filter(
        (e) =>
          (e.painLevel !== undefined || e.painFrequency !== undefined) &&
          isWithinRange(e.timestamp, range),
      )
      .map((e) => ({
        timestamp: e.timestamp,
        painLevel: e.painLevel,
        painFrequency: e.painFrequency,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [entries, range]);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-ink-emphasis text-sm font-semibold">
          Pain over time
        </h3>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <TogglePill
              key={r.value}
              selected={range === r.value}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </TogglePill>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-ink-muted text-sm">
          No rated entries in this range yet.
        </p>
      ) : (
        <>
          <div className="text-ink-muted mb-2.5 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: colors.line }}
              />
              Pain intensity (0–10)
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: colors.frequencyLine }}
              />
              Frequency (%)
            </span>
          </div>
          <div className="h-[204px]">
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
                  tick={{ fill: colors.muted, fontSize: 10 }}
                  axisLine={{ stroke: colors.grid }}
                  tickLine={false}
                  tickMargin={6}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, 10]}
                  ticks={[0, 5, 10]}
                  tick={{ fill: colors.line, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={20}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: colors.frequencyLine, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <ReferenceLine
                  yAxisId="left"
                  y={5}
                  stroke={colors.grid}
                  strokeDasharray="4 4"
                />
                <Tooltip content={<ChartTooltip colors={colors} />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="painLevel"
                  stroke={colors.line}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={{
                    r: 3,
                    fill: colors.line,
                    stroke: colors.surface,
                    strokeWidth: 1,
                  }}
                  activeDot={{
                    r: 5,
                    fill: colors.line,
                    stroke: colors.surface,
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="painFrequency"
                  stroke={colors.frequencyLine}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={{
                    r: 3,
                    fill: colors.frequencyLine,
                    stroke: colors.surface,
                    strokeWidth: 1,
                  }}
                  activeDot={{
                    r: 5,
                    fill: colors.frequencyLine,
                    stroke: colors.surface,
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  );
}
