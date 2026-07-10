import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "border-strong bg-input text-ink-emphasis focus:border-accent w-full rounded-[10px] border px-3 py-[9px] text-[13px] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
