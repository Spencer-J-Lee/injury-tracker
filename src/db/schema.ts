import Dexie, { type EntityTable } from "dexie";
import type {
  Injury,
  Remedy,
  Trigger,
  LogEntry,
  JournalEntry,
  AppMeta,
} from "@/types/models";

export const db = new Dexie("injury-tracker") as Dexie & {
  injuries: EntityTable<Injury, "id">;
  remedies: EntityTable<Remedy, "id">;
  triggers: EntityTable<Trigger, "id">;
  logEntries: EntityTable<LogEntry, "id">;
  journalEntries: EntityTable<JournalEntry, "id">;
  meta: EntityTable<AppMeta, "key">;
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
