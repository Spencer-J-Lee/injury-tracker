import type { HTMLAttributes } from "react";
import clsx from "clsx";

type Tone = "slate" | "green" | "amber" | "red" | "indigo" | "orange";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  weight?: "semibold" | "bold";
}

const toneClasses: Record<Tone, string> = {
  slate: "bg-control text-ink-secondary",
  green: "bg-pain-green-bg text-pain-green",
  amber: "bg-pain-amber-bg text-pain-amber",
  red: "bg-pain-red-bg text-pain-red",
  indigo: "bg-accent-soft text-accent-soft-text",
  orange: "bg-pain-orange-bg text-pain-orange",
};

export function Badge({
  tone = "slate",
  weight = "semibold",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-sm whitespace-nowrap",
        weight === "bold" ? "font-bold" : "font-semibold",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
