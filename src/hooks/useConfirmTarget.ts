import { useState } from 'react';

export function useConfirmTarget<T extends { id: string }>(items: T[]) {
  const [targetId, setTargetId] = useState<string | null>(null);
  const target = items.find((item) => item.id === targetId);

  return {
    target,
    confirm: (id: string) => setTargetId(id),
    clear: () => setTargetId(null),
  };
}
