import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "dashed";
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
  ghost:
    "bg-transparent border-transparent text-ink-secondary font-semibold hover:text-ink",
  dashed:
    "bg-transparent text-accent-soft-text border-dashed border-strong font-semibold hover:bg-accent-soft/40",
};

const sizeClasses: Record<Size, string> = {
  sm: "rounded-[9px] px-3 py-1.5 text-xs",
  md: "rounded-[10px] px-[15px] py-[9px] text-[13px]",
  lg: "rounded-xl px-4 py-[11px] text-sm",
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
        "inline-flex items-center justify-center gap-1.5 border transition-colors disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
