import type { HTMLAttributes } from "react";
import clsx from "clsx";

type Tone = "slate" | "green" | "amber" | "red";

interface ToneTextProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  slate: "text-ink-muted",
  green: "text-pain-green-text",
  amber: "text-pain-amber-text",
  red: "text-pain-red-text",
};

export function ToneText({
  tone = "slate",
  className,
  ...props
}: ToneTextProps) {
  return (
    <span
      className={clsx("font-semibold", toneClasses[tone], className)}
      {...props}
    />
  );
}
