import { db } from '@/db/schema'
import type { Remedy, RemedyType } from '@/types/models'

export function listRemediesForInjury(injuryId: string) {
  return db.remedies
    .where('injuryId')
    .equals(injuryId)
    .filter((remedy) => !remedy.archivedAt)
    .toArray()
}

export function listAllRemediesForInjury(injuryId: string) {
  return db.remedies.where('injuryId').equals(injuryId).toArray()
}

export async function createRemedy(input: {
  injuryId: string
  name: string
  description?: string
  type: RemedyType
}): Promise<Remedy> {
  const remedy: Remedy = {
    id: crypto.randomUUID(),
    injuryId: input.injuryId,
    name: input.name,
    description: input.description,
    type: input.type,
    createdAt: new Date().toISOString(),
  }
  await db.remedies.add(remedy)
  return remedy
}

export async function updateRemedy(id: string, changes: Partial<Pick<Remedy, 'name' | 'description'>>) {
  await db.remedies.update(id, changes)
}

export async function archiveRemedy(id: string) {
  await db.remedies.update(id, { archivedAt: new Date().toISOString() })
}

export async function getRemediesByIds(ids: string[]): Promise<Remedy[]> {
  if (ids.length === 0) return []
  const remedies = await db.remedies.bulkGet(ids)
  return remedies.filter((r): r is Remedy => r !== undefined)
}
