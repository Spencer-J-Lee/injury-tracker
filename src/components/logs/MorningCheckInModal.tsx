import { useEffect, useState } from "react";
import type {
  MorningCheckIn,
  NumbnessDuration,
  NumbnessSuspectedCause,
  PainMechanism,
  StiffnessDuration,
} from "@/types/models";
import type { Injury } from "@/types/models";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Kbd } from "@/components/ui/Kbd";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { InjuryTitle } from "@/components/injuries/InjuryTitle";
import { PainSlider } from "@/components/logs/PainSlider";
import { StiffnessDurationSelect } from "@/components/logs/StiffnessDurationSelect";
import { NumbnessCheckIn } from "@/components/logs/NumbnessCheckIn";
import { RichTextEditor } from "@/components/journal/RichTextEditor";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import {
  createMorningCheckIn,
  updateMorningCheckIn,
} from "@/db/queries/morningCheckIns";
import { toDatetimeLocalValue, fromDatetimeLocalValue } from "@/lib/dates";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";
import { getMechanismVisibility } from "@/lib/morningCheckInOptions";

interface MorningCheckInModalProps {
  injuryId: string;
  injury?: Pick<Injury, "bodyPart" | "injuryType" | "locationDetail">;
  painMechanisms: PainMechanism[];
  entry?: MorningCheckIn;
  open: boolean;
  onClose: () => void;
}

export function MorningCheckInModal({
  injuryId,
  injury,
  painMechanisms,
  entry,
  open,
  onClose,
}: MorningCheckInModalProps) {
  const { showNociceptive, showNeuropathic, showNociplastic } =
    getMechanismVisibility(entry?.painMechanisms ?? painMechanisms);
  const showPain = showNociceptive || showNociplastic;

  const [painLevel, setPainLevel] = useState<number | undefined>(
    entry?.painLevel,
  );
  const [stiffnessLevel, setStiffnessLevel] = useState<number | undefined>(
    entry?.stiffnessLevel,
  );
  const [stiffnessDuration, setStiffnessDuration] = useState<
    StiffnessDuration | undefined
  >(entry?.stiffnessDuration);
  const [numbnessPresent, setNumbnessPresent] = useState<boolean | undefined>(
    entry?.numbnessPresent,
  );
  const [numbnessDuration, setNumbnessDuration] = useState<
    NumbnessDuration | undefined
  >(entry?.numbnessDuration);
  const [numbnessSuspectedCause, setNumbnessSuspectedCause] = useState<
    NumbnessSuspectedCause | undefined
  >(entry?.numbnessSuspectedCause);
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [timestamp, setTimestamp] = useState(() =>
    toDatetimeLocalValue(entry?.timestamp ?? new Date().toISOString()),
  );
  const [initialTimestamp, setInitialTimestamp] = useState(timestamp);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setPainLevel(entry?.painLevel);
      setStiffnessLevel(entry?.stiffnessLevel);
      setStiffnessDuration(entry?.stiffnessDuration);
      setNumbnessPresent(entry?.numbnessPresent);
      setNumbnessDuration(entry?.numbnessDuration);
      setNumbnessSuspectedCause(entry?.numbnessSuspectedCause);
      setNotes(entry?.notes ?? "");
      const nextTimestamp = toDatetimeLocalValue(
        entry?.timestamp ?? new Date().toISOString(),
      );
      setTimestamp(nextTimestamp);
      setInitialTimestamp(nextTimestamp);
    }
  }, [open, entry]);

  const handleStiffnessLevelChange = (level: number | undefined) => {
    setStiffnessLevel(level);
    if (!level) {
      setStiffnessDuration(undefined);
    }
  };

  const handleNumbnessPresentChange = (present: boolean) => {
    setNumbnessPresent(present);
    if (present !== true) {
      setNumbnessDuration(undefined);
      setNumbnessSuspectedCause(undefined);
    }
  };

  const isDirty = open && entry
    ? painLevel !== entry.painLevel ||
      stiffnessLevel !== entry.stiffnessLevel ||
      stiffnessDuration !== entry.stiffnessDuration ||
      numbnessPresent !== entry.numbnessPresent ||
      numbnessDuration !== entry.numbnessDuration ||
      numbnessSuspectedCause !== entry.numbnessSuspectedCause ||
      notes !== (entry.notes ?? "") ||
      timestamp !== toDatetimeLocalValue(entry.timestamp)
    : open &&
      (painLevel !== undefined ||
        stiffnessLevel !== undefined ||
        stiffnessDuration !== undefined ||
        numbnessPresent !== undefined ||
        notes.trim().length > 0 ||
        timestamp !== initialTimestamp);

  const { isPrompting, guard, confirmLeave, cancelLeave } =
    useUnsavedChangesGuard(isDirty);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (entry) {
        await updateMorningCheckIn(entry.id, {
          timestamp: fromDatetimeLocalValue(timestamp),
          painLevel,
          stiffnessLevel,
          stiffnessDuration,
          numbnessPresent,
          numbnessDuration,
          numbnessSuspectedCause,
          notes: notes.trim() || undefined,
        });
      } else {
        await createMorningCheckIn({
          injuryId,
          timestamp: fromDatetimeLocalValue(timestamp),
          painMechanisms,
          painLevel,
          stiffnessLevel,
          stiffnessDuration,
          numbnessPresent,
          numbnessDuration,
          numbnessSuspectedCause,
          notes: notes.trim() || undefined,
        });
      }
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
            {entry ? "Edit morning check-in" : "Morning check-in"} —{" "}
            <InjuryTitle injury={injury} />
          </>
        ) : entry ? (
          "Edit morning check-in"
        ) : (
          "Morning check-in"
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
      {showPain && (
        <PainSlider
          value={painLevel}
          onChange={setPainLevel}
          label="Resting pain"
        />
      )}
      {showNociceptive && (
        <>
          <PainSlider
            value={stiffnessLevel}
            onChange={handleStiffnessLevelChange}
            label="Stiffness"
            tone="violet"
          />
          {stiffnessLevel !== undefined && stiffnessLevel > 0 && (
            <StiffnessDurationSelect
              value={stiffnessDuration}
              onChange={setStiffnessDuration}
            />
          )}
        </>
      )}
      {showNeuropathic && (
        <NumbnessCheckIn
          present={numbnessPresent}
          onPresentChange={handleNumbnessPresentChange}
          duration={numbnessDuration}
          onDurationChange={setNumbnessDuration}
          suspectedCause={numbnessSuspectedCause}
          onSuspectedCauseChange={setNumbnessSuspectedCause}
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
        message="You have unsaved changes to this morning check-in. Leave without saving?"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </Modal>
  );
}
