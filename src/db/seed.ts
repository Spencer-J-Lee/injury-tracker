import { format } from "date-fns";
import { db } from "@/db/schema";
import type {
  Injury,
  LogEntry,
  Remedy,
  Trigger,
  JournalEntry,
} from "@/types/models";
import { SEED_INJURIES, SEED_JOURNAL_ENTRIES } from "@/db/seedData";

export const SEED_MARKER = "꧁꧂";

const LEGACY_SEED_MARKERS: string[] = [];

function isSeedMarked(value: string): boolean {
  return (
    value.endsWith(SEED_MARKER) ||
    LEGACY_SEED_MARKERS.some((marker) => value.endsWith(marker))
  );
}

function isoOffsetDays(
  days: number,
  atHour?: number,
  atMinute?: number,
): string {
  const date = new Date(Date.now() + days * 86_400_000);
  if (atHour !== undefined) {
    date.setHours(atHour, atMinute ?? 0, 0, 0);
  }
  return date.toISOString();
}

function dateOffsetDays(days: number): string {
  return format(new Date(Date.now() + days * 86_400_000), "yyyy-MM-dd");
}

export interface ClearSeedResult {
  injuriesDeleted: number;
  journalEntriesDeleted: number;
}

export async function clearSeedTestData(): Promise<ClearSeedResult> {
  return db.transaction(
    "rw",
    db.injuries,
    db.remedies,
    db.triggers,
    db.logEntries,
    db.journalEntries,
    async () => {
      const seedIds = (await db.injuries.toArray())
        .filter((injury) => isSeedMarked(injury.injuryType))
        .map((injury) => injury.id);

      if (seedIds.length > 0) {
        await db.logEntries.where("injuryId").anyOf(seedIds).delete();
        await db.remedies.where("injuryId").anyOf(seedIds).delete();
        await db.triggers.where("injuryId").anyOf(seedIds).delete();
        await db.injuries.bulkDelete(seedIds);
      }

      const seedJournalIds = (await db.journalEntries.toArray())
        .filter((entry) => isSeedMarked(entry.text))
        .map((entry) => entry.id);

      if (seedJournalIds.length > 0) {
        await db.journalEntries.bulkDelete(seedJournalIds);
      }

      return {
        injuriesDeleted: seedIds.length,
        journalEntriesDeleted: seedJournalIds.length,
      };
    },
  );
}

export interface SeedResult {
  injuriesCreated: number;
  remediesCreated: number;
  triggersCreated: number;
  logEntriesCreated: number;
  journalEntriesCreated: number;
  injuriesDeleted: number;
  journalEntriesDeleted: number;
}

export async function seedTestData(): Promise<SeedResult> {
  const { injuriesDeleted, journalEntriesDeleted } = await clearSeedTestData();

  const injuryRows: Injury[] = [];
  const remedyRows: Remedy[] = [];
  const triggerRows: Trigger[] = [];
  const logEntryRows: LogEntry[] = [];
  const journalEntryRows: JournalEntry[] = SEED_JOURNAL_ENTRIES.map((seed) => {
    const now = isoOffsetDays(seed.offsetDays);
    return {
      id: crypto.randomUUID(),
      date: dateOffsetDays(seed.offsetDays),
      text: `${seed.text}\n\n${SEED_MARKER}`,
      createdAt: now,
      updatedAt: now,
    };
  });

  for (const seed of SEED_INJURIES) {
    const injuryId = crypto.randomUUID();
    const createdAt = isoOffsetDays(-seed.createdDaysAgo);
    injuryRows.push({
      id: injuryId,
      bodyPart: seed.bodyPart,
      injuryType: `${seed.injuryType} ${SEED_MARKER}`,
      locationDetail: seed.locationDetail,
      description: seed.description,
      status: seed.status,
      priority: seed.priority,
      createdAt,
      updatedAt: createdAt,
      archivedAt:
        seed.archivedDaysAgo !== undefined
          ? isoOffsetDays(-seed.archivedDaysAgo)
          : undefined,
    });

    const remedyIdByKey = new Map<string, string>();
    for (const remedy of seed.remedies) {
      const remedyId = crypto.randomUUID();
      remedyIdByKey.set(remedy.key, remedyId);
      remedyRows.push({
        id: remedyId,
        injuryId,
        name: remedy.name,
        description: remedy.description,
        providesImmediateRelief: remedy.providesImmediateRelief,
        category: remedy.category,
        createdAt,
        archivedAt:
          remedy.archivedDaysAgo !== undefined
            ? isoOffsetDays(-remedy.archivedDaysAgo)
            : undefined,
      });
    }

    const triggerIdByKey = new Map<string, string>();
    for (const trigger of seed.triggers) {
      const triggerId = crypto.randomUUID();
      triggerIdByKey.set(trigger.key, triggerId);
      triggerRows.push({
        id: triggerId,
        injuryId,
        name: trigger.name,
        description: trigger.description,
        category: trigger.category,
        createdAt,
        archivedAt:
          trigger.archivedDaysAgo !== undefined
            ? isoOffsetDays(-trigger.archivedDaysAgo)
            : undefined,
      });
    }

    for (const log of seed.logs) {
      const timestamp = isoOffsetDays(log.offsetDays, log.atHour, log.atMinute);
      const remedyIds = (log.remedyKeys ?? [])
        .map((key) => remedyIdByKey.get(key))
        .filter((id): id is string => id !== undefined);
      const triggerIds = (log.triggerKeys ?? [])
        .map((key) => triggerIdByKey.get(key))
        .filter((id): id is string => id !== undefined);
      logEntryRows.push({
        id: crypto.randomUUID(),
        sessionId: crypto.randomUUID(),
        injuryId,
        timestamp,
        painLevel: log.painLevel,
        painFrequency: log.painFrequency,
        remedyIds,
        triggerIds,
        notes: log.notes,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }
  }

  await db.transaction(
    "rw",
    db.injuries,
    db.remedies,
    db.triggers,
    db.logEntries,
    db.journalEntries,
    async () => {
      await db.injuries.bulkAdd(injuryRows);
      await db.remedies.bulkAdd(remedyRows);
      await db.triggers.bulkAdd(triggerRows);
      await db.logEntries.bulkAdd(logEntryRows);
      await db.journalEntries.bulkAdd(journalEntryRows);
    },
  );

  return {
    injuriesCreated: injuryRows.length,
    remediesCreated: remedyRows.length,
    triggersCreated: triggerRows.length,
    logEntriesCreated: logEntryRows.length,
    journalEntriesCreated: journalEntryRows.length,
    injuriesDeleted,
    journalEntriesDeleted,
  };
}
