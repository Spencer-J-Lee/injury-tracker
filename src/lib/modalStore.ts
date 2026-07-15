import { useSyncExternalStore } from "react";

let openCount = 0;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function registerModalOpen() {
  openCount += 1;
  notify();
  return () => {
    openCount -= 1;
    notify();
  };
}

export function useAnyModalOpen() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => openCount > 0,
  );
}
