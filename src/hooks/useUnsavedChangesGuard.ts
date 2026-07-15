import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedChangesGuard(isDirty: boolean) {
  const bypassRef = useRef(false);

  useEffect(() => {
    if (!isDirty) {
      // Once the form is clean again, re-arm the guard for the next
      // time it becomes dirty (bypass is only meant to cover the single
      // navigation that immediately follows a save).
      bypassRef.current = false;
      return;
    }
    if (bypassRef.current) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const blocker = useBlocker(
    useCallback(() => isDirty && !bypassRef.current, [isDirty]),
  );

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
    if (blocker.state === "blocked") blocker.proceed();
    setPendingAction((current) => {
      current?.();
      return null;
    });
  }, [blocker]);

  const cancelLeave = useCallback(() => {
    if (blocker.state === "blocked") blocker.reset();
    setPendingAction(null);
  }, [blocker]);

  const markSaved = useCallback(() => {
    bypassRef.current = true;
  }, []);

  return {
    isPrompting: blocker.state === "blocked" || pendingAction !== null,
    guard,
    confirmLeave,
    cancelLeave,
    markSaved,
  };
}
