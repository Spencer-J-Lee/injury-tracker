import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "border-subtle bg-surface rounded-[16px] border p-[18px]",
        className,
      )}
      {...props}
    />
  );
}
