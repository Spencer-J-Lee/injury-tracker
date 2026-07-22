import { useState, type SubmitEvent } from "react";
import type { Injury, InjuryPriority, InjuryStatus } from "@/types/models";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Kbd } from "@/components/ui/Kbd";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { saveShortcutLabel, cancelShortcutLabel } from "@/lib/shortcuts";

interface InjuryFormValues {
  bodyPart: string;
  injuryType: string;
  locationDetail: string;
  description: string;
  status: InjuryStatus;
  priority: InjuryPriority | null;
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
  const [bodyPart, setBodyPart] = useState(initial?.bodyPart ?? "");
  const [injuryType, setInjuryType] = useState(initial?.injuryType ?? "");
  const [locationDetail, setLocationDetail] = useState(
    initial?.locationDetail ?? "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<InjuryStatus>(
    initial?.status ?? "active",
  );
  const [priority, setPriority] = useState<InjuryPriority | null>(
    initial?.priority ?? null,
  );
  const [submitting, setSubmitting] = useState(false);

  const isDirty =
    bodyPart !== (initial?.bodyPart ?? "") ||
    injuryType !== (initial?.injuryType ?? "") ||
    locationDetail !== (initial?.locationDetail ?? "") ||
    description !== (initial?.description ?? "") ||
    status !== (initial?.status ?? "active") ||
    priority !== (initial?.priority ?? null);

  const { isPrompting, guard, confirmLeave, cancelLeave, markSaved } =
    useUnsavedChangesGuard(isDirty);

  const doSubmit = async () => {
    if (!bodyPart.trim() || !injuryType.trim() || submitting) return;
    setSubmitting(true);
    markSaved();
    try {
      await onSubmit({
        bodyPart: bodyPart.trim(),
        injuryType: injuryType.trim(),
        locationDetail: locationDetail.trim(),
        description: description.trim(),
        status,
        priority,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    void doSubmit();
  };

  const guardedCancel = () => guard(onCancel);

  useFormShortcuts({ onSave: doSubmit, onCancel: guardedCancel });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label size="md">Body Part</Label>
        <Input
          value={bodyPart}
          onChange={(e) => setBodyPart(e.target.value)}
          placeholder="e.g. Deltoids"
          required
          autoFocus
        />
      </div>
      <div>
        <Label size="md">Injury Type</Label>
        <Input
          value={injuryType}
          onChange={(e) => setInjuryType(e.target.value)}
          placeholder="e.g. RSI"
          required
        />
      </div>
      <div>
        <Label size="md">Location Detail</Label>
        <Input
          value={locationDetail}
          onChange={(e) => setLocationDetail(e.target.value)}
          placeholder="e.g. Right, Anterior"
        />
      </div>
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
      <div>
        <Label size="md">Priority</Label>
        <Select
          value={priority ?? ""}
          onChange={(e) =>
            setPriority(
              e.target.value === "" ? null : (e.target.value as InjuryPriority),
            )
          }
        >
          <option value="">None</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>
      <div>
        <Label size="md">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What caused the injury and what are the symptoms?"
          rows={3}
        />
      </div>
      <div className="flex items-center gap-2.5">
        <Button
          type="submit"
          disabled={submitting || !bodyPart.trim() || !injuryType.trim()}
        >
          {submitLabel}
          <Kbd>{saveShortcutLabel}</Kbd>
        </Button>
        <Button type="button" variant="ghost" onClick={guardedCancel}>
          Cancel
          <Kbd>{cancelShortcutLabel}</Kbd>
        </Button>
      </div>
      <ConfirmDialog
        open={isPrompting}
        message="You have unsaved changes to this injury. Leave without saving?"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </form>
  );
}
