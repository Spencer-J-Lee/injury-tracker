import clsx from "clsx";
import type { PainTone } from "@/lib/pain";

const meterFillClasses: Record<PainTone, string> = {
  slate: "bg-ink-faint",
  green: "bg-pain-green-text",
  amber: "bg-pain-amber-text",
  red: "bg-pain-red-text",
};

const meterTextClasses: Record<PainTone, string> = {
  slate: "text-ink-muted",
  green: "text-pain-green-text",
  amber: "text-pain-amber-text",
  red: "text-pain-red-text",
};

export function MeterRow({
  label,
  value,
  displayValue,
  tone,
  labelClassName,
}: {
  label: string;
  value: number;
  displayValue: string;
  tone: PainTone;
  labelClassName?: string;
}) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span
        className={clsx(
          "text-ink-muted shrink-0 font-semibold",
          labelClassName ?? "w-18",
        )}
      >
        {label}
      </span>
      <div className="bg-control h-2 flex-1 rounded-full">
        <div
          className={clsx("h-2 rounded-full", meterFillClasses[tone])}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <span
        className={clsx(
          "w-11 shrink-0 text-right font-bold",
          meterTextClasses[tone],
        )}
      >
        {displayValue}
      </span>
    </div>
  );
}
