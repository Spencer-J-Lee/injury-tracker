import { useEffect, useState } from "react";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { JournalEntry } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  RichTextEditor,
  RichTextContent,
} from "@/components/journal/RichTextEditor";
import { Kbd } from "@/components/ui/Kbd";
import { formatFullDate } from "@/lib/dates";
import {
  updateJournalEntry,
  deleteJournalEntry,
} from "@/db/queries/journalEntries";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";

interface JournalEntryCardProps {
  entry: JournalEntry;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  guard: (action: () => void) => void;
  onDirtyChange: (isDirty: boolean) => void;
}

export function JournalEntryCard({
  entry,
  isEditing,
  onStartEdit,
  onStopEdit,
  guard,
  onDirtyChange,
}: JournalEntryCardProps) {
  const [draft, setDraft] = useState(entry.text);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isDirty = isEditing && draft !== entry.text;

  useEffect(() => {
    onDirtyChange(isDirty);
    return () => onDirtyChange(false);
  }, [isDirty, onDirtyChange]);

  const startEdit = () => {
    setDraft(entry.text);
    onStartEdit();
  };

  const cancelEdit = () => {
    setDraft(entry.text);
    onStopEdit();
  };

  const guardedCancel = () => guard(cancelEdit);

  const handleSave = async () => {
    if (!draft.trim()) return;
    await updateJournalEntry(entry.id, draft);
    onStopEdit();
  };

  const handleDelete = async () => {
    setConfirmingDelete(false);
    await deleteJournalEntry(entry.id);
  };

  useFormShortcuts({
    onSave: handleSave,
    onCancel: guardedCancel,
    enabled: isEditing,
  });

  return (
    <Card>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="font-heading text-ink text-xl font-semibold">
          {formatFullDate(entry.date)}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-1">
            <IconButton icon={faPen} label="Edit entry" onClick={startEdit} />
            <IconButton
              icon={faTrash}
              tone="danger"
              label="Delete entry"
              onClick={() => setConfirmingDelete(true)}
            />
          </div>
        )}
      </div>

      {isEditing ? (
        <>
          <RichTextEditor value={draft} onChange={setDraft} autoFocus />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" onClick={guardedCancel}>
              Cancel
              <Kbd>{cancelShortcutLabel}</Kbd>
            </Button>
            <Button onClick={handleSave} disabled={!draft.trim()}>
              Save
              <Kbd>{saveShortcutLabel}</Kbd>
            </Button>
          </div>
        </>
      ) : (
        <RichTextContent
          html={entry.text}
          className="text-ink-secondary text-[14px]"
        />
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete journal entry?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </Card>
  );
}
