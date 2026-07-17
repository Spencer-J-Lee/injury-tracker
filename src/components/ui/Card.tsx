import type { ComponentPropsWithoutRef, ElementType } from "react";
import clsx from "clsx";

type Size = "sm" | "md" | "lg";
type Variant = "solid" | "subtle" | "dashed";

interface CardOwnProps {
  size?: Size;
  variant?: Variant;
}

type CardProps<T extends ElementType> = CardOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps | "as">;

const sizeClasses: Record<Size, string> = {
  sm: "rounded-lg p-3",
  md: "rounded-[12px] px-3.5 py-3",
  lg: "rounded-[16px] p-[18px]",
};

const variantClasses: Record<Variant, string> = {
  solid: "bg-surface border-subtle border",
  subtle: "border-subtle border",
  dashed: "border-strong border border-dashed",
};

export function Card<T extends ElementType = "div">({
  as,
  size = "lg",
  variant = "solid",
  className,
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={clsx(sizeClasses[size], variantClasses[variant], className)}
      {...props}
    />
  );
}
