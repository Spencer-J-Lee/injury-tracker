import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

type Tone = 'neutral' | 'danger'
type Size = 'sm' | 'md'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: FontAwesomeIconProps['icon']
  tone?: Tone
  size?: Size
  label: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'rounded-md w-6 h-6',
  md: 'h-10 w-10 rounded-[10px] border',
}

const iconSizeClasses: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-base',
}

const toneClasses: Record<Size, Record<Tone, string>> = {
  sm: {
    neutral: 'text-ink-muted hover:bg-accent-soft hover:text-accent-soft-text',
    danger: 'text-ink-muted hover:bg-pain-red-bg hover:text-pain-red',
  },
  md: {
    neutral: 'border-strong bg-control text-ink hover:bg-surface-raised',
    danger:
      'border-[oklch(0.33_0.14_25)] bg-[oklch(0.33_0.14_25)] text-[oklch(0.96_0.03_25)] hover:bg-[oklch(0.37_0.14_25)]',
  },
}

export function IconButton({ icon, tone = 'neutral', size = 'sm', label, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex items-center justify-center transition-colors',
        sizeClasses[size],
        toneClasses[size][tone],
        className,
      )}
      {...props}
    >
      <FontAwesomeIcon icon={icon} className={iconSizeClasses[size]} />
    </button>
  )
}
