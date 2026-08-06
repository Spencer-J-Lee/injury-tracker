import {
  faRotateLeft,
  faAsterisk,
  faDumbbell,
  faBolt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Remedy, Trigger } from '@/types/models';
import { Card } from '@/components/ui/Card';
import { CollapsibleCard } from '@/components/ui/CollapsibleCard';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RichTextContent } from '@/components/journal/RichTextContent';
import { useArchivedRemedies } from '@/hooks/useArchivedRemedies';
import { useArchivedTriggers } from '@/hooks/useArchivedTriggers';
import { useConfirmTarget } from '@/hooks/useConfirmTarget';
import { unarchiveRemedy, deleteRemedy } from '@/db/queries/remedies';
import { unarchiveTrigger, deleteTrigger } from '@/db/queries/triggers';

export function ArchivedRemedyTriggerSection({
  injuryId,
}: {
  injuryId: string;
}) {
  const remedies = useArchivedRemedies(injuryId);
  const triggers = useArchivedTriggers(injuryId);
  const confirmDeleteRemedy = useConfirmTarget(remedies);
  const confirmDeleteTrigger = useConfirmTarget(triggers);

  if (remedies.length === 0 && triggers.length === 0) return null;

  return (
    <CollapsibleCard title="Archived" defaultOpen={false}>
      <div className="space-y-4">
        {remedies.length > 0 && (
          <div>
            <h4 className="text-ink-faint mb-3 text-sm font-semibold tracking-wide uppercase">
              Remedies
            </h4>
            <ul className="space-y-2.5">
              {remedies.map((remedy) => (
                <ArchivedRemedyRow
                  key={remedy.id}
                  remedy={remedy}
                  onDeleteRequest={() => confirmDeleteRemedy.confirm(remedy.id)}
                />
              ))}
            </ul>
          </div>
        )}

        {triggers.length > 0 && (
          <div>
            <h4 className="text-ink-faint mb-3 text-sm font-semibold tracking-wide uppercase">
              Triggers
            </h4>
            <ul className="space-y-2.5">
              {triggers.map((trigger) => (
                <ArchivedTriggerRow
                  key={trigger.id}
                  trigger={trigger}
                  onDeleteRequest={() =>
                    confirmDeleteTrigger.confirm(trigger.id)
                  }
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDeleteRemedy.target !== undefined}
        title="Delete remedy?"
        message={`"${confirmDeleteRemedy.target?.name}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDeleteRemedy.target)
            deleteRemedy(confirmDeleteRemedy.target.id);
          confirmDeleteRemedy.clear();
        }}
        onCancel={() => confirmDeleteRemedy.clear()}
      />
      <ConfirmDialog
        open={confirmDeleteTrigger.target !== undefined}
        title="Delete trigger?"
        message={`"${confirmDeleteTrigger.target?.name}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmDeleteTrigger.target)
            deleteTrigger(confirmDeleteTrigger.target.id);
          confirmDeleteTrigger.clear();
        }}
        onCancel={() => confirmDeleteTrigger.clear()}
      />
    </CollapsibleCard>
  );
}

function ArchivedRemedyRow({
  remedy,
  onDeleteRequest,
}: {
  remedy: Remedy;
  onDeleteRequest: () => void;
}) {
  return (
    <Card as="li" size="md" variant="muted" className="text-pretty">
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
          {remedy.category && <Badge>{remedy.category}</Badge>}
          <IconButton
            icon={faRotateLeft}
            label="Restore remedy"
            onClick={() => unarchiveRemedy(remedy.id)}
          />
          <IconButton
            icon={faTrash}
            tone="danger"
            label="Delete remedy"
            onClick={onDeleteRequest}
          />
        </div>
      </div>
      {remedy.description && (
        <RichTextContent
          html={remedy.description}
          className="text-ink-muted mt-1.5 text-sm text-pretty"
        />
      )}
    </Card>
  );
}

function ArchivedTriggerRow({
  trigger,
  onDeleteRequest,
}: {
  trigger: Trigger;
  onDeleteRequest: () => void;
}) {
  return (
    <Card as="li" size="md" variant="muted" className="text-pretty">
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
            icon={faRotateLeft}
            label="Restore trigger"
            onClick={() => unarchiveTrigger(trigger.id)}
          />
          <IconButton
            icon={faTrash}
            tone="danger"
            label="Delete trigger"
            onClick={onDeleteRequest}
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
  );
}
