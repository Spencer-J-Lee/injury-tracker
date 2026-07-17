import type { InjuryPriority } from "@/types/models";
import { Badge } from "@/components/ui/Badge";

const priorityConfig: Record<
  InjuryPriority,
  { label: string; tone: "amber" | "orange" | "red" }
> = {
  urgent: { label: "URGENT", tone: "red" },
  high: { label: "High", tone: "red" },
  medium: { label: "Medium", tone: "orange" },
  low: { label: "Low", tone: "amber" },
};

export function InjuryPriorityBadge({
  priority,
}: {
  priority: InjuryPriority | null;
}) {
  if (priority === null) return null;
  const config = priorityConfig[priority];
  return (
    <Badge tone={config.tone} weight="bold">
      {config.label}
    </Badge>
  );
}
