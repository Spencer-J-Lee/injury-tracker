import { useLiveQuery } from 'dexie-react-hooks'
import { listJournalEntries } from '@/db/queries/journalEntries'

export function useJournalEntries() {
  return useLiveQuery(() => listJournalEntries(), [], [])
}
