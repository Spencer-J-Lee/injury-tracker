import type { Injury, InjuryPriority, InjuryStatus } from "@/types/models";

export function formatInjuryName(injury: {
  bodyPart: string;
  injuryType: string;
}): string {
  if (!injury.injuryType) return injury.bodyPart;
  return `${injury.bodyPart}: ${injury.injuryType}`;
}

export const STATUS_ORDER: InjuryStatus[] = [
  "active",
  "monitoring",
  "resolved",
];
const PRIORITY_ORDER: InjuryPriority[] = ["urgent", "high", "medium", "low"];

export function compareInjuries(a: Injury, b: Injury): number {
  const statusDiff =
    STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
  if (statusDiff !== 0) return statusDiff;
  const aPriority = a.priority
    ? PRIORITY_ORDER.indexOf(a.priority)
    : PRIORITY_ORDER.length;
  const bPriority = b.priority
    ? PRIORITY_ORDER.indexOf(b.priority)
    : PRIORITY_ORDER.length;
  return aPriority - bPriority;
}
