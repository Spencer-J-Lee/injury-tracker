import { useLiveQuery } from 'dexie-react-hooks';
import { listArchivedTriggersForInjury } from '@/db/queries/triggers';

export function useArchivedTriggers(injuryId: string | undefined) {
  return useLiveQuery(
    () => (injuryId ? listArchivedTriggersForInjury(injuryId) : []),
    [injuryId],
    [],
  );
}
