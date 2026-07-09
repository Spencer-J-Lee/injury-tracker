import { useLiveQuery } from 'dexie-react-hooks'
import { listRemediesForInjury } from '@/db/queries/remedies'

export function useRemedies(injuryId: string | undefined) {
  return useLiveQuery(() => (injuryId ? listRemediesForInjury(injuryId) : []), [injuryId], [])
}
