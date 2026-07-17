import type { RemedyCategory, TriggerCategory } from "@/types/models";

export const REMEDY_CATEGORIES: RemedyCategory[] = [
  "Mobility",
  "Strengthening",
  "Lifestyle",
  "Rest",
];

export const TRIGGER_CATEGORIES: TriggerCategory[] = [
  "Activity",
  "Overuse",
  "Load",
  "Posture",
  "Muscle Tightness",
];

export function sortByCategoryThenName<
  T extends { category?: string; name: string },
>(items: T[], categoryOrder: string[]): T[] {
  const rank = (category?: string) => {
    const index = category ? categoryOrder.indexOf(category) : -1;
    return index === -1 ? categoryOrder.length : index;
  };
  return [...items].sort((a, b) => {
    const rankDiff = rank(a.category) - rank(b.category);
    if (rankDiff !== 0) return rankDiff;
    return a.name.localeCompare(b.name);
  });
}
