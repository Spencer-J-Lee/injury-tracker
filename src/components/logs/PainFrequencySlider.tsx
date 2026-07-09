interface PainFrequencySliderProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
}

export function PainFrequencySlider({ value, onChange }: PainFrequencySliderProps) {
  const pct = value ?? 0

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[13px] text-ink-muted">
        <span>Frequency</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink-emphasis">
            {value === undefined ? 'Not rated' : `${value}%`}
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
        max={100}
        step={5}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-amber"
        style={{ background: `linear-gradient(to right, var(--color-pain-amber) ${pct}%, var(--color-subtle) ${pct}%)` }}
      />
    </div>
  )
}
