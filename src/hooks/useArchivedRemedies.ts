import { useLiveQuery } from 'dexie-react-hooks';
import { listArchivedRemediesForInjury } from '@/db/queries/remedies';

export function useArchivedRemedies(injuryId: string | undefined) {
  return useLiveQuery(
    () => (injuryId ? listArchivedRemediesForInjury(injuryId) : []),
    [injuryId],
    [],
  );
}
