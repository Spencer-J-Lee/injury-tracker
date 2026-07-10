import { RatingSlider } from '@/components/logs/RatingSlider'

interface PainSliderProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
}

export function PainSlider({ value, onChange }: PainSliderProps) {
  return (
    <RatingSlider
      label="Pain intensity"
      value={value}
      onChange={onChange}
      max={10}
      step={1}
      color="var(--color-accent)"
      formatValue={(v) => `${v}/10`}
      ticks={[0, 2, 4, 6, 8, 10]}
    />
  )
}
