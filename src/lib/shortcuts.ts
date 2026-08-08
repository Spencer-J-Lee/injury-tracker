const isMac =
  typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);

export const saveShortcutLabel = isMac ? '⌘S' : 'Ctrl+S';
export const cancelShortcutLabel = 'Esc';
export const saveNoSymptomsShortcutLabel = isMac ? '⌘⇧S' : 'Ctrl+Shift+S';
export const addInjuryShortcutLabel = 'N';
export const addActivityShortcutLabel = 'N';
export const logEntryShortcutLabel = 'T';
export const updateEntryShortcutLabel = 'T';
export const morningCheckInShortcutLabel = 'M';
export const dashboardShortcutLabel = '1';
export const habitsShortcutLabel = '2';
export const strengtheningShortcutLabel = '3';
export const journalShortcutLabel = '4';
export const activitiesShortcutLabel = '5';
export const todosShortcutLabel = '`';
export const settingsShortcutLabel = '0';
export const journalQuickEditShortcutLabel = 'E';
