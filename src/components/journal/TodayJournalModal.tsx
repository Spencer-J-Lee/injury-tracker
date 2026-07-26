import { useRef, useState } from "react";
import { format } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RichTextEditor } from "@/components/journal/RichTextEditor";
import { useJournalModal } from "@/context/useJournalModal";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import {
  getTodayJournalEntry,
  createJournalEntry,
  updateJournalEntry,
} from "@/db/queries/journalEntries";
import { formatFullDate } from "@/lib/dates";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";
import { setJournalDraft } from "@/lib/journalDraft";

export function TodayJournalModal() {
  const { open, closeJournalModal } = useJournalModal();
  const todayEntryResult = useLiveQuery(
    async () => ({ entry: await getTodayJournalEntry() }),
    [],
  );
  const todayEntry = todayEntryResult?.entry;
  const loaded = todayEntryResult !== undefined;

  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  // Modal only mounts the RichTextEditor once `open` flips true, so the
  // reset has to happen synchronously during render (not in an effect) —
  // otherwise the editor mounts with the previous draft before it's cleared.
  // Seeding also waits for `loaded`, since useLiveQuery resolves
  // asynchronously and would otherwise seed an empty draft if the modal is
  // opened before the first query result arrives.
  const wasOpenRef = useRef(false);
  if (open && !wasOpenRef.current) {
    if (loaded) {
      setDraft(todayEntry?.text ?? "");
      wasOpenRef.current = true;
    }
  } else if (!open) {
    wasOpenRef.current = false;
  }

  const isDirty = open && draft !== (todayEntry?.text ?? "");

  const { isPrompting, guard, confirmLeave, cancelLeave } =
    useUnsavedChangesGuard(isDirty);

  const handleSave = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    try {
      if (todayEntry) {
        await updateJournalEntry(todayEntry.id, draft);
      } else {
        await createJournalEntry(draft);
      }
      setJournalDraft("");
      closeJournalModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => guard(closeJournalModal)}
      onSave={handleSave}
      title={`Journal — ${formatFullDate(format(new Date(), "yyyy-MM-dd"))}`}
      footer={
        <>
          <Button
            iconAfter={<Kbd>{saveShortcutLabel}</Kbd>}
            onClick={handleSave}
            disabled={saving || !draft.trim()}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            iconAfter={<Kbd>{cancelShortcutLabel}</Kbd>}
            onClick={() => guard(closeJournalModal)}
          >
            Cancel
          </Button>
        </>
      }
    >
      <RichTextEditor value={draft} onChange={setDraft} autoFocus />

      <ConfirmDialog
        open={isPrompting}
        message="You have unsaved changes to this journal entry. Leave without saving?"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </Modal>
  );
}
