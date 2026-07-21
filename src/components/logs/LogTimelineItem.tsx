import { useState } from "react";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { LogEntry, Remedy, Trigger } from "@/types/models";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { IconButton } from "@/components/ui/IconButton";
import { ToneText } from "@/components/ui/ToneText";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { RichTextContent } from "@/components/journal/RichTextEditor";
import { formatTimestamp } from "@/lib/dates";
import { painTone, painLabel, freqTone } from "@/lib/pain";
import {
  REMEDY_CATEGORIES,
  sortByCategoryThenName,
  TRIGGER_CATEGORIES,
} from "@/lib/categories";
import { deleteLogEntry } from "@/db/queries/logEntries";
import { LogEntryEditModal } from "@/components/logs/LogEntryEditModal";

function sortIdsByCategory<T extends { name: string; category?: string }>(
  ids: string[],
  map: Map<string, T>,
  categoryOrder: string[],
  fallbackName: string,
): string[] {
  const items = ids.map((id) => {
    const item = map.get(id);
    return { id, category: item?.category, name: item?.name ?? fallbackName };
  });
  return sortByCategoryThenName(items, categoryOrder).map((item) => item.id);
}

export function LogTimelineItem({
  entry,
  remedyMap,
  triggerMap,
}: {
  entry: LogEntry;
  remedyMap: Map<string, Remedy>;
  triggerMap: Map<string, Trigger>;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const hasRemediesOrTriggers =
    entry.remedyIds.length > 0 || entry.triggerIds.length > 0;
  const sortedRemedyIds = sortIdsByCategory(
    entry.remedyIds,
    remedyMap,
    REMEDY_CATEGORIES,
    "Unknown remedy",
  );
  const sortedTriggerIds = sortIdsByCategory(
    entry.triggerIds,
    triggerMap,
    TRIGGER_CATEGORIES,
    "Unknown trigger",
  );

  return (
    <Card as="li" size="md" variant="subtle">
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink-muted text-[13px]">
          {formatTimestamp(entry.timestamp)}
        </span>
        <div className="flex items-center gap-1.5 text-[13px]">
          <ToneText tone={painTone(entry.painLevel)}>
            {entry.painLevel === undefined
              ? "Not rated"
              : `${painLabel(entry.painLevel)} ${entry.painLevel}/10`}
          </ToneText>
          {entry.painFrequency !== undefined && (
            <>
              <span className="text-ink-muted">•</span>
              <ToneText tone={freqTone(entry.painFrequency)}>
                {entry.painFrequency}% freq
              </ToneText>
            </>
          )}
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

      {hasRemediesOrTriggers && (
        <>
          <Divider />
          <div className="mt-2 space-y-1.5">
            {entry.remedyIds.length > 0 && (
              <div className="flex gap-2">
                <span className="text-ink-muted w-14 shrink-0 pt-[3px] text-[11px] font-semibold">
                  Remedies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sortedRemedyIds.map((remedyId) => (
                    <Badge key={remedyId} tone="green">
                      {remedyMap.get(remedyId)?.name ?? "Unknown remedy"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {entry.triggerIds.length > 0 && (
              <div className="flex gap-2">
                <span className="text-ink-muted w-14 shrink-0 pt-[3px] text-[11px] font-semibold">
                  Triggers
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sortedTriggerIds.map((triggerId) => (
                    <Badge key={triggerId} tone="red">
                      {triggerMap.get(triggerId)?.name ?? "Unknown trigger"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {entry.notes && (
        <>
          <Divider />
          <div className="mt-2">
            <RichTextContent
              html={entry.notes}
              className="text-ink-secondary text-[13px]"
            />
          </div>
        </>
      )}

      <LogEntryEditModal
        entry={entry}
        open={editing}
        onClose={() => setEditing(false)}
      />

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete log entry?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          setConfirmingDelete(false);
          deleteLogEntry(entry.id);
        }}
        onCancel={() => setConfirmingDelete(false)}
      />
    </Card>
  );
}
