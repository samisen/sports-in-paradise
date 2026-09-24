/**
 * The retreat domain: what a guest can choose, the week that comes out of it,
 * and what it costs.
 *
 * No Angular in here. The planner page renders whatever this produces, which
 * keeps the rules in one readable place and makes them easy to argue with.
 */

/* ------------------------------------------------------------- choices --- */

export type LevelId = 'newcomer' | 'improver' | 'competitor';
export type IntensityId = 'light' | 'balanced' | 'heavy';
export type StayId = 'shared' | 'private' | 'villa';
export type BaseId = 'canggu' | 'uluwatu' | 'ubud' | 'sanur';

export type ExtraId =
  | 'video'
  | 'ice-bath'
  | 'massage'
  | 'yoga'
  | 'gym'
  | 'surf'
  | 'excursion'
  | 'tournament'
  | 'airport'
  | 'nutrition'
  | 'photo'
  | 'rackets';

export interface RetreatConfig {
  nights: number;
  guests: number;
  level: LevelId;
  intensity: IntensityId;
  stay: StayId;
  base: BaseId;
  extras: ExtraId[];
}

export const LEVELS: { id: LevelId; name: string; note: string }[] = [
  { id: 'newcomer', name: 'New to padel', note: 'Played a handful of times, or none' },
  { id: 'improver', name: 'Improver', note: 'Play weekly, want the technique fixed' },
  { id: 'competitor', name: 'Competitor', note: 'League or tournament player' },
];

export const INTENSITIES: { id: IntensityId; name: string; note: string; sessions: string }[] = [
  { id: 'light', name: 'Light', note: 'One session a day, the island for the rest', sessions: '1 session/day' },
  { id: 'balanced', name: 'Balanced', note: 'Coaching in the morning, matches in the cool', sessions: '2 sessions/day' },
  { id: 'heavy', name: 'Heavy', note: 'Two on court plus conditioning', sessions: '3 sessions/day' },
];

export const STAYS: { id: StayId; name: string; note: string; nightly: number }[] = [
  { id: 'shared', name: 'Shared villa room', note: 'Own room, shared pool and kitchen', nightly: 55 },
  { id: 'private', name: 'Private suite', note: 'Own room and bathroom, hotel service', nightly: 95 },
  { id: 'villa', name: 'Private villa', note: 'The whole villa, for your group', nightly: 165 },
];

export const BASES: { id: BaseId; name: string; note: string; multiplier: number; courts: string }[] = [
  { id: 'canggu', name: 'Canggu', note: 'Busiest padel scene, everything walkable', multiplier: 1, courts: '6 courts, 2 clubs' },
  { id: 'uluwatu', name: 'Uluwatu', note: 'Clifftop, quieter, best for a focused block', multiplier: 1.15, courts: '4 courts' },
  { id: 'ubud', name: 'Ubud', note: 'Jungle and recovery, cooler air', multiplier: 0.85, courts: '2 courts' },
  { id: 'sanur', name: 'Sanur', note: 'Calm east coast, easiest travel days', multiplier: 0.9, courts: '3 courts' },
];

/** `perPerson` is the whole-retreat price unless the note says otherwise. */
export const EXTRAS: {
  id: ExtraId;
  name: string;
  note: string;
  perPerson: number;
  group: 'court' | 'recovery' | 'island' | 'logistics';
}[] = [
  { id: 'video', name: 'Video analysis', note: 'Filmed and reviewed twice in the week', perPerson: 90, group: 'court' },
  { id: 'tournament', name: 'Closing tournament', note: 'Americano format on the last full day', perPerson: 80, group: 'court' },
  { id: 'rackets', name: 'Racket and ball package', note: 'Demo rackets and fresh balls all week', perPerson: 60, group: 'court' },
  { id: 'ice-bath', name: 'Ice bath', note: 'After every hard session', perPerson: 60, group: 'recovery' },
  { id: 'massage', name: 'Sports massage', note: 'One per three nights', perPerson: 55, group: 'recovery' },
  { id: 'yoga', name: 'Sunrise yoga', note: 'Before the morning court', perPerson: 70, group: 'recovery' },
  { id: 'gym', name: 'Strength sessions', note: 'Padel-specific conditioning', perPerson: 50, group: 'recovery' },
  { id: 'nutrition', name: 'Nutrition plan', note: 'Written for the week, food included', perPerson: 110, group: 'recovery' },
  { id: 'surf', name: 'Surf morning', note: 'Board, coach and transfer', perPerson: 120, group: 'island' },
  { id: 'excursion', name: 'Island day', note: 'Waterfall, temple or volcano, with a driver', perPerson: 140, group: 'island' },
  { id: 'photo', name: 'Photographer', note: 'On court and off, files sent after', perPerson: 130, group: 'island' },
  { id: 'airport', name: 'Airport transfers', note: 'Both ways, however late the flight', perPerson: 45, group: 'logistics' },
];

export const NIGHT_LIMITS = { min: 3, max: 14 } as const;
export const GUEST_LIMITS = { min: 1, max: 8 } as const;

export const DEFAULT_CONFIG: RetreatConfig = {
  nights: 7,
  guests: 2,
  level: 'improver',
  intensity: 'balanced',
  stay: 'private',
  base: 'canggu',
  extras: ['ice-bath', 'airport'],
};

/* -------------------------------------------------------------- the week -- */

export type BlockKind =
  | 'clinic'
  | 'match'
  | 'fitness'
  | 'recovery'
  | 'experience'
  | 'meal'
  | 'travel'
  | 'free';

export interface Block {
  /** Stable within its day, so the schedule can animate what changed. */
  id: string;
  label: string;
  sub?: string;
  kind: BlockKind;
  /** Decimal hours: 7.5 is 07:30. */
  start: number;
  end: number;
}

export type DayTag = 'Arrival' | 'Training' | 'Rest & explore' | 'Match day' | 'Departure';

export interface Day {
  id: string;
  index: number;
  name: string;
  tag: DayTag;
  blocks: Block[];
}

/** The hours the schedule is drawn between. */
export const DAY_START = 6;
export const DAY_END = 21;

const LEVEL_WORDS: Record<LevelId, { clinic: string; match: string; clinicSub: string }> = {
  newcomer: { clinic: 'Fundamentals', match: 'Supervised games', clinicSub: 'Grip, contact, the glass' },
  improver: { clinic: 'Technical clinic', match: 'Match play', clinicSub: 'Bandeja, vibora, positioning' },
  competitor: { clinic: 'Tactical clinic', match: 'Competitive sets', clinicSub: 'Patterns, pressure, court craft' },
};

function block(id: string, label: string, kind: BlockKind, start: number, end: number, sub?: string): Block {
  return { id, label, kind, start, end, sub };
}

/**
 * A day on the island, not a day in a sports hall.
 *
 * Nothing serious is scheduled between ten and four: at 8°S it is 32°C on a
 * glass court and the sessions that matter would be wasted. Play sits at
 * either end of the day and the middle belongs to the guest.
 */
function trainingDay(config: RetreatConfig, index: number, tag: DayTag): Day {
  const words = LEVEL_WORDS[config.level];
  const has = (id: ExtraId) => config.extras.includes(id);
  const blocks: Block[] = [];

  if (has('yoga')) blocks.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 7));

  // morning court — the technical work, while the surface is still cool
  const clinicEnd = config.intensity === 'light' ? 9 : 9.5;
  blocks.push(block('clinic', words.clinic, 'clinic', 7.5, clinicEnd, words.clinicSub));

  if (has('ice-bath')) blocks.push(block('ice-bath', 'Ice bath', 'recovery', clinicEnd + 0.25, clinicEnd + 0.75));
  blocks.push(block('breakfast', 'Breakfast', 'meal', clinicEnd + 1, clinicEnd + 2));

  if (has('video') && (index === 2 || index === 5)) {
    blocks.push(block('video', 'Video review', 'clinic', 12, 13, 'Yesterday’s footage'));
  }

  // the open afternoon runs up to whatever comes next, so conditioning does
  // not get laid on top of it
  const heavy = config.intensity === 'heavy';
  blocks.push(block('midday', 'Open afternoon', 'free', 13, heavy ? 15 : 16, 'Too hot for the glass'));

  if (heavy) {
    blocks.push(block('fitness', 'Conditioning', 'fitness', 15, 16, 'Legs, shoulders, change of direction'));
  }

  let lastEnd = 16;
  if (config.intensity !== 'light' || index % 2 === 0) {
    lastEnd = heavy ? 18.5 : 18;
    blocks.push(block('match', words.match, 'match', 16.25, lastEnd));
  }

  // dinner waits for the massage rather than colliding with it
  let dinnerAt = 19.5;
  if (has('massage') && index % 3 === 0) {
    const start = lastEnd + 0.25;
    blocks.push(block('massage', 'Sports massage', 'recovery', start, start + 1));
    dinnerAt = Math.max(dinnerAt, start + 1.25);
  }
  blocks.push(block('dinner', 'Dinner together', 'meal', dinnerAt, Math.max(21, dinnerAt + 1.25)));

  return { id: `day-${index}`, index, name: `Day ${index}`, tag, blocks };
}

export function buildSchedule(config: RetreatConfig): Day[] {
  const days: Day[] = [];
  const total = config.nights + 1; // a 7-night retreat is 8 days on the ground
  const has = (id: ExtraId) => config.extras.includes(id);

  // rest day sits in the middle, once the week is long enough to need one
  const restDay = config.nights >= 5 ? Math.ceil(total / 2) : -1;
  // the tournament wants the last full day, with a night's recovery after it
  const finalDay = has('tournament') && config.nights >= 4 ? total - 1 : -1;

  for (let i = 1; i <= total; i++) {
    if (i === 1) {
      const blocks: Block[] = [];
      if (has('airport')) blocks.push(block('transfer', 'Airport pickup', 'travel', 10, 11.5));
      blocks.push(block('settle', 'Check in and settle', 'free', 12, 15));
      blocks.push(block('hit', 'First hit', 'clinic', 16.5, 18, 'Levels, pairs, where you are'));
      blocks.push(block('dinner', 'Welcome dinner', 'meal', 19.5, 21));
      days.push({ id: 'day-1', index: 1, name: 'Day 1', tag: 'Arrival', blocks });
      continue;
    }

    if (i === total) {
      const blocks: Block[] = [];
      blocks.push(block('clinic', 'Last court', 'clinic', 7.5, 9, 'Loose games, no drills'));
      blocks.push(block('breakfast', 'Breakfast', 'meal', 10, 11));
      blocks.push(block('checkout', 'Check out', 'free', 11, 12));
      if (has('airport')) blocks.push(block('transfer', 'Airport drop-off', 'travel', 13, 14.5));
      days.push({ id: `day-${i}`, index: i, name: `Day ${i}`, tag: 'Departure', blocks });
      continue;
    }

    if (i === restDay) {
      const blocks: Block[] = [];
      if (has('yoga')) blocks.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 7));
      if (has('surf')) blocks.push(block('surf', 'Surf morning', 'experience', 7, 10.5, 'Board and coach included'));
      else if (has('excursion')) blocks.push(block('excursion', 'Island day', 'experience', 8, 16, 'Driver for the day'));
      else blocks.push(block('slow', 'Slow morning', 'free', 7, 11, 'No alarm'));
      if (has('massage')) blocks.push(block('massage', 'Sports massage', 'recovery', 15, 16));
      blocks.push(block('social', 'Social doubles', 'match', 16.5, 18, 'Mixed pairs, no scoring pressure'));
      blocks.push(block('dinner', 'Dinner out', 'meal', 19.5, 21));
      days.push({ id: `day-${i}`, index: i, name: `Day ${i}`, tag: 'Rest & explore', blocks });
      continue;
    }

    if (i === finalDay) {
      const blocks: Block[] = [];
      if (has('yoga')) blocks.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 7));
      blocks.push(block('warmup', 'Warm-up and draw', 'clinic', 7.5, 8.5));
      blocks.push(block('tournament', 'Americano tournament', 'match', 8.5, 11.5, 'Everyone plays everyone'));
      blocks.push(block('breakfast', 'Late breakfast', 'meal', 12, 13));
      if (has('ice-bath')) blocks.push(block('ice-bath', 'Ice bath', 'recovery', 13.5, 14));
      blocks.push(block('midday', 'Open afternoon', 'free', 14, 17));
      blocks.push(block('final', 'Finals and prizes', 'match', 17, 18.5));
      blocks.push(block('dinner', 'Closing dinner', 'meal', 19.5, 21));
      days.push({ id: `day-${i}`, index: i, name: `Day ${i}`, tag: 'Match day', blocks });
      continue;
    }

    days.push(trainingDay(config, i, 'Training'));
  }

  return days;
}

/* --------------------------------------------------------------- price --- */

export interface PriceLine {
  label: string;
  amount: number;
  note?: string;
}

export interface RetreatStudy {
  days: Day[];
  /** Days with real coaching on them, which is what the coaching line is built from. */
  trainingDays: number;
  courtHours: number;
  lines: PriceLine[];
  perPerson: number;
  groupTotal: number;
  perNight: number;
  groupDiscountPct: number;
}

const COACHING_PER_DAY: Record<IntensityId, number> = { light: 60, balanced: 95, heavy: 140 };

/** Bigger groups share a coach and a villa, so the per-head price falls. */
export function groupDiscountPct(guests: number): number {
  if (guests >= 7) return 14;
  if (guests >= 5) return 10;
  if (guests >= 3) return 6;
  return 0;
}

export function buildStudy(config: RetreatConfig): RetreatStudy {
  const days = buildSchedule(config);
  const stay = STAYS.find((s) => s.id === config.stay)!;
  const base = BASES.find((b) => b.id === config.base)!;

  const courtKinds: BlockKind[] = ['clinic', 'match'];
  const courtHours = Math.round(
    days
      .flatMap((d) => d.blocks)
      .filter((b) => courtKinds.includes(b.kind))
      .reduce((sum, b) => sum + (b.end - b.start), 0),
  );
  const trainingDays = days.filter((d) => d.tag === 'Training' || d.tag === 'Match day').length;

  const accommodation = Math.round(stay.nightly * base.multiplier * config.nights);
  const coaching = Math.round(COACHING_PER_DAY[config.intensity] * trainingDays);
  const logistics = Math.round(40 + 12 * config.nights);

  const chosen = EXTRAS.filter((e) => config.extras.includes(e.id));
  const extraCost = (id: ExtraId) => {
    const e = EXTRAS.find((x) => x.id === id)!;
    // massage is priced per session, so it follows the length of the stay
    if (id === 'massage') return Math.round(e.perPerson * Math.max(1, Math.round(config.nights / 3)));
    return e.perPerson;
  };
  const sum = (group: (typeof EXTRAS)[number]['group']) =>
    chosen.filter((e) => e.group === group).reduce((total, e) => total + extraCost(e.id), 0);

  const lines: PriceLine[] = [
    { label: `${stay.name} · ${config.nights} nights`, amount: accommodation, note: `${base.name} rates` },
    { label: `Coaching and court time · ${trainingDays} days`, amount: coaching, note: `${courtHours} hours on court` },
    { label: 'On-court extras', amount: sum('court') },
    { label: 'Recovery and wellness', amount: sum('recovery') },
    { label: 'Island experiences', amount: sum('island') },
    { label: 'Transfers and logistics', amount: logistics + sum('logistics') },
  ].filter((l) => l.amount > 0);

  const gross = lines.reduce((total, l) => total + l.amount, 0);
  const discount = groupDiscountPct(config.guests);
  const perPerson = Math.round(gross * (1 - discount / 100));

  return {
    days,
    trainingDays,
    courtHours,
    lines,
    perPerson,
    groupTotal: perPerson * config.guests,
    perNight: Math.round(perPerson / config.nights),
    groupDiscountPct: discount,
  };
}
