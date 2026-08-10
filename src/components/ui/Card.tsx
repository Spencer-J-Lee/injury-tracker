import type { ComponentPropsWithRef, ElementType } from 'react';
import clsx from 'clsx';
import { cardPaddingClasses, type CardSize } from '@/components/ui/cardStyles';

type Size = CardSize;
type Variant = 'solid' | 'muted' | 'dashed';

interface CardOwnProps {
  size?: Size;
  variant?: Variant;
  padding?: boolean;
  rounded?: boolean;
}

type CardProps<T extends ElementType> = CardOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithRef<T>, keyof CardOwnProps | 'as'>;

const radiusClasses: Record<Size, string> = {
  sm: 'rounded-lg',
  md: 'rounded-2xl',
  lg: 'rounded-[20px]',
};

const variantClasses: Record<Variant, string> = {
  solid: 'bg-surface border-subtle border',
  muted: 'bg-canvas/40 border-subtle border',
  dashed: 'bg-canvas/40 border-strong border border-dashed',
};

export function Card<T extends ElementType = 'div'>({
  as,
  size = 'lg',
  variant = 'solid',
  padding = true,
  rounded = true,
  className,
  ...props
}: CardProps<T>) {
  const Component = as ?? 'div';
  return (
    <Component
      className={clsx(
        rounded && radiusClasses[size],
        padding && cardPaddingClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
