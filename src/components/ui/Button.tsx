import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "dashed" | "orange";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent border-accent text-ink font-bold hover:bg-accent-hover",
  secondary:
    "bg-control text-ink border-strong font-semibold hover:bg-surface-raised",
  danger:
    "bg-[oklch(0.33_0.14_25)] border-[oklch(0.33_0.14_25)] text-[oklch(0.96_0.03_25)] font-bold hover:bg-[oklch(0.37_0.14_25)]",
  orange:
    "bg-[oklch(0.6_0.15_55)] border-[oklch(0.6_0.15_55)] text-ink font-bold hover:bg-[oklch(0.54_0.15_55)]",
  ghost:
    "bg-transparent border-transparent text-ink-secondary font-semibold hover:text-ink",
  dashed:
    "bg-transparent text-ink-secondary border-dashed border-strong font-semibold hover:bg-surface-raised hover:text-ink",
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-lg px-2.5 py-1.5 text-sm gap-1",
  md: "rounded-xl px-3.5 py-2 text-base gap-2",
  lg: "rounded-2xl px-4 py-3 text-lg gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center border transition-colors disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
