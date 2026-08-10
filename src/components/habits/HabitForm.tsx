import { useId, useState, type SubmitEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Kbd } from '@/components/ui/Kbd';
import { Textarea } from '@/components/ui/Textarea';
import { useFormShortcuts } from '@/hooks/useFormShortcuts';
import { saveShortcutLabel, cancelShortcutLabel } from '@/lib/shortcuts';

interface HabitFormValues {
  name: string;
  description: string;
  optional: boolean;
}

interface HabitFormProps {
  initial?: Partial<HabitFormValues>;
  submitLabel: string;
  onSubmit: (values: HabitFormValues) => void | Promise<void>;
  onCancel?: () => void;
  showShortcuts?: boolean;
}

export function HabitForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  showShortcuts = true,
}: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [optional, setOptional] = useState(initial?.optional ?? false);
  const [submitting, setSubmitting] = useState(false);
  const optionalId = useId();

  const doSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        optional,
      });
      if (!initial) {
        setName('');
        setDescription('');
        setOptional(false);
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
        placeholder="Habit Name"
        required
        autoFocus
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Notes (optional)"
      />
      <Checkbox
        id={optionalId}
        label="Optional"
        checked={optional}
        onChange={(e) => setOptional(e.target.checked)}
      />

      <div className="flex items-center gap-2.5">
        <Button
          type="submit"
          disabled={submitting || !name.trim()}
          className="flex-1"
          iconAfter={showShortcuts && <Kbd>{saveShortcutLabel}</Kbd>}
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
            iconAfter={showShortcuts && <Kbd>{cancelShortcutLabel}</Kbd>}
          >
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}
