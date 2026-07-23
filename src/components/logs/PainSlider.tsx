import { RatingSlider } from "@/components/logs/RatingSlider";

interface PainSliderProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label?: string;
  tone?: "teal" | "violet";
}

export function PainSlider({
  value,
  onChange,
  label = "Pain intensity",
  tone = "teal",
}: PainSliderProps) {
  return (
    <RatingSlider
      label={label}
      value={value}
      onChange={onChange}
      max={10}
      step={0.5}
      color={
        tone === "violet"
          ? "var(--color-pain-violet)"
          : "var(--color-pain-teal)"
      }
      formatValue={(v) => `${v}/10`}
      className={tone === "violet" ? "range-violet" : "range-teal"}
      ticks={[0, 2, 4, 6, 8, 10]}
    />
  );
}
