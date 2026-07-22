import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "border-strong bg-input text-ink-emphasis placeholder:text-ink-faint focus:border-accent w-full rounded-xl border px-4 py-3 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
