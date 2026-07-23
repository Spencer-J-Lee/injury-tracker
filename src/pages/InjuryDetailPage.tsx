import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useInjury } from "@/hooks/useInjury";
import { useLastLogEntryForInjury } from "@/hooks/useLastLogEntryForInjury";
import { useMorningCheckInsForInjury } from "@/hooks/useMorningCheckInsForInjury";
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
  morningCheckInShortcutLabel,
} from "@/lib/shortcuts";
import { useLogModal } from "@/context/useLogModal";
import { todayEntryOnly } from "@/lib/dates";
import { RemedyList } from "@/components/remedies/RemedyList";
import { TriggerList } from "@/components/triggers/TriggerList";
import { PainTrendChart } from "@/components/charts/PainTrendChart";
import { MorningTrendChart } from "@/components/charts/MorningTrendChart";
import { LogTimeline } from "@/components/logs/LogTimeline";
import { MorningCheckInTimeline } from "@/components/logs/MorningCheckInTimeline";
import { LogEntryEditModal } from "@/components/logs/LogEntryEditModal";
import { MorningCheckInModal } from "@/components/logs/MorningCheckInModal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { deleteInjury } from "@/db/queries/injuries";
import { formatInjuryName } from "@/lib/injuries";

export function InjuryDetailPage() {
  const { id } = useParams();
  const injury = useInjury(id);
  const { openLogModal } = useLogModal();
  const navigate = useNavigate();
  const lastEntry = useLastLogEntryForInjury(id ?? "");
  const recentMorningCheckIns = useMorningCheckInsForInjury(id, 1);
  const [editingToday, setEditingToday] = useState(false);
  const [editingMorning, setEditingMorning] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [view, setView] = useState<"main" | "morning">("main");
  const viewOptions = [
    { value: "main", label: "Main History" },
    { value: "morning", label: "Morning" },
  ] as const;
  const anyModalOpen = useAnyModalOpen();

  const todayEntry = todayEntryOnly(lastEntry);
  const todayMorningEntry = todayEntryOnly(recentMorningCheckIns?.[0]);

  useKeyboardShortcut(
    "t",
    () => (todayEntry ? setEditingToday(true) : openLogModal(injury?.id)),
    !!injury && !!todayMorningEntry && !anyModalOpen,
  );

  useKeyboardShortcut(
    "m",
    () => setEditingMorning(true),
    !!injury && !anyModalOpen,
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
            {!todayMorningEntry ? (
              <Button onClick={() => setEditingMorning(true)}>
                Morning Check-In
                <Kbd>{morningCheckInShortcutLabel}</Kbd>
              </Button>
            ) : todayEntry ? (
              <Button variant="secondary" onClick={() => setEditingToday(true)}>
                Update Today's Entry
                <Kbd>{updateEntryShortcutLabel}</Kbd>
              </Button>
            ) : (
              <Button onClick={() => openLogModal(injury.id)}>
                Log Entry
                <Kbd>{logEntryShortcutLabel}</Kbd>
              </Button>
            )}
            {todayMorningEntry && (
              <Button
                variant="secondary"
                onClick={() => setEditingMorning(true)}
              >
                Update Morning Check-In
                <Kbd>{morningCheckInShortcutLabel}</Kbd>
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
          <SegmentedControl
            options={viewOptions}
            value={view}
            onChange={setView}
            size="lg"
            className="w-full"
          />

          {view === "main" ? (
            <>
              <PainTrendChart injuryId={injury.id} />
              <LogTimeline injuryId={injury.id} />
            </>
          ) : (
            <>
              <MorningTrendChart injuryId={injury.id} />
              <MorningCheckInTimeline injuryId={injury.id} />
            </>
          )}
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

      <MorningCheckInModal
        injuryId={injury.id}
        injury={injury}
        painMechanisms={injury.painMechanisms}
        entry={todayMorningEntry}
        open={editingMorning}
        onClose={() => setEditingMorning(false)}
      />

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
