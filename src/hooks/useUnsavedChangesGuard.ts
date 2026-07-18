import { useCallback, useEffect, useId, useRef, useState } from "react";
import { setGuardDirty } from "@/lib/unsavedChangesRegistry";

export function useUnsavedChangesGuard(isDirty: boolean) {
  const id = useId();
  const bypassRef = useRef(false);

  useEffect(() => {
    if (!isDirty) {
      // Once the form is clean again, re-arm the guard for the next
      // time it becomes dirty (bypass is only meant to cover the single
      // navigation that immediately follows a save).
      bypassRef.current = false;
      setGuardDirty(id, false);
      return;
    }
    if (bypassRef.current) {
      setGuardDirty(id, false);
      return;
    }
    setGuardDirty(id, true);
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [id, isDirty]);

  useEffect(() => {
    return () => setGuardDirty(id, false);
  }, [id]);

  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const guard = useCallback(
    (action: () => void) => {
      if (isDirty) {
        setPendingAction(() => action);
      } else {
        action();
      }
    },
    [isDirty],
  );

  const confirmLeave = useCallback(() => {
    setPendingAction((current) => {
      current?.();
      return null;
    });
  }, []);

  const cancelLeave = useCallback(() => {
    setPendingAction(null);
  }, []);

  const markSaved = useCallback(() => {
    bypassRef.current = true;
    setGuardDirty(id, false);
  }, [id]);

  return {
    isPrompting: pendingAction !== null,
    guard,
    confirmLeave,
    cancelLeave,
    markSaved,
  };
}
