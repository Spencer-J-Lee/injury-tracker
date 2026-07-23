import { useMemo } from "react";
import { LinkButton } from "@/components/ui/LinkButton";
import { Label } from "../ui/Label";

const THUMB_RADIUS_PX = 8;

interface RatingSliderProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  max: number;
  step: number;
  color: string;
  formatValue: (value: number) => string;
  className?: string;
  ticks: number[];
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
  const pct = ((value ?? 0) / max) * 100;
  const listId = useMemo(
    () => `${label.replace(/\s+/g, "-").toLowerCase()}-ticks`,
    [label],
  );

  const tickPositions = useMemo(
    () =>
      ticks.map((tick) => ({
        tick,
        left: `calc(${THUMB_RADIUS_PX}px + ${tick / max} * (100% - ${2 * THUMB_RADIUS_PX}px))`,
      })),
    [ticks, max],
  );

  return (
    <div>
      <div className="text-ink-muted flex items-center justify-between text-sm">
        <Label noMargin>{label}</Label>
        <div className="flex items-center gap-2.5">
          <span className="text-ink-emphasis font-semibold">
            {value === undefined ? "Not rated" : formatValue(value)}
          </span>
          {value !== undefined && (
            <LinkButton onClick={() => onChange(undefined)}>clear</LinkButton>
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
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, var(--color-subtle) ${pct}%)`,
        }}
      />
      <datalist id={listId}>
        {ticks.map((tick) => (
          <option key={tick} value={tick} />
        ))}
      </datalist>
      <div className="relative h-1.5">
        {tickPositions.map(({ tick, left }) => (
          <span
            key={tick}
            className="bg-ink-muted/40 absolute top-0 h-2 w-px -translate-x-1/2"
            style={{ left }}
          />
        ))}
      </div>
      <div className="text-ink-muted relative mt-0.5 h-5 text-sm">
        {tickPositions.map(({ tick, left }) => (
          <span
            key={tick}
            className="absolute -translate-x-1/2"
            style={{ left }}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  );
}
