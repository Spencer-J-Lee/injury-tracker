import { Link, useParams } from 'react-router-dom'
import { useInjury } from '@/hooks/useInjury'
import { InjuryStatusBadge } from '@/components/injuries/InjuryStatusBadge'
import { Button } from '@/components/ui/Button'
import { useLogModal } from '@/context/LogModalContext'
import { RemedyList } from '@/components/remedies/RemedyList'
import { PainTrendChart } from '@/components/charts/PainTrendChart'
import { LogTimeline } from '@/components/logs/LogTimeline'

export function InjuryDetailPage() {
  const { id } = useParams()
  const injury = useInjury(id)
  const { openLogModal } = useLogModal()

  if (injury === undefined) {
    return <p className="text-ink-muted">Loading…</p>
  }

  if (injury === null || !id) {
    return <p className="text-ink-muted">Injury not found.</p>
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
          <p className="mt-2 max-w-[56ch] text-sm text-ink-secondary">{injury.description}</p>
        )}

        <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
          <Button onClick={() => openLogModal([injury.id])}>Log Entry</Button>
          <Link to={`/injuries/${injury.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5 min-w-0">
          <PainTrendChart injuryId={injury.id} />
          <LogTimeline injuryId={injury.id} />
        </div>
        <div className="lg:self-start min-w-0">
          <RemedyList injuryId={injury.id} />
        </div>
      </div>
    </div>
  )
}
