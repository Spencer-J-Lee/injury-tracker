import { useState, type SubmitEvent } from "react";
import type { RemedyCategory } from "@/types/models";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Kbd } from "@/components/ui/Kbd";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";
import { Textarea } from "@/components/ui/Textarea";
import { REMEDY_CATEGORIES } from "@/lib/categories";

interface RemedyFormValues {
  name: string;
  description: string;
  category?: RemedyCategory;
  providesImmediateRelief: boolean;
  isProgramExercise: boolean;
}

interface RemedyFormProps {
  initial?: Partial<RemedyFormValues>;
  submitLabel: string;
  onSubmit: (values: RemedyFormValues) => void | Promise<void>;
  onCancel?: () => void;
  showShortcuts?: boolean;
}

export function RemedyForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  showShortcuts = true,
}: RemedyFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<RemedyCategory | undefined>(
    initial?.category,
  );
  const [providesImmediateRelief, setProvidesImmediateRelief] = useState(
    initial?.providesImmediateRelief ?? false,
  );
  const [isProgramExercise, setIsProgramExercise] = useState(
    initial?.isProgramExercise ?? false,
  );
  const [submitting, setSubmitting] = useState(false);

  const doSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        category,
        providesImmediateRelief,
        isProgramExercise: category === "Strengthening" && isProgramExercise,
      });
      if (!initial) {
        setName("");
        setDescription("");
        setCategory(undefined);
        setProvidesImmediateRelief(false);
        setIsProgramExercise(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    void doSubmit();
  };

  useFormShortcuts({ onSave: doSubmit, onCancel, enabled: showShortcuts });

  return (
    <Card
      as="form"
      size="sm"
      variant="dashed"
      onSubmit={handleSubmit}
      className="space-y-2.5"
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Remedy Name"
        required
        autoFocus
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Notes (optional)"
      />
      <Select
        value={category ?? ""}
        onChange={(e) =>
          setCategory(e.target.value as RemedyCategory | undefined)
        }
      >
        <option value="">No category</option>
        {REMEDY_CATEGORIES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>

      <Checkbox
        id="providesImmediateRelief"
        label="Provides immediate relief"
        checked={providesImmediateRelief}
        onChange={(e) => setProvidesImmediateRelief(e.target.checked)}
      />

      {category === "Strengthening" && (
        <Checkbox
          id="isProgramExercise"
          label="Include in strengthening program"
          checked={isProgramExercise}
          onChange={(e) => setIsProgramExercise(e.target.checked)}
        />
      )}

      <div className="flex items-center gap-2.5">
        <Button
          type="submit"
          disabled={submitting || !name.trim()}
          className="flex-1"
        >
          {submitLabel}
          {showShortcuts && <Kbd>{saveShortcutLabel}</Kbd>}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
            {showShortcuts && <Kbd>{cancelShortcutLabel}</Kbd>}
          </Button>
        )}
      </div>
    </Card>
  );
}
