import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type TogglePillTone = "accent" | "red";

interface TogglePillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  tone?: TogglePillTone;
}

const selectedToneClasses: Record<TogglePillTone, string> = {
  accent: "border-accent bg-accent-soft text-accent-soft-text",
  red: "border-pain-red bg-pain-red-bg text-pain-red",
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
          : "border-strong text-ink-secondary hover:bg-surface-raised bg-transparent",
        className,
      )}
      {...props}
    />
  );
}
