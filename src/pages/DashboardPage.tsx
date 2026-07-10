import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useInjuries } from '@/hooks/useInjuries'
import { InjuryCard } from '@/components/injuries/InjuryCard'
import { Button } from '@/components/ui/Button'
import { TogglePill } from '@/components/ui/TogglePill'
import { Kbd } from '@/components/ui/Kbd'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { addInjuryShortcutLabel, cancelShortcutLabel } from '@/lib/shortcuts'
import { deleteInjuries } from '@/db/queries/injuries'
import type { InjuryStatus } from '@/types/models'

const STATUS_ORDER: InjuryStatus[] = ['active', 'monitoring', 'resolved']
const STATUS_LABELS: Record<InjuryStatus, string> = {
  active: 'Active',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
}

export function DashboardPage() {
  const injuries = useInjuries()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<InjuryStatus[]>(STATUS_ORDER)
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useKeyboardShortcut('n', () => navigate('/injuries/new'), !selectMode)
  useKeyboardShortcut('Escape', () => exitSelectMode(), selectMode)

  const toggleStatus = (status: InjuryStatus) => {
    setStatusFilter((current) =>
      current.includes(status) ? current.filter((s) => s !== status) : [...current, status],
    )
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const exitSelectMode = () => {
    setSelectMode(false)
    setSelectedIds(new Set())
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    const count = selectedIds.size
    if (!confirm(`Delete ${count} injur${count === 1 ? 'y' : 'ies'}? This cannot be undone.`)) return
    await deleteInjuries([...selectedIds])
    exitSelectMode()
  }

  const visibleInjuries = (injuries ?? [])
    .filter((injury) => statusFilter.includes(injury.status))
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))

  return (
    <div className="space-y-5">
      <div className="flex justify-between gap-3 mb-4">
        <h1 className="font-heading text-2xl font-semibold text-ink">Your injuries</h1>
        <div className="flex items-center gap-2">
          {selectMode ? (
            <Button variant="ghost" onClick={exitSelectMode}>
              Cancel
              <Kbd>{cancelShortcutLabel}</Kbd>
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setSelectMode(true)}>
                Select
              </Button>
              <Link to="/injuries/new">
                <Button>
                  Add Injury
                  <Kbd>{addInjuryShortcutLabel}</Kbd>
                </Button>
              </Link>
            </>
          )}
        </div>
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

      {selectMode && (
        <div className="flex items-center justify-between gap-3 rounded-[12px] border border-subtle bg-surface-raised px-[14px] py-2.5">
          <span className="text-[13px] text-ink-secondary">
            {selectedIds.size} selected
          </span>
          <Button
            variant="danger"
            size="sm"
            disabled={selectedIds.size === 0}
            onClick={handleDeleteSelected}
          >
            Delete selected
          </Button>
        </div>
      )}

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
            <InjuryCard
              key={injury.id}
              injury={injury}
              selectable={selectMode}
              selected={selectedIds.has(injury.id)}
              onToggleSelect={toggleSelected}
            />
          ))}
        </div>
      )}
    </div>
  )
}
