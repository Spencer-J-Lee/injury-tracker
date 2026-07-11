import { useState, type SubmitEvent } from "react";
import type { Category } from "@/types/models";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { Select } from "@/components/ui/Select";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";
import { Textarea } from "./Textarea";

const CATEGORIES: Category[] = [
  "Mobility",
  "Strengthening",
  "Lifestyle",
  "Rest",
  "Overuse",
  "Posture",
];

interface EntityFormValues {
  name: string;
  description: string;
  category?: Category;
}

interface EntityFormProps {
  nameLabel: string;
  initial?: Partial<EntityFormValues>;
  submitLabel: string;
  onSubmit: (values: EntityFormValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function EntityForm({
  nameLabel,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: EntityFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<Category | undefined>(
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

  useFormShortcuts({ onSave: doSubmit, onCancel });

  return (
    <form
      onSubmit={handleSubmit}
      className="border-strong space-y-2 rounded-lg border border-dashed p-3"
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={nameLabel}
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
          setCategory(e.target.value as Category | undefined)
        }
      >
        <option value="">No category</option>
        {CATEGORIES.map((option) => (
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
          <Kbd>{saveShortcutLabel}</Kbd>
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
            <Kbd>{cancelShortcutLabel}</Kbd>
          </Button>
        )}
      </div>
    </form>
  );
}
