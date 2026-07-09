import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type Tone = 'slate' | 'green' | 'amber' | 'red' | 'indigo'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  weight?: 'semibold' | 'bold'
}

const toneClasses: Record<Tone, string> = {
  slate: 'bg-control text-ink-secondary',
  green: 'bg-pain-green-bg text-pain-green',
  amber: 'bg-pain-amber-bg text-pain-amber',
  red: 'bg-pain-red-bg text-pain-red',
  indigo: 'bg-accent-soft text-accent-soft-text',
}

export function Badge({ tone = 'slate', weight = 'semibold', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center whitespace-nowrap rounded-full px-[9px] py-[3px] text-[11px]',
        weight === 'bold' ? 'font-bold' : 'font-semibold',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
