import { useMemo } from 'react'

const THUMB_RADIUS_PX = 8

interface RatingSliderProps {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  max: number
  step: number
  color: string
  formatValue: (value: number) => string
  className?: string
  ticks: number[]
}

export function RatingSlider({
  label,
  value,
  onChange,
  max,
  step,
  color,
  formatValue,
  className,
  ticks,
}: RatingSliderProps) {
  const pct = ((value ?? 0) / max) * 100
  const listId = useMemo(() => `${label.replace(/\s+/g, '-').toLowerCase()}-ticks`, [label])

  const tickPositions = useMemo(
    () =>
      ticks.map((tick) => ({
        tick,
        left: `calc(${THUMB_RADIUS_PX}px + ${tick / max} * (100% - ${2 * THUMB_RADIUS_PX}px))`,
      })),
    [ticks, max]
  )

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[13px] text-ink-muted">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink-emphasis">
            {value === undefined ? 'Not rated' : formatValue(value)}
          </span>
          {value !== undefined && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="font-semibold text-accent-soft-text hover:underline"
            >
              clear
            </button>
          )}
        </div>
      </div>
      
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className={className}
        list={listId}
        style={{ background: `linear-gradient(to right, ${color} ${pct}%, var(--color-subtle) ${pct}%)` }}
      />
      <datalist id={listId}>
        {ticks.map((tick) => (
          <option key={tick} value={tick} />
        ))}
      </datalist>
      <div className="relative h-1">
        {tickPositions.map(({ tick, left }) => (
          <span
            key={tick}
            className="absolute top-0 h-1.5 w-px -translate-x-1/2 bg-ink-muted/40"
            style={{ left }}
          />
        ))}
      </div>
      <div className="relative mt-0.5 h-4 text-[11px] text-ink-muted">
        {tickPositions.map(({ tick, left }) => (
          <span key={tick} className="absolute -translate-x-1/2" style={{ left }}>
            {tick}
          </span>
        ))}
      </div>
    </div>
  )
}
