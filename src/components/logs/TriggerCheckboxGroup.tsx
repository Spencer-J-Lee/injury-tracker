import { useState } from "react";
import type { Category } from "@/types/models";
import { useTriggers } from "@/hooks/useTriggers";
import { createTrigger } from "@/db/queries/triggers";
import { Label } from "../ui/Label";
import { TogglePill } from "@/components/ui/TogglePill";
import { Button } from "../ui/Button";
import { EntityForm } from "@/components/ui/EntityForm";

interface TriggerCheckboxGroupProps {
  injuryId: string;
  selectedTriggerIds: string[];
  onToggle: (triggerId: string) => void;
}

export function TriggerCheckboxGroup({
  injuryId,
  selectedTriggerIds,
  onToggle,
}: TriggerCheckboxGroupProps) {
  const triggers = useTriggers(injuryId) ?? [];
  const [adding, setAdding] = useState(false);

  const handleAdd = async (values: {
    name: string;
    description: string;
    category?: Category;
  }) => {
    const created = await createTrigger({
      injuryId,
      name: values.name,
      description: values.description || undefined,
      category: values.category,
    });
    onToggle(created.id);
  };

  return (
    <div>
      <Label>Triggers</Label>
      <div className="flex flex-wrap gap-2">
        {triggers.map((trigger) => {
          const selected = selectedTriggerIds.includes(trigger.id);
          return (
            <TogglePill
              key={trigger.id}
              tone="red"
              selected={selected}
              onClick={() => onToggle(trigger.id)}
            >
              {trigger.name}
            </TogglePill>
          );
        })}
        <Button variant={triggers.length > 0 ? "ghost" : "dashed"} size="sm" onClick={() => setAdding(true)}>
          + Add
        </Button>
      </div>
      {adding && (
        <div className="mt-1.5">
          <EntityForm
            nameLabel="Trigger Name"
            submitLabel="Add"
            showShortcuts={false}
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await handleAdd(values);
              setAdding(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
