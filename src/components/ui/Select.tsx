import type { SelectHTMLAttributes } from 'react'
import clsx from 'clsx'

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        'w-full rounded-[10px] border border-strong bg-input px-3 py-[9px] text-[13px] text-ink-emphasis focus:border-accent focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}
