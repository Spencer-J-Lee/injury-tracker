import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type TogglePillTone = "accent" | "red" | "green";

interface TogglePillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  tone?: TogglePillTone;
}

const selectedToneClasses: Record<TogglePillTone, string> = {
  accent:
    "border-accent bg-accent-soft text-accent-soft-text hover:border-accent-border-hover hover:bg-accent-soft-hover",
  red: "border-pain-red bg-pain-red-bg text-pain-red hover:border-pain-red-border-hover hover:bg-pain-red-bg-hover",
  green:
    "border-pain-green bg-pain-green-bg text-pain-green hover:border-pain-green-border-hover hover:bg-pain-green-bg-hover",
};

export function TogglePill({
  selected,
  tone = "accent",
  className,
  ...props
}: TogglePillProps) {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-full border px-3 py-[5px] text-xs font-semibold whitespace-nowrap transition-colors",
        selected
          ? selectedToneClasses[tone]
          : "border-strong text-ink-secondary hover:border-ink-faint hover:bg-surface-raised hover:text-ink bg-transparent",
        className,
      )}
      {...props}
    />
  );
}
