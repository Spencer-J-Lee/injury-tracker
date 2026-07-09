import type { InjuryStatus, RemedyType } from '@/types/models'

export interface SeedRemedy {
  key: string
  name: string
  description?: string
  type: RemedyType
}

export interface SeedLogEntry {
  offsetDays: number
  atHour?: number
  atMinute?: number
  painLevel?: number
  painFrequency?: number
  remedyKeys?: string[]
  notes?: string
}

export interface SeedInjury {
  name: string
  description?: string
  status: InjuryStatus
  createdDaysAgo: number
  archivedDaysAgo?: number
  remedies: SeedRemedy[]
  logs: SeedLogEntry[]
}

export const SEED_INJURIES: SeedInjury[] = [
  // active, improving: frequent logs, declining pain, both remedy types
  {
    name: 'Lower back strain',
    description: 'Tweaked while deadlifting, worse when sitting for long periods.',
    status: 'active',
    createdDaysAgo: 42,
    remedies: [
      { key: 'heat-pack', name: 'Heat pack', type: 'relief' },
      { key: 'physio-exercises', name: 'Physio stretches', description: '15 min routine, morning and evening', type: 'longterm' },
    ],
    logs: [
      { offsetDays: -40, atHour: 9, painLevel: 7, painFrequency: 4, remedyKeys: ['heat-pack'], notes: 'Could barely stand up straight this morning.' },
      { offsetDays: -33, atHour: 9, painLevel: 6, painFrequency: 3, remedyKeys: ['heat-pack', 'physio-exercises'] },
      { offsetDays: -26, atHour: 9, painLevel: 5, painFrequency: 3, remedyKeys: ['physio-exercises'], notes: 'Started the stretch routine, feels a bit looser.' },
      { offsetDays: -19, atHour: 9, painLevel: 4, painFrequency: 2, remedyKeys: ['physio-exercises'] },
      { offsetDays: -12, atHour: 9, painLevel: 3, painFrequency: 2, remedyKeys: ['physio-exercises'] },
      { offsetDays: -5, atHour: 9, painLevel: 2, painFrequency: 1, remedyKeys: ['physio-exercises'], notes: 'Almost back to normal.' },
    ],
  },
  // active, chronic, no remedies yet
  {
    name: 'Tennis elbow',
    description: 'Dull ache on the outside of the right elbow.',
    status: 'active',
    createdDaysAgo: 60,
    remedies: [],
    logs: [
      { offsetDays: -50, atHour: 18, painLevel: 5, painFrequency: 3 },
      { offsetDays: -35, atHour: 18, painLevel: 5, painFrequency: 3, notes: 'About the same, still bothers me typing a lot.' },
      { offsetDays: -20, atHour: 18, painLevel: 6, painFrequency: 4 },
      { offsetDays: -6, atHour: 18, painLevel: 5, painFrequency: 3 },
    ],
  },
  // monitoring, low intermittent pain, one relief remedy
  {
    name: 'Occasional knee twinge',
    description: 'Sharp twinge on stairs, otherwise fine.',
    status: 'monitoring',
    createdDaysAgo: 90,
    remedies: [{ key: 'knee-brace', name: 'Knee brace', type: 'relief' }],
    logs: [
      { offsetDays: -80, atHour: 20, painLevel: 3, painFrequency: 1, remedyKeys: ['knee-brace'] },
      { offsetDays: -45, atHour: 20, painLevel: 2, painFrequency: 1 },
      { offsetDays: -10, atHour: 20, painLevel: 3, painFrequency: 1, remedyKeys: ['knee-brace'], notes: 'Happened once going down stairs quickly.' },
    ],
  },
  // resolved, full history trending to zero
  {
    name: 'Sprained ankle',
    description: 'Rolled it stepping off a curb.',
    status: 'resolved',
    createdDaysAgo: 35,
    remedies: [
      { key: 'ice', name: 'Ice pack', type: 'relief' },
      { key: 'ankle-mobility', name: 'Ankle mobility exercises', type: 'longterm' },
    ],
    logs: [
      { offsetDays: -34, atHour: 12, painLevel: 8, painFrequency: 5, remedyKeys: ['ice'], notes: 'Pretty swollen, kept it elevated.' },
      { offsetDays: -30, atHour: 12, painLevel: 6, painFrequency: 4, remedyKeys: ['ice', 'ankle-mobility'] },
      { offsetDays: -24, atHour: 12, painLevel: 4, painFrequency: 3, remedyKeys: ['ankle-mobility'] },
      { offsetDays: -17, atHour: 12, painLevel: 2, painFrequency: 2, remedyKeys: ['ankle-mobility'] },
      { offsetDays: -10, atHour: 12, painLevel: 1, painFrequency: 1, remedyKeys: ['ankle-mobility'] },
      { offsetDays: -3, atHour: 12, painLevel: 0, painFrequency: 0, notes: 'Fully healed, back to running.' },
    ],
  },
  // newly created, no logs yet (empty state)
  {
    name: 'New shoulder tightness',
    description: 'Noticed some tightness after a heavy lifting session.',
    status: 'active',
    createdDaysAgo: 0,
    remedies: [],
    logs: [],
  },
  // archived
  {
    name: 'Old wrist strain',
    description: 'From a fall a while back, fully healed.',
    status: 'resolved',
    createdDaysAgo: 400,
    archivedDaysAgo: 300,
    remedies: [{ key: 'wrist-brace', name: 'Wrist brace', type: 'relief' }],
    logs: [
      { offsetDays: -395, atHour: 10, painLevel: 6, painFrequency: 3, remedyKeys: ['wrist-brace'] },
      { offsetDays: -370, atHour: 10, painLevel: 2, painFrequency: 1 },
      { offsetDays: -310, atHour: 10, painLevel: 0, painFrequency: 0, notes: 'Long healed, archiving this.' },
    ],
  },
]
