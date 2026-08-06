import { db } from '@/db/schema';
import type { Section } from '@/types/models';

export async function listActiveSections(): Promise<Section[]> {
  const sections = await db.sections.toArray();
  return sections.sort((a, b) => a.position - b.position);
}

export async function createSection(input: { name: string }): Promise<Section> {
  return db.transaction('rw', db.sections, async () => {
    const existing = await db.sections.toArray();
    const nextPosition =
      existing.length > 0
        ? Math.max(...existing.map((section) => section.position)) + 1
        : 0;
    const section: Section = {
      id: crypto.randomUUID(),
      name: input.name,
      position: nextPosition,
      createdAt: new Date().toISOString(),
    };
    await db.sections.add(section);
    return section;
  });
}

export async function updateSection(
  id: string,
  changes: Partial<Pick<Section, 'name'>>,
) {
  await db.sections.update(id, changes);
}

export async function deleteSection(id: string) {
  await db.transaction('rw', db.sections, db.activities, async () => {
    await db.activities.where('sectionId').equals(id).delete();
    await db.sections.delete(id);
  });
}

export async function reorderSections(orderedIds: string[]): Promise<void> {
  await db.transaction('rw', db.sections, async () => {
    await Promise.all(
      orderedIds.map((id, index) =>
        db.sections.update(id, { position: index }),
      ),
    );
  });
}
