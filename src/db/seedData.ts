import type {
  Category,
  InjuryPriority,
  InjuryStatus,
  RemedyType,
} from "@/types/models";

export interface SeedRemedy {
  key: string;
  name: string;
  description?: string;
  type: RemedyType;
  category?: Category;
}

export interface SeedTrigger {
  key: string;
  name: string;
  description?: string;
  category?: Category;
}

export interface SeedLogEntry {
  offsetDays: number;
  atHour?: number;
  atMinute?: number;
  painLevel?: number;
  painFrequency?: number;
  remedyKeys?: string[];
  triggerKeys?: string[];
  notes?: string;
}

export interface SeedJournalEntry {
  offsetDays: number;
  text: string;
}

export const SEED_JOURNAL_ENTRIES: SeedJournalEntry[] = [
  {
    offsetDays: -1,
    text: "Sharp pain when going down stairs. Iced it twice and kept it elevated in the evening.",
  },
  {
    offsetDays: -3,
    text: "Physio session went well. Increased resistance band reps to 3x15 without issues.",
  },
  {
    offsetDays: -5,
    text: "Mostly stiff after sitting for long periods. Short walk in the afternoon helped loosen it up.",
  },
  {
    offsetDays: -7,
    text: "Slept awkwardly and woke up with some tightness. Backed off the heavier exercises today.",
  },
  {
    offsetDays: -9,
    text: "First day back at the gym since the injury. Kept it light — bodyweight only, no pain reported.",
  },
  {
    offsetDays: -12,
    text: "Overall feeling more confident moving around. Still avoiding heavy lifting.",
  },
  {
    offsetDays: -16,
    text: "Rough day — long drive left everything achy. Extra stretching before bed helped.",
  },
  {
    offsetDays: -2,
    text: "<p>Tried a few new exercises for the elbow today:</p><ul><li>Wrist flexor stretch, 3x30s each side</li><li>Eccentric wrist curls with a light dumbbell</li><li>Ice for 10 min afterward</li></ul><p>No flare-up so far.</p>",
  },
  {
    offsetDays: -6,
    text: '<p>Physio gave me an updated recovery routine to follow:</p><ol><li>5 min light cardio to warm up</li><li>Glute bridges, 3x12</li><li>Bird dogs, 3x10 each side</li><li>Cat-cow stretch, 2 min</li></ol><p>Following along with <a href="https://www.youtube.com/results?search_query=lower+back+physio+routine" target="_blank" rel="noopener noreferrer">this playlist</a> for form checks.</p>',
  },
  {
    offsetDays: -10,
    text: '<p>Found a good <a href="https://www.hopkinsmedicine.org/health/conditions-and-diseases/tennis-elbow" target="_blank" rel="noopener noreferrer">article on tennis elbow management</a> — going to try the counterforce brace it mentions.</p>',
  },
  {
    offsetDays: -14,
    text: "<p>Noticing some patterns in what sets off the knee twinge:</p><ul><li>Going down stairs quickly</li><li>Sitting cross-legged for too long</li><li>Cold mornings</li></ul>",
  },
  {
    offsetDays: -20,
    text: '<p>Ankle feels almost back to normal. Ran through the standard mobility checks from <a href="https://www.physio-pedia.com/Ankle_Sprain" target="_blank" rel="noopener noreferrer">Physiopedia</a>:</p><ol><li>Single-leg balance, 30s — passed</li><li>Calf raises x15 — passed, slight tightness</li><li>Hop test — held off, feels early</li></ol>',
  },
  {
    offsetDays: -24,
    text: "<p>Shoulder tightness log for the week:</p><ul><li>Worse after bench press</li><li>Better after foam rolling</li><li>No pain at rest</li></ul>",
  },
  {
    offsetDays: -29,
    text: '<p>Hip has been nagging on longer runs. Cutting mileage back and reading up on <a href="https://www.runnersworld.com/health-injuries/a20812609/it-band-syndrome/" target="_blank" rel="noopener noreferrer">IT band syndrome recovery</a> before ramping back up.</p>',
  },
  {
    offsetDays: -33,
    text: "<p>Neck is finally loosening up after the fender bender. Checklist before calling it healed:</p><ol><li>Full range of motion turning to check blind spot</li><li>No tension headaches for a full week</li><li>Can sleep on either side without waking up stiff</li></ol>",
  },
];

export interface SeedInjury {
  bodyPart: string;
  injuryType: string;
  locationDetail?: string;
  description?: string;
  status: InjuryStatus;
  priority: InjuryPriority;
  createdDaysAgo: number;
  archivedDaysAgo?: number;
  remedies: SeedRemedy[];
  triggers: SeedTrigger[];
  logs: SeedLogEntry[];
}

export const SEED_INJURIES: SeedInjury[] = [
  // active, improving: frequent logs, declining pain, both remedy types
  {
    bodyPart: "Lower back",
    injuryType: "Strain",
    description:
      "Tweaked while deadlifting, worse when sitting for long periods.",
    status: "active",
    priority: "medium",
    createdDaysAgo: 42,
    remedies: [
      {
        key: "heat-pack",
        name: "Heat pack",
        type: "relief",
        category: "Lifestyle",
      },
      {
        key: "physio-exercises",
        name: "Physio stretches",
        description: "15 min routine, morning and evening",
        type: "longterm",
        category: "Mobility",
      },
    ],
    triggers: [
      {
        key: "sitting-long",
        name: "Sitting for long periods",
        description: "Especially without lumbar support",
      },
      {
        key: "deadlifting-heavy",
        name: "Deadlifting heavy without warming up",
      },
    ],
    logs: [
      {
        offsetDays: -40,
        atHour: 9,
        painLevel: 7,
        painFrequency: 80,
        remedyKeys: ["heat-pack"],
        triggerKeys: ["deadlifting-heavy"],
        notes: "Could barely stand up straight this morning.",
      },
      {
        offsetDays: -33,
        atHour: 9,
        painLevel: 6,
        painFrequency: 60,
        remedyKeys: ["heat-pack", "physio-exercises"],
        triggerKeys: ["sitting-long"],
      },
      {
        offsetDays: -26,
        atHour: 9,
        painLevel: 5,
        painFrequency: 60,
        remedyKeys: ["physio-exercises"],
        notes: "Started the stretch routine, feels a bit looser.",
      },
      {
        offsetDays: -19,
        atHour: 9,
        painLevel: 4,
        painFrequency: 40,
        remedyKeys: ["physio-exercises"],
      },
      {
        offsetDays: -12,
        atHour: 9,
        painLevel: 3,
        painFrequency: 40,
        remedyKeys: ["physio-exercises"],
      },
      {
        offsetDays: -5,
        atHour: 9,
        painLevel: 2,
        painFrequency: 20,
        remedyKeys: ["physio-exercises"],
        notes: "Almost back to normal.",
      },
    ],
  },
  // active, chronic, no remedies yet
  {
    bodyPart: "Elbow",
    injuryType: "Tennis elbow",
    locationDetail: "Right, Lateral",
    description: "Dull ache on the outside of the right elbow.",
    status: "active",
    priority: "high",
    createdDaysAgo: 60,
    remedies: [],
    triggers: [
      {
        key: "typing-gripping",
        name: "Typing / gripping tightly",
        description: "Flares up after long coding sessions",
      },
    ],
    logs: [
      { offsetDays: -50, atHour: 18, painLevel: 5, painFrequency: 60 },
      {
        offsetDays: -35,
        atHour: 18,
        painLevel: 5,
        painFrequency: 60,
        triggerKeys: ["typing-gripping"],
        notes: "About the same, still bothers me typing a lot.",
      },
      {
        offsetDays: -20,
        atHour: 18,
        painLevel: 6,
        painFrequency: 80,
        triggerKeys: ["typing-gripping"],
      },
      { offsetDays: -6, atHour: 18, painLevel: 5, painFrequency: 60 },
    ],
  },
  // monitoring, low intermittent pain, one relief remedy
  {
    bodyPart: "Knee",
    injuryType: "Twinge",
    locationDetail: "Left",
    description: "Sharp twinge on stairs, otherwise fine.",
    status: "monitoring",
    priority: "low",
    createdDaysAgo: 90,
    remedies: [
      {
        key: "knee-brace",
        name: "Knee brace",
        type: "relief",
        category: "Lifestyle",
      },
    ],
    triggers: [],
    logs: [
      {
        offsetDays: -80,
        atHour: 20,
        painLevel: 3,
        painFrequency: 20,
        remedyKeys: ["knee-brace"],
      },
      { offsetDays: -45, atHour: 20, painLevel: 2, painFrequency: 20 },
      {
        offsetDays: -10,
        atHour: 20,
        painLevel: 3,
        painFrequency: 20,
        remedyKeys: ["knee-brace"],
        notes: "Happened once going down stairs quickly.",
      },
    ],
  },
  // resolved, full history trending to zero
  {
    bodyPart: "Ankle",
    injuryType: "Sprain",
    locationDetail: "Left",
    description: "Rolled it stepping off a curb.",
    status: "resolved",
    priority: "low",
    createdDaysAgo: 35,
    remedies: [
      { key: "ice", name: "Ice pack", type: "relief", category: "Lifestyle" },
      {
        key: "ankle-mobility",
        name: "Ankle mobility exercises",
        type: "longterm",
        category: "Mobility",
      },
    ],
    triggers: [],
    logs: [
      {
        offsetDays: -34,
        atHour: 12,
        painLevel: 8,
        painFrequency: 100,
        remedyKeys: ["ice"],
        notes: "Pretty swollen, kept it elevated.",
      },
      {
        offsetDays: -30,
        atHour: 12,
        painLevel: 6,
        painFrequency: 80,
        remedyKeys: ["ice", "ankle-mobility"],
      },
      {
        offsetDays: -24,
        atHour: 12,
        painLevel: 4,
        painFrequency: 60,
        remedyKeys: ["ankle-mobility"],
      },
      {
        offsetDays: -17,
        atHour: 12,
        painLevel: 2,
        painFrequency: 40,
        remedyKeys: ["ankle-mobility"],
      },
      {
        offsetDays: -10,
        atHour: 12,
        painLevel: 1,
        painFrequency: 20,
        remedyKeys: ["ankle-mobility"],
      },
      {
        offsetDays: -3,
        atHour: 12,
        painLevel: 0,
        painFrequency: 0,
        notes: "Fully healed, back to running.",
      },
    ],
  },
  // newly created, no logs yet (empty state)
  {
    bodyPart: "Deltoid",
    injuryType: "Tightness",
    locationDetail: "Right, Posterior",
    description: "Noticed some tightness after a heavy lifting session.",
    status: "active",
    priority: "urgent",
    createdDaysAgo: 0,
    remedies: [],
    triggers: [],
    logs: [],
  },
  // archived
  {
    bodyPart: "Wrist",
    injuryType: "Strain",
    locationDetail: "Right",
    description: "From a fall a while back, fully healed.",
    status: "resolved",
    priority: "low",
    createdDaysAgo: 400,
    archivedDaysAgo: 300,
    remedies: [{ key: "wrist-brace", name: "Wrist brace", type: "relief" }],
    triggers: [],
    logs: [
      {
        offsetDays: -395,
        atHour: 10,
        painLevel: 6,
        painFrequency: 60,
        remedyKeys: ["wrist-brace"],
      },
      { offsetDays: -370, atHour: 10, painLevel: 2, painFrequency: 20 },
      {
        offsetDays: -310,
        atHour: 10,
        painLevel: 0,
        painFrequency: 0,
        notes: "Long healed, archiving this.",
      },
    ],
  },
  // active, chronic overuse injury, gradually improving with strengthening work
  {
    bodyPart: "Shoulder",
    injuryType: "Rotator cuff strain",
    locationDetail: "Right",
    description:
      "Aches with overhead motion, likely from bench pressing too heavy without warming up.",
    status: "active",
    priority: "medium",
    createdDaysAgo: 50,
    remedies: [
      {
        key: "shoulder-ice",
        name: "Ice pack",
        type: "relief",
        category: "Lifestyle",
      },
      {
        key: "rotator-cuff-exercises",
        name: "Rotator cuff strengthening",
        description: "Band external rotations, 3x15 each side",
        type: "longterm",
        category: "Strengthening",
      },
    ],
    triggers: [
      {
        key: "overhead-reaching",
        name: "Reaching overhead",
        description: "Especially lifting something off a high shelf",
        category: "Overuse",
      },
      {
        key: "bench-press-heavy",
        name: "Bench pressing heavy without warming up",
        category: "Overuse",
      },
    ],
    logs: [
      {
        offsetDays: -48,
        atHour: 17,
        painLevel: 8,
        painFrequency: 80,
        remedyKeys: ["shoulder-ice"],
        triggerKeys: ["bench-press-heavy"],
        notes: "Felt a sharp pull mid-set, stopped the workout early.",
      },
      {
        offsetDays: -41,
        atHour: 17,
        painLevel: 7,
        painFrequency: 60,
        remedyKeys: ["shoulder-ice"],
        triggerKeys: ["overhead-reaching"],
      },
      {
        offsetDays: -34,
        atHour: 17,
        painLevel: 6,
        painFrequency: 60,
        remedyKeys: ["rotator-cuff-exercises"],
        notes: "Started the band exercises physio recommended.",
      },
      {
        offsetDays: -27,
        atHour: 17,
        painLevel: 5,
        painFrequency: 40,
        remedyKeys: ["rotator-cuff-exercises"],
        triggerKeys: ["overhead-reaching"],
      },
      {
        offsetDays: -18,
        atHour: 17,
        painLevel: 4,
        painFrequency: 40,
        remedyKeys: ["rotator-cuff-exercises"],
      },
      {
        offsetDays: -9,
        atHour: 17,
        painLevel: 3,
        painFrequency: 20,
        remedyKeys: ["rotator-cuff-exercises"],
      },
      {
        offsetDays: -4,
        atHour: 17,
        painLevel: 2,
        painFrequency: 20,
        notes: "Back to light overhead press without pain.",
      },
    ],
  },
  // monitoring, low intermittent pain tied to mileage
  {
    bodyPart: "Hip",
    injuryType: "IT band syndrome",
    locationDetail: "Left, Lateral",
    description:
      "Tightness along the outside of the hip that flares up on longer runs.",
    status: "monitoring",
    priority: "low",
    createdDaysAgo: 70,
    remedies: [
      {
        key: "foam-roller",
        name: "Foam rolling",
        type: "relief",
        category: "Lifestyle",
      },
      {
        key: "hip-strengthening",
        name: "Hip abductor strengthening",
        description: "Clamshells and side-lying leg raises, 3x15",
        type: "longterm",
        category: "Strengthening",
      },
    ],
    triggers: [
      {
        key: "running-long-distance",
        name: "Running past 5 miles",
        category: "Overuse",
      },
      {
        key: "tight-hips",
        name: "Sitting with poor posture",
        category: "Posture",
      },
    ],
    logs: [
      {
        offsetDays: -65,
        atHour: 19,
        painLevel: 5,
        painFrequency: 40,
        remedyKeys: ["foam-roller"],
        triggerKeys: ["running-long-distance"],
        notes: "Flared up on an 8 mile run, had to walk the last stretch.",
      },
      {
        offsetDays: -52,
        atHour: 19,
        painLevel: 4,
        painFrequency: 40,
        remedyKeys: ["foam-roller", "hip-strengthening"],
        triggerKeys: ["tight-hips"],
      },
      {
        offsetDays: -38,
        atHour: 19,
        painLevel: 3,
        painFrequency: 20,
        remedyKeys: ["hip-strengthening"],
      },
      {
        offsetDays: -24,
        atHour: 19,
        painLevel: 3,
        painFrequency: 20,
        remedyKeys: ["hip-strengthening"],
        triggerKeys: ["running-long-distance"],
        notes: "Held up fine through a 6 mile run this time.",
      },
      {
        offsetDays: -5,
        atHour: 19,
        painLevel: 2,
        painFrequency: 20,
        remedyKeys: ["hip-strengthening"],
      },
    ],
  },
  // resolved, full month+ history trending to zero
  {
    bodyPart: "Neck",
    injuryType: "Whiplash",
    description: "Stiffness and tension headaches after a minor fender bender.",
    status: "resolved",
    priority: "low",
    createdDaysAgo: 45,
    remedies: [
      {
        key: "heat-pack-neck",
        name: "Heat pack",
        type: "relief",
        category: "Lifestyle",
      },
      {
        key: "neck-mobility",
        name: "Neck mobility exercises",
        description: "Gentle range-of-motion drills, twice daily",
        type: "longterm",
        category: "Mobility",
      },
    ],
    triggers: [
      {
        key: "looking-down-at-phone",
        name: "Looking down at phone for long periods",
        category: "Posture",
      },
    ],
    logs: [
      {
        offsetDays: -44,
        atHour: 8,
        painLevel: 7,
        painFrequency: 80,
        remedyKeys: ["heat-pack-neck"],
        notes:
          "Very stiff the morning after, hard to check blind spots driving.",
      },
      {
        offsetDays: -37,
        atHour: 8,
        painLevel: 6,
        painFrequency: 60,
        remedyKeys: ["heat-pack-neck", "neck-mobility"],
        triggerKeys: ["looking-down-at-phone"],
      },
      {
        offsetDays: -29,
        atHour: 8,
        painLevel: 4,
        painFrequency: 40,
        remedyKeys: ["neck-mobility"],
      },
      {
        offsetDays: -20,
        atHour: 8,
        painLevel: 2,
        painFrequency: 20,
        remedyKeys: ["neck-mobility"],
        triggerKeys: ["looking-down-at-phone"],
      },
      {
        offsetDays: -10,
        atHour: 8,
        painLevel: 1,
        painFrequency: 20,
        remedyKeys: ["neck-mobility"],
      },
      {
        offsetDays: -3,
        atHour: 8,
        painLevel: 0,
        painFrequency: 0,
        notes: "Full range of motion back, calling this resolved.",
      },
    ],
  },
];
