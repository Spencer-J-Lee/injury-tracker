import { db } from '@/db/schema'
import type { Injury, LogEntry, Remedy } from '@/types/models'
import { SEED_INJURIES } from '@/db/seedData'

export const SEED_MARKER = ' ·'

function isoOffsetDays(days: number, atHour?: number, atMinute?: number): string {
  const date = new Date(Date.now() + days * 86_400_000)
  if (atHour !== undefined) {
    date.setHours(atHour, atMinute ?? 0, 0, 0)
  }
  return date.toISOString()
}

export async function clearSeedTestData(): Promise<number> {
  return db.transaction('rw', db.injuries, db.remedies, db.logEntries, async () => {
    const seedIds = (await db.injuries.toArray())
      .filter((injury) => injury.name.endsWith(SEED_MARKER))
      .map((injury) => injury.id)

    if (seedIds.length === 0) return 0

    await db.logEntries.where('injuryId').anyOf(seedIds).delete()
    await db.remedies.where('injuryId').anyOf(seedIds).delete()
    await db.injuries.bulkDelete(seedIds)

    return seedIds.length
  })
}

export interface SeedResult {
  injuriesCreated: number
  remediesCreated: number
  logEntriesCreated: number
  injuriesDeleted: number
}

export async function seedTestData(): Promise<SeedResult> {
  const injuriesDeleted = await clearSeedTestData()

  const injuryRows: Injury[] = []
  const remedyRows: Remedy[] = []
  const logEntryRows: LogEntry[] = []

  for (const seed of SEED_INJURIES) {
    const injuryId = crypto.randomUUID()
    const createdAt = isoOffsetDays(-seed.createdDaysAgo)
    injuryRows.push({
      id: injuryId,
      name: `${seed.name}${SEED_MARKER}`,
      description: seed.description,
      status: seed.status,
      createdAt,
      updatedAt: createdAt,
      archivedAt: seed.archivedDaysAgo !== undefined ? isoOffsetDays(-seed.archivedDaysAgo) : undefined,
    })

    const remedyIdByKey = new Map<string, string>()
    for (const remedy of seed.remedies) {
      const remedyId = crypto.randomUUID()
      remedyIdByKey.set(remedy.key, remedyId)
      remedyRows.push({
        id: remedyId,
        injuryId,
        name: remedy.name,
        description: remedy.description,
        type: remedy.type,
        createdAt,
      })
    }

    for (const log of seed.logs) {
      const timestamp = isoOffsetDays(log.offsetDays, log.atHour, log.atMinute)
      const remedyIds = (log.remedyKeys ?? [])
        .map((key) => remedyIdByKey.get(key))
        .filter((id): id is string => id !== undefined)
      logEntryRows.push({
        id: crypto.randomUUID(),
        sessionId: crypto.randomUUID(),
        injuryId,
        timestamp,
        painLevel: log.painLevel,
        painFrequency: log.painFrequency,
        remedyIds,
        notes: log.notes,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    }
  }

  await db.transaction('rw', db.injuries, db.remedies, db.logEntries, async () => {
    await db.injuries.bulkAdd(injuryRows)
    await db.remedies.bulkAdd(remedyRows)
    await db.logEntries.bulkAdd(logEntryRows)
  })

  return {
    injuriesCreated: injuryRows.length,
    remediesCreated: remedyRows.length,
    logEntriesCreated: logEntryRows.length,
    injuriesDeleted,
  }
}
