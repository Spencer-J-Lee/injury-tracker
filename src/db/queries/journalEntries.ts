import { format } from 'date-fns'
import { db } from '@/db/schema'
import type { JournalEntry } from '@/types/models'

export function listJournalEntries() {
  return db.journalEntries.orderBy('date').reverse().toArray()
}

export async function createJournalEntry(text: string): Promise<JournalEntry> {
  const now = new Date()
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    date: format(now, 'yyyy-MM-dd'),
    text,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
  await db.journalEntries.add(entry)
  return entry
}

export async function updateJournalEntry(id: string, text: string) {
  await db.journalEntries.update(id, { text, updatedAt: new Date().toISOString() })
}

export async function deleteJournalEntry(id: string) {
  await db.journalEntries.delete(id)
}
