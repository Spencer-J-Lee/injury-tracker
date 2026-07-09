import { useMemo, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import clsx from 'clsx'
import { Card } from '@/components/ui/Card'
import { useLogEntriesForInjury } from '@/hooks/useLogEntriesForInjury'
import { isWithinRange, type TrendRange } from '@/lib/dates'
import { format } from 'date-fns'

const RANGES: { value: TrendRange; label: string }[] = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'all', label: 'All' },
]

const colors = {
  line: 'oklch(0.58 0.1 250)',
  frequencyLine: 'oklch(0.76 0.13 85)',
  surface: 'oklch(0.2 0.011 60)',
  grid: 'oklch(0.25 0.01 60)',
  muted: 'oklch(0.6 0.012 60)',
  primary: 'oklch(0.96 0.004 60)',
  secondary: 'oklch(0.76 0.012 60)',
}

interface ChartPoint {
  timestamp: string
  painLevel?: number
  painFrequency?: number
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ChartPoint }>
  colors: typeof colors
}

function ChartTooltip({ active, payload, colors }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div
      className="rounded-lg border px-3 py-2 text-sm shadow-md"
      style={{ background: colors.surface, borderColor: colors.grid, color: colors.secondary }}
    >
      <p style={{ color: colors.muted }} className="text-xs">
        {format(new Date(point.timestamp), 'MMM d, yyyy · h:mm a')}
      </p>
      {point.painLevel !== undefined && (
        <p className="font-semibold" style={{ color: colors.primary }}>
          {point.painLevel}/10 intensity
        </p>
      )}
      {point.painFrequency !== undefined && (
        <p className="font-semibold" style={{ color: colors.frequencyLine }}>
          {point.painFrequency}% frequency
        </p>
      )}
    </div>
  )
}

export function PainTrendChart({ injuryId }: { injuryId: string }) {
  const [range, setRange] = useState<TrendRange>('30d')
  const entries = useLogEntriesForInjury(injuryId)

  const data = useMemo<ChartPoint[]>(() => {
    return (entries ?? [])
      .filter((e) => (e.painLevel !== undefined || e.painFrequency !== undefined) && isWithinRange(e.timestamp, range))
      .map((e) => ({ timestamp: e.timestamp, painLevel: e.painLevel, painFrequency: e.painFrequency }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  }, [entries, range])

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-ink-emphasis">Pain over time</h3>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={clsx(
                'rounded-full px-[10px] py-[5px] text-xs font-semibold transition-colors',
                range === r.value
                  ? 'bg-accent-soft text-accent-soft-text'
                  : 'text-ink-muted hover:text-ink-secondary',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-ink-muted">No rated entries in this range yet.</p>
      ) : (
        <>
          <div className="mb-2.5 flex items-center gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: colors.line }} />
              Pain intensity
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: colors.frequencyLine }} />
              Frequency
            </span>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={colors.grid} strokeWidth={1} />
                <XAxis dataKey="timestamp" hide />
                <YAxis yAxisId="left" domain={[0, 10]} hide />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} hide />
                <Tooltip content={<ChartTooltip colors={colors} />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="painLevel"
                  stroke={colors.line}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{ r: 5, fill: colors.line, stroke: colors.surface, strokeWidth: 2 }}
                  isAnimationActive={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="painFrequency"
                  stroke={colors.frequencyLine}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{ r: 5, fill: colors.frequencyLine, stroke: colors.surface, strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  )
}
