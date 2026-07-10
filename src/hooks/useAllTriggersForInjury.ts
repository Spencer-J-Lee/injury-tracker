import { useLiveQuery } from 'dexie-react-hooks'
import { listAllTriggersForInjury } from '@/db/queries/triggers'

export function useAllTriggersForInjury(injuryId: string | undefined) {
  return useLiveQuery(() => (injuryId ? listAllTriggersForInjury(injuryId) : []), [injuryId], [])
}
