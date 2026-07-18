// react-router only supports a single active useBlocker at a time, but
// several independent forms/modals in this app each want to guard
// navigation while dirty. They all share one useBlocker (registered in
// UnsavedChangesBlockerProvider) and report their dirty state in here so
// that single blocker knows whether it should block.
const dirtyIds = new Set<string>();

export function setGuardDirty(id: string, dirty: boolean) {
  if (dirty) {
    dirtyIds.add(id);
  } else {
    dirtyIds.delete(id);
  }
}

export function isAnyGuardDirty() {
  return dirtyIds.size > 0;
}
