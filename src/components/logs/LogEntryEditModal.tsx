import { useEffect, useState } from "react";
import type { LogEntry } from "@/types/models";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Kbd } from "@/components/ui/Kbd";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PainSlider } from "@/components/logs/PainSlider";
import { PainFrequencySlider } from "@/components/logs/PainFrequencySlider";
import { RemedyCheckboxGroup } from "@/components/logs/RemedyCheckboxGroup";
import { TriggerCheckboxGroup } from "@/components/logs/TriggerCheckboxGroup";
import { InjuryTitle } from "@/components/injuries/InjuryTitle";
import { RichTextEditor } from "@/components/journal/RichTextEditor";
import { useInjury } from "@/hooks/useInjury";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { updateLogEntry } from "@/db/queries/logEntries";
import { toDatetimeLocalValue, fromDatetimeLocalValue } from "@/lib/dates";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";

interface LogEntryEditModalProps {
  entry: LogEntry;
  open: boolean;
  onClose: () => void;
}

export function LogEntryEditModal({
  entry,
  open,
  onClose,
}: LogEntryEditModalProps) {
  const injury = useInjury(entry.injuryId);

  const [painLevel, setPainLevel] = useState<number | undefined>(
    entry.painLevel,
  );
  const [painFrequency, setPainFrequency] = useState<number | undefined>(
    entry.painFrequency,
  );
  const [remedyIds, setRemedyIds] = useState<string[]>(entry.remedyIds);
  const [triggerIds, setTriggerIds] = useState<string[]>(entry.triggerIds);
  const [notes, setNotes] = useState(entry.notes ?? "");
  const [timestamp, setTimestamp] = useState(() =>
    toDatetimeLocalValue(entry.timestamp),
  );
  const [saving, setSaving] = useState(false);

  const isDirty =
    open &&
    (painLevel !== entry.painLevel ||
      painFrequency !== entry.painFrequency ||
      remedyIds.join(",") !== entry.remedyIds.join(",") ||
      triggerIds.join(",") !== entry.triggerIds.join(",") ||
      notes !== (entry.notes ?? "") ||
      timestamp !== toDatetimeLocalValue(entry.timestamp));

  const { isPrompting, guard, confirmLeave, cancelLeave } =
    useUnsavedChangesGuard(isDirty);

  useEffect(() => {
    if (open) {
      setPainLevel(entry.painLevel);
      setPainFrequency(entry.painFrequency);
      setRemedyIds(entry.remedyIds);
      setTriggerIds(entry.triggerIds);
      setNotes(entry.notes ?? "");
      setTimestamp(toDatetimeLocalValue(entry.timestamp));
    }
  }, [open, entry]);

  const toggleRemedy = (remedyId: string) => {
    setRemedyIds((prev) =>
      prev.includes(remedyId)
        ? prev.filter((id) => id !== remedyId)
        : [...prev, remedyId],
    );
  };

  const toggleTrigger = (triggerId: string) => {
    setTriggerIds((prev) =>
      prev.includes(triggerId)
        ? prev.filter((id) => id !== triggerId)
        : [...prev, triggerId],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLogEntry(entry.id, {
        timestamp: fromDatetimeLocalValue(timestamp),
        painLevel,
        painFrequency,
        remedyIds,
        triggerIds,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => guard(onClose)}
      onSave={handleSave}
      title={
        injury ? (
          <>
            Edit log entry — <InjuryTitle injury={injury} />
          </>
        ) : (
          "Edit log entry"
        )
      }
      footer={
        <>
          <Button variant="ghost" onClick={() => guard(onClose)}>
            Cancel
            <Kbd>{cancelShortcutLabel}</Kbd>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            Save
            <Kbd>{saveShortcutLabel}</Kbd>
          </Button>
        </>
      }
    >
      <PainSlider value={painLevel} onChange={setPainLevel} />
      <PainFrequencySlider value={painFrequency} onChange={setPainFrequency} />
      <RemedyCheckboxGroup
        injuryId={entry.injuryId}
        selectedRemedyIds={remedyIds}
        onToggle={toggleRemedy}
      />
      <TriggerCheckboxGroup
        injuryId={entry.injuryId}
        selectedTriggerIds={triggerIds}
        onToggle={toggleTrigger}
      />

      <div>
        <Label>Notes</Label>
        <RichTextEditor value={notes} onChange={setNotes} autoFocus />
      </div>

      <div>
        <Label>When</Label>
        <Input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />
      </div>

      <ConfirmDialog
        open={isPrompting}
        message="You have unsaved changes to this log entry. Leave without saving?"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </Modal>
  );
}
