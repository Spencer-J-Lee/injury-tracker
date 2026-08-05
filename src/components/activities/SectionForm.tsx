import { useState, type SubmitEvent } from 'react';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/components/ui/Input';
import { IconButton } from '@/components/ui/IconButton';
import { useFormShortcuts } from '@/hooks/useFormShortcuts';

interface SectionFormValues {
  name: string;
}

interface SectionFormProps {
  initial?: SectionFormValues;
  onSubmit: (values: SectionFormValues) => void | Promise<void>;
  onCancel: () => void;
}

export function SectionForm({ initial, onSubmit, onCancel }: SectionFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [submitting, setSubmitting] = useState(false);

  const doSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim() });
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
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Section name"
        size="sm"
        className="w-auto max-w-68"
        autoFocus
      />
      <IconButton
        type="submit"
        icon={faCheck}
        label="Save section"
        disabled={submitting || !name.trim()}
        className="shrink-0"
      />
      <IconButton
        type="button"
        icon={faXmark}
        tone="danger"
        label="Cancel"
        onClick={onCancel}
        className="shrink-0"
      />
    </form>
  );
}
