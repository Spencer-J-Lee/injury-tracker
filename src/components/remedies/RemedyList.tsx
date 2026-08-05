import { faAsterisk, faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from '@/components/ui/Card';
import { RemedySection } from '@/components/remedies/RemedySection';
import { useRemedies } from '@/hooks/useRemedies';

export function RemedyList({ injuryId }: { injuryId: string }) {
  const remedies = useRemedies(injuryId) ?? [];
  const strengthening = remedies.filter((r) => r.category === 'Strengthening');
  const mobility = remedies.filter((r) => r.category === 'Mobility');
  const prevention = remedies
    .filter((r) => r.category !== 'Strengthening' && r.category !== 'Mobility')
    .sort((a, b) => {
      const categoryCompare = (a.category ?? '').localeCompare(
        b.category ?? '',
      );
      if (categoryCompare !== 0) return categoryCompare;
      return a.name.localeCompare(b.name);
    });

  return (
    <Card className="space-y-4">
      <div className="flex items-baseline justify-between gap-2.5">
        <h3 className="font-heading text-ink-emphasis text-lg font-semibold">
          Remedies
        </h3>
        <span className="text-ink-faint flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <FontAwesomeIcon
              icon={faAsterisk}
              className="text-pain-green text-xs"
            />
            Immediate relief
          </span>
          <span className="flex items-center gap-1">
            <FontAwesomeIcon
              icon={faDumbbell}
              className="text-accent-soft-text text-xs"
            />
            In strengthening program
          </span>
        </span>
      </div>
      <RemedySection
        title="Strengthening"
        remedies={strengthening}
        injuryId={injuryId}
        defaults={{ category: 'Strengthening' }}
        showCategoryBadge={false}
      />
      <RemedySection
        title="Mobility"
        remedies={mobility}
        injuryId={injuryId}
        defaults={{ category: 'Mobility' }}
        showCategoryBadge={false}
      />
      <RemedySection
        title="Prevention"
        remedies={prevention}
        injuryId={injuryId}
        defaults={{}}
      />
    </Card>
  );
}
