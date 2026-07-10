import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        handler();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, handler, enabled]);
}
