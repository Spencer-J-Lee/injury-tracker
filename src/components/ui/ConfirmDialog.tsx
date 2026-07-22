import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title = "Discard unsaved changes?",
  message,
  confirmLabel = "Discard",
  cancelLabel = "Keep editing",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-5 backdrop-blur-sm"
      style={{ background: "oklch(0.05 0.007 60 / 0.7)" }}
      onClick={onCancel}
    >
      <div
        className="border-subtle bg-surface-raised w-full max-w-[450px] rounded-[20px] border p-6 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-ink mb-2.5 text-xl font-semibold">
          {title}
        </h2>
        <p className="text-ink-muted mb-6 text-lg">{message}</p>
        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
