import Dexie, { type EntityTable } from 'dexie'
import type { Injury, Remedy, LogEntry, AppMeta } from '@/types/models'

export const db = new Dexie('injury-tracker') as Dexie & {
  injuries: EntityTable<Injury, 'id'>
  remedies: EntityTable<Remedy, 'id'>
  logEntries: EntityTable<LogEntry, 'id'>
  meta: EntityTable<AppMeta, 'key'>
}

db.version(1).stores({
  injuries: 'id, status, archivedAt',
  remedies: 'id, injuryId, type, archivedAt',
  logEntries: 'id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds',
  meta: 'key',
})
