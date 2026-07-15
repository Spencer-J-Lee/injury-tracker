import { useState } from "react";
import clsx from "clsx";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { LogEntry, Remedy, Trigger } from "@/types/models";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { ToneText } from "@/components/ui/ToneText";
import { formatTimestamp } from "@/lib/dates";
import { painTone, painLabel, freqTone } from "@/lib/pain";
import { deleteLogEntry } from "@/db/queries/logEntries";
import { LogEntryEditModal } from "@/components/logs/LogEntryEditModal";

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
  const hasDetails =
    entry.remedyIds.length > 0 ||
    entry.triggerIds.length > 0 ||
    Boolean(entry.notes);

  return (
    <li className="border-subtle rounded-[12px] border px-[14px] py-3">
      <div
        className={clsx(
          "flex items-center justify-between gap-2",
          hasDetails && "mb-2",
        )}
      >
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
            onClick={() => {
              if (!confirm("Delete this log entry? This cannot be undone."))
                return;
              deleteLogEntry(entry.id);
            }}
          />
        </div>
      </div>

      {entry.remedyIds.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {entry.remedyIds.map((remedyId) => {
            const remedy = remedyMap.get(remedyId);
            return (
              <Badge key={remedyId} tone="indigo">
                {remedy?.name ?? "Unknown remedy"}
              </Badge>
            );
          })}
        </div>
      )}

      {entry.triggerIds.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {entry.triggerIds.map((triggerId) => {
            const trigger = triggerMap.get(triggerId);
            return (
              <Badge key={triggerId} tone="red">
                {trigger?.name ?? "Unknown trigger"}
              </Badge>
            );
          })}
        </div>
      )}

      {entry.notes && (
        <p className="text-ink-secondary text-[13px] whitespace-pre-line">
          {entry.notes}
        </p>
      )}

      <LogEntryEditModal
        entry={entry}
        open={editing}
        onClose={() => setEditing(false)}
      />
    </li>
  );
}
