import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'default' | 'gold' | 'optional';

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string;
  variant?: Variant;
  padding?: boolean;
  animated?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default: 'checked:bg-accent checked:border-accent',
  gold: 'checked:border-[#F8AF18] checked:bg-[#F8AF18]',
  optional: 'border-dashed checked:border-ink-faint checked:bg-control',
};

const animatedVariantClasses: Record<Variant, string> = {
  default: 'motion-reduce:checked:bg-accent checked:border-accent',
  gold: 'checked:border-[#F8AF18] motion-reduce:checked:bg-[#F8AF18]',
  optional:
    'border-dashed checked:border-ink-faint motion-reduce:checked:bg-control',
};

const overlayColorClasses: Record<Variant, string> = {
  default: 'bg-accent',
  gold: 'bg-[#F8AF18]',
  optional: 'bg-control',
};

const CHECK_POP_IN_ANIMATION_CLASSES =
  'peer-checked:motion-safe:animate-[check-pop-in_195ms_ease-out_105ms_both] motion-reduce:peer-checked:scale-100 motion-reduce:peer-checked:opacity-100';

function CheckOverlay({
  variant,
  animated,
}: {
  variant: Variant;
  animated: boolean;
}) {
  if (!animated) return null;
  return (
    <span
      className={clsx(
        'pointer-events-none absolute inset-px rounded-sm [clip-path:circle(0%_at_50%_50%)] motion-reduce:hidden',
        'peer-checked:motion-safe:animate-[circle-wipe_240ms_ease-out_both]',
        overlayColorClasses[variant],
      )}
    />
  );
}

function CheckMark({
  colorClassName,
  animated,
}: {
  colorClassName: string;
  animated: boolean;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={clsx(
        'pointer-events-none relative scale-75 opacity-0',
        animated ? 'size-5' : 'size-4',
        animated
          ? CHECK_POP_IN_ANIMATION_CLASSES
          : 'peer-checked:scale-100 peer-checked:opacity-100',
        colorClassName,
      )}
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoldMark({ animated }: { animated: boolean }) {
  return (
    <svg
      viewBox="0 0 576 512"
      fill="currentColor"
      className={clsx(
        'pointer-events-none relative scale-75 text-white opacity-0',
        animated ? 'size-4' : 'size-3.5',
        animated
          ? CHECK_POP_IN_ANIMATION_CLASSES
          : 'peer-checked:scale-100 peer-checked:opacity-100',
      )}
    >
      <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
    </svg>
  );
}

function renderIcon(variant: Variant, animated: boolean) {
  switch (variant) {
    case 'default':
      return <CheckMark colorClassName="text-white" animated={animated} />;
    case 'optional':
      return (
        <CheckMark colorClassName="text-ink-secondary" animated={animated} />
      );
    case 'gold':
      return <GoldMark animated={animated} />;
  }
}

export function Checkbox({
  label,
  className,
  id,
  variant = 'default',
  padding = true,
  animated = false,
  ...props
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        'text-ink-secondary group flex gap-2.5 text-pretty',
        padding && 'py-1.5',
        !props.disabled && 'cursor-pointer',
        className,
      )}
    >
      <div className="relative flex size-6 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          className={clsx(
            'peer border-strong bg-input group-hover:border-ink-faint absolute inset-0 m-0 cursor-pointer appearance-none rounded border disabled:cursor-not-allowed disabled:opacity-50',
            animated
              ? animatedVariantClasses[variant]
              : variantClasses[variant],
          )}
          {...props}
        />
        <CheckOverlay variant={variant} animated={animated} />
        {renderIcon(variant, animated)}
      </div>
      {label}
    </label>
  );
}
