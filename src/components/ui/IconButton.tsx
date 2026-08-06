import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

type Tone = 'neutral' | 'danger' | 'warning';
type Size = 'sm' | 'md';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: FontAwesomeIconProps['icon'];
  tone?: Tone;
  size?: Size;
  label: string;
}

const sizeClasses: Record<Size, string> = {
  sm: 'w-7 h-7 rounded-lg',
  md: 'h-10.5 w-10.5 rounded-xl',
};

const iconSizeClasses: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-lg',
};

const toneClasses: Record<Size, Record<Tone, string>> = {
  sm: {
    neutral: 'text-ink-muted hover:bg-surface-raised hover:text-ink',
    danger: 'text-ink-muted hover:bg-pain-red-bg hover:text-pain-red',
    warning: 'text-ink-muted hover:bg-pain-amber-bg hover:text-pain-amber',
  },
  md: {
    neutral: 'border border-strong bg-control text-ink hover:bg-surface-raised',
    danger:
      'bg-[oklch(0.33_0.14_25)] text-[oklch(0.96_0.03_25)] hover:bg-[oklch(0.37_0.14_25)]',
    warning:
      'bg-[oklch(0.33_0.09_85)] text-[oklch(0.96_0.03_85)] hover:bg-[oklch(0.37_0.09_85)]',
  },
};

export function IconButton({
  icon,
  tone = 'neutral',
  size = 'sm',
  label,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      className={clsx(
        'inline-flex items-center justify-center',
        sizeClasses[size],
        toneClasses[size][tone],
        className,
      )}
      {...props}
    >
      <FontAwesomeIcon icon={icon} className={iconSizeClasses[size]} />
    </button>
  );
}
