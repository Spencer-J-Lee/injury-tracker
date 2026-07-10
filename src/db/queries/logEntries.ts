import { db } from "@/db/schema";
import type { LogEntry } from "@/types/models";

export interface LogSessionInjuryInput {
  injuryId: string;
  painLevel?: number;
  painFrequency?: number;
  remedyIds: string[];
  triggerIds: string[];
}

export interface CreateLogSessionInput {
  timestamp: string;
  notes?: string;
  injuries: LogSessionInjuryInput[];
}

export async function createLogSession(
  input: CreateLogSessionInput,
): Promise<LogEntry[]> {
  const sessionId = crypto.randomUUID();
  const now = new Date().toISOString();
  const rows: LogEntry[] = input.injuries.map((entry) => ({
    id: crypto.randomUUID(),
    sessionId,
    injuryId: entry.injuryId,
    timestamp: input.timestamp,
    painLevel: entry.painLevel,
    painFrequency: entry.painFrequency,
    remedyIds: entry.remedyIds,
    triggerIds: entry.triggerIds,
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  }));
  await db.logEntries.bulkAdd(rows);
  return rows;
}

export function listLogEntriesForInjury(injuryId: string, limit?: number) {
  const collection = db.logEntries
    .where("[injuryId+timestamp]")
    .between([injuryId, ""], [injuryId, "￿"])
    .reverse();
  return limit ? collection.limit(limit).toArray() : collection.toArray();
}

export function listRecentLogEntries(limit = 10) {
  return db.logEntries.orderBy("timestamp").reverse().limit(limit).toArray();
}

export async function getLastLogEntryForInjury(injuryId: string) {
  const [latest] = await listLogEntriesForInjury(injuryId, 1);
  return latest;
}

export interface UpdateLogEntryInput {
  timestamp: string;
  painLevel: number | undefined;
  painFrequency: number | undefined;
  remedyIds: string[];
  triggerIds: string[];
  notes: string | undefined;
}

export async function updateLogEntry(id: string, changes: UpdateLogEntryInput) {
  await db.logEntries.update(id, {
    ...changes,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteLogSession(sessionId: string) {
  await db.logEntries.where("sessionId").equals(sessionId).delete();
}

export async function deleteLogEntry(id: string) {
  await db.logEntries.delete(id);
}
