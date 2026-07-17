import { useState } from "react";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { LogEntry, Remedy, Trigger } from "@/types/models";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { IconButton } from "@/components/ui/IconButton";
import { ToneText } from "@/components/ui/ToneText";
import { RichTextContent } from "@/components/journal/RichTextEditor";
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
  const hasRemediesOrTriggers =
    entry.remedyIds.length > 0 || entry.triggerIds.length > 0;

  return (
    <li className="border-subtle rounded-[12px] border px-[14px] py-3">
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
            onClick={() => {
              if (!confirm("Delete this log entry? This cannot be undone."))
                return;
              deleteLogEntry(entry.id);
            }}
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
                  {entry.remedyIds.map((remedyId) => (
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
                  {entry.triggerIds.map((triggerId) => (
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
    </li>
  );
}
