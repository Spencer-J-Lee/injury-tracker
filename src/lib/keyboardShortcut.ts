interface ShortcutModifiers {
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

/** Cmd on Mac, Ctrl elsewhere, treated as a single "meta" modifier. */
export function matchesShortcut(
  e: KeyboardEvent,
  key: string,
  modifiers: ShortcutModifiers = {},
): boolean {
  const meta = e.metaKey || e.ctrlKey;
  return (
    e.key.toLowerCase() === key.toLowerCase() &&
    meta === !!modifiers.meta &&
    e.shiftKey === !!modifiers.shift &&
    e.altKey === !!modifiers.alt
  );
}
