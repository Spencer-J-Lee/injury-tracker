import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RichTextEditor } from "@/components/journal/RichTextEditor";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import { PaginationControls } from "@/components/journal/PaginationControls";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { createJournalEntry } from "@/db/queries/journalEntries";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { formatFullDate } from "@/lib/dates";
import { saveShortcutLabel } from "@/lib/shortcuts";
import { getJournalDraft, setJournalDraft } from "@/lib/journalDraft";

const PAGE_SIZE = 5;

export function JournalPage() {
  const entries = useJournalEntries();
  const [draft, setDraft] = useState(getJournalDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingDirty, setIsEditingDirty] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const hasTodayEntry = useMemo(
    () => entries.some((entry) => entry.date === today),
    [entries, today],
  );
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));

  const rawPage = searchParams.has("page")
    ? Number(searchParams.get("page"))
    : 1;
  const page =
    Number.isFinite(rawPage) && rawPage >= 1
      ? Math.min(Math.trunc(rawPage), totalPages)
      : 1;
  const pagedEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (clamped <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(clamped));
      }
      return params;
    });
  };

  const { isPrompting, guard, confirmLeave, cancelLeave } =
    useUnsavedChangesGuard(isEditingDirty);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsEditingDirty(dirty);
  }, []);

  const updateDraft = (value: string) => {
    setDraft(value);
    setJournalDraft(value);
  };

  const handleSave = async () => {
    if (!draft.trim()) return;
    await createJournalEntry(draft);
    updateDraft("");
    goToPage(1);
  };

  useFormShortcuts({
    onSave: handleSave,
    enabled: editingId === null && !hasTodayEntry && draft.trim().length > 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-ink text-3xl font-semibold">
          Journal
        </h1>
        <div className="text-ink-muted">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      {!hasTodayEntry && (
        <Card>
          <div className="font-heading text-ink mb-4 text-2xl font-semibold">
            {formatFullDate(today)}
          </div>
          <RichTextEditor
            value={draft}
            onChange={updateDraft}
            placeholder="How are you feeling?"
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={!draft.trim()}>
              Save entry
              <Kbd>{saveShortcutLabel}</Kbd>
            </Button>
          </div>
        </Card>
      )}

      {entries.length > PAGE_SIZE && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}

      <div className="flex flex-col gap-4">
        {entries.length === 0 ? (
          <p className="text-ink-muted py-10 text-center text-lg">
            No entries yet. Write your first one above.
          </p>
        ) : (
          pagedEntries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              isEditing={editingId === entry.id}
              onStartEdit={() => setEditingId(entry.id)}
              onStopEdit={() => setEditingId(null)}
              guard={guard}
              onDirtyChange={handleDirtyChange}
            />
          ))
        )}
      </div>

      {entries.length > PAGE_SIZE && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}

      <ConfirmDialog
        open={isPrompting}
        message="You have unsaved changes to a journal entry. Leave without saving?"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </div>
  );
}
