import type { ReactNode } from "react";
import clsx from "clsx";

interface PageTitleProps {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageTitle({ children, actions, className }: PageTitleProps) {
  const heading = (
    <h1 className="font-heading text-ink text-3xl font-semibold">
      {children}
    </h1>
  );

  if (!actions) {
    return <div className={className}>{heading}</div>;
  }

  return (
    <div
      className={clsx("flex items-start justify-between gap-4", className)}
    >
      {heading}
      {actions}
    </div>
  );
}
