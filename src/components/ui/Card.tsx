import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-[16px] border border-subtle bg-surface p-[18px]',
        className,
      )}
      {...props}
    />
  )
}
