import type { LabelHTMLAttributes } from "react";
import clsx from "clsx";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: "sm" | "md";
}

const SIZE_STYLES: Record<NonNullable<LabelProps["size"]>, string> = {
  sm: "text-xs font-semibold text-ink-muted",
  md: "text-sm font-medium text-ink-secondary",
};

export function Label({ className, size = "sm", ...props }: LabelProps) {
  return (
    <label
      className={clsx("mb-1.5 block", SIZE_STYLES[size], className)}
      {...props}
    />
  );
}
