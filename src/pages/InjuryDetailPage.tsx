import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isToday } from "date-fns";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useInjury } from "@/hooks/useInjury";
import { useLastLogEntryForInjury } from "@/hooks/useLastLogEntryForInjury";
import { statusLabels } from "@/lib/injuryStatus";
import { InjuryPriorityBadge } from "@/components/injuries/InjuryPriorityBadge";
import { InjuryTitle } from "@/components/injuries/InjuryTitle";
import { Button } from "@/components/ui/Button";
import { PageTitle } from "@/components/ui/PageTitle";
import { IconButton } from "@/components/ui/IconButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Kbd } from "@/components/ui/Kbd";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useAnyModalOpen } from "@/lib/modalStore";
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
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const anyModalOpen = useAnyModalOpen();

  const todayEntry =
    lastEntry && isToday(new Date(lastEntry.timestamp)) ? lastEntry : undefined;

  useKeyboardShortcut(
    "l",
    () => openLogModal(injury?.id),
    !!injury && !todayEntry && !anyModalOpen,
  );

  useKeyboardShortcut(
    "u",
    () => setEditingToday(true),
    !!todayEntry && !anyModalOpen,
  );

  if (injury === undefined) {
    return <p className="text-ink-muted">Loading…</p>;
  }

  if (injury === null || !id) {
    return <p className="text-ink-muted">Injury not found.</p>;
  }

  const handleDelete = async () => {
    setConfirmingDelete(false);
    await deleteInjury(injury.id);
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div>
        <PageTitle
          actions={
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-ink-muted text-xs font-bold tracking-widest uppercase">
                {statusLabels[injury.status]}
              </span>
              <InjuryPriorityBadge priority={injury.priority} />
            </div>
          }
        >
          <InjuryTitle injury={injury} />
        </PageTitle>
        {injury.description && (
          <p className="text-ink-secondary mt-2.5 max-w-3/5 text-lg">
            {injury.description}
          </p>
        )}

        <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            {todayEntry ? (
              <Button onClick={() => setEditingToday(true)}>
                Update Today's Entry
                <Kbd>{updateEntryShortcutLabel}</Kbd>
              </Button>
            ) : (
              <Button onClick={() => openLogModal(injury.id)}>
                Log Entry
                <Kbd>{logEntryShortcutLabel}</Kbd>
              </Button>
            )}
            <Link to={`/injuries/${injury.id}/edit`}>
              <IconButton icon={faPen} size="md" label="Edit injury" />
            </Link>
          </div>
          <div className="flex gap-3">
            <IconButton
              icon={faTrash}
              size="md"
              tone="danger"
              label="Delete injury"
              onClick={() => setConfirmingDelete(true)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="min-w-0 space-y-6">
          <PainTrendChart injuryId={injury.id} />
          <LogTimeline injuryId={injury.id} />
        </div>
        <div className="min-w-0 space-y-6 lg:self-start">
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

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete injury?"
        message={`Delete "${formatInjuryName(injury)}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
