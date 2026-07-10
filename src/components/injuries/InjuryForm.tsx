import { useState, type SubmitEvent } from "react";
import type { Injury, InjuryStatus } from "@/types/models";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Kbd } from "@/components/ui/Kbd";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";

interface InjuryFormValues {
  name: string;
  description: string;
  status: InjuryStatus;
}

interface InjuryFormProps {
  initial?: Injury;
  onSubmit: (values: InjuryFormValues) => void | Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function InjuryForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: InjuryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<InjuryStatus>(
    initial?.status ?? "active",
  );
  const [submitting, setSubmitting] = useState(false);

  const doSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        status,
      });
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label size="md">Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Right Flexors: RSI"
          required
          autoFocus
        />
      </div>
      {initial && (
        <div>
          <Label size="md">Status</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as InjuryStatus)}
          >
            <option value="active">Active</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </Select>
        </div>
      )}
      <div>
        <Label size="md">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What caused the injury and what are the symptoms?"
          rows={3}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting || !name.trim()}>
          {submitLabel}
          <Kbd>{saveShortcutLabel}</Kbd>
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
          <Kbd>{cancelShortcutLabel}</Kbd>
        </Button>
      </div>
    </form>
  );
}
