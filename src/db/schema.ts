import Dexie, { type EntityTable } from 'dexie'
import type { Injury, Remedy, Trigger, LogEntry, AppMeta } from '@/types/models'

export const db = new Dexie('injury-tracker') as Dexie & {
  injuries: EntityTable<Injury, 'id'>
  remedies: EntityTable<Remedy, 'id'>
  triggers: EntityTable<Trigger, 'id'>
  logEntries: EntityTable<LogEntry, 'id'>
  meta: EntityTable<AppMeta, 'key'>
}

db.version(1).stores({
  injuries: 'id, status, archivedAt',
  remedies: 'id, injuryId, type, archivedAt',
  logEntries: 'id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds',
  meta: 'key',
})

db.version(2)
  .stores({
    injuries: 'id, status, archivedAt',
    remedies: 'id, injuryId, type, archivedAt',
    triggers: 'id, injuryId, archivedAt',
    logEntries: 'id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds',
    meta: 'key',
  })
  .upgrade((tx) =>
    tx
      .table('logEntries')
      .toCollection()
      .modify((entry) => {
        entry.triggerIds = entry.triggerIds ?? []
      }),
  )
