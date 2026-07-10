import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "border-strong bg-input text-ink-emphasis placeholder:text-ink-faint focus:border-accent w-full rounded-[10px] border px-3 py-[9px] text-[13px] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
