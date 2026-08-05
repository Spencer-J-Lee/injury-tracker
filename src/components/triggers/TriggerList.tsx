import { useState } from 'react';
import { faPen, faBoxArchive, faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { TriggerForm } from '@/components/triggers/TriggerForm';
import { RichTextContent } from '@/components/journal/RichTextEditor';
import { useTriggers } from '@/hooks/useTriggers';
import {
  createTrigger,
  archiveTrigger,
  updateTrigger,
} from '@/db/queries/triggers';

export function TriggerList({ injuryId }: { injuryId: string }) {
  const triggers = useTriggers(injuryId) ?? [];
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Card>
      <div className="mb-6 flex items-baseline justify-between gap-2.5">
        <h3 className="font-heading text-ink-emphasis text-lg font-semibold">
          Triggers
        </h3>
        <span className="text-ink-faint flex items-center gap-1 text-xs">
          <FontAwesomeIcon icon={faBolt} className="text-pain-red text-xs" />
          High reactivity
        </span>
      </div>

      {triggers.length > 0 && (
        <ul className="mb-2.5 space-y-2.5">
          {triggers.map((trigger) =>
            editingId === trigger.id ? (
              <li key={trigger.id}>
                <TriggerForm
                  initial={{
                    name: trigger.name,
                    description: trigger.description ?? '',
                    category: trigger.category,
                    isHighReactivity: trigger.isHighReactivity ?? false,
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
              <Card
                as="li"
                size="md"
                variant="muted"
                key={trigger.id}
                className="text-pretty"
              >
                <div className="flex min-w-0 items-start justify-between gap-2.5">
                  <p className="text-ink">
                    {trigger.name}
                    {trigger.isHighReactivity && (
                      <FontAwesomeIcon
                        icon={faBolt}
                        className="text-pain-red ml-1.5 align-baseline! text-xs"
                      />
                    )}
                  </p>
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
                  <RichTextContent
                    html={trigger.description}
                    className="text-ink-muted mt-1.5 text-sm text-pretty"
                  />
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
          variant={triggers.length > 0 ? 'ghost' : 'dashed'}
          size={triggers.length > 0 ? 'sm' : 'md'}
          onClick={() => setAdding(true)}
          className="w-full"
        >
          + Add
        </Button>
      )}
    </Card>
  );
}
