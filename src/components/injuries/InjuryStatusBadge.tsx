import type { InjuryStatus } from "@/types/models";
import { Badge } from "@/components/ui/Badge";

const statusConfig: Record<
  InjuryStatus,
  { label: string; tone: "amber" | "indigo" | "green" }
> = {
  active: { label: "Active", tone: "amber" },
  monitoring: { label: "Monitoring", tone: "indigo" },
  resolved: { label: "Resolved", tone: "green" },
};

export function InjuryStatusBadge({ status }: { status: InjuryStatus }) {
  const config = statusConfig[status];
  return (
    <Badge tone={config.tone} weight="bold">
      {config.label}
    </Badge>
  );
}
