import { useLiveQuery } from 'dexie-react-hooks'
import { getInjury } from '@/db/queries/injuries'

export function useInjury(id: string | undefined) {
  return useLiveQuery(() => (id ? getInjury(id) : undefined), [id])
}
