import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface TogglePillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
}

export function TogglePill({ selected, className, ...props }: TogglePillProps) {
  return (
    <button
      type="button"
      className={clsx(
        'whitespace-nowrap rounded-full border px-3 py-[5px] text-xs font-semibold transition-colors',
        selected
          ? 'border-accent bg-accent-soft text-accent-soft-text'
          : 'border-strong bg-transparent text-ink-secondary hover:bg-surface-raised',
        className,
      )}
      {...props}
    />
  )
}
