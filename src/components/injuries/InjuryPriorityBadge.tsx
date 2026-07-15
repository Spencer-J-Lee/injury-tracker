import type { InjuryPriority } from "@/types/models";
import { Badge } from "@/components/ui/Badge";

const priorityConfig: Record<
  InjuryPriority,
  { label: string; tone: "indigo" | "amber" | "orange" | "red" }
> = {
  low: { label: "Low", tone: "indigo" },
  medium: { label: "Medium", tone: "amber" },
  high: { label: "High", tone: "orange" },
  urgent: { label: "Urgent", tone: "red" },
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
