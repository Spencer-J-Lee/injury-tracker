import type { Activity, ActivityBodyPart, Section } from "@/types/models";

export const ACTIVITY_BODY_PARTS: ActivityBodyPart[] = [
  "Arms",
  "Legs",
  "Neck/Shoulders",
];

export function groupActivitiesBySections(
  activities: Activity[],
  sections: Section[],
  { hideEmpty = false }: { hideEmpty?: boolean } = {},
): Array<{ section: Section | undefined; items: Activity[] }> {
  const bySection = new Map<string, Activity[]>();
  const other: Activity[] = [];
  for (const activity of activities) {
    if (activity.sectionId) {
      const bucket = bySection.get(activity.sectionId);
      if (bucket) {
        bucket.push(activity);
      } else {
        bySection.set(activity.sectionId, [activity]);
      }
    } else {
      other.push(activity);
    }
  }
  for (const items of bySection.values()) {
    items.sort((a, b) => a.position - b.position);
  }
  other.sort((a, b) => a.position - b.position);

  const groups: Array<{ section: Section | undefined; items: Activity[] }> =
    sections
      .map((section) => ({
        section,
        items: bySection.get(section.id) ?? [],
      }))
      .filter((group) => !hideEmpty || group.items.length > 0);

  if (other.length > 0) {
    groups.push({ section: undefined, items: other });
  }
  return groups;
}
