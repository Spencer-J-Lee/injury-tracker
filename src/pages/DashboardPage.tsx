import { Link } from 'react-router-dom'
import { useInjuries } from '@/hooks/useInjuries'
import { InjuryCard } from '@/components/injuries/InjuryCard'
import { Button } from '@/components/ui/Button'

export function DashboardPage() {
  const injuries = useInjuries()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">Your injuries</h1>
        <Link to="/injuries/new">
          <Button>Add Injury</Button>
        </Link>
      </div>

      {injuries === undefined ? (
        <p className="text-ink-muted">Loading…</p>
      ) : injuries.length === 0 ? (
        <p className="text-ink-muted">
          No injuries tracked yet. Add one to start logging.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {injuries.map((injury) => (
            <InjuryCard key={injury.id} injury={injury} />
          ))}
        </div>
      )}
    </div>
  )
}
