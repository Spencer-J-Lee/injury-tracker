import { Link, useNavigate, useParams } from 'react-router-dom'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useInjury } from '@/hooks/useInjury'
import { InjuryStatusBadge } from '@/components/injuries/InjuryStatusBadge'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Kbd } from '@/components/ui/Kbd'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { logEntryShortcutLabel } from '@/lib/shortcuts'
import { useLogModal } from '@/context/useLogModal'
import { RemedyList } from '@/components/remedies/RemedyList'
import { TriggerList } from '@/components/triggers/TriggerList'
import { PainTrendChart } from '@/components/charts/PainTrendChart'
import { LogTimeline } from '@/components/logs/LogTimeline'
import { deleteInjury } from '@/db/queries/injuries'

export function InjuryDetailPage() {
  const { id } = useParams()
  const injury = useInjury(id)
  const { openLogModal } = useLogModal()
  const navigate = useNavigate()

  useKeyboardShortcut('l', () => openLogModal(injury ? [injury.id] : []), !!injury)

  if (injury === undefined) {
    return <p className="text-ink-muted">Loading…</p>
  }

  if (injury === null || !id) {
    return <p className="text-ink-muted">Injury not found.</p>
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${injury.name}"? This cannot be undone.`)) return
    await deleteInjury(injury.id)
    navigate('/')
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold text-ink">{injury.name}</h1>
          <div className="mt-1 shrink-0">
            <InjuryStatusBadge status={injury.status} />
          </div>
        </div>
        {injury.description && (
          <p className="mt-2 max-w-3/5 text-sm text-pretty text-ink-secondary">{injury.description}</p>
        )}

        <div className="mt-3.5 flex flex-wrap items-center gap-2.5 w-full justify-between">
          <div className="flex gap-2.5">
            <Button onClick={() => openLogModal([injury.id])}>
              Log Entry
              <Kbd>{logEntryShortcutLabel}</Kbd>
            </Button>
            <Link to={`/injuries/${injury.id}/edit`}>
              <IconButton icon={faPen} size="md" label="Edit injury" />
            </Link>
          </div>
          <div className="flex gap-2.5">
            <IconButton icon={faTrash} size="md" tone="danger" label="Delete injury" onClick={handleDelete} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5 min-w-0">
          <PainTrendChart injuryId={injury.id} />
          <LogTimeline injuryId={injury.id} />
        </div>
        <div className="space-y-5 lg:self-start min-w-0">
          <RemedyList injuryId={injury.id} />
          <TriggerList injuryId={injury.id} />
        </div>
      </div>
    </div>
  )
}
