import { useSyncExternalStore } from "react";

const KEY = "activities:editing-enabled";

let editingEnabled = localStorage.getItem(KEY) !== "false";
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function setActivitiesEditingEnabled(value: boolean) {
  editingEnabled = value;
  localStorage.setItem(KEY, String(value));
  notify();
}

export function useActivitiesEditingEnabled() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => editingEnabled,
  );
}
