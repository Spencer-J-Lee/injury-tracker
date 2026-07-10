import { exportDB, importInto } from "dexie-export-import";
import { db } from "@/db/schema";

const LAST_EXPORTED_AT_KEY = "lastExportedAt";

export async function getLastExportedAt(): Promise<string | undefined> {
  const meta = await db.meta.get(LAST_EXPORTED_AT_KEY);
  return meta?.value;
}

async function setLastExportedAt(iso: string) {
  await db.meta.put({ key: LAST_EXPORTED_AT_KEY, value: iso });
}

export async function exportBackup(): Promise<void> {
  const blob = await exportDB(db);
  const now = new Date().toISOString();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `injury-tracker-backup-${now.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  await setLastExportedAt(now);
}

export async function importBackup(file: File): Promise<void> {
  await importInto(db, file, {
    clearTablesBeforeImport: true,
    acceptNameDiff: true,
    skipTables: ["meta"],
  });
}

export async function deleteAllData(): Promise<void> {
  await db.transaction(
    "rw",
    db.injuries,
    db.remedies,
    db.triggers,
    db.logEntries,
    async () => {
      await db.injuries.clear();
      await db.remedies.clear();
      await db.triggers.clear();
      await db.logEntries.clear();
    },
  );
}

export async function requestPersistentStorage(): Promise<void> {
  if (navigator.storage?.persist) {
    await navigator.storage.persist();
  }
}
