import Dexie, { type EntityTable } from "dexie";
import type {
  Injury,
  Remedy,
  Trigger,
  LogEntry,
  JournalEntry,
  AppMeta,
  PlannedExercise,
  MorningCheckIn,
  Habit,
  HabitCompletion,
  Activity,
  Section,
} from "@/types/models";

export const db = new Dexie("injury-tracker") as Dexie & {
  injuries: EntityTable<Injury, "id">;
  remedies: EntityTable<Remedy, "id">;
  triggers: EntityTable<Trigger, "id">;
  logEntries: EntityTable<LogEntry, "id">;
  journalEntries: EntityTable<JournalEntry, "id">;
  meta: EntityTable<AppMeta, "key">;
  plannedExercises: EntityTable<PlannedExercise, "id">;
  morningCheckIns: EntityTable<MorningCheckIn, "id">;
  habits: EntityTable<Habit, "id">;
  habitCompletions: EntityTable<HabitCompletion, "id">;
  activities: EntityTable<Activity, "id">;
  sections: EntityTable<Section, "id">;
};

db.version(1).stores({
  injuries: "id, status, archivedAt",
  remedies: "id, injuryId, type, archivedAt",
  logEntries:
    "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds",
  meta: "key",
});

db.version(2)
  .stores({
    injuries: "id, status, archivedAt",
    remedies: "id, injuryId, type, archivedAt",
    triggers: "id, injuryId, archivedAt",
    logEntries:
      "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
    meta: "key",
  })
  .upgrade((tx) =>
    tx
      .table("logEntries")
      .toCollection()
      .modify((entry) => {
        entry.triggerIds = entry.triggerIds ?? [];
      }),
  );

db.version(3).stores({
  injuries: "id, status, archivedAt",
  remedies: "id, injuryId, type, archivedAt",
  triggers: "id, injuryId, archivedAt",
  logEntries:
    "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
  journalEntries: "id, date",
  meta: "key",
});

db.version(4)
  .stores({
    injuries: "id, status, archivedAt",
    remedies: "id, injuryId, type, archivedAt",
    triggers: "id, injuryId, archivedAt",
    logEntries:
      "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
    journalEntries: "id, date",
    meta: "key",
  })
  .upgrade((tx) =>
    tx
      .table("injuries")
      .toCollection()
      .modify((injury) => {
        const raw: string = injury.name ?? "";
        const idx = raw.indexOf(":");
        if (idx !== -1) {
          injury.bodyPart = raw.slice(0, idx).trim();
          injury.injuryType = raw.slice(idx + 1).trim();
        } else {
          injury.bodyPart = raw.trim();
          injury.injuryType = "";
        }
        delete injury.name;
      }),
  );

db.version(5)
  .stores({
    injuries: "id, status, archivedAt",
    remedies: "id, injuryId, type, category, archivedAt",
    triggers: "id, injuryId, category, archivedAt",
    logEntries:
      "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
    journalEntries: "id, date",
    meta: "key",
  })
  .upgrade((tx) =>
    Promise.all([
      tx
        .table("remedies")
        .toCollection()
        .modify((remedy) => {
          remedy.category = remedy.category ?? "Other";
        }),
      tx
        .table("triggers")
        .toCollection()
        .modify((trigger) => {
          trigger.category = trigger.category ?? "Other";
        }),
    ]),
  );

db.version(6)
  .stores({
    injuries: "id, status, archivedAt",
    remedies: "id, injuryId, type, category, archivedAt",
    triggers: "id, injuryId, category, archivedAt",
    logEntries:
      "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
    journalEntries: "id, date",
    meta: "key",
  })
  .upgrade((tx) =>
    Promise.all([
      tx
        .table("remedies")
        .toCollection()
        .modify((remedy) => {
          if (remedy.category === "Other") delete remedy.category;
        }),
      tx
        .table("triggers")
        .toCollection()
        .modify((trigger) => {
          if (trigger.category === "Other") delete trigger.category;
        }),
    ]),
  );

db.version(7).stores({
  injuries: "id, status, archivedAt",
  remedies: "id, injuryId, type, category, archivedAt",
  triggers: "id, injuryId, category, archivedAt",
  logEntries:
    "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
  journalEntries: "id, date",
  meta: "key",
});

db.version(8)
  .stores({
    injuries: "id, status, archivedAt",
    remedies: "id, injuryId, type, category, archivedAt",
    triggers: "id, injuryId, category, archivedAt",
    logEntries:
      "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
    journalEntries: "id, date",
    meta: "key",
  })
  .upgrade((tx) =>
    tx
      .table("injuries")
      .toCollection()
      .modify((injury) => {
        injury.priority = injury.priority ?? "medium";
      }),
  );

db.version(9)
  .stores({
    injuries: "id, status, archivedAt",
    remedies: "id, injuryId, category, archivedAt",
    triggers: "id, injuryId, category, archivedAt",
    logEntries:
      "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
    journalEntries: "id, date",
    meta: "key",
  })
  .upgrade((tx) =>
    tx
      .table("remedies")
      .toCollection()
      .modify((remedy) => {
        remedy.providesImmediateRelief = remedy.type === "relief";
        delete remedy.type;
      }),
  );

const VALID_REMEDY_CATEGORIES = new Set([
  "Mobility",
  "Strengthening",
  "Lifestyle",
  "Rest",
]);
const VALID_TRIGGER_CATEGORIES = new Set([
  "Overuse",
  "Load",
  "Posture",
  "Activity",
  "Muscle Tightness",
]);

db.version(10)
  .stores({
    injuries: "id, status, archivedAt",
    remedies: "id, injuryId, category, archivedAt",
    triggers: "id, injuryId, category, archivedAt",
    logEntries:
      "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
    journalEntries: "id, date",
    meta: "key",
  })
  .upgrade((tx) =>
    Promise.all([
      tx
        .table("remedies")
        .toCollection()
        .modify((remedy) => {
          if (
            remedy.category &&
            !VALID_REMEDY_CATEGORIES.has(remedy.category)
          ) {
            delete remedy.category;
          }
        }),
      tx
        .table("triggers")
        .toCollection()
        .modify((trigger) => {
          if (trigger.category === "Mobility") {
            trigger.category = "Muscle Tightness";
          } else if (
            trigger.category &&
            !VALID_TRIGGER_CATEGORIES.has(trigger.category)
          ) {
            delete trigger.category;
          }
        }),
    ]),
  );

db.version(11)
  .stores({
    injuries: "id, status, archivedAt",
    remedies: "id, injuryId, category, archivedAt",
    triggers: "id, injuryId, category, archivedAt",
    logEntries:
      "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
    journalEntries: "id, date",
    meta: "key",
  })
  .upgrade((tx) =>
    tx
      .table("triggers")
      .toCollection()
      .modify((trigger) => {
        if (trigger.category === "Strengthening") {
          trigger.category = "Activity";
        }
      }),
  );

db.version(12).stores({
  injuries: "id, status, archivedAt",
  remedies: "id, injuryId, category, archivedAt",
  triggers: "id, injuryId, category, archivedAt",
  logEntries:
    "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
  journalEntries: "id, date",
  meta: "key",
  plannedExercises: "id, date, remedyId",
});

const V13_STORES = {
  injuries: "id, status, archivedAt",
  remedies: "id, injuryId, category, archivedAt",
  triggers: "id, injuryId, category, archivedAt",
  logEntries:
    "id, injuryId, timestamp, sessionId, [injuryId+timestamp], *remedyIds, *triggerIds",
  journalEntries: "id, date",
  meta: "key",
  plannedExercises: "id, date, remedyId",
  morningCheckIns: "id, injuryId, timestamp, [injuryId+timestamp]",
};

db.version(13).stores(V13_STORES);

db.version(14)
  .stores(V13_STORES)
  .upgrade((tx) =>
    tx
      .table("injuries")
      .toCollection()
      .modify((injury) => {
        injury.painMechanisms = injury.painMechanisms ?? [];
      }),
  );

db.version(15)
  .stores(V13_STORES)
  .upgrade(async (tx) => {
    const injuries = await tx.table("injuries").toArray();
    const mechanismsByInjuryId = new Map(
      injuries.map((injury) => [injury.id, injury.painMechanisms ?? []]),
    );
    await tx
      .table("morningCheckIns")
      .toCollection()
      .modify((entry) => {
        entry.painMechanisms =
          entry.painMechanisms ??
          mechanismsByInjuryId.get(entry.injuryId) ??
          [];
      });
  });

db.version(16).stores({
  ...V13_STORES,
  habits: "id, archivedAt",
  habitCompletions: "id, habitId, date, [habitId+date]",
});

db.version(17)
  .stores({
    ...V13_STORES,
    habits: "id, archivedAt, position",
    habitCompletions: "id, habitId, date, [habitId+date]",
  })
  .upgrade(async (tx) => {
    const habits = await tx.table("habits").toArray();
    habits.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    await Promise.all(
      habits.map((habit, index) =>
        tx.table("habits").update(habit.id, { position: index }),
      ),
    );
  });

db.version(18).stores({
  ...V13_STORES,
  habits: "id, archivedAt, position",
  habitCompletions: "id, habitId, date, [habitId+date]",
  activities: "id, archivedAt",
});

db.version(19)
  .stores({
    ...V13_STORES,
    habits: "id, archivedAt, position",
    habitCompletions: "id, habitId, date, [habitId+date]",
    activities: "id, archivedAt",
  })
  .upgrade(async (tx) => {
    const activities = await tx.table("activities").toArray();
    await Promise.all(
      activities.map((activity) =>
        tx.table("activities").update(activity.id, {
          bodyPartsRested: activity.bodyPartsUsed ?? [],
          bodyPartsUsed: undefined,
        }),
      ),
    );
  });

db.version(20)
  .stores({
    ...V13_STORES,
    habits: "id, archivedAt, position",
    habitCompletions: "id, habitId, date, [habitId+date]",
    activities: "id, archivedAt, sectionId",
    sections: "id, archivedAt, position",
  })
  .upgrade(async (tx) => {
    const activities = await tx.table("activities").toArray();

    const categories = [
      ...new Set(
        activities
          .map((activity) => (activity.category ?? "").trim())
          .filter((category) => category.length > 0),
      ),
    ].sort((a, b) => a.localeCompare(b));

    const sectionIdByCategory = new Map<string, string>();
    const sectionRows = categories.map((name, index) => {
      const id = crypto.randomUUID();
      sectionIdByCategory.set(name, id);
      return { id, name, position: index, createdAt: new Date().toISOString() };
    });
    if (sectionRows.length > 0) {
      await tx.table("sections").bulkAdd(sectionRows);
    }

    await Promise.all(
      activities.map((activity) => {
        const key = (activity.category ?? "").trim();
        return tx.table("activities").update(activity.id, {
          sectionId: key ? sectionIdByCategory.get(key) : undefined,
          category: undefined,
        });
      }),
    );
  });

db.version(21)
  .stores({
    ...V13_STORES,
    habits: "id, archivedAt, position",
    habitCompletions: "id, habitId, date, [habitId+date]",
    activities: "id, archivedAt, sectionId, position",
    sections: "id, archivedAt, position",
  })
  .upgrade(async (tx) => {
    const activities = await tx.table("activities").toArray();
    const bySection = new Map<string, typeof activities>();
    for (const activity of activities) {
      const key = activity.sectionId ?? "";
      const bucket = bySection.get(key);
      if (bucket) {
        bucket.push(activity);
      } else {
        bySection.set(key, [activity]);
      }
    }
    await Promise.all(
      [...bySection.values()].flatMap((group) => {
        group.sort((a, b) => a.name.localeCompare(b.name));
        return group.map((activity, index) =>
          tx.table("activities").update(activity.id, { position: index }),
        );
      }),
    );
  });
