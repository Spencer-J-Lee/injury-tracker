import type { ReactNode } from "react";

interface KbdProps {
  children: ReactNode;
}

export function Kbd({ children }: KbdProps) {
  return (
    <span className="border-subtle bg-control text-ink-faint rounded-sm border px-1.5 py-px font-mono text-xs leading-none font-normal">
      {children}
    </span>
  );
}
