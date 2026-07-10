import type { ReactNode } from 'react'

interface KbdProps {
  children: ReactNode
}

export function Kbd({ children }: KbdProps) {
  return (
    <span className="rounded-[4px] border border-subtle bg-control px-1 py-[1px] font-mono text-[10px] font-normal leading-none text-ink-faint">
      {children}
    </span>
  )
}
