import { useState, type SubmitEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';

interface TodoFormValues {
  text: string;
  description: string;
}

interface TodoFormProps {
  initial?: Partial<TodoFormValues>;
  submitLabel: string;
  onSubmit: (values: TodoFormValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function TodoForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: TodoFormProps) {
  const [text, setText] = useState(initial?.text ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [submitting, setSubmitting] = useState(false);

  const doSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ text: text.trim(), description: description.trim() });
      if (!initial) {
        setText('');
        setDescription('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    void doSubmit();
  };

  return (
    <Card
      as="form"
      size="sm"
      variant="dashed"
      onSubmit={handleSubmit}
      className="space-y-2.5"
    >
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Todo"
        required
        autoFocus
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
      />

      <div className="flex items-center gap-2.5">
        <Button
          type="submit"
          disabled={submitting || !text.trim()}
          className="flex-1"
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}
