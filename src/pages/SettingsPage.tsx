import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  exportBackup,
  importBackup,
  deleteAllData,
  getLastExportedAt,
} from "@/db/backup";
import { seedTestData, clearSeedTestData, SEED_MARKER } from "@/db/seed";
import { formatRelative } from "@/lib/dates";

export function SettingsPage() {
  const [lastExportedAt, setLastExportedAt] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "clearSeed" | "deleteAll" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getLastExportedAt().then(setLastExportedAt);
  }, []);

  const handleExport = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await exportBackup();
      setLastExportedAt(await getLastExportedAt());
      setMessage("Export downloaded.");
    } finally {
      setBusy(false);
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      await importBackup(file);
      setLastExportedAt(await getLastExportedAt());
      setMessage("Import complete.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const handleSeed = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await seedTestData();
      setMessage(
        `Loaded ${result.injuriesCreated} injuries, ${result.remediesCreated} remedies, ${result.triggersCreated} triggers, ${result.logEntriesCreated} log entries, and ${result.journalEntriesCreated} journal entries` +
          (result.injuriesDeleted > 0 || result.journalEntriesDeleted > 0
            ? ` (replaced ${result.injuriesDeleted} previous seed injuries and ${result.journalEntriesDeleted} journal entries).`
            : "."),
      );
    } finally {
      setBusy(false);
    }
  };

  const handleClearSeed = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const { injuriesDeleted, journalEntriesDeleted } =
        await clearSeedTestData();
      setMessage(
        `Cleared ${injuriesDeleted} seed injur${injuriesDeleted === 1 ? "y" : "ies"} and ${journalEntriesDeleted} seed journal entr${journalEntriesDeleted === 1 ? "y" : "ies"}.`,
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAll = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await deleteAllData();
      setMessage("All data deleted.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-ink text-3xl font-semibold">Settings</h1>
      {message && <p className="text-pain-green">{message}</p>}

      <Card className="space-y-4">
        <div>
          <h3 className="text-ink text-xl font-semibold">Backup</h3>
          <p className="text-ink-muted mt-2">
            All data is stored only in this browser. Export regularly to avoid
            losing it.
          </p>
          <p className="text-ink-faint mt-2 text-sm">
            {lastExportedAt
              ? `Last exported ${formatRelative(lastExportedAt)}`
              : "Never exported"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExport} disabled={busy}>
            Export data
          </Button>
          <Button
            variant="secondary"
            onClick={handleImportClick}
            disabled={busy}
            className="whitespace-nowrap"
          >
            Import data
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <h3 className="text-ink text-xl font-semibold">Seed data</h3>
          <p className="text-ink-muted mt-2">
            Loads a set of example injuries, remedies, and log entries for
            testing. Re-running replaces previous seed data.
          </p>
          <p className="text-ink-muted mt-2">
            Seeded items are tagged with the{" "}
            <span className="font-mono">{SEED_MARKER}</span> marker so they can
            be identified and cleared later.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSeed} disabled={busy}>
            Load example data
          </Button>
          <Button
            variant="danger"
            onClick={() => setConfirmAction("clearSeed")}
            disabled={busy}
          >
            Clear seed data
          </Button>
        </div>
      </Card>

      <Card
        className="space-y-4"
        style={{ borderColor: "oklch(0.40 0.08 25)" }}
      >
        <div>
          <h3 className="text-pain-red text-xl font-semibold">
            Danger zone
          </h3>
          <p className="text-ink-muted mt-2">
            Permanently delete every injury, remedy, and log entry.
          </p>
        </div>
        <Button
          variant="danger"
          onClick={() => setConfirmAction("deleteAll")}
          disabled={busy}
        >
          Delete all data
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmAction === "clearSeed"}
        title="Clear seed data?"
        message='This removes only the example data created by "Load example data".'
        confirmLabel="Clear"
        onConfirm={() => {
          setConfirmAction(null);
          handleClearSeed();
        }}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === "deleteAll"}
        title="Delete all data?"
        message="Delete all injuries, remedies, and log entries? This cannot be undone."
        confirmLabel="Delete all"
        onConfirm={() => {
          setConfirmAction(null);
          handleDeleteAll();
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
