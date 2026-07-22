import { useState } from "react";
import { faPen, faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { TriggerForm } from "@/components/triggers/TriggerForm";
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
      <h3 className="font-heading text-ink-emphasis mb-6 text-lg font-semibold">
        Triggers
      </h3>

      {triggers.length > 0 && (
        <ul className="mb-2.5 space-y-2.5">
          {triggers.map((trigger) =>
            editingId === trigger.id ? (
              <li key={trigger.id}>
                <TriggerForm
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
              <Card as="li" size="md" variant="subtle" key={trigger.id}>
                <div className="flex min-w-0 items-start justify-between gap-2.5">
                  <p className="text-ink">{trigger.name}</p>
                  <div className="flex shrink-0 gap-2">
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
                  <p className="text-ink-muted mt-1.5 text-sm">
                    {trigger.description}
                  </p>
                )}
              </Card>
            ),
          )}
        </ul>
      )}

      {adding ? (
        <div>
          <TriggerForm
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
          variant={triggers.length > 0 ? "ghost" : "dashed"}
          onClick={() => setAdding(true)}
          className="w-full"
        >
          + Add
        </Button>
      )}
    </Card>
  );
}
