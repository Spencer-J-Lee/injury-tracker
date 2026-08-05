import { useState, type SubmitEvent } from "react";
import type { ActivityBodyPart } from "@/types/models";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Kbd } from "@/components/ui/Kbd";
import { TogglePill } from "@/components/ui/TogglePill";
import { RichTextEditor } from "@/components/journal/RichTextEditor";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { useSections } from "@/hooks/useSections";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";
import { ACTIVITY_BODY_PARTS } from "@/lib/activities";

interface ActivityFormValues {
  name: string;
  description: string;
  sectionId: string;
  bodyPartsRested: ActivityBodyPart[];
}

interface ActivityFormProps {
  initial?: ActivityFormValues;
  onSubmit: (values: ActivityFormValues) => void | Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function ActivityForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: ActivityFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sectionId, setSectionId] = useState(initial?.sectionId ?? "");
  const [bodyPartsRested, setBodyPartsRested] = useState<ActivityBodyPart[]>(
    initial?.bodyPartsRested ?? [],
  );
  const [submitting, setSubmitting] = useState(false);
  const sections = useSections() ?? [];

  const toggleBodyPart = (part: ActivityBodyPart) => {
    setBodyPartsRested((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part],
    );
  };

  const isDirty =
    name !== (initial?.name ?? "") ||
    description !== (initial?.description ?? "") ||
    sectionId !== (initial?.sectionId ?? "") ||
    [...bodyPartsRested].sort().join(",") !==
      [...(initial?.bodyPartsRested ?? [])].sort().join(",");

  const { markSaved } = useUnsavedChangesGuard(isDirty);

  const doSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    markSaved();
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        sectionId,
        bodyPartsRested,
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label size="md">Activity Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Reading"
          required
          autoFocus
        />
      </div>
      <div>
        <Label size="md">Section</Label>
        <Select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
        >
          <option value="">Other</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label size="md">Rests</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {ACTIVITY_BODY_PARTS.map((part) => (
            <TogglePill
              key={part}
              type="button"
              selected={bodyPartsRested.includes(part)}
              onClick={() => toggleBodyPart(part)}
            >
              {part}
            </TogglePill>
          ))}
        </div>
      </div>
      <div>
        <Label size="md">Description</Label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Notes (optional)"
        />
      </div>
      <div className="flex items-center gap-2.5">
        <Button
          type="submit"
          disabled={submitting || !name.trim()}
          iconAfter={<Kbd>{saveShortcutLabel}</Kbd>}
        >
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          iconAfter={<Kbd>{cancelShortcutLabel}</Kbd>}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
