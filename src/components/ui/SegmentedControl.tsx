import type { ReactNode } from 'react';
import clsx from 'clsx';

type SegmentedControlTone = 'accent' | 'orange';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: ReactNode;
  tone?: SegmentedControlTone;
}

type SegmentedControlSize = 'md' | 'lg';

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  size?: SegmentedControlSize;
  className?: string;
}

const activeToneClasses: Record<SegmentedControlTone, string> = {
  accent: 'border-accent bg-accent-soft text-accent-soft-text',
  orange:
    'border-[oklch(0.6_0.15_55)] bg-[oklch(0.6_0.15_55)]/20 text-[oklch(0.75_0.15_55)]',
};

const dividerSizeClasses: Record<SegmentedControlSize, string> = {
  md: 'h-4',
  lg: 'h-5',
};

const buttonSizeClasses: Record<SegmentedControlSize, string> = {
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={clsx(
        'border-strong inline-flex items-center gap-0.5 rounded-lg border p-0.5',
        className,
      )}
    >
      {options.map((option, index) => (
        <div key={option.value} className="flex flex-1 items-center gap-0.5">
          {index > 0 && (
            <div className={clsx('bg-strong w-px', dividerSizeClasses[size])} />
          )}
          <button
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              'w-full rounded-md border font-semibold whitespace-nowrap',
              buttonSizeClasses[size],
              option.value === value
                ? activeToneClasses[option.tone ?? 'accent']
                : 'text-ink-secondary hover:bg-surface-raised hover:text-ink border-transparent bg-transparent',
            )}
          >
            {option.label}
          </button>
        </div>
      ))}
    </div>
  );
}
