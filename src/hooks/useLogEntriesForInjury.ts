import { useLiveQuery } from 'dexie-react-hooks'
import { listLogEntriesForInjury } from '@/db/queries/logEntries'

export function useLogEntriesForInjury(injuryId: string | undefined, limit?: number) {
  return useLiveQuery(
    () => (injuryId ? listLogEntriesForInjury(injuryId, limit) : []),
    [injuryId, limit],
    [],
  )
}
