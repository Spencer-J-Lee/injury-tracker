import { useMorningCheckInsForInjury } from "@/hooks/useMorningCheckInsForInjury";
import { chartColors as colors } from "@/components/charts/chartColors";
import { TrendChart } from "@/components/charts/TrendChart";
import type { MorningCheckIn } from "@/types/models";

export function MorningTrendChart({ injuryId }: { injuryId: string }) {
  const entries = useMorningCheckInsForInjury(injuryId);

  return (
    <TrendChart<MorningCheckIn>
      title="Resting pain & stiffness over time"
      emptyText="No rated check-ins in this range yet."
      entries={entries}
      getTimestamp={(e) => e.timestamp}
      isRated={(e) => e.painLevel !== undefined || e.stiffnessLevel !== undefined}
      toPoint={(e) => ({
        painLevel: e.painLevel,
        stiffnessLevel: e.stiffnessLevel,
      })}
      axes={[
        { id: "left", domain: [0, 10], ticks: [0, 5, 10], color: colors.muted },
      ]}
      referenceLine={{ yAxisId: "left", y: 5 }}
      series={[
        {
          dataKey: "painLevel",
          legendLabel: "Resting pain (0-10)",
          color: colors.line,
          yAxisId: "left",
          tooltipFormatter: (v) => `${v}/10 resting pain`,
        },
        {
          dataKey: "stiffnessLevel",
          legendLabel: "Stiffness (0-10)",
          color: colors.frequencyLine,
          yAxisId: "left",
          tooltipFormatter: (v) => `${v}/10 stiffness`,
        },
      ]}
    />
  );
}
