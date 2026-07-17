import { RatingSlider } from "@/components/logs/RatingSlider";

interface PainFrequencySliderProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function PainFrequencySlider({
  value,
  onChange,
}: PainFrequencySliderProps) {
  return (
    <RatingSlider
      label="Frequency (when using)"
      value={value}
      onChange={onChange}
      max={100}
      step={5}
      color="var(--color-pain-violet)"
      formatValue={(v) => `${v}%`}
      className="range-violet"
      ticks={[0, 25, 50, 75, 100]}
    />
  );
}
