interface PainSliderProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
}

export function PainSlider({ value, onChange }: PainSliderProps) {
  const pct = ((value ?? 0) / 10) * 100

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[13px] text-ink-muted">
        <span>Pain intensity</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink-emphasis">
            {value === undefined ? 'Not rated' : `${value}/10`}
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
        max={10}
        step={1}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-subtle) ${pct}%)` }}
      />
    </div>
  )
}
