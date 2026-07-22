import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useLogEntriesForInjury } from "@/hooks/useLogEntriesForInjury";
import { isWithinRange } from "@/lib/dates";
import { chartColors as colors } from "@/components/charts/chartColors";

interface ChartPoint {
  timestamp: string;
  painLevel?: number;
  painFrequency?: number;
}

export function MiniPainTrendChart({ injuryId }: { injuryId: string }) {
  const entries = useLogEntriesForInjury(injuryId);

  const data = useMemo<ChartPoint[]>(() => {
    return (entries ?? [])
      .filter(
        (e) =>
          (e.painLevel !== undefined || e.painFrequency !== undefined) &&
          isWithinRange(e.timestamp, "7d"),
      )
      .map((e) => ({
        timestamp: e.timestamp,
        painLevel: e.painLevel,
        painFrequency: e.painFrequency,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [entries]);

  if (data.length === 0) return null;

  return (
    <div className="pointer-events-none h-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke={colors.grid} strokeWidth={1} />
          <YAxis yAxisId="left" domain={[0, 10]} hide width={0} />
          <YAxis yAxisId="right" domain={[0, 100]} hide width={0} />
          <ReferenceLine
            yAxisId="left"
            y={5}
            stroke={colors.grid}
            strokeDasharray="4 4"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="painLevel"
            stroke={colors.line}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="painFrequency"
            stroke={colors.frequencyLine}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
