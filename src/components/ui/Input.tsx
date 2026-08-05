import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Size = "sm" | "md";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "rounded-lg px-2.5 py-1.5 text-sm",
  md: "rounded-xl px-4 py-3",
};

export function Input({ className, size = "md", ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "border-strong bg-input text-ink-emphasis placeholder:text-ink-faint focus:border-accent w-full border focus:outline-none",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
