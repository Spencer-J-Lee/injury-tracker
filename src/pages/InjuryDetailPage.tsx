import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isToday } from "date-fns";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useInjury } from "@/hooks/useInjury";
import { useLastLogEntryForInjury } from "@/hooks/useLastLogEntryForInjury";
import { InjuryStatusBadge } from "@/components/injuries/InjuryStatusBadge";
import { InjuryTitle } from "@/components/injuries/InjuryTitle";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import {
  logEntryShortcutLabel,
  updateEntryShortcutLabel,
} from "@/lib/shortcuts";
import { useLogModal } from "@/context/useLogModal";
import { RemedyList } from "@/components/remedies/RemedyList";
import { TriggerList } from "@/components/triggers/TriggerList";
import { PainTrendChart } from "@/components/charts/PainTrendChart";
import { LogTimeline } from "@/components/logs/LogTimeline";
import { LogEntryEditModal } from "@/components/logs/LogEntryEditModal";
import { deleteInjury } from "@/db/queries/injuries";
import { formatInjuryName } from "@/lib/injuries";

export function InjuryDetailPage() {
  const { id } = useParams();
  const injury = useInjury(id);
  const { openLogModal } = useLogModal();
  const navigate = useNavigate();
  const lastEntry = useLastLogEntryForInjury(id ?? "");
  const [editingToday, setEditingToday] = useState(false);

  const todayEntry =
    lastEntry && isToday(new Date(lastEntry.timestamp)) ? lastEntry : undefined;

  useKeyboardShortcut(
    "l",
    () => openLogModal(injury ? [injury.id] : []),
    !!injury,
  );

  useKeyboardShortcut("u", () => setEditingToday(true), !!todayEntry);

  if (injury === undefined) {
    return <p className="text-ink-muted">Loading…</p>;
  }

  if (injury === null || !id) {
    return <p className="text-ink-muted">Injury not found.</p>;
  }

  const handleDelete = async () => {
    if (
      !confirm(`Delete "${formatInjuryName(injury)}"? This cannot be undone.`)
    )
      return;
    await deleteInjury(injury.id);
    navigate("/");
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-ink text-2xl font-semibold">
            <InjuryTitle injury={injury} />
          </h1>
          <div className="mt-1 shrink-0">
            <InjuryStatusBadge status={injury.status} />
          </div>
        </div>
        {injury.description && (
          <p className="text-ink-secondary mt-2 max-w-3/5 text-sm text-pretty">
            {injury.description}
          </p>
        )}

        <div className="mt-3.5 flex w-full flex-wrap items-center justify-between gap-2.5">
          <div className="flex gap-2.5">
            <Button onClick={() => openLogModal([injury.id])}>
              Log Entry
              <Kbd>{logEntryShortcutLabel}</Kbd>
            </Button>
            {todayEntry && (
              <Button onClick={() => setEditingToday(true)}>
                Update Today's Entry
                <Kbd>{updateEntryShortcutLabel}</Kbd>
              </Button>
            )}
            <Link to={`/injuries/${injury.id}/edit`}>
              <IconButton icon={faPen} size="md" label="Edit injury" />
            </Link>
          </div>
          <div className="flex gap-2.5">
            <IconButton
              icon={faTrash}
              size="md"
              tone="danger"
              label="Delete injury"
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-5">
          <PainTrendChart injuryId={injury.id} />
          <LogTimeline injuryId={injury.id} />
        </div>
        <div className="min-w-0 space-y-5 lg:self-start">
          <RemedyList injuryId={injury.id} />
          <TriggerList injuryId={injury.id} />
        </div>
      </div>

      {todayEntry && (
        <LogEntryEditModal
          entry={todayEntry}
          open={editingToday}
          onClose={() => setEditingToday(false)}
        />
      )}
    </div>
  );
}
