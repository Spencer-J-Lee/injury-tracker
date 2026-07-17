import type {
  RemedyCategory,
  TriggerCategory,
  InjuryPriority,
  InjuryStatus,
} from "@/types/models";

export interface SeedRemedy {
  key: string;
  name: string;
  description?: string;
  providesImmediateRelief: boolean;
  category?: RemedyCategory;
  archivedDaysAgo?: number;
}

export interface SeedTrigger {
  key: string;
  name: string;
  description?: string;
  category?: TriggerCategory;
  archivedDaysAgo?: number;
}

export interface SeedLogEntry {
  offsetDays: number;
  atHour?: number;
  atMinute?: number;
  painLevel?: number;
  painFrequency?: number;
  remedyKeys?: string[];
  triggerKeys?: string[];
  notes?: string; // rendered as HTML via RichTextContent
}

export interface SeedJournalEntry {
  offsetDays: number;
  text: string;
}

export const SEED_JOURNAL_ENTRIES: SeedJournalEntry[] = [
  {
    offsetDays: 0,
    text: "<p>Today, I will focus on these things:</p><ul><li><p>Take a break every 2 games instead of playing straight through.</p></li><li><p>Do the recovery routine before opening the laptop, not after.</p></li><li><p>Try the wall pull stretch at a shallower angle so it doesn't strain the shoulder.</p></li></ul>",
  },
  {
    offsetDays: -1,
    text: "<p>Long stretch of controller use today led to a noticeable uptick in thumb and flexor pain by the evening. The sitting setup on the bed helped bring it back down within 10-15 minutes each time, but I should figure out a way to catch it earlier before it builds up.</p>",
  },
  {
    offsetDays: -2,
    text: "<p>Today, I will focus on these things:</p><ul><li><p>Only game with breaks built in, not solo marathon sessions.</p></li><li><p>Refrain from coding until the recovery stretches and strengthening work are done.</p></li></ul>",
  },
  {
    offsetDays: -4,
    text: "<p>Spent a lot of time stretching this morning (~1.5 hrs), which was mentally tiring by the end, but it seemed to pay off — pain levels and frequency stayed low for the rest of the day even with long stretches at the computer.</p><p>The biggest unknown right now is getting the ankles further along before the trip in October.</p>",
  },
  {
    offsetDays: -6,
    text: "<p>Noticing a pattern: the ulnar nerve symptoms consistently flare during driving, especially longer drives, but calm down quickly once I lean back more in the seat. Going to keep testing that adjustment before assuming it's fully explained.</p>",
  },
  {
    offsetDays: -9,
    text: '<p>Watched <a href="https://www.youtube.com/results?search_query=habit+change+awareness" target="_blank" rel="noopener noreferrer">a video</a> on building awareness around habits that make pain worse — the idea is to notice the moment before, during, and after an activity rather than just powering through it. Trying to apply that to catching flare-ups earlier instead of only noticing once it&rsquo;s already bad.</p>',
  },
  {
    offsetDays: -13,
    text: "<p>Been thinking about what I actually need to make progress here. Three things stand out:</p><ol><li><p>A reliable way to tell which exercises are actually helping long-term versus just masking things temporarily.</p></li><li><p>Setting up my routine so I actually do the exercises consistently instead of it feeling like a chore I skip.</p></li><li><p>Managing the frustration that comes with slow progress so it doesn't turn into overdoing things out of impatience.</p></li></ol>",
  },
  {
    offsetDays: -17,
    text: "<p>Rough day — long computer session left the forearm, trapezius, and ulnar nerve all more irritated than usual. Massage and stretching helped bring things down but it took longer than usual tonight.</p>",
  },
  {
    offsetDays: -22,
    text: "<p>Feeling more optimistic about the ankles. Frequency has been dropping steadily since starting the banded dorsiflexion work and sleeping with the brace on. Driving specifically seems to bother it less than it used to.</p>",
  },
  {
    offsetDays: -28,
    text: '<p>Found a good <a href="https://www.hopkinsmedicine.org/health/conditions-and-diseases/tennis-elbow" target="_blank" rel="noopener noreferrer">article on overuse injuries and tendon loading</a> — the gist is that some controlled loading (not just rest) is what actually builds tendon resilience over time. Matches what the strengthening exercises seem to be doing for the thumb and forearm.</p>',
  },
  {
    offsetDays: -35,
    text: "<p>Trying to get better at logging the small stuff — a lot of the pain patterns only became obvious once I started writing down what I was doing right before a flare-up (prolonged computer use, phone scrolling, laptop on the lap) instead of just the pain itself.</p>",
  },
  {
    offsetDays: -41,
    text: "<p>Good session with the physical therapist today. Nerve glides look correct, and we adjusted the reps on the resistance band dorsiflexion since I was probably overdoing volume the first couple weeks.</p>",
  },
  {
    offsetDays: -50,
    text: "<p>Realizing most of these issues cluster around the same root causes: long unbroken stretches at the computer, gripping a controller too long, and not paying attention to posture until something already hurts. Going to try building in short breaks proactively instead of reactively.</p>",
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
  // active, chronic RSI, computer/phone driven, dull constant pain trending down
  {
    bodyPart: "Forearm Flexors",
    injuryType: "RSI",
    locationDetail: "Right",
    description:
      "Comes and goes over the years from overuse — these days mostly driven by computer and phone use. When present it's typically constant and dull, and seems tied to tight chest muscles too.",
    status: "active",
    priority: "medium",
    createdDaysAgo: 50,
    remedies: [
      {
        key: "massage-stretch-chest",
        name: "Massage & stretch: chest",
        description:
          "Massage gun, then wall/bed stretch. Pin and stretch when it's really tight.",
        providesImmediateRelief: true,
        category: "Mobility",
      },
      {
        key: "massage-stretch-flexors-extensors",
        name: "Massage & stretch: flexors & extensors",
        description: "Massage gun, then flexors & extensors stretch.",
        providesImmediateRelief: false,
        category: "Mobility",
      },
      {
        key: "wrist-curls",
        name: "Wrist curls",
        description:
          "Strengthens the flexors directly to help prevent tightness and pain.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
      {
        key: "reverse-wrist-curls",
        name: "Reverse wrist curls",
        description: "Strengthens the extensors to offload the flexors.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
      {
        key: "brace-rest",
        name: "Brace & rest",
        description:
          "Wearing a brace and avoiding palm muscle use to bring frequency down over a few days.",
        providesImmediateRelief: false,
        category: "Rest",
        archivedDaysAgo: 8,
      },
    ],
    triggers: [
      {
        key: "prolonged-computer-usage",
        name: "Prolonged computer usage",
        description: "30 to 50+ min of continuous use.",
        category: "Overuse",
      },
      {
        key: "phone-usage",
        name: "Phone usage",
        description: "3 to 5+ min of continuous use.",
        category: "Overuse",
      },
    ],
    logs: [
      {
        offsetDays: -48,
        atHour: 21,
        painLevel: 2,
        painFrequency: 30,
        remedyKeys: ["brace-rest"],
        triggerKeys: ["prolonged-computer-usage"],
      },
      {
        offsetDays: -42,
        atHour: 0,
        painLevel: 3,
        painFrequency: 35,
        remedyKeys: [
          "massage-stretch-flexors-extensors",
          "massage-stretch-chest",
        ],
        triggerKeys: ["prolonged-computer-usage"],
        notes:
          "<p>Two separate long sessions at the computer led to consistent, dull pain. Massage and stretching out the chest helped reduce intensity, but it lingered most of the evening.</p>",
      },
      {
        offsetDays: -35,
        atHour: 19,
        painLevel: 1,
        painFrequency: 15,
        remedyKeys: [
          "massage-stretch-flexors-extensors",
          "massage-stretch-chest",
        ],
        triggerKeys: ["prolonged-computer-usage"],
        notes:
          "<p>Extended gaming session for about an hour without breaks brought on minor dull pain. Otherwise felt okay most of the day.</p>",
      },
      {
        offsetDays: -26,
        atHour: 5,
        painLevel: 1,
        painFrequency: 20,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>Less computer time today since I was out most of the day.</p>",
      },
      {
        offsetDays: -18,
        atHour: 0,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: ["wrist-curls", "reverse-wrist-curls"],
        triggerKeys: [],
        notes:
          "<p>Started the wrist curl work on both sides. Hoping strengthening the extensors takes some of the load off the flexors long-term.</p>",
      },
      {
        offsetDays: -9,
        atHour: 1,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: [
          "massage-stretch-chest",
          "massage-stretch-flexors-extensors",
        ],
        triggerKeys: ["prolonged-computer-usage"],
        notes:
          "<p>Didn't notice it much today, maybe a little tightness/discomfort. Played about an hour of games with no pain yet.</p>",
      },
      {
        offsetDays: -1,
        atHour: 17,
        painLevel: 2,
        painFrequency: 10,
        remedyKeys: [
          "massage-stretch-chest",
          "massage-stretch-flexors-extensors",
          "brace-rest",
        ],
        triggerKeys: [],
      },
    ],
  },
  // active, urgent, overuse from a burst of new activity, improving with brace + strengthening
  {
    bodyPart: "Ankles",
    injuryType: "Likely RSI",
    locationDetail: "Bilateral, Anteromedial",
    description:
      "Initially hurt it doing bodyweight squats, though the real cause is probably too much volume over a few weeks — new walking habit, swimming, and squats every other day all stacked up at once.",
    status: "active",
    priority: "urgent",
    createdDaysAgo: 45,
    remedies: [
      {
        key: "resistance-banded-dorsiflexion",
        name: "Resistance banded dorsiflexion",
        description:
          "Strengthens the anterior tibialis, the muscle attached to the tendon where the pain is felt.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
      {
        key: "brace-before-bed",
        name: "Brace before bed",
        description:
          "Strapping on an ankle brace helps a lot with preventing pain first thing in the morning and likely prevents overnight strain.",
        providesImmediateRelief: false,
        category: "Lifestyle",
      },
      {
        key: "stretching-circuit-lower-body",
        name: "Stretching circuit: lower body",
        description:
          "Massage gun/stick on calves, anterior tib, quads, groin, then heel pulls (straight and bent), supine quad stretch, sitting cossack squat.",
        providesImmediateRelief: false,
        category: "Mobility",
      },
    ],
    triggers: [],
    logs: [
      {
        offsetDays: -43,
        atHour: 5,
        painLevel: 2,
        painFrequency: 50,
        remedyKeys: [],
        triggerKeys: [],
      },
      {
        offsetDays: -40,
        atHour: 5,
        painLevel: 2,
        painFrequency: 80,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>Out since mid-morning and did a lot of walking today. The ankle pain seems much more frequent walking outside compared to inside the house — not sure if that's the continuous volume or something about the surface. Should pay attention to this next time.</p><p>Increase in frequency may also be from doing squats this morning.</p>",
      },
      {
        offsetDays: -33,
        atHour: 19,
        painLevel: 2,
        painFrequency: 20,
        remedyKeys: ["stretching-circuit-lower-body"],
        triggerKeys: [],
        notes:
          "<p>An extensive massage and stretching circuit for the calves, quads, and groin this morning helped reduce frequency significantly. Worth doing every morning, even a shortened version on busy days.</p>",
      },
      {
        offsetDays: -26,
        atHour: 5,
        painLevel: 2,
        painFrequency: 10,
        remedyKeys: ["stretching-circuit-lower-body"],
        triggerKeys: [],
        notes:
          "<p>Some achy pain throughout the day but might be better than yesterday, hard to say for sure. Continuing the resistance banded dorsiflexion for a couple more weeks.</p><p>Did get sharper pain (3-4 intensity) walking uphill in the neighborhood. Should note things like that on my phone as they happen instead of trying to remember later.</p>",
      },
      {
        offsetDays: -19,
        atHour: 1,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: [
          "resistance-banded-dorsiflexion",
          "brace-before-bed",
          "stretching-circuit-lower-body",
        ],
        triggerKeys: [],
        notes:
          "<p>Feeling pretty good so far — pain is happening much less frequently and comes in short bursts rather than constant. The brace is helping a lot, and the banded dorsiflexion seems to be working out too. Maybe I was just doing too much volume before. It's hurting less frequently while driving now too, which is a good sign.</p>",
      },
      {
        offsetDays: -12,
        atHour: 0,
        painLevel: 1,
        painFrequency: 10,
        remedyKeys: ["stretching-circuit-lower-body", "brace-before-bed"],
        triggerKeys: [],
        notes:
          "<p>Feeling fairly good overall. Some tightness/discomfort walking outside today (5-10 min on flat ground), but seems to be trending better over time. Did feel some moments of strain on the front-outer part of both ankles — might just be transient but noting it.</p>",
      },
      {
        offsetDays: -3,
        atHour: 17,
        painLevel: 1,
        painFrequency: 10,
        remedyKeys: [
          "stretching-circuit-lower-body",
          "brace-before-bed",
          "resistance-banded-dorsiflexion",
        ],
        triggerKeys: [],
      },
    ],
  },
  // resolved, short history, no clear cause, resolved on its own
  {
    bodyPart: "Lumbricals",
    injuryType: "RSI(?)",
    locationDetail: "Between back of 4th & 5th",
    description:
      "Not sure what caused this, but pain tended to be dull and constant when present.",
    status: "resolved",
    priority: "low",
    createdDaysAgo: 60,
    remedies: [
      {
        key: "cross-fiber-massage-elbow",
        name: "Cross-fiber massage: elbow",
        description:
          "Gave immediate relief to persisting pain during the work day.",
        providesImmediateRelief: true,
        category: "Mobility",
      },
    ],
    triggers: [
      {
        key: "carrying-heavy-dumbbells",
        name: "Carrying heavy dumbbells",
        description: "Around 15 lbs.",
      },
    ],
    logs: [
      {
        offsetDays: -60,
        atHour: 3,
        painLevel: 0,
        painFrequency: 0,
        remedyKeys: [],
        triggerKeys: [],
      },
      {
        offsetDays: -49,
        atHour: 5,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: [],
        triggerKeys: ["carrying-heavy-dumbbells"],
        notes:
          "<p>Felt slight irritation lifting heavier weights (15 lbs) for dumbbell bench press but it went away fairly quickly. Not worth being concerned about but will keep monitoring.</p>",
      },
      {
        offsetDays: -46,
        atHour: 19,
        painLevel: 0,
        painFrequency: 0,
        remedyKeys: [],
        triggerKeys: [],
      },
      {
        offsetDays: -30,
        atHour: 19,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: ["cross-fiber-massage-elbow"],
        triggerKeys: [],
      },
      {
        offsetDays: -14,
        atHour: 19,
        painLevel: 0,
        painFrequency: 0,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>Hasn't come back in a couple of weeks. Calling this resolved for now.</p>",
      },
    ],
  },
  // monitoring, low priority, tied to a specific movement pattern
  {
    bodyPart: "Intercostals/Abdominals",
    injuryType: "RSI",
    locationDetail: "Bilateral",
    description:
      "Originally strained years ago during rock climbing. Likely aggravated over the years by repeatedly twisting the torso.",
    status: "monitoring",
    priority: "low",
    createdDaysAgo: 55,
    remedies: [
      {
        key: "upper-circle-crunch",
        name: "Upper circle crunch",
        description: "Targets the upper abs and obliques.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
      {
        key: "leg-raises",
        name: "Leg raises",
        description: "Targets the lower abs.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
    ],
    triggers: [
      {
        key: "trunk-flexion-supine",
        name: "Trunk flexion from supine position",
        description:
          "Tends to hurt coming up from lying on the back with a crunch-type movement.",
      },
    ],
    logs: [
      {
        offsetDays: -55,
        atHour: 2,
        painLevel: 0,
        painFrequency: 0,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>Muscles are in good condition for everyday activities. Likely not ready for strenuous sports yet, so worth being careful ramping back up.</p>",
      },
      {
        offsetDays: -52,
        atHour: 5,
        painLevel: 2,
        painFrequency: 5,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>Felt it during a back-extension stretch on the foam roller while trying to open up the chest and lats. Went away quickly once I stopped, but good to know this motion/position triggers it.</p>",
      },
      {
        offsetDays: -47,
        atHour: 6,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>Felt a little bit at some point today, can't remember exactly when — maybe during face pulls with the lighter band.</p>",
      },
      {
        offsetDays: -40,
        atHour: 6,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>Some strain on one side whenever I extend the back a lot, like lying back on the foam roller.</p>",
      },
      {
        offsetDays: -1,
        atHour: 17,
        painLevel: 0,
        painFrequency: 0,
        remedyKeys: ["upper-circle-crunch", "leg-raises"],
        triggerKeys: ["trunk-flexion-supine"],
        notes:
          "<p>Added dedicated ab strengthening this week to see if building up the surrounding muscles reduces how often this gets irritated by everyday twisting.</p>",
      },
    ],
  },
  // active, high priority, gaming/controller driven, remedies split relief vs longterm
  {
    bodyPart: "Thumb Muscles",
    injuryType: "RSI",
    locationDetail: "Right",
    description:
      "Caused by overuse of a gaming controller. When present it tends to be dull and constant, typically resolved by resting and gently massaging the thumb muscles.",
    status: "active",
    priority: "high",
    createdDaysAgo: 40,
    remedies: [
      {
        key: "sit-in-bed",
        name: "Sit in bed",
        description: "Proper sitting setup and a short screen break.",
        providesImmediateRelief: true,
        category: "Rest",
      },
      {
        key: "sitting-setup-bed",
        name: "Sitting setup: bed",
        description:
          "Soft pillow for the neck, another pillow to lay the arms in front.",
        providesImmediateRelief: false,
        category: "Lifestyle",
      },
      {
        key: "3-point-pinch",
        name: "3-point pinch",
        description: "Strengthens the thenar muscles to help prevent pain.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
      {
        key: "massage-stretch-thenar",
        name: "Massage & stretch: thenar, flexors, & extensors",
        description:
          "Massage gun with ball attachment, then flexors and extensors stretch.",
        providesImmediateRelief: true,
        category: "Mobility",
      },
    ],
    triggers: [
      {
        key: "prolonged-controller-usage",
        name: "Prolonged game controller usage",
        description: "30+ min of continuous use.",
        category: "Overuse",
      },
      {
        key: "driving",
        name: "Driving",
        description: "The longer the drive, the worse it tends to feel.",
        category: "Activity",
      },
      {
        key: "phone-usage",
        name: "Phone usage",
        description: "Continuous use 10+ min.",
        category: "Overuse",
      },
    ],
    logs: [
      {
        offsetDays: -39,
        atHour: 5,
        painLevel: 3,
        painFrequency: 75,
        remedyKeys: [],
        triggerKeys: ["phone-usage", "driving"],
      },
      {
        offsetDays: -35,
        atHour: 5,
        painLevel: 2,
        painFrequency: 20,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>Out and about since mid-morning so the drop in frequency is likely from avoiding computer and phone use.</p>",
      },
      {
        offsetDays: -29,
        atHour: 19,
        painLevel: 1,
        painFrequency: 15,
        remedyKeys: [],
        triggerKeys: [],
        notes:
          "<p>About an hour of gaming in the afternoon triggered minor pain. Played more later since I was feeling frustrated. It comes on after about 2 sessions, and the massage gun + stretch combo works really well for relieving it.</p>",
      },
      {
        offsetDays: -22,
        atHour: 20,
        painLevel: 2,
        painFrequency: 25,
        remedyKeys: ["massage-stretch-thenar"],
        triggerKeys: ["prolonged-controller-usage"],
        notes:
          "<p>About 1.5 hours of gaming in the afternoon triggered the pain. Played more later in the day since I was stressed and frustrated — pain definitely happens more when I use my mouse more throughout the day too.</p>",
      },
      {
        offsetDays: -8,
        atHour: 5,
        painLevel: 2,
        painFrequency: 35,
        remedyKeys: ["massage-stretch-thenar", "3-point-pinch", "sit-in-bed"],
        triggerKeys: ["phone-usage", "driving", "prolonged-controller-usage"],
        notes:
          "<p>Felt this a lot today from a mix of driving, phone, and computer use. Need a consistent way to take breaks between activities that cause pain — maybe having a specific low-effort thing to do instead so the break actually happens.</p>",
      },
      {
        offsetDays: -3,
        atHour: 17,
        painLevel: 2,
        painFrequency: 15,
        remedyKeys: ["massage-stretch-thenar"],
        triggerKeys: [],
      },
      {
        offsetDays: 0,
        atHour: 17,
        painLevel: 2,
        painFrequency: 15,
        remedyKeys: ["massage-stretch-thenar"],
        triggerKeys: [],
      },
    ],
  },
  // active, high priority, nerve irritation tied to forearm position, most remedies/triggers
  {
    bodyPart: "Ulnar Nerve",
    injuryType: "Irritation(?)",
    locationDetail: "Left",
    description:
      "Don't remember the initial cause but it's been around for most of the last few months. Tends to flare up the more the forearm stays pronated.",
    status: "active",
    priority: "high",
    createdDaysAgo: 60,
    remedies: [
      {
        key: "massage-stretch-chest",
        name: "Massage & stretch: chest",
        description:
          "Massage gun, then lying foam roller chest stretch at different angles.",
        providesImmediateRelief: true,
        category: "Mobility",
      },
      {
        key: "sitting-setup-computer",
        name: "Sitting setup: computer",
        description:
          "Chair lean level 2, pillow for back and neck support, adjust arm rest to relieve elbow pressure.",
        providesImmediateRelief: true,
        category: "Lifestyle",
      },
      {
        key: "sitting-setup-car",
        name: "Sitting setup: car",
        description: "Tends to feel better leaning back more.",
        providesImmediateRelief: false,
        category: "Lifestyle",
      },
      {
        key: "nerve-glides",
        name: "Nerve glides",
        description:
          "Lying back on a foam roller, arms out to the side: 15 reps pronation & supination, 15 reps flexion & extension.",
        providesImmediateRelief: false,
        category: "Mobility",
      },
      {
        key: "foam-roller-chest-routine",
        name: "Foam roller routine: chest",
        description:
          "Supine on foam roller, arms out to the side holding different positions, ceiling punches x10, thumbs-down alternating arm raises.",
        providesImmediateRelief: false,
        category: "Mobility",
      },
      {
        key: "massage-stretch-back-neck",
        name: "Massage & stretch: back & neck",
        description:
          "Massage gun on spine, peanut ball on neck, wall pull stretch, suboccipital stretch.",
        providesImmediateRelief: true,
        category: "Mobility",
      },
      {
        key: "lie-down-do-nothing",
        name: "Lie down & do nothing",
        description: "When nothing else works.",
        providesImmediateRelief: true,
        category: "Rest",
      },
      {
        key: "dumbbell-bent-over-rows",
        name: "Dumbbell bent-over rows",
        description:
          "Strengthens and helps prevent tightness in the lats, which correlate heavily with the pain.",
        providesImmediateRelief: false,
        category: "Strengthening",
        archivedDaysAgo: 6,
      },
      {
        key: "chest-press",
        name: "Chest press",
        description:
          "Improves posture and decreases tightness in chest muscles that seem correlated with symptoms.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
    ],
    triggers: [
      {
        key: "coding-first-thing-morning",
        name: "Coding first thing in the morning",
        description:
          "Leads to staying at the computer long enough to cause stubborn tightness that's much harder to shake.",
        category: "Activity",
      },
      {
        key: "prolonged-computer-usage",
        name: "Prolonged computer usage",
        description: "30 to 50+ min of continuous use.",
        category: "Overuse",
      },
      {
        key: "driving",
        name: "Driving",
        description: "Consistently brings on numbness.",
        category: "Activity",
      },
      {
        key: "using-laptop-on-lap",
        name: "Using laptop on lap",
        category: "Activity",
      },
    ],
    logs: [
      {
        offsetDays: -59,
        atHour: 21,
        painLevel: 2,
        painFrequency: 35,
        remedyKeys: ["sitting-setup-computer", "massage-stretch-back-neck"],
        triggerKeys: ["coding-first-thing-morning", "prolonged-computer-usage"],
      },
      {
        offsetDays: -52,
        atHour: 19,
        painLevel: 2,
        painFrequency: 15,
        remedyKeys: [
          "sitting-setup-computer",
          "massage-stretch-back-neck",
          "lie-down-do-nothing",
        ],
        triggerKeys: ["using-laptop-on-lap"],
        notes:
          "<p>Started feeling it during a long morning stretching session, not entirely sure what caused it. I should keep tabs on it next time to trace down the cause — it came back once I started typing, which adds to the evidence it's aggravated by a pronated forearm position.</p><p>Started feeling better as I did some chores that used a variety of hand motions. Setting up the computer chair properly definitely helps a lot too.</p>",
      },
      {
        offsetDays: -47,
        atHour: 19,
        painLevel: 2,
        painFrequency: 10,
        remedyKeys: [
          "sitting-setup-computer",
          "massage-stretch-chest",
          "massage-stretch-back-neck",
        ],
        triggerKeys: ["using-laptop-on-lap"],
        notes:
          "<p>Practically no numbness during a 1-1.5 hour stretching session in the morning, but felt it soon after sitting on the bed watching videos on my phone. Not entirely sure why — held off on the strengthening work since carrying weight would aggravate it while already numb.</p><p>Using the proper sitting setup got rid of the numbness during a gaming session within minutes — a really reliable way to settle it down.</p>",
      },
      {
        offsetDays: -34,
        atHour: 1,
        painLevel: 3,
        painFrequency: 35,
        remedyKeys: ["massage-stretch-chest", "massage-stretch-back-neck"],
        triggerKeys: ["prolonged-computer-usage"],
        notes:
          "<p>Two separate long sessions at the computer led to consistent, dull pain. Massage and stretching helped reduce intensity, but it's still persisting after about an hour.</p><p>Too much screen time made it last most of the night, though at least the intensity was lower after the massage and stretching.</p>",
      },
      {
        offsetDays: -26,
        atHour: 5,
        painLevel: 2,
        painFrequency: 10,
        remedyKeys: [
          "massage-stretch-back-neck",
          "foam-roller-chest-routine",
          "sitting-setup-computer",
        ],
        triggerKeys: [],
        notes:
          "<p>Been feeling much better on average. The sitting setup for both the computer and car have been pivotal to the reduction in frequency.</p><p>Started doing the nerve glides when I'm not feeling numbness — seems okay so far but will keep an eye on how they affect symptoms.</p>",
      },
      {
        offsetDays: -20,
        atHour: 1,
        painLevel: 1,
        painFrequency: 10,
        remedyKeys: [
          "sitting-setup-car",
          "sitting-setup-computer",
          "massage-stretch-back-neck",
          "foam-roller-chest-routine",
        ],
        triggerKeys: ["using-laptop-on-lap", "prolonged-computer-usage"],
        notes:
          "<p>This has been feeling better overall too. It's still getting aggravated by driving specifically and comes on fairly quickly — there's got to be something about the seat position. The good news is the intensity feels much lower these days.</p>",
      },
      {
        offsetDays: -6,
        atHour: 0,
        painLevel: 1,
        painFrequency: 20,
        remedyKeys: [
          "sitting-setup-car",
          "sitting-setup-computer",
          "massage-stretch-back-neck",
          "foam-roller-chest-routine",
          "chest-press",
        ],
        triggerKeys: ["driving", "coding-first-thing-morning"],
        notes:
          "<p>Felt this more today compared to yesterday, probably because the left back and neck felt tighter than usual. Massaging and stretching helped after a few minutes.</p><p>Noticed some minor numbness spreading to other fingers too — might not be worth worrying about, but noting it just in case.</p>",
      },
      {
        offsetDays: 0,
        atHour: 17,
        painLevel: 2,
        painFrequency: 50,
        remedyKeys: [
          "massage-stretch-back-neck",
          "sitting-setup-computer",
          "foam-roller-chest-routine",
          "chest-press",
        ],
        triggerKeys: [],
        notes:
          "<p>Noticed this tends to get triggered specifically by the foam roller routine for loosening the chest muscles — need to watch the angle on that.</p>",
      },
    ],
  },
  // active, medium priority, tied to lat/trap tightness and posture, longest running
  {
    bodyPart: "Trapezius",
    injuryType: "RSI(?)",
    locationDetail: "Left, Mid",
    description:
      "Had this on and off for years, heavily tied to prolonged computer use and seems correlated with tight lats.",
    status: "active",
    priority: "medium",
    createdDaysAgo: 35,
    remedies: [
      {
        key: "stretch-wall-pull",
        name: "Stretch: wall pull",
        description:
          "Arm high, hips back, spine twisted away, torso bent away.",
        providesImmediateRelief: false,
        category: "Mobility",
      },
      {
        key: "stretch-crossbody-wall-pull",
        name: "Stretch: crossbody wall pull",
        description: "Arm across the body, torso curls forward.",
        providesImmediateRelief: false,
        category: "Mobility",
      },
      {
        key: "massage-stretch-rhomboids-traps",
        name: "Massage & stretch: rhomboids/traps",
        description: "Massage gun, then crossbody wall stretch.",
        providesImmediateRelief: true,
        category: "Mobility",
      },
      {
        key: "massage-stretch-left-lats",
        name: "Massage & stretch: left lats",
        description: "Soft/hard foam roll, then wall pull stretch.",
        providesImmediateRelief: true,
        category: "Mobility",
      },
      {
        key: "sitting-setup-computer-2",
        name: "Sitting setup: computer",
        description:
          "Chair lean level 2, pillow for back and neck support to avoid overworking the neck in extension.",
        providesImmediateRelief: false,
        category: "Lifestyle",
      },
      {
        key: "dumbbell-bent-over-rows-2",
        name: "Dumbbell bent-over rows",
        description:
          "Strengthens and helps prevent tightness in the lats, which correlate heavily with the pain.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
      {
        key: "face-pulls",
        name: "Face pulls",
        description:
          "Strengthens the postural muscles and prevents tightness in the rhomboids, which correlate heavily with the pain.",
        providesImmediateRelief: false,
        category: "Strengthening",
      },
    ],
    triggers: [
      {
        key: "prolonged-computer-usage-2",
        name: "Prolonged computer usage",
        category: "Overuse",
      },
      {
        key: "trying-too-hard-upright-posture",
        name: "Trying too hard to maintain upright posture",
        description:
          "Pretty much always works against me — probably overworking the lats and rhomboids, which tightens them and causes pain.",
        category: "Posture",
      },
    ],
    logs: [
      {
        offsetDays: -34,
        atHour: 23,
        painLevel: 3,
        painFrequency: 25,
        remedyKeys: ["massage-stretch-left-lats"],
        triggerKeys: [],
        notes:
          "<p>The persistent, dull pain seems correlated with tight left lats. Got noticeably better as I manually massaged them during the day and again at home.</p><p>Also noticed it tends to get better when I slouch and gets worse when I try to maintain upright posture for long periods.</p>",
      },
      {
        offsetDays: -32,
        atHour: 20,
        painLevel: 2,
        painFrequency: 25,
        remedyKeys: ["massage-stretch-left-lats", "sitting-setup-computer-2"],
        triggerKeys: ["prolonged-computer-usage-2"],
        notes:
          "<p>Felt a lot of tightness in the morning, but that improved significantly with foam rolling and a longer, full-body stretching session. Need to pay more attention to what specifically helps next time.</p>",
      },
      {
        offsetDays: -29,
        atHour: 5,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: [],
        triggerKeys: [],
      },
      {
        offsetDays: -26,
        atHour: 19,
        painLevel: 2,
        painFrequency: 10,
        remedyKeys: [
          "sitting-setup-computer-2",
          "massage-stretch-rhomboids-traps",
          "massage-stretch-left-lats",
        ],
        triggerKeys: ["prolonged-computer-usage-2"],
        notes:
          "<p>Massaging and stretching the rhomboids/traps and left lats is a really effective way to relieve pain and tightness here. Learned some better stretching form from an online physio channel and it's been helpful.</p>",
      },
      {
        offsetDays: -22,
        atHour: 20,
        painLevel: 1,
        painFrequency: 5,
        remedyKeys: [
          "massage-stretch-rhomboids-traps",
          "massage-stretch-left-lats",
          "sitting-setup-computer-2",
        ],
        triggerKeys: [],
        notes:
          "<p>Didn't feel it much today, which is odd — maybe just a little tightness. Played about an hour of games with no pain yet.</p>",
      },
      {
        offsetDays: -6,
        atHour: 1,
        painLevel: 1,
        painFrequency: 10,
        remedyKeys: [
          "massage-stretch-left-lats",
          "massage-stretch-rhomboids-traps",
          "sitting-setup-computer-2",
        ],
        triggerKeys: ["prolonged-computer-usage-2"],
        notes:
          "<p>Feeling pretty good overall today, mostly tightness and discomfort. Massaging and stretching the lats and rhomboids is really helping. Slightly concerned the wall pull stretches might be straining the shoulder a bit — need to find a way to keep doing them without aggravating that.</p>",
      },
      {
        offsetDays: 0,
        atHour: 17,
        painLevel: 1,
        painFrequency: 10,
        remedyKeys: [
          "massage-stretch-left-lats",
          "massage-stretch-rhomboids-traps",
          "sitting-setup-computer-2",
        ],
        triggerKeys: [],
      },
    ],
  },
  // resolved and archived, old overuse strain fully healed
  {
    bodyPart: "Extensors",
    injuryType: "RSI",
    locationDetail: "Right",
    description:
      "Old overuse strain from a period of heavy keyboard use, fully resolved.",
    status: "resolved",
    priority: "low",
    createdDaysAgo: 240,
    archivedDaysAgo: 150,
    remedies: [
      {
        key: "extensor-stretch",
        name: "Extensor stretch",
        description: "Wrist flexion stretch, held 30s each side.",
        providesImmediateRelief: true,
        category: "Mobility",
      },
    ],
    triggers: [],
    logs: [
      {
        offsetDays: -235,
        atHour: 10,
        painLevel: 3,
        painFrequency: 40,
        remedyKeys: ["extensor-stretch"],
      },
      {
        offsetDays: -210,
        atHour: 10,
        painLevel: 2,
        painFrequency: 20,
        remedyKeys: ["extensor-stretch"],
      },
      {
        offsetDays: -160,
        atHour: 10,
        painLevel: 0,
        painFrequency: 0,
        notes: "<p>Long healed, archiving this.</p>",
      },
    ],
  },
  // newly created, no logs yet (empty state)
  {
    bodyPart: "Occipital Region",
    injuryType: "Tension(?)",
    locationDetail: "Base of skull",
    description:
      "Noticed some tightness/tension after an especially long stretch of screen time.",
    status: "active",
    priority: "urgent",
    createdDaysAgo: 0,
    remedies: [],
    triggers: [],
    logs: [],
  },
];
