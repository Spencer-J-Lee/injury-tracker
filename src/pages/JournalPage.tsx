import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardFast,
  faBackwardStep,
  faForwardStep,
  faForwardFast,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RichTextEditor } from "@/components/journal/RichTextEditor";
import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
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
    enabled: editingId === null && draft.trim().length > 0,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-ink text-2xl font-semibold">
          Journal
        </h1>
        <div className="text-ink-muted text-[13px]">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      <Card>
        <div className="font-heading text-ink mb-3 text-xl font-semibold">
          {formatFullDate(today)}
        </div>
        <RichTextEditor
          value={draft}
          onChange={updateDraft}
          placeholder="How are you feeling?"
        />
        <div className="mt-3 flex justify-end">
          <Button onClick={handleSave} disabled={!draft.trim()}>
            Save entry
            <Kbd>{saveShortcutLabel}</Kbd>
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {entries.length === 0 ? (
          <p className="text-ink-muted py-8 text-center text-[14px]">
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
        <div className="flex items-center justify-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => goToPage(1)}
          >
            <FontAwesomeIcon icon={faBackwardFast} />
            First
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          >
            <FontAwesomeIcon icon={faBackwardStep} />
            Newer
          </Button>
          <span className="text-ink-muted text-[13px]">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Older
            <FontAwesomeIcon icon={faForwardStep} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => goToPage(totalPages)}
          >
            Last
            <FontAwesomeIcon icon={faForwardFast} />
          </Button>
        </div>
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
