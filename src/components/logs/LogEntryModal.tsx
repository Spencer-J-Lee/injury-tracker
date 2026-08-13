import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Kbd } from '@/components/ui/Kbd';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { InjurySelector } from '@/components/logs/InjurySelector';
import { PainSlider } from '@/components/logs/PainSlider';
import { PainFrequencySlider } from '@/components/logs/PainFrequencySlider';
import { RemedyCheckboxGroup } from '@/components/logs/RemedyCheckboxGroup';
import { TriggerCheckboxGroup } from '@/components/logs/TriggerCheckboxGroup';
import { InjuryTitle } from '@/components/injuries/InjuryTitle';
import { RichTextEditor } from '@/components/journal/RichTextEditor';
import { useLogModal } from '@/context/useLogModal';
import { useInjuries } from '@/hooks/useInjuries';
import { useUnsavedChangesGuard } from '@/hooks/useUnsavedChangesGuard';
import { createLogSession } from '@/db/queries/logEntries';
import { toDatetimeLocalValue, fromDatetimeLocalValue } from '@/lib/dates';
import {
  saveShortcutLabel,
  cancelShortcutLabel,
  saveNoSymptomsShortcutLabel,
} from '@/lib/shortcuts';
import { matchesShortcut } from '@/lib/keyboardShortcut';

export function LogEntryModal() {
  const { state, closeLogModal } = useLogModal();
  const injuries = useInjuries() ?? [];

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [painLevel, setPainLevel] = useState<number | undefined>(undefined);
  const [painFrequency, setPainFrequency] = useState<number | undefined>(
    undefined,
  );
  const [remedyIds, setRemedyIds] = useState<string[]>([]);
  const [triggerIds, setTriggerIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [timestamp, setTimestamp] = useState(() =>
    toDatetimeLocalValue(new Date().toISOString()),
  );
  const [saving, setSaving] = useState(false);
  const initialTimestampRef = useRef(timestamp);

  const initialSelectedId = state.initialInjuryId;
  const isDirty =
    state.open &&
    (selectedId !== initialSelectedId ||
      painLevel !== undefined ||
      painFrequency !== undefined ||
      remedyIds.length > 0 ||
      triggerIds.length > 0 ||
      notes.trim().length > 0 ||
      timestamp !== initialTimestampRef.current);

  const { isPrompting, guard, confirmLeave, cancelLeave } =
    useUnsavedChangesGuard(isDirty);

  useEffect(() => {
    if (state.open) {
      setSelectedId(state.initialInjuryId);
      setPainLevel(undefined);
      setPainFrequency(undefined);
      setRemedyIds([]);
      setTriggerIds([]);
      setNotes('');
      const initialTimestamp = toDatetimeLocalValue(new Date().toISOString());
      setTimestamp(initialTimestamp);
      initialTimestampRef.current = initialTimestamp;
    }
  }, [state.open, state.initialInjuryId]);

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

  const saveEntry = useCallback(
    async (values: {
      painLevel: number | undefined;
      painFrequency: number | undefined;
      remedyIds: string[];
      triggerIds: string[];
    }) => {
      if (!selectedId) return;
      setSaving(true);
      try {
        await createLogSession({
          timestamp: fromDatetimeLocalValue(timestamp),
          notes: notes.trim() || undefined,
          injuries: [
            {
              injuryId: selectedId,
              ...values,
            },
          ],
        });
        closeLogModal();
      } finally {
        setSaving(false);
      }
    },
    [selectedId, timestamp, notes, closeLogModal],
  );

  const handleSave = () =>
    saveEntry({ painLevel, painFrequency, remedyIds, triggerIds });

  const handleSaveNoSymptoms = useCallback(
    () =>
      saveEntry({
        painLevel: 0,
        painFrequency: 0,
        remedyIds: [],
        triggerIds: [],
      }),
    [saveEntry],
  );

  useEffect(() => {
    if (!state.open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (matchesShortcut(e, 's', { meta: true, shift: true })) {
        e.preventDefault();
        handleSaveNoSymptoms();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.open, handleSaveNoSymptoms]);

  const selectedInjury = injuries.find((i) => i.id === selectedId);

  return (
    <Modal
      open={state.open}
      onClose={() => guard(closeLogModal)}
      onSave={handleSave}
      title={
        selectedInjury ? (
          <>
            Log entry — <InjuryTitle injury={selectedInjury} />
          </>
        ) : (
          'Log entry'
        )
      }
      footer={
        <>
          <Button
            variant="ghost"
            iconAfter={<Kbd>{cancelShortcutLabel}</Kbd>}
            onClick={() => guard(closeLogModal)}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            iconAfter={<Kbd>{saveNoSymptomsShortcutLabel}</Kbd>}
            onClick={handleSaveNoSymptoms}
            disabled={saving || !selectedId}
          >
            Save: No Symptoms
          </Button>
          <Button
            iconAfter={<Kbd>{saveShortcutLabel}</Kbd>}
            onClick={handleSave}
            disabled={saving || !selectedId}
          >
            Submit
          </Button>
        </>
      }
    >
      {selectedInjury ? (
        <>
          <PainSlider value={painLevel} onChange={setPainLevel} />
          <PainFrequencySlider
            value={painFrequency}
            onChange={setPainFrequency}
          />
          <RemedyCheckboxGroup
            injuryId={selectedInjury.id}
            selectedRemedyIds={remedyIds}
            onToggle={toggleRemedy}
          />
          <TriggerCheckboxGroup
            injuryId={selectedInjury.id}
            selectedTriggerIds={triggerIds}
            onToggle={toggleTrigger}
          />
        </>
      ) : (
        <InjurySelector
          injuries={injuries}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}

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
