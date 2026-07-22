import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        "text-ink-secondary group flex w-fit items-center gap-2.5 py-1.5",
        !props.disabled && "cursor-pointer",
        className,
      )}
    >
      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          className="peer border-strong bg-input checked:bg-accent checked:border-accent group-hover:border-ink-faint focus-visible:outline-accent absolute inset-0 m-0 appearance-none rounded border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="pointer-events-none relative h-4 w-4 scale-75 text-white opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100"
        >
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </label>
  );
}
