import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { LinkButton } from '@/components/ui/LinkButton';
import { GuidelineHeading } from './GuidelineItem';

interface Item {
  id: string;
  label: string;
  text: string;
}

interface Category {
  title: string;
  items: Item[];
}

const ORDER_OF_OPERATIONS =
  'Range → Load → Contraction type → Tempo/tool → Substitute exercise';

const CATEGORIES: Category[] = [
  {
    title: 'Change the range/position',
    items: [
      { id: 'range-rom', label: 'ROM', text: 'only work the pain-free range' },
      {
        id: 'range-adjacent-joint',
        label: 'Adjacent joint position',
        text: 'tweak the angle of nearby joints (like your wrist position) to take pressure off',
      },
    ],
  },
  {
    title: 'Change the load',
    items: [
      {
        id: 'load-external',
        label: 'External load',
        text: 'reduce weight/resistance',
      },
      {
        id: 'load-type',
        label: 'Load type',
        text: 'dumbbell → resistance band → bodyweight',
      },
      {
        id: 'load-contraction-type',
        label: 'Contraction type',
        text: 'isotonic → isometric (typically most tolerable starting point) → eccentric',
      },
    ],
  },
  {
    title: 'Change the tempo',
    items: [
      {
        id: 'tempo-speed',
        label: 'Speed',
        text: 'for isotonics, try going slower for more control or faster to decrease time under tension',
      },
      {
        id: 'tempo-time-under-tension',
        label: 'Reduce time under tension',
        text: 'for isometrics, reduce hold time',
      },
    ],
  },
  {
    title: 'Change the dosage',
    items: [
      {
        id: 'dosage-reps-sets',
        label: 'Reps/sets',
        text: 'cut volume before cutting intensity',
      },
      {
        id: 'dosage-rest',
        label: 'Rest',
        text: 'longer breaks between reps/sets',
      },
      {
        id: 'dosage-frequency',
        label: 'Frequency',
        text: 'same weekly volume, spread over more days',
      },
    ],
  },
  {
    title: 'Change your stability demands',
    items: [
      {
        id: 'stability-chain',
        label: 'Open vs. closed chain',
        text: 'do the movement against something solid like a wall or table surface instead of free-standing',
      },
      {
        id: 'stability-surface',
        label: 'Stable vs. unstable surface',
        text: "removing unstable surface work if it's adding unwanted joint stress",
      },
      {
        id: 'stability-unilateral',
        label: 'Unilateral vs. bilateral',
        text: 'sometimes bilateral reduces relative load per limb, sometimes unilateral allows better compensatory positioning',
      },
    ],
  },
  {
    title: 'Change your grip (forearm/wrist-specific)',
    items: [
      {
        id: 'grip-width',
        label: 'Grip width/diameter',
        text: 'thicker handle = less grip force needed',
      },
      {
        id: 'grip-type',
        label: 'Grip type',
        text: 'neutral vs. pronated vs. supinated',
      },
      {
        id: 'grip-tool-swap',
        label: 'Tool swap',
        text: 'band vs. free weight vs. cable (different resistance curves)',
      },
    ],
  },
];

const STORAGE_KEY = 'strengthening:exercise-adjustment-tips-checked';

function loadChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChecked(checked: Record<string, boolean>) {
  if (Object.keys(checked).length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }
}

export function ExerciseModificationCheatsheet() {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecked(next);
      return next;
    });
  };

  const clear = () => {
    setChecked({});
    saveChecked({});
  };

  const hasChecked = Object.values(checked).some(Boolean);

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="font-heading text-ink text-2xl font-semibold">
          Exercise Modification Cheatsheet
        </div>
        {hasChecked && (
          <LinkButton type="button" onClick={clear}>
            clear all
          </LinkButton>
        )}
      </div>

      <GuidelineHeading
        title="Order of operations"
        text={ORDER_OF_OPERATIONS}
      />

      <div className="mt-5 flex flex-wrap">
        {CATEGORIES.map((category, index) => (
          <div
            key={category.title}
            className={
              index % 2 === 0
                ? 'mb-5 w-full sm:mr-6 sm:w-[calc(50%-0.75rem)]'
                : 'mb-5 w-full sm:w-[calc(50%-0.75rem)]'
            }
          >
            <p className="font-heading text-ink mb-1 text-lg font-medium">
              {category.title}
            </p>
            <div className="space-y-0.5">
              {category.items.map((item) => (
                <Checkbox
                  key={item.id}
                  id={item.id}
                  label={`${item.label}: ${item.text}`}
                  checked={checked[item.id] ?? false}
                  onChange={() => toggle(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
