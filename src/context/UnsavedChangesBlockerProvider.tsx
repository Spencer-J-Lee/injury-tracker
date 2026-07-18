import { useCallback, type ReactNode } from "react";
import { useBlocker } from "react-router-dom";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { isAnyGuardDirty } from "@/lib/unsavedChangesRegistry";

export function UnsavedChangesBlockerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const blocker = useBlocker(useCallback(() => isAnyGuardDirty(), []));

  return (
    <>
      {children}
      <ConfirmDialog
        open={blocker.state === "blocked"}
        message="You have unsaved changes. Are you sure you want to leave?"
        confirmLabel="Leave"
        onConfirm={() => {
          if (blocker.state === "blocked") blocker.proceed();
        }}
        onCancel={() => {
          if (blocker.state === "blocked") blocker.reset();
        }}
      />
    </>
  );
}
