import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { Label } from "@/components/ui/Label";
import { LinkButton } from "@/components/ui/LinkButton";
import { TogglePill } from "@/components/ui/TogglePill";
import { useInjuries } from "@/hooks/useInjuries";
import { useProgramExercisePool } from "@/hooks/useProgramExercisePool";
import { compareInjuries, formatInjuryName } from "@/lib/injuries";
import { formatShortDateWithDay } from "@/lib/dates";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";

interface EditExercisesModalProps {
  open: boolean;
  date: string;
  existingRemedyIds: string[];
  onSubmit: (remedyIds: string[]) => void | Promise<void>;
  onCancel: () => void;
}

export function EditExercisesModal({
  open,
  date,
  existingRemedyIds,
  onSubmit,
  onCancel,
}: EditExercisesModalProps) {
  const injuries = useInjuries() ?? [];
  const pool = useProgramExercisePool() ?? [];
  const [remedyIds, setRemedyIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setRemedyIds(open ? existingRemedyIds : []);
  }, [open, existingRemedyIds]);

  const groups = [...injuries]
    .sort(compareInjuries)
    .map((injury) => ({
      injury,
      remedies: pool.filter((remedy) => remedy.injuryId === injury.id),
    }))
    .filter((group) => group.remedies.length > 0);

  const toggleRemedy = (remedyId: string) => {
    setRemedyIds((prev) =>
      prev.includes(remedyId)
        ? prev.filter((id) => id !== remedyId)
        : [...prev, remedyId],
    );
  };

  const toggleGroup = (groupRemedyIds: string[]) => {
    const allSelected = groupRemedyIds.every((id) => remedyIds.includes(id));
    setRemedyIds((prev) =>
      allSelected
        ? prev.filter((id) => !groupRemedyIds.includes(id))
        : [...new Set([...prev, ...groupRemedyIds])],
    );
  };

  const handleSubmit = () => {
    if (submitting) return;
    setSubmitting(true);
    void Promise.resolve(onSubmit(remedyIds)).finally(() =>
      setSubmitting(false),
    );
  };

  return (
    <Modal
      open={open}
      onClose={onCancel}
      onSave={handleSubmit}
      title={`Edit exercises — ${formatShortDateWithDay(date)}`}
      size="narrow"
      footer={
        <>
          <Button onClick={handleSubmit} disabled={submitting}>
            Save
            <Kbd>{saveShortcutLabel}</Kbd>
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
            <Kbd>{cancelShortcutLabel}</Kbd>
          </Button>
        </>
      }
    >
      {groups.map(({ injury, remedies }) => {
        const groupRemedyIds = remedies.map((remedy) => remedy.id);
        const allSelected = groupRemedyIds.every((id) =>
          remedyIds.includes(id),
        );
        return (
          <div key={injury.id}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <Label noMargin>{formatInjuryName(injury)}</Label>
              <LinkButton onClick={() => toggleGroup(groupRemedyIds)}>
                {allSelected ? "clear" : "select all"}
              </LinkButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {remedies.map((remedy) => (
                <TogglePill
                  key={remedy.id}
                  selected={remedyIds.includes(remedy.id)}
                  onClick={() => toggleRemedy(remedy.id)}
                >
                  {remedy.name}
                </TogglePill>
              ))}
            </div>
          </div>
        );
      })}
    </Modal>
  );
}
