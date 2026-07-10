const isMac =
  typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);

export const saveShortcutLabel = isMac ? "⌘S" : "Ctrl+S";
export const cancelShortcutLabel = "Esc";
export const addInjuryShortcutLabel = "N";
export const logEntryShortcutLabel = "L";
