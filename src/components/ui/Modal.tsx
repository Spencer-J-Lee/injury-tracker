import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useFormShortcuts } from "@/hooks/useFormShortcuts";
import { registerModalOpen } from "@/lib/modalStore";
import { IconButton } from "@/components/ui/IconButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "default" | "narrow";
}

const maxWidthBySize = {
  default: "sm:max-w-[800px]",
  narrow: "sm:max-w-[550px]",
};

export function Modal({
  open,
  onClose,
  onSave,
  title,
  children,
  footer,
  size = "default",
}: ModalProps) {
  useFormShortcuts({ onSave, onCancel: onClose, enabled: open });

  useEffect(() => {
    if (!open) return;
    return registerModalOpen();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center backdrop-blur-sm sm:items-center sm:p-7"
      style={{ background: "oklch(0.05 0.007 60 / 0.7)" }}
      onClick={onClose}
    >
      <div
        className={`border-subtle bg-surface-raised max-h-[90vh] w-full ${maxWidthBySize[size]} overflow-y-auto rounded-t-3xl border p-7 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] sm:rounded-3xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between">
          <h2 className="font-heading text-ink text-2xl font-semibold">
            {title}
          </h2>
          <IconButton icon={faXmark} label="Close" onClick={onClose} />
        </div>
        <div className="space-y-5">{children}</div>
        {footer && (
          <div className="mt-6 flex justify-end gap-2.5">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}
