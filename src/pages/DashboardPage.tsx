import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInjuries } from '@/hooks/useInjuries'
import { InjuryCard } from '@/components/injuries/InjuryCard'
import { Button } from '@/components/ui/Button'
import { TogglePill } from '@/components/ui/TogglePill'
import type { InjuryStatus } from '@/types/models'

const STATUS_ORDER: InjuryStatus[] = ['active', 'monitoring', 'resolved']
const STATUS_LABELS: Record<InjuryStatus, string> = {
  active: 'Active',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
}

export function DashboardPage() {
  const injuries = useInjuries()
  const [statusFilter, setStatusFilter] = useState<InjuryStatus[]>(STATUS_ORDER)

  const toggleStatus = (status: InjuryStatus) => {
    setStatusFilter((current) =>
      current.includes(status) ? current.filter((s) => s !== status) : [...current, status],
    )
  }

  const visibleInjuries = (injuries ?? [])
    .filter((injury) => statusFilter.includes(injury.status))
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">Your injuries</h1>
        <Link to="/injuries/new">
          <Button>Add Injury</Button>
        </Link>
      </div>

      <div className='flex items-center gap-x-2'>
        <div className="text-xs font-semibold text-ink-muted">Filter by:</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_ORDER.map((status) => (
            <TogglePill
              key={status}
              selected={statusFilter.includes(status)}
              onClick={() => toggleStatus(status)}
            >
              {STATUS_LABELS[status]}
            </TogglePill>
          ))}
        </div>
      </div>

      {injuries === undefined ? (
        <p className="text-ink-muted">Loading…</p>
      ) : injuries.length === 0 ? (
        <p className="text-ink-muted">
          No injuries tracked yet. Add one to start logging.
        </p>
      ) : visibleInjuries.length === 0 ? (
        <p className="text-ink-muted">No injuries match the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleInjuries.map((injury) => (
            <InjuryCard key={injury.id} injury={injury} />
          ))}
        </div>
      )}
    </div>
  )
}
