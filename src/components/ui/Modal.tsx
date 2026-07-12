import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  open,
  onClose,
  onSave,
  title,
  children,
  footer,
}: ModalProps) {
  useFormShortcuts({ onSave, onCancel: onClose, enabled: open });

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center backdrop-blur-sm sm:items-center sm:p-6"
      style={{ background: "oklch(0.05 0.007 60 / 0.7)" }}
      onClick={onClose}
    >
      <div
        className="border-subtle bg-surface-raised max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-t-[18px] border p-[22px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] sm:rounded-[18px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-ink text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-muted hover:text-ink text-base transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
