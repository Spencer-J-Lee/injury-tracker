import { useState } from "react";
import { faPen, faSun, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Injury, MorningCheckIn } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { IconButton } from "@/components/ui/IconButton";
import { ToneText } from "@/components/ui/ToneText";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RichTextContent } from "@/components/journal/RichTextEditor";
import { formatTimestamp } from "@/lib/dates";
import { painTone, painLabel } from "@/lib/pain";
import {
  STIFFNESS_DURATION_OPTIONS,
  NUMBNESS_DURATION_OPTIONS,
  NUMBNESS_SUSPECTED_CAUSE_OPTIONS,
  getMechanismVisibility,
} from "@/lib/morningCheckInOptions";
import { deleteMorningCheckIn } from "@/db/queries/morningCheckIns";
import { MorningCheckInModal } from "@/components/logs/MorningCheckInModal";

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
    showNociplastic,
  } = getMechanismVisibility(entry.painMechanisms);
  const showPain = isMechanical || showNociplastic;
  const hasStiffness =
    entry.stiffnessLevel !== undefined || entry.stiffnessDuration !== undefined;
  const hasBodyMetrics =
    isNeuropathic && entry.numbnessPresent !== undefined;

  return (
    <Card as="li" size="md" variant="subtle">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-ink-muted">
            {formatTimestamp(entry.timestamp)}
          </span>
          <FontAwesomeIcon icon={faSun} className="text-amber-500" />
        </div>
        <div className="flex items-center gap-3">
          {showPain && (
            <div className="flex items-center gap-1.5">
              <span className="text-ink-muted text-sm font-semibold">
                Resting Pain:
              </span>
              <ToneText tone={painTone(entry.painLevel)}>
                {entry.painLevel === undefined
                  ? "Not rated"
                  : `${painLabel(entry.painLevel)} ${entry.painLevel}/10`}
              </ToneText>
            </div>
          )}
          {showPain && isMechanical && hasStiffness && (
            <span className="text-ink-muted">•</span>
          )}
          {isMechanical && hasStiffness && (
            <div className="flex items-center gap-1.5">
              <span className="text-ink-muted text-sm font-semibold">
                Stiffness:
              </span>
              <ToneText tone={painTone(entry.stiffnessLevel)}>
                {entry.stiffnessLevel !== undefined
                  ? `${entry.stiffnessLevel}/10`
                  : "Not rated"}
                {entry.stiffnessDuration !== undefined &&
                  ` · ${stiffnessLabels.get(entry.stiffnessDuration)}`}
              </ToneText>
            </div>
          )}
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
      </div>

      {hasBodyMetrics && (
        <>
          <Divider className="mt-2.5" />
          <div className="mt-2.5 space-y-2">
            {isNeuropathic && entry.numbnessPresent !== undefined && (
              <div className="flex gap-2.5">
                <span className="text-ink-muted w-[92px] shrink-0 pt-1 text-sm font-semibold">
                  Numbness
                </span>
                <span className="text-ink-secondary pt-1 text-sm">
                  {entry.numbnessPresent ? "Present" : "Not present"}
                  {entry.numbnessDuration !== undefined &&
                    ` · ${numbnessDurationLabels.get(entry.numbnessDuration)}`}
                  {entry.numbnessSuspectedCause !== undefined &&
                    ` · ${numbnessCauseLabels.get(entry.numbnessSuspectedCause)}`}
                </span>
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
