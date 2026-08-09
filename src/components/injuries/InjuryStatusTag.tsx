import type { InjuryStatus } from '@/types/models';
import { statusLabels } from '@/lib/injuryStatus';
import { KeyValueTag } from '@/components/ui/KeyValueTag';

export function InjuryStatusTag({ status }: { status: InjuryStatus }) {
  return (
    <KeyValueTag
      label="STATUS"
      value={statusLabels[status]}
      valueClassName="text-ink-secondary"
    />
  );
}
