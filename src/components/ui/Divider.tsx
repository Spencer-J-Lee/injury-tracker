import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  className,
  orientation = "horizontal",
  ...props
}: DividerProps) {
  return (
    <hr
      className={clsx(
        "border-subtle border-dashed",
        orientation === "vertical" ? "h-full border-l" : "border-t",
        className,
      )}
      {...props}
    />
  );
}
