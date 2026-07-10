import type { ReactNode } from "react";

interface KbdProps {
  children: ReactNode;
}

export function Kbd({ children }: KbdProps) {
  return (
    <span className="border-subtle bg-control text-ink-faint rounded-[4px] border px-1 py-[1px] font-mono text-[10px] leading-none font-normal">
      {children}
    </span>
  );
}
