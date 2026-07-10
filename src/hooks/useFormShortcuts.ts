import { useEffect } from "react";

interface FormShortcutOptions {
  onSave?: () => void;
  onCancel?: () => void;
  enabled?: boolean;
}

export function useFormShortcuts({
  onSave,
  onCancel,
  enabled = true,
}: FormShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave?.();
        return;
      }
      if (e.key === "Escape") {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onSave, onCancel]);
}
