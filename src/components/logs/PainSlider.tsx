import { RatingSlider } from "@/components/logs/RatingSlider";

interface PainSliderProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function PainSlider({ value, onChange }: PainSliderProps) {
  return (
    <RatingSlider
      label="Pain intensity"
      value={value}
      onChange={onChange}
      max={10}
      step={1}
      color="var(--color-pain-teal)"
      formatValue={(v) => `${v}/10`}
      className="range-teal"
      ticks={[0, 2, 4, 6, 8, 10]}
    />
  );
}
