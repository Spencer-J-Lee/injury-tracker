import type { InjuryPriority } from "@/types/models";
import { Badge } from "@/components/ui/Badge";

const priorityConfig: Record<
  InjuryPriority,
  { label: string; tone: "slate" | "indigo" | "amber" | "red" }
> = {
  low: { label: "Low", tone: "slate" },
  medium: { label: "Medium", tone: "indigo" },
  high: { label: "High", tone: "amber" },
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
