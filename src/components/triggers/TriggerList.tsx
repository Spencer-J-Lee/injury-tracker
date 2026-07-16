import { useState } from "react";
import { faPen, faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { EntityForm } from "@/components/ui/EntityForm";
import { useTriggers } from "@/hooks/useTriggers";
import {
  createTrigger,
  archiveTrigger,
  updateTrigger,
} from "@/db/queries/triggers";

export function TriggerList({ injuryId }: { injuryId: string }) {
  const triggers = useTriggers(injuryId) ?? [];
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Card>
      <h3 className="font-heading text-ink-emphasis mb-5 text-sm font-semibold">
        Triggers
      </h3>

      {triggers.length > 0 && (
        <ul className="mb-2 space-y-2">
          {triggers.map((trigger) =>
            editingId === trigger.id ? (
              <li key={trigger.id}>
                <EntityForm
                  nameLabel="Trigger Name"
                  initial={{
                    name: trigger.name,
                    description: trigger.description ?? "",
                    category: trigger.category,
                  }}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (values) => {
                    await updateTrigger(trigger.id, values);
                    setEditingId(null);
                  }}
                />
              </li>
            ) : (
              <li
                key={trigger.id}
                className="border-subtle rounded-[10px] border px-3 py-[9px]"
              >
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <p className="text-ink text-[13px]">{trigger.name}</p>
                  <div className="flex shrink-0 gap-1.5">
                    {trigger.category && <Badge>{trigger.category}</Badge>}
                    <IconButton
                      icon={faPen}
                      label="Edit trigger"
                      onClick={() => setEditingId(trigger.id)}
                    />
                    <IconButton
                      icon={faBoxArchive}
                      tone="danger"
                      label="Archive trigger"
                      onClick={() => archiveTrigger(trigger.id)}
                    />
                  </div>
                </div>
                {trigger.description && (
                  <p className="text-ink-muted mt-1 text-xs text-pretty">
                    {trigger.description}
                  </p>
                )}
              </li>
            ),
          )}
        </ul>
      )}

      {adding ? (
        <div>
          <EntityForm
            nameLabel="Trigger Name"
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await createTrigger({ injuryId, ...values });
              setAdding(false);
            }}
          />
        </div>
      ) : (
        <Button
          variant="dashed"
          onClick={() => setAdding(true)}
          className="w-full"
        >
          + Add
        </Button>
      )}
    </Card>
  );
}
