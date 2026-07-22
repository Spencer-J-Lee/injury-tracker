import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "border-strong bg-input text-ink-emphasis placeholder:text-ink-faint focus:border-accent block w-full rounded-xl border px-4 py-3 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
