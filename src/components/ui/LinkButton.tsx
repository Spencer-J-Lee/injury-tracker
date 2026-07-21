import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type LinkButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function LinkButton({ className, type, ...props }: LinkButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={clsx(
        "text-accent-soft-text font-semibold hover:underline",
        className,
      )}
      {...props}
    />
  );
}
