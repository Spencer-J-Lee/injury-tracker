import { format } from 'date-fns';
import { db } from '@/db/schema';
import type {
  Injury,
  LogEntry,
  Remedy,
  Trigger,
  JournalEntry,
  MorningCheckIn,
  PlannedExercise,
  Habit,
  HabitCompletion,
  Activity,
  Section,
} from '@/types/models';
import {
  SEED_INJURIES,
  SEED_JOURNAL_ENTRIES,
  SEED_HABITS,
  SEED_ACTIVITIES,
  SEED_SECTIONS,
} from '@/db/seedData';

export const SEED_MARKER = '꧁꧂';

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
  return format(new Date(Date.now() + days * 86_400_000), 'yyyy-MM-dd');
}

export interface ClearSeedResult {
  injuriesDeleted: number;
  journalEntriesDeleted: number;
  habitsDeleted: number;
  activitiesDeleted: number;
  sectionsDeleted: number;
}

export async function clearSeedTestData(): Promise<ClearSeedResult> {
  return db.transaction(
    'rw',
    [
      db.injuries,
      db.remedies,
      db.triggers,
      db.logEntries,
      db.morningCheckIns,
      db.journalEntries,
      db.plannedExercises,
      db.habits,
      db.habitCompletions,
      db.activities,
      db.sections,
    ],
    async () => {
      const seedIds = (await db.injuries.toArray())
        .filter((injury) => isSeedMarked(injury.injuryType))
        .map((injury) => injury.id);

      if (seedIds.length > 0) {
        const seedRemedyIds = await db.remedies
          .where('injuryId')
          .anyOf(seedIds)
          .primaryKeys();

        await db.logEntries.where('injuryId').anyOf(seedIds).delete();
        await db.morningCheckIns.where('injuryId').anyOf(seedIds).delete();
        await db.plannedExercises
          .where('remedyId')
          .anyOf(seedRemedyIds)
          .delete();
        await db.remedies.where('injuryId').anyOf(seedIds).delete();
        await db.triggers.where('injuryId').anyOf(seedIds).delete();
        await db.injuries.bulkDelete(seedIds);
      }

      const seedJournalIds = (await db.journalEntries.toArray())
        .filter((entry) => isSeedMarked(entry.text))
        .map((entry) => entry.id);

      if (seedJournalIds.length > 0) {
        await db.journalEntries.bulkDelete(seedJournalIds);
      }

      const seedHabitIds = (await db.habits.toArray())
        .filter((habit) => isSeedMarked(habit.description ?? ''))
        .map((habit) => habit.id);

      if (seedHabitIds.length > 0) {
        await db.habitCompletions.where('habitId').anyOf(seedHabitIds).delete();
        await db.habits.bulkDelete(seedHabitIds);
      }

      const seedActivityIds = (await db.activities.toArray())
        .filter((activity) => isSeedMarked(activity.description ?? ''))
        .map((activity) => activity.id);

      if (seedActivityIds.length > 0) {
        await db.activities.bulkDelete(seedActivityIds);
      }

      const seedSectionIds = (await db.sections.toArray())
        .filter((section) => isSeedMarked(section.name))
        .map((section) => section.id);

      if (seedSectionIds.length > 0) {
        await db.sections.bulkDelete(seedSectionIds);
      }

      return {
        injuriesDeleted: seedIds.length,
        journalEntriesDeleted: seedJournalIds.length,
        habitsDeleted: seedHabitIds.length,
        activitiesDeleted: seedActivityIds.length,
        sectionsDeleted: seedSectionIds.length,
      };
    },
  );
}

export interface SeedResult {
  injuriesCreated: number;
  remediesCreated: number;
  triggersCreated: number;
  logEntriesCreated: number;
  morningCheckInsCreated: number;
  journalEntriesCreated: number;
  plannedExercisesCreated: number;
  habitsCreated: number;
  habitCompletionsCreated: number;
  activitiesCreated: number;
  sectionsCreated: number;
  injuriesDeleted: number;
  journalEntriesDeleted: number;
  habitsDeleted: number;
  activitiesDeleted: number;
  sectionsDeleted: number;
}

export async function seedTestData(): Promise<SeedResult> {
  const {
    injuriesDeleted,
    journalEntriesDeleted,
    habitsDeleted,
    activitiesDeleted,
    sectionsDeleted,
  } = await clearSeedTestData();

  const injuryRows: Injury[] = [];
  const remedyRows: Remedy[] = [];
  const triggerRows: Trigger[] = [];
  const logEntryRows: LogEntry[] = [];
  const morningCheckInRows: MorningCheckIn[] = [];
  const plannedExerciseRows: PlannedExercise[] = [];
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

  const habitRows: Habit[] = [];
  const habitCompletionRows: HabitCompletion[] = [];
  SEED_HABITS.forEach((seed, index) => {
    const habitId = crypto.randomUUID();
    const createdAt = isoOffsetDays(-seed.createdDaysAgo);
    habitRows.push({
      id: habitId,
      name: seed.name,
      description: seed.description
        ? `${seed.description}\n\n${SEED_MARKER}`
        : SEED_MARKER,
      position: index,
      createdAt,
      archivedAt:
        seed.archivedDaysAgo !== undefined
          ? isoOffsetDays(-seed.archivedDaysAgo)
          : undefined,
    });

    for (const daysAgo of seed.completedDaysAgo) {
      habitCompletionRows.push({
        id: crypto.randomUUID(),
        habitId,
        date: dateOffsetDays(-daysAgo),
        createdAt: isoOffsetDays(-daysAgo, 8),
      });
    }
  });

  const sectionRows: Section[] = SEED_SECTIONS.map((seed, index) => ({
    id: crypto.randomUUID(),
    name: `${seed.name} ${SEED_MARKER}`,
    position: index,
    createdAt: isoOffsetDays(-30),
  }));
  const sectionIdByName = new Map(
    SEED_SECTIONS.map((seed, index) => [seed.name, sectionRows[index].id]),
  );

  const activityPositionBySection = new Map<string, number>();
  const activityRows: Activity[] = SEED_ACTIVITIES.map((seed) => {
    const sectionKey = seed.section ?? '';
    const position = activityPositionBySection.get(sectionKey) ?? 0;
    activityPositionBySection.set(sectionKey, position + 1);
    return {
      id: crypto.randomUUID(),
      name: seed.name,
      description: seed.description
        ? `${seed.description}\n\n${SEED_MARKER}`
        : SEED_MARKER,
      sectionId: seed.section ? sectionIdByName.get(seed.section) : undefined,
      bodyPartsRested: seed.bodyPartsRested,
      position,
      createdAt: isoOffsetDays(-seed.createdDaysAgo),
      archivedAt:
        seed.archivedDaysAgo !== undefined
          ? isoOffsetDays(-seed.archivedDaysAgo)
          : undefined,
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
      painMechanisms: seed.painMechanisms ?? [],
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
        isProgramExercise: remedy.isProgramExercise,
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

    for (const checkIn of seed.morningCheckIns ?? []) {
      const timestamp = isoOffsetDays(
        checkIn.offsetDays,
        checkIn.atHour,
        checkIn.atMinute,
      );
      morningCheckInRows.push({
        id: crypto.randomUUID(),
        injuryId,
        timestamp,
        painMechanisms: seed.painMechanisms ?? [],
        painLevel: checkIn.painLevel,
        stiffnessLevel: checkIn.stiffnessLevel,
        stiffnessDuration: checkIn.stiffnessDuration,
        numbnessPresent: checkIn.numbnessPresent,
        numbnessDuration: checkIn.numbnessDuration,
        numbnessSuspectedCause: checkIn.numbnessSuspectedCause,
        notes: checkIn.notes,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    for (const planned of seed.plannedExercises ?? []) {
      const remedyId = remedyIdByKey.get(planned.remedyKey);
      if (remedyId === undefined) continue;
      plannedExerciseRows.push({
        id: crypto.randomUUID(),
        date: dateOffsetDays(planned.offsetDays),
        remedyId,
        createdAt: isoOffsetDays(planned.offsetDays, 8),
      });
    }
  }

  await db.transaction(
    'rw',
    [
      db.injuries,
      db.remedies,
      db.triggers,
      db.logEntries,
      db.morningCheckIns,
      db.journalEntries,
      db.plannedExercises,
      db.habits,
      db.habitCompletions,
      db.activities,
      db.sections,
    ],
    async () => {
      await db.injuries.bulkAdd(injuryRows);
      await db.remedies.bulkAdd(remedyRows);
      await db.triggers.bulkAdd(triggerRows);
      await db.logEntries.bulkAdd(logEntryRows);
      await db.morningCheckIns.bulkAdd(morningCheckInRows);
      await db.journalEntries.bulkAdd(journalEntryRows);
      await db.plannedExercises.bulkAdd(plannedExerciseRows);
      await db.habits.bulkAdd(habitRows);
      await db.habitCompletions.bulkAdd(habitCompletionRows);
      await db.sections.bulkAdd(sectionRows);
      await db.activities.bulkAdd(activityRows);
    },
  );

  return {
    injuriesCreated: injuryRows.length,
    remediesCreated: remedyRows.length,
    triggersCreated: triggerRows.length,
    logEntriesCreated: logEntryRows.length,
    morningCheckInsCreated: morningCheckInRows.length,
    journalEntriesCreated: journalEntryRows.length,
    plannedExercisesCreated: plannedExerciseRows.length,
    habitsCreated: habitRows.length,
    habitCompletionsCreated: habitCompletionRows.length,
    activitiesCreated: activityRows.length,
    sectionsCreated: sectionRows.length,
    injuriesDeleted,
    journalEntriesDeleted,
    habitsDeleted,
    activitiesDeleted,
    sectionsDeleted,
  };
}
