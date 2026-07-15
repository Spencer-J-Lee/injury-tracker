import type { InjuryStatus } from "@/types/models";

export const statusLabels: Record<InjuryStatus, string> = {
  active: "Active",
  monitoring: "Monitoring",
  resolved: "Resolved",
};
