import { useContext } from "react";
import { LogModalContext } from "@/context/logModalStore";

export function useLogModal() {
  const ctx = useContext(LogModalContext);
  if (!ctx) throw new Error("useLogModal must be used within LogModalProvider");
  return ctx;
}
