import type {
  StiffnessDuration,
  NumbnessDuration,
  NumbnessSuspectedCause,
  PainMechanism,
} from "@/types/models";

export const PAIN_MECHANISM_OPTIONS: { value: PainMechanism; label: string }[] =
  [
    { value: "nociceptive", label: "Nociceptive (Mechanical)" },
    { value: "neuropathic", label: "Neuropathic" },
    { value: "nociplastic", label: "Nociplastic (Nervous system)" },
  ];

// An injury with no pain mechanisms recorded yet (e.g. migrated from before
// this field existed) hasn't been categorized, not deliberately narrowed —
// show every mechanism's fields rather than hiding all of them.
export function getMechanismVisibility(painMechanisms: PainMechanism[]) {
  const showAll = painMechanisms.length === 0;
  return {
    showNociceptive: showAll || painMechanisms.includes("nociceptive"),
    showNeuropathic: showAll || painMechanisms.includes("neuropathic"),
    showNociplastic: showAll || painMechanisms.includes("nociplastic"),
  };
}

export const STIFFNESS_DURATION_OPTIONS: {
  value: StiffnessDuration;
  label: string;
}[] = [
  { value: "immediate", label: "Immediate (within 1-2 mins)" },
  { value: "5-10min", label: "~5-10 min" },
  { value: "15-30min", label: "~15-30 min" },
  { value: "30plus", label: "30+ min" },
];

export const NUMBNESS_DURATION_OPTIONS: {
  value: NumbnessDuration;
  label: string;
}[] = [
  {
    value: "brief",
    label: "Brief (<1 min)",
  },
  {
    value: "lingering",
    label: "Lingering (several minutes)",
  },
  {
    value: "persistent",
    label: "Persistent (well into the morning routine)",
  },
];

export const NUMBNESS_SUSPECTED_CAUSE_OPTIONS: {
  value: NumbnessSuspectedCause;
  label: string;
}[] = [
  { value: "sleep-posture", label: "Sleep posture" },
  { value: "load-related", label: "Load-related (previous day's exercise)" },
  { value: "unsure", label: "Unsure" },
];
