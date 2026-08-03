import { useEffect } from "react";
import { matchesShortcut } from "@/lib/keyboardShortcut";

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
      if (matchesShortcut(e, "s", { meta: true })) {
        e.preventDefault();
        onSave?.();
        return;
      }
      if (matchesShortcut(e, "Escape")) {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onSave, onCancel]);
}
