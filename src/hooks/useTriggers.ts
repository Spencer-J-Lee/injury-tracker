import { useLiveQuery } from 'dexie-react-hooks'
import { listActiveTriggersForInjury } from '@/db/queries/triggers'

export function useTriggers(injuryId: string | undefined) {
  return useLiveQuery(() => (injuryId ? listActiveTriggersForInjury(injuryId) : []), [injuryId], [])
}
