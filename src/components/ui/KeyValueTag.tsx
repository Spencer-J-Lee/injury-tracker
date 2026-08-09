import clsx from 'clsx';

export function KeyValueTag({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <span className="bg-surface-raised border-subtle inline-flex items-center border">
      <span className="text-ink-muted bg-control border-subtle border-r px-2 py-1 text-xs font-semibold tracking-wider uppercase">
        {label}
      </span>
      <span
        className={clsx(
          'bg-surface px-2.25 py-1 text-xs font-bold',
          valueClassName,
        )}
      >
        {value}
      </span>
    </span>
  );
}
