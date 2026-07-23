import { useLogEntriesForInjury } from "@/hooks/useLogEntriesForInjury";
import { chartColors as colors } from "@/components/charts/chartColors";
import { TrendChart } from "@/components/charts/TrendChart";
import type { LogEntry } from "@/types/models";

export function PainTrendChart({ injuryId }: { injuryId: string }) {
  const entries = useLogEntriesForInjury(injuryId);

  return (
    <TrendChart<LogEntry>
      title="Pain over time"
      emptyText="No rated entries in this range yet."
      entries={entries}
      getTimestamp={(e) => e.timestamp}
      isRated={(e) => e.painLevel !== undefined || e.painFrequency !== undefined}
      toPoint={(e) => ({
        painLevel: e.painLevel,
        painFrequency: e.painFrequency,
      })}
      axes={[
        { id: "left", domain: [0, 10], ticks: [0, 5, 10], color: colors.line },
        {
          id: "right",
          domain: [0, 100],
          ticks: [0, 50, 100],
          tickFormatter: (v) => `${v}%`,
          color: colors.frequencyLine,
        },
      ]}
      referenceLine={{ yAxisId: "left", y: 5 }}
      series={[
        {
          dataKey: "painLevel",
          legendLabel: "Pain intensity (0-10)",
          color: colors.line,
          yAxisId: "left",
          tooltipFormatter: (v) => `${v}/10 intensity`,
        },
        {
          dataKey: "painFrequency",
          legendLabel: "Frequency (0-100%)",
          color: colors.frequencyLine,
          yAxisId: "right",
          tooltipFormatter: (v) => `${v}% frequency`,
        },
      ]}
    />
  );
}
