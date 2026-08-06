import { useState } from 'react';
import {
  faPen,
  faBoxArchive,
  faAsterisk,
  faDumbbell,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { RemedyCategory, Remedy } from '@/types/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RemedyForm } from '@/components/remedies/RemedyForm';
import { RichTextContent } from '@/components/journal/RichTextContent';
import {
  createRemedy,
  archiveRemedy,
  updateRemedy,
} from '@/db/queries/remedies';
import { useConfirmTarget } from '@/hooks/useConfirmTarget';

interface RemedySectionDefaults {
  category?: RemedyCategory;
}

export function RemedySection({
  title,
  remedies,
  injuryId,
  defaults,
  showCategoryBadge = true,
}: {
  title: string;
  remedies: Remedy[];
  injuryId: string;
  defaults: RemedySectionDefaults;
  showCategoryBadge?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const confirmingArchive = useConfirmTarget(remedies);

  return (
    <div>
      <h4 className="text-ink-faint mb-3 text-sm font-semibold tracking-wide uppercase">
        {title}
      </h4>

      {remedies.length > 0 && (
        <ul className="mb-2.5 space-y-2.5">
          {remedies.map((remedy) =>
            editingId === remedy.id ? (
              <li key={remedy.id}>
                <RemedyForm
                  initial={{
                    name: remedy.name,
                    description: remedy.description ?? '',
                    category: remedy.category,
                    providesImmediateRelief: remedy.providesImmediateRelief,
                    isProgramExercise: remedy.isProgramExercise ?? false,
                  }}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (values) => {
                    await updateRemedy(remedy.id, values);
                    setEditingId(null);
                  }}
                />
              </li>
            ) : (
              <Card
                as="li"
                size="md"
                variant="muted"
                key={remedy.id}
                className="text-pretty"
              >
                <div className="flex min-w-0 items-start justify-between gap-2.5">
                  <p className="text-ink">
                    {remedy.name}
                    {remedy.providesImmediateRelief && (
                      <FontAwesomeIcon
                        icon={faAsterisk}
                        className="text-pain-green ml-1.5 align-baseline! text-xs"
                      />
                    )}
                    {remedy.isProgramExercise && (
                      <FontAwesomeIcon
                        icon={faDumbbell}
                        className="text-accent-soft-text ml-1.5 align-baseline! text-xs"
                      />
                    )}
                  </p>
                  <div className="flex shrink-0 flex-wrap justify-end gap-2">
                    {showCategoryBadge && remedy.category && (
                      <Badge>{remedy.category}</Badge>
                    )}
                    <IconButton
                      icon={faPen}
                      label="Edit remedy"
                      onClick={() => setEditingId(remedy.id)}
                    />
                    <IconButton
                      icon={faBoxArchive}
                      tone="warning"
                      label="Archive remedy"
                      onClick={() => confirmingArchive.confirm(remedy.id)}
                    />
                  </div>
                </div>
                {remedy.description && (
                  <RichTextContent
                    html={remedy.description}
                    className="text-ink-muted mt-1.5 text-sm text-pretty"
                    onChange={(description) =>
                      updateRemedy(remedy.id, { description })
                    }
                  />
                )}
              </Card>
            ),
          )}
        </ul>
      )}

      {adding ? (
        <div>
          <RemedyForm
            initial={defaults}
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={async (values) => {
              await createRemedy({ injuryId, ...values });
              setAdding(false);
            }}
          />
        </div>
      ) : (
        <Button
          variant={remedies.length > 0 ? 'ghost' : 'dashed'}
          size={remedies.length > 0 ? 'sm' : 'md'}
          onClick={() => setAdding(true)}
          className="w-full"
        >
          + Add
        </Button>
      )}

      <ConfirmDialog
        open={confirmingArchive.target != null}
        title="Archive remedy?"
        message={`"${confirmingArchive.target?.name}" will be moved to the archived list.`}
        confirmLabel="Archive"
        confirmVariant="warning"
        onConfirm={() => {
          if (confirmingArchive.target)
            archiveRemedy(confirmingArchive.target.id);
          confirmingArchive.clear();
        }}
        onCancel={() => confirmingArchive.clear()}
      />
    </div>
  );
}
