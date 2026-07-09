import { useLiveQuery } from 'dexie-react-hooks'
import { getLastLogEntryForInjury } from '@/db/queries/logEntries'

export function useLastLogEntryForInjury(injuryId: string) {
  return useLiveQuery(() => getLastLogEntryForInjury(injuryId), [injuryId])
}
