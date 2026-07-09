import { useNavigate } from 'react-router-dom'
import type { Injury } from '@/types/models'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { InjuryStatusBadge } from '@/components/injuries/InjuryStatusBadge'
import { useLastLogEntryForInjury } from '@/hooks/useLastLogEntryForInjury'
import { useLogModal } from '@/context/LogModalContext'
import { formatRelative } from '@/lib/dates'

export function InjuryCard({ injury }: { injury: Injury }) {
  const lastLog = useLastLogEntryForInjury(injury.id)
  const { openLogModal } = useLogModal()
  const navigate = useNavigate()

  const goToDetail = () => navigate(`/injuries/${injury.id}`)

  return (
    <Card
      role="link"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          goToDetail()
        }
      }}
      className="flex cursor-pointer flex-col gap-[14px] transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-ink">{injury.name}</h3>
        <InjuryStatusBadge status={injury.status} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-[13px] text-ink-muted">
          {lastLog ? (
            <span>
              Last pain <span className="font-semibold text-ink-emphasis">{lastLog.painLevel ?? '—'}/10</span>{' '}
              · {formatRelative(lastLog.timestamp)}
            </span>
          ) : (
            <span>No entries yet</span>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            openLogModal([injury.id])
          }}
        >
          + Log
        </Button>
      </div>
    </Card>
  )
}
