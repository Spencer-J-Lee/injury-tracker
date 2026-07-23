import clsx from "clsx";

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

type SegmentedControlSize = "md" | "lg";

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  size?: SegmentedControlSize;
  className?: string;
}

const dividerSizeClasses: Record<SegmentedControlSize, string> = {
  md: "h-4",
  lg: "h-5",
};

const buttonSizeClasses: Record<SegmentedControlSize, string> = {
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={clsx(
        "border-strong inline-flex items-center gap-0.5 rounded-lg border p-0.5",
        className,
      )}
    >
      {options.map((option, index) => (
        <div key={option.value} className="flex flex-1 items-center gap-0.5">
          {index > 0 && (
            <div className={clsx("bg-strong w-px", dividerSizeClasses[size])} />
          )}
          <button
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              "w-full rounded-md border font-semibold whitespace-nowrap transition-colors",
              buttonSizeClasses[size],
              option.value === value
                ? "border-accent bg-accent-soft text-accent-soft-text"
                : "border-transparent bg-transparent text-ink-secondary hover:bg-surface-raised hover:text-ink",
            )}
          >
            {option.label}
          </button>
        </div>
      ))}
    </div>
  );
}
