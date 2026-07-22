import type { LabelHTMLAttributes } from "react";
import clsx from "clsx";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: "sm" | "md";
  noMargin?: boolean;
}

const SIZE_STYLES: Record<NonNullable<LabelProps["size"]>, string> = {
  sm: "text-sm font-semibold text-ink-muted",
  md: "text-lg font-medium text-ink-secondary",
};

export function Label({
  className,
  size = "sm",
  noMargin = false,
  ...props
}: LabelProps) {
  return (
    <label
      className={clsx(
        "block",
        !noMargin && "mb-2",
        SIZE_STYLES[size],
        className,
      )}
      {...props}
    />
  );
}
