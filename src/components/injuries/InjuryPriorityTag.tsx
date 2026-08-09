import type { InjuryPriority } from '@/types/models';
import { KeyValueTag } from '@/components/ui/KeyValueTag';

const priorityConfig: Record<
  InjuryPriority,
  { label: string; colorClass: string }
> = {
  urgent: { label: 'Urgent', colorClass: 'text-[oklch(0.72_0.18_25)]' },
  high: { label: 'High', colorClass: 'text-[oklch(0.76_0.15_55)]' },
  medium: { label: 'Medium', colorClass: 'text-[oklch(0.8_0.14_85)]' },
  low: { label: 'Low', colorClass: 'text-[oklch(0.7_0.16_150)]' },
};

export function InjuryPriorityTag({
  priority,
}: {
  priority: InjuryPriority | null;
}) {
  if (priority === null) return null;
  const config = priorityConfig[priority];
  return (
    <KeyValueTag
      label="PRIO"
      value={config.label}
      valueClassName={config.colorClass}
    />
  );
}
