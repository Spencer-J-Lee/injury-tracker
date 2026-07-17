import { useState, type SubmitEvent } from "react";
import type { TriggerCategory } from "@/types/models";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Kbd } from "@/components/ui/Kbd";
import { Select } from "@/components/ui/Select";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";
import { Textarea } from "@/components/ui/Textarea";
import { TRIGGER_CATEGORIES } from "@/lib/categories";

interface TriggerFormValues {
  name: string;
  description: string;
  category?: TriggerCategory;
}

interface TriggerFormProps {
  initial?: Partial<TriggerFormValues>;
  submitLabel: string;
  onSubmit: (values: TriggerFormValues) => void | Promise<void>;
  onCancel?: () => void;
  showShortcuts?: boolean;
}

export function TriggerForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  showShortcuts = true,
}: TriggerFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<TriggerCategory | undefined>(
    initial?.category,
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
      });
      if (!initial) {
        setName("");
        setDescription("");
        setCategory(undefined);
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
      className="space-y-2"
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Trigger Name"
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
          setCategory(e.target.value as TriggerCategory | undefined)
        }
      >
        <option value="">No category</option>
        {TRIGGER_CATEGORIES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>

      <div className="flex items-center gap-2">
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
