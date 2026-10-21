/**
 * The planner, independent of any one sport.
 *
 * Each sport supplies a `PlannerSpec`: what a guest can choose, how those
 * choices become days on the island, and what each part costs. This file
 * turns a spec and a set of choices into a priced week. No Angular in here,
 * so the rules can be read — and argued with — on their own.
 */

/* ------------------------------------------------------------- choices --- */

export interface LevelOption {
  id: string;
  name: string;
  note: string;
}

export interface IntensityOption {
  id: string;
  name: string;
  note: string;
  /** Short tag beside the name, e.g. "2 sessions/day". */
  sessions: string;
  /** Per coached day, per person: coaching plus whatever the sport needs to happen (courts, green fees, boats, guides). */
  perDay: number;
}

export interface StayOption {
  id: string;
  name: string;
  note: string;
  nightly: number;
}

export interface BaseOption {
  id: string;
  name: string;
  /** One line on why you would pick it. */
  note: string;
  /** A short fact shown under the name, e.g. "7 courts, 2 clubs". */
  detail: string;
  /** Applied to the accommodation line: where you sleep costs what it costs. */
  multiplier: number;
}

export interface ExtraOption {
  id: string;
  name: string;
  note: string;
  /** Whole-retreat price per person, unless `everyNights` is set. */
  perPerson: number;
  group: string;
  /** Priced per session, one session per this many nights (e.g. massage every third night). */
  everyNights?: number;
  /** The week has to be at least this long for the extra to fit. */
  minNights?: number;
  /** Only offered to these levels. */
  levels?: string[];
  /** Why it is unavailable, when it is. */
  needs?: string;
}

export interface RetreatConfig {
  nights: number;
  guests: number;
  level: string;
  intensity: string;
  stay: string;
  base: string;
  extras: string[];
}

/* -------------------------------------------------------------- the week -- */

/**
 * What a block is, for colour and for counting. `coaching` and `play` are the
 * sport itself; everything else is the week around it.
 */
export type BlockKind =
  | 'coaching'
  | 'play'
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
  /** Something the sport counts — holes played, dives logged, km walked. */
  units?: number;
}

export interface Day {
  id: string;
  index: number;
  name: string;
  /** A one- or two-word label: Arrival, Training, Summit, Surface day… */
  tag: string;
  /** Which colour the tag gets. */
  tone: 'arrival' | 'core' | 'rest' | 'peak' | 'departure';
  /** Whether the day is paid at the intensity's per-day rate. */
  coached: boolean;
  blocks: Block[];
}

export function block(
  id: string,
  label: string,
  kind: BlockKind,
  start: number,
  end: number,
  sub?: string,
  units?: number,
): Block {
  return { id, label, kind, start, end, sub, units };
}

export function day(index: number, tag: string, tone: Day['tone'], coached: boolean, blocks: Block[]): Day {
  return { id: `day-${index}`, index, name: `Day ${index}`, tag, tone, coached, blocks };
}

/* ----------------------------------------------------------- the spec --- */

export interface PlannerSpec {
  levels: LevelOption[];
  intensities: IntensityOption[];
  bases: BaseOption[];
  stays: StayOption[];
  extras: ExtraOption[];
  extraGroups: { key: string; title: string }[];
  defaultConfig: RetreatConfig;
  nightLimits: { min: number; max: number };
  guestLimits: { min: number; max: number };
  /** The hours the schedule is drawn between. A sunrise summit starts at two. */
  dayStart: number;
  dayEnd: number;

  /** Labels the planner UI uses, so it can speak the sport. */
  words: {
    /** "Where you play now" / "Your diving" / "How far you walk now" */
    levelTitle: string;
    intensityTitle: string;
    baseTitle: string;
    /** Price line for the per-day part: "Coaching and court time". */
    coachingLine: string;
    /** "players", "golfers", "divers", "walkers" */
    people: string;
    person: string;
  };

  /** The headline number the week is summarised by. */
  metric: {
    /** e.g. "hours on court", "holes of golf", "logged dives", "km on foot" */
    label: string;
    measure(days: Day[]): number;
  };

  /** Fixed costs of moving people around the island. */
  logistics: { base: number; perNight: number };

  /** One sentence under the schedule on how the week has been shaped. */
  statusNote: string;
  /** The rules the builder applies, stated for the guest. */
  rules: string[];

  build(config: RetreatConfig): Day[];
}

/* --------------------------------------------------------------- price --- */

export interface PriceLine {
  label: string;
  amount: number;
  note?: string;
}

export interface RetreatStudy {
  days: Day[];
  coachedDays: number;
  metric: number;
  lines: PriceLine[];
  perPerson: number;
  groupTotal: number;
  perNight: number;
  groupDiscountPct: number;
}

/** Bigger groups share a coach, a boat or a villa, so the per-head price falls. */
export function groupDiscountPct(guests: number): number {
  if (guests >= 7) return 14;
  if (guests >= 5) return 10;
  if (guests >= 3) return 6;
  return 0;
}

/** Hours spent in blocks of the given kinds, for sports that count time. */
export function hoursIn(days: Day[], kinds: BlockKind[]): number {
  return Math.round(
    days
      .flatMap((d) => d.blocks)
      .filter((b) => kinds.includes(b.kind))
      .reduce((sum, b) => sum + (b.end - b.start), 0),
  );
}

/** The sum of every block's `units`. */
export function unitsIn(days: Day[]): number {
  return days.flatMap((d) => d.blocks).reduce((sum, b) => sum + (b.units ?? 0), 0);
}

export function extraAvailable(spec: PlannerSpec, config: RetreatConfig, id: string): boolean {
  const e = spec.extras.find((x) => x.id === id);
  if (!e) return false;
  if (e.minNights && config.nights < e.minNights) return false;
  if (e.levels && !e.levels.includes(config.level)) return false;
  return true;
}

/**
 * Drops extras the current choices can no longer support, so a week shortened
 * below a tournament's minimum does not keep charging for it.
 */
export function effectiveExtras(spec: PlannerSpec, config: RetreatConfig): string[] {
  return config.extras.filter((id) => extraAvailable(spec, config, id));
}

export function extraCost(e: ExtraOption, nights: number): number {
  if (e.everyNights) return Math.round(e.perPerson * Math.max(1, Math.round(nights / e.everyNights)));
  return e.perPerson;
}

export function buildStudy(spec: PlannerSpec, raw: RetreatConfig): RetreatStudy {
  const config = { ...raw, extras: effectiveExtras(spec, raw) };
  const days = spec.build(config);
  const stay = spec.stays.find((s) => s.id === config.stay) ?? spec.stays[0];
  const base = spec.bases.find((b) => b.id === config.base) ?? spec.bases[0];
  const intensity = spec.intensities.find((i) => i.id === config.intensity) ?? spec.intensities[0];

  const coachedDays = days.filter((d) => d.coached).length;
  const metric = spec.metric.measure(days);

  const accommodation = Math.round(stay.nightly * base.multiplier * config.nights);
  const coaching = Math.round(intensity.perDay * coachedDays);
  const logistics = Math.round(spec.logistics.base + spec.logistics.perNight * config.nights);

  const chosen = spec.extras.filter((e) => config.extras.includes(e.id));
  const lines: PriceLine[] = [
    { label: `${stay.name} · ${config.nights} nights`, amount: accommodation, note: `${base.name} rates` },
    {
      label: `${spec.words.coachingLine} · ${coachedDays} days`,
      amount: coaching,
      note: `${metric} ${spec.metric.label}`,
    },
  ];
  for (const g of spec.extraGroups) {
    const amount = chosen.filter((e) => e.group === g.key).reduce((t, e) => t + extraCost(e, config.nights), 0);
    if (g.key === 'logistics') {
      lines.push({ label: 'Transfers and logistics', amount: amount + logistics });
    } else if (amount > 0) {
      lines.push({ label: g.title, amount });
    }
  }
  if (!spec.extraGroups.some((g) => g.key === 'logistics')) {
    lines.push({ label: 'Transfers and logistics', amount: logistics });
  }

  const gross = lines.reduce((t, l) => t + l.amount, 0);
  const discount = groupDiscountPct(config.guests);
  const perPerson = Math.round(gross * (1 - discount / 100));

  return {
    days,
    coachedDays,
    metric,
    lines: lines.filter((l) => l.amount > 0),
    perPerson,
    groupTotal: perPerson * config.guests,
    perNight: Math.round(perPerson / config.nights),
    groupDiscountPct: discount,
  };
}

/* ------------------------------------------------------- shared parts --- */

/** Rooms are the same whatever you came to do. */
export const STAYS: StayOption[] = [
  { id: 'shared', name: 'Shared villa room', note: 'Own room, shared pool and kitchen', nightly: 55 },
  { id: 'private', name: 'Private suite', note: 'Own room and bathroom, hotel service', nightly: 95 },
  { id: 'villa', name: 'Private villa', note: 'The whole villa, for your group', nightly: 165 },
];

export const has = (config: RetreatConfig, id: string) => config.extras.includes(id);

/** The rest day sits in the middle, once a week is long enough to need one. */
export function restDayIndex(nights: number, minNights = 5): number {
  return nights >= minNights ? Math.ceil((nights + 1) / 2) : -1;
}
