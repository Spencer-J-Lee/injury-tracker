import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import type { Injury } from '@/types/models'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { InjuryStatusBadge } from '@/components/injuries/InjuryStatusBadge'
import { useLastLogEntryForInjury } from '@/hooks/useLastLogEntryForInjury'
import { useLogModal } from '@/context/LogModalContext'
import { formatRelative } from '@/lib/dates'

interface InjuryCardProps {
  injury: Injury
  selectable?: boolean
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

export function InjuryCard({ injury, selectable, selected, onToggleSelect }: InjuryCardProps) {
  const lastLog = useLastLogEntryForInjury(injury.id)
  const { openLogModal } = useLogModal()
  const navigate = useNavigate()

  const handleClick = () => {
    if (selectable) {
      onToggleSelect?.(injury.id)
    } else {
      navigate(`/injuries/${injury.id}`)
    }
  }

  return (
    <Card
      role={selectable ? 'checkbox' : 'link'}
      aria-checked={selectable ? Boolean(selected) : undefined}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      className={clsx(
        'relative flex cursor-pointer flex-col gap-[14px] transition-colors hover:border-accent',
        selectable && selected && 'border-accent! bg-accent-soft/20',
      )}
    >
      {selectable && selected && (
        <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-canvas bg-accent text-accent-on">
          <FontAwesomeIcon icon={faCheck} className='text-[0.625rem] text-ink' aria-hidden="true" />
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-ink">{injury.name}</h3>
        </div>
        <InjuryStatusBadge status={injury.status} />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-[13px] text-ink-muted">
          {lastLog ? (
            <span>
              Last pain <span className="font-semibold text-ink-emphasis">{lastLog.painLevel ?? '—'}/10</span>{' '}
              • {formatRelative(lastLog.timestamp)}
            </span>
          ) : (
            <span>No entries yet</span>
          )}
        </div>
        {!selectable && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              openLogModal([injury.id])
            }}
          >
            + Log Entry
          </Button>
        )}
      </div>
    </Card>
  )
}
