import { useState } from 'react';
import { faPen, faSun, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Injury, MorningCheckIn } from '@/types/models';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { IconButton } from '@/components/ui/IconButton';
import { ToneText } from '@/components/ui/ToneText';
import { MeterRow } from '@/components/ui/MeterRow';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RichTextContent } from '@/components/journal/RichTextEditor';
import { formatTimestamp } from '@/lib/dates';
import { painTone } from '@/lib/pain';
import {
  STIFFNESS_DURATION_OPTIONS,
  NUMBNESS_DURATION_OPTIONS,
  NUMBNESS_SUSPECTED_CAUSE_OPTIONS,
  getMechanismVisibility,
  stiffnessDurationTone,
  numbnessPresenceTone,
  numbnessDurationTone,
} from '@/lib/morningCheckInOptions';
import { deleteMorningCheckIn } from '@/db/queries/morningCheckIns';
import { MorningCheckInModal } from '@/components/logs/MorningCheckInModal';

const stiffnessLabels = new Map(
  STIFFNESS_DURATION_OPTIONS.map((opt) => [opt.value, opt.label]),
);
const numbnessDurationLabels = new Map(
  NUMBNESS_DURATION_OPTIONS.map((opt) => [opt.value, opt.label]),
);
const numbnessCauseLabels = new Map(
  NUMBNESS_SUSPECTED_CAUSE_OPTIONS.map((opt) => [opt.value, opt.label]),
);

export function MorningCheckInTimelineItem({
  entry,
  injury,
}: {
  entry: MorningCheckIn;
  injury?: Injury;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const {
    showNociceptive: isMechanical,
    showNeuropathic: isNeuropathic,
    showNociplastic: isNociplastic,
  } = getMechanismVisibility(entry.painMechanisms);
  const showPain = isMechanical || isNociplastic;
  const showStiffness = isMechanical && entry.stiffnessLevel !== undefined;
  const showNumbess = isNeuropathic && entry.numbnessPresent !== undefined;
  const showDetails = showPain || showStiffness || showNumbess;

  return (
    <Card as="li" size="md" variant="muted">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-ink-muted">
            {formatTimestamp(entry.timestamp)}
          </span>
          <FontAwesomeIcon icon={faSun} className="text-amber-500" />
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            icon={faPen}
            label="Edit entry"
            onClick={() => setEditing(true)}
          />
          <IconButton
            icon={faTrash}
            tone="danger"
            label="Delete entry"
            onClick={() => setConfirmingDelete(true)}
          />
        </div>
      </div>

      {showDetails && (
        <>
          <Divider className="mt-2.5" />
          <div className="mt-2.5 space-y-2.5">
            {showPain &&
              (entry.painLevel !== undefined ? (
                <MeterRow
                  label="Resting Pain"
                  labelClassName="w-23"
                  value={(entry.painLevel / 10) * 100}
                  displayValue={`${entry.painLevel}/10`}
                  tone={painTone(entry.painLevel)}
                />
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-ink-muted w-23 shrink-0 text-sm font-semibold">
                    Resting Pain
                  </span>
                  <ToneText className="text-sm">Not rated</ToneText>
                </div>
              ))}
            {showPain && showStiffness && <Divider />}
            {showStiffness && (
              <div className="space-y-1">
                <MeterRow
                  label="Stiffness"
                  labelClassName="w-23"
                  value={((entry.stiffnessLevel ?? 0) / 10) * 100}
                  displayValue={
                    entry.stiffnessLevel !== undefined
                      ? `${entry.stiffnessLevel}/10`
                      : 'Not rated'
                  }
                  tone={painTone(entry.stiffnessLevel)}
                />
                {entry.stiffnessDuration !== undefined && (
                  <div className="w-full pl-27 text-sm">
                    <span className="text-ink-muted">Loosens in: </span>
                    <ToneText
                      tone={stiffnessDurationTone(entry.stiffnessDuration)}
                    >
                      {stiffnessLabels.get(entry.stiffnessDuration)}
                    </ToneText>
                  </div>
                )}
              </div>
            )}
            {(showPain || showStiffness) && showNumbess && <Divider />}
            {showNumbess && (
              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <span className="text-ink-muted w-23 shrink-0 text-sm font-semibold">
                    Numbness
                  </span>
                  {entry.numbnessPresent ? (
                    <div className="text-sm">
                      <span className="text-ink-muted">Duration: </span>
                      <ToneText
                        tone={numbnessDurationTone(entry.numbnessDuration)}
                      >
                        {entry.numbnessDuration !== undefined
                          ? numbnessDurationLabels.get(entry.numbnessDuration)
                          : 'Not rated'}
                      </ToneText>
                    </div>
                  ) : (
                    <ToneText
                      tone={numbnessPresenceTone(entry.numbnessPresent)}
                      className="text-sm"
                    >
                      Not present
                    </ToneText>
                  )}
                </div>
                {entry.numbnessPresent &&
                  entry.numbnessSuspectedCause !== undefined && (
                    <div className="pl-27 text-sm">
                      <span className="text-ink-muted">Likely cause: </span>
                      <span className="text-ink-secondary">
                        {numbnessCauseLabels.get(entry.numbnessSuspectedCause)}
                      </span>
                    </div>
                  )}
              </div>
            )}
          </div>
        </>
      )}

      {entry.notes && (
        <>
          <Divider className="mt-2.5" />
          <div className="mt-2.5">
            <RichTextContent
              html={entry.notes}
              className="text-ink-secondary"
            />
          </div>
        </>
      )}

      <MorningCheckInModal
        injuryId={entry.injuryId}
        injury={injury ?? undefined}
        painMechanisms={injury?.painMechanisms ?? []}
        entry={entry}
        open={editing}
        onClose={() => setEditing(false)}
      />

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete morning check-in?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          setConfirmingDelete(false);
          deleteMorningCheckIn(entry.id);
        }}
        onCancel={() => setConfirmingDelete(false)}
      />
    </Card>
  );
}
