import { useState } from "react";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { JournalEntry } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import {
  RichTextEditor,
  RichTextContent,
} from "@/components/journal/RichTextEditor";
import { isRichTextHtml } from "@/lib/richText";
import { Kbd } from "@/components/ui/Kbd";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatFullDate } from "@/lib/dates";
import {
  updateJournalEntry,
  deleteJournalEntry,
} from "@/db/queries/journalEntries";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";

interface JournalEntryCardProps {
  entry: JournalEntry;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
}

export function JournalEntryCard({
  entry,
  isEditing,
  onStartEdit,
  onStopEdit,
}: JournalEntryCardProps) {
  const [draft, setDraft] = useState(entry.text);

  const isDirty = isEditing && draft !== entry.text;
  const { isPrompting, guard, confirmLeave, cancelLeave } =
    useUnsavedChangesGuard(isDirty);

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
    if (!confirm("Delete this journal entry? This cannot be undone.")) return;
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
              onClick={handleDelete}
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
      ) : isRichTextHtml(entry.text) ? (
        <RichTextContent
          html={entry.text}
          className="text-ink-secondary text-[14px]"
        />
      ) : (
        <p className="text-ink-secondary text-[14px] leading-[1.6] whitespace-pre-wrap">
          {entry.text}
        </p>
      )}

      <ConfirmDialog
        open={isPrompting}
        message="You have unsaved changes to this journal entry. Leave without saving?"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </Card>
  );
}
