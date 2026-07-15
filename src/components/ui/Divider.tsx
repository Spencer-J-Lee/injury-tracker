import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Divider({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={clsx("border-subtle mt-2 border-t border-dashed", className)}
      {...props}
    />
  );
}
