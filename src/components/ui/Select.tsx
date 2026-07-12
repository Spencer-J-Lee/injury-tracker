import type { SelectHTMLAttributes } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={clsx(
          "border-strong bg-input text-ink-emphasis focus:border-accent w-full appearance-none rounded-[10px] border px-3 py-[9px] pr-8 text-[13px] focus:outline-none",
          className,
        )}
        {...props}
      />
      <FontAwesomeIcon
        icon={faChevronDown}
        className="text-ink-faint pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[10px]"
      />
    </div>
  );
}
