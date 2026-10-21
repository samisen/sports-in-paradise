import { SportSite } from '../content/types';
import { PHOTOS } from '../media';
import {
  Block,
  Day,
  PlannerSpec,
  RetreatConfig,
  STAYS,
  block,
  day,
  has,
  restDayIndex,
  unitsIn,
} from '../planner/engine';

const D = PHOTOS.diving;
const B = PHOTOS.bali;
const L = PHOTOS.life;

/* ------------------------------------------------------------ planner --- */

/**
 * Sites by base, in three tiers. `easy` is sheltered water a new diver can
 * train in; `mid` is what a certified diver with a guide should enjoy; `current`
 * is the diving that earns its reputation and is kept for experienced divers.
 */
const SITES: Record<string, { easy: string[]; mid: string[]; current: string[]; night: string }> = {
  amed: {
    easy: ['Jemeluk Bay', 'Lipah Bay', 'Coral Garden, Tulamben'],
    mid: ['Liberty wreck, Tulamben', 'The Drop-off, Tulamben', 'Japanese wreck, Banyuning'],
    current: ['Gili Selang'],
    night: 'Liberty wreck by torch',
  },
  penida: {
    easy: ['Sheltered reef, Lembongan', 'Sheltered slope, Penida north coast'],
    mid: ['Manta Point', 'SD Point, Penida north coast', 'Ped, Penida north coast'],
    current: ['Crystal Bay', 'Toyapakeh', 'Blue Corner, Lembongan'],
    night: 'Lembongan house reef',
  },
  pemuteran: {
    easy: ['Biorock reef, Pemuteran', 'Secret Bay, Gilimanuk'],
    mid: ['Menjangan: Pos 2 wall', 'Garden Eel Point, Menjangan', 'Napoleon Reef, Pemuteran'],
    current: ['Anchor wreck, Menjangan'],
    night: 'Pemuteran house reef',
  },
  padangbai: {
    easy: ['Blue Lagoon', 'Jepun, Padang Bai'],
    mid: ['Gili Mimpang', 'Blue Lagoon, outer slope'],
    current: ['Gili Tepekong', 'Gili Biaha (Shark Cave)'],
    night: 'Blue Lagoon by torch',
  },
};

/** Hours from the airport, door to door. Penida includes the boat from Sanur. */
const TRANSFER_HOURS: Record<string, number> = { amed: 2.5, penida: 1.75, pemuteran: 4, padangbai: 1.5 };

/** Road and boat from a far base to Lembongan, for the mola trip. */
const TO_LEMBONGAN_HOURS: Record<string, number> = { amed: 3.5, pemuteran: 5 };

const LAND_DAY: Record<string, string> = {
  amed: 'Tirta Gangga and Taman Ujung · water palaces, low ground',
  penida: 'Kelingking and the east-coast cliffs',
  pemuteran: 'Pulaki temple and the west coast',
  padangbai: 'Tenganan village and Candidasa',
};

interface WeekState {
  /** Dives scheduled so far, to rotate the sites. */
  dives: number;
  /** Adventure dives left to schedule on the PADI Advanced course. */
  advanced: string[];
  nightDays: number[];
  cameraDays: number[];
  freediveDay: number;
  molaDay: number;
  preMolaDay: number;
}

function sitePool(c: RetreatConfig): string[] {
  const s = SITES[c.base] ?? SITES['amed'];
  if (c.level === 'new') return s.easy;
  if (c.level === 'certified') return [...s.easy, ...s.mid];
  // experienced: alternate the guided sites with the current-swept ones
  const out: string[] = [];
  for (let k = 0; k < Math.max(s.mid.length, s.current.length); k++) {
    if (s.mid[k]) out.push(s.mid[k]);
    if (s.current[k]) out.push(s.current[k]);
  }
  return out;
}

function nextSite(c: RetreatConfig, w: WeekState): string {
  const pool = sitePool(c);
  return pool[w.dives++ % pool.length];
}

function diveSub(c: RetreatConfig, site: string): string {
  const current = (SITES[c.base] ?? SITES['amed']).current.includes(site);
  const parts = [current ? 'Drift — experienced divers only' : c.level === 'new' ? 'To 18 m, with your instructor' : 'Guided, four divers to a guide'];
  if (has(c, 'nitrox')) parts.push('nitrox');
  return parts.join(' · ');
}

/** One dive: an hour in the water, one line in the logbook. */
function dive(c: RetreatConfig, w: WeekState, id: string, start: number, extra?: string): Block {
  if (w.advanced.length > 0) {
    const name = w.advanced.shift()!;
    const site = nextSite(c, w);
    return block(id, `Advanced: ${name}`, 'coaching', start, start + 1, site, 1);
  }
  const site = nextSite(c, w);
  const sub = [diveSub(c, site), extra].filter(Boolean).join(' · ');
  return block(id, site, 'play', start, start + 1, sub, 1);
}

/** Two days from a list, spread out: second and fourth if there are that many. */
function pickTwo(days: number[]): number[] {
  const want = [1, 3, 0, 2].filter((k) => k < days.length).slice(0, 2);
  return want.map((k) => days[k]);
}

/**
 * A dive day, shaped by the water rather than the clock.
 *
 * Mornings are when the sea is flattest and the visibility best, so the two
 * dives that matter go in before midday. The third is optional and short of
 * the afternoon wind; night dives need a full surface interval before them.
 */
function diveDay(c: RetreatConfig, w: WeekState, i: number): Day {
  const blocks: Block[] = [];
  const leaving = i === w.preMolaDay;
  const freedive = i === w.freediveDay;
  const shore = c.base === 'amed';

  if (has(c, 'yoga')) blocks.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 6.75, 'Breathing and mobility'));
  blocks.push(block('breakfast', 'Light breakfast', 'meal', 6.75, 7.5));

  if (freedive) {
    blocks.push(block('freedive', 'Freediving intro', 'coaching', 7.5, 11.5, 'Breath-hold, the line, then the reef — before any tanks'));
  } else {
    blocks.push(block('briefing', shore ? 'Briefing and kit to the beach' : 'Briefing and boat out', 'coaching', 7.5, 8.25));
    const camera = w.cameraDays.includes(i) ? 'photographer with you' : undefined;
    blocks.push(dive(c, w, 'dive1', 8.25));
    blocks.push(block('surface', 'Surface interval', 'free', 9.25, 10.5, 'Tea, fruit, the logbook'));
    blocks.push(dive(c, w, 'dive2', 10.5, camera));
  }
  blocks.push(block('lunch', 'Lunch', 'meal', 12, 13));

  if (leaving) {
    const h = TO_LEMBONGAN_HOURS[c.base] ?? 4;
    blocks.push(block('to-lembongan', 'Road and boat to Lembongan', 'travel', 13.5, 13.5 + h, 'For tomorrow’s first boat'));
    blocks.push(block('dinner', 'Dinner on Lembongan', 'meal', 19.5, 21));
    return day(i, 'To Lembongan', 'core', true, blocks);
  }

  let lastEnd = 16;
  if (c.intensity !== 'easy' || freedive) {
    blocks.push(block('siesta', 'Siesta', 'free', 13, 14.5, 'Off-gassing, officially'));
    blocks.push(dive(c, w, 'dive3', 14.5));
    blocks.push(block('log', 'Logbook and debrief', 'coaching', 16, 16.5));
    lastEnd = 16.5;
  } else {
    blocks.push(block('afternoon', 'Afternoon off', 'free', 13, 16, 'Two dives is a full day'));
  }

  if (has(c, 'massage') && i % 3 === 0) {
    blocks.push(block('massage', 'Sports massage', 'recovery', lastEnd + 0.25, lastEnd + 1.25));
  }

  if (w.nightDays.includes(i)) {
    const s = SITES[c.base] ?? SITES['amed'];
    blocks.push(block('night', `Night dive: ${s.night}`, 'play', 18.5, 19.5, 'Torch, guide, slow', 1));
    blocks.push(block('dinner', 'Late dinner', 'meal', 19.75, 21));
  } else {
    blocks.push(block('dinner', 'Dinner together', 'meal', 19.5, 21));
  }
  return day(i, 'Diving', 'core', true, blocks);
}

/** The mola morning: first boat on Crystal Bay, before the fleet arrives. */
function molaDay(c: RetreatConfig, w: WeekState, i: number): Day {
  const blocks: Block[] = [];
  const sub = 'Cold thermocline · July to October';
  if (c.base === 'padangbai') {
    blocks.push(block('boat', 'Boat from Padang Bai', 'travel', 6, 7));
    blocks.push(block('mola', 'Crystal Bay at dawn', 'play', 7.25, 8.25, sub, 1));
    blocks.push(block('breakfast', 'Breakfast on the boat', 'meal', 8.5, 9.25));
  } else {
    blocks.push(block('boat', 'First boat to Crystal Bay', 'travel', 6, 6.5));
    blocks.push(block('mola', 'Crystal Bay at dawn', 'play', 6.5, 7.5, sub, 1));
    blocks.push(block('breakfast', 'Breakfast on the boat', 'meal', 7.75, 8.5));
  }
  w.dives++;
  blocks.push(block('dive2', 'Manta Point', 'play', 9.75, 10.75, 'Cleaning station · surge', 1));

  if (c.base === 'amed' || c.base === 'pemuteran') {
    const h = TO_LEMBONGAN_HOURS[c.base];
    blocks.push(block('lunch', 'Lunch on Lembongan', 'meal', 11.5, 12.5));
    blocks.push(block('home', 'Boat and road back to base', 'travel', 13, 13 + h));
    blocks.push(block('dinner', 'Dinner together', 'meal', 19.5, 21));
    return day(i, 'Mola day', 'peak', true, blocks);
  }

  if (c.base === 'padangbai') {
    blocks.push(block('home', 'Boat back to Padang Bai', 'travel', 11.25, 12.25));
    blocks.push(block('lunch', 'Lunch', 'meal', 12.5, 13.5));
  } else {
    blocks.push(block('lunch', 'Lunch', 'meal', 12, 13));
  }
  if (c.intensity !== 'easy') {
    const pool = sitePool(c);
    if (pool[w.dives % pool.length] === 'Crystal Bay') w.dives++; // once is enough for one day
    blocks.push(dive(c, w, 'dive3', 14.5));
    blocks.push(block('log', 'Logbook and debrief', 'coaching', 16, 16.5));
  }
  blocks.push(block('dinner', 'Dinner together', 'meal', 19.5, 21));
  return day(i, 'Mola day', 'peak', true, blocks);
}

const COURSE_TAGS = ['Theory & pool', 'Training dives', 'Certified'];

/**
 * PADI Open Water across three days: theory and confined water first, then
 * four training dives in open water, two a day, in sheltered sites only.
 */
function courseDay(c: RetreatConfig, w: WeekState, i: number, step: number, lastStep: boolean): Day {
  const blocks: Block[] = [];
  const referral = 'Referral: finish the open-water dives on a later trip';
  if (has(c, 'yoga')) blocks.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 6.75, 'Breathing and mobility'));

  if (step === 0) {
    blocks.push(block('breakfast', 'Breakfast', 'meal', 7, 7.75));
    blocks.push(block('theory', 'Theory: how diving works', 'coaching', 8, 10, 'Pressure, gas, planning a dive'));
    blocks.push(block('pool1', 'Confined water', 'coaching', 10.5, 12.5, 'First breaths, clearing a mask, buoyancy'));
    blocks.push(block('lunch', 'Lunch', 'meal', 12.5, 13.5));
    blocks.push(block('pool2', 'Confined water', 'coaching', 14.5, 16.5, 'The skills to the open-water standard'));
    blocks.push(block('review', 'Knowledge review', 'coaching', 17, 18, lastStep ? referral : undefined));
  } else {
    blocks.push(block('breakfast', 'Light breakfast', 'meal', 6.75, 7.5));
    blocks.push(block('briefing', 'Briefing and kit', 'coaching', 7.5, 8.25, 'Sheltered water only'));
    const n = step === 1 ? 1 : 3;
    const photo = w.cameraDays.includes(i) ? ' · photographer with you' : '';
    blocks.push(block('train1', `Training dive ${n}`, 'coaching', 8.25, 9.25, nextSite(c, w), 1));
    blocks.push(block('surface', 'Surface interval', 'free', 9.25, 10.5, 'Skills debrief'));
    blocks.push(block('train2', `Training dive ${n + 1}`, 'coaching', 10.5, 11.5, `${nextSite(c, w)}${photo}`, 1));
    blocks.push(block('lunch', 'Lunch', 'meal', 12, 13));
    blocks.push(block('afternoon', 'Afternoon off', 'free', 13, 14.5));
    if (step === 1) {
      blocks.push(block('exam', 'Final exam', 'coaching', 14.5, 15.5, lastStep ? referral : 'Fifty questions, then the answers'));
    } else {
      blocks.push(block('cert', 'Logbook and certification', 'coaching', 14.5, 15.5, 'Open Water Diver, to 18 m'));
    }
  }

  if (has(c, 'massage') && i % 3 === 0) blocks.push(block('massage', 'Sports massage', 'recovery', 18, 19));
  blocks.push(block('dinner', 'Dinner together', 'meal', 19.5, 21));
  return day(i, COURSE_TAGS[step], step === 2 ? 'peak' : 'core', true, blocks);
}

function build(c: RetreatConfig): Day[] {
  const days: Day[] = [];
  const total = c.nights + 1;
  const surfaceDay = total - 1; // nothing in the water for the 24 hours before the flight
  const rest = restDayIndex(c.nights, 8);
  const transfer = TRANSFER_HOURS[c.base] ?? 2;

  // which days are which, before any are drawn
  const divingDays: number[] = [];
  for (let i = 2; i < surfaceDay; i++) if (i !== rest) divingDays.push(i);
  const courseDays = c.level === 'new' ? divingDays.slice(0, 3) : [];
  const funDays = divingDays.filter((d) => !courseDays.includes(d));

  let mola = -1;
  let preMola = -1;
  if (has(c, 'mola') && funDays.length >= 2) {
    const far = c.base === 'amed' || c.base === 'pemuteran';
    const mid = Math.max(1, Math.floor(funDays.length / 2));
    const order = [mid, ...funDays.map((_, k) => k).filter((k) => k !== mid && k >= 1)];
    for (const k of order) {
      if (!far || funDays[k - 1] === funDays[k] - 1) {
        mola = funDays[k];
        preMola = far ? funDays[k - 1] : -1;
        break;
      }
    }
  }
  const ordinary = funDays.filter((d) => d !== mola && d !== preMola);

  const nightDays: number[] = [];
  if (c.intensity === 'max') ordinary.forEach((d, k) => k % 2 === 1 && nightDays.push(d));
  if (has(c, 'night')) for (const d of pickTwo(ordinary)) if (!nightDays.includes(d)) nightDays.push(d);

  const w: WeekState = {
    dives: 0,
    advanced: has(c, 'advanced')
      ? ['deep', 'navigation', 'peak performance buoyancy', c.base === 'amed' ? 'wreck' : 'fish identification', 'underwater naturalist']
      : [],
    nightDays,
    cameraDays: has(c, 'camera') ? pickTwo([...courseDays.slice(1), ...ordinary]) : [],
    freediveDay: has(c, 'freedive') ? (rest > 0 && !has(c, 'land') ? rest : (funDays[0] ?? -1)) : -1,
    molaDay: mola,
    preMolaDay: preMola,
  };

  for (let i = 1; i <= total; i++) {
    if (i === 1) {
      const b: Block[] = [];
      let free = 12;
      if (has(c, 'airport')) {
        b.push(block('transfer', 'Airport pickup', 'travel', 9.5, 9.5 + transfer, c.base === 'penida' ? 'Road to Sanur, then the boat' : 'By the coast road'));
        free = 9.5 + transfer + 0.25;
      }
      if (free < 14.75) b.push(block('settle', 'Check in and settle', 'free', free, 14.75));
      b.push(block('kit', 'Kit fitting', 'coaching', 15, 15.75, 'Mask, fins, wetsuit, weights'));
      if (c.level === 'new') {
        b.push(block('elearning', 'Theory, first chapters', 'coaching', 16, 17.5, 'With your instructor, at your pace'));
      } else {
        b.push(block('check', 'Check dive', 'coaching', 16, 17, 'Weighting, trim, a look at your skills', 1));
      }
      b.push(block('dinner', 'Welcome dinner', 'meal', 19.5, 21));
      days.push(day(i, 'Arrival', 'arrival', false, b));
    } else if (i === total) {
      const b: Block[] = [block('breakfast', 'Breakfast', 'meal', 8, 9)];
      b.push(block('checkout', 'Check out', 'free', 10, 11));
      if (has(c, 'airport')) b.push(block('transfer', 'Airport drop-off', 'travel', 11.5, 11.5 + transfer, 'Well over 24 hours since your last dive'));
      days.push(day(i, 'Departure', 'departure', false, b));
    } else if (i === surfaceDay) {
      const b: Block[] = [];
      if (has(c, 'yoga')) b.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 7));
      if (has(c, 'land') && rest < 0) {
        b.push(block('land', 'Land day', 'experience', 8, 16, LAND_DAY[c.base]));
      } else {
        b.push(block('slow', 'Slow morning', 'free', 7.5, 11, 'No tanks for the 24 hours before you fly'));
        b.push(block('snorkel', 'Snorkel if you like', 'free', 14, 16, 'Mask and fins only'));
      }
      if (has(c, 'massage')) b.push(block('massage', 'Sports massage', 'recovery', 16.5, 17.5));
      b.push(block('dinner', 'Closing dinner', 'meal', 19.5, 21, 'Logbooks signed'));
      days.push(day(i, 'Surface day', 'rest', false, b));
    } else if (i === rest) {
      const b: Block[] = [];
      if (has(c, 'yoga')) b.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 7));
      if (has(c, 'land')) {
        b.push(block('land', 'Land day', 'experience', 8, 16, LAND_DAY[c.base]));
      } else if (w.freediveDay === i) {
        b.push(block('freedive', 'Freediving intro', 'coaching', 8, 11.5, 'Breath-hold, the line, the house reef'));
        b.push(block('afternoon', 'Afternoon off', 'free', 13, 16));
      } else {
        b.push(block('slow', 'Slow morning', 'free', 7.5, 11, 'No alarm, no tanks'));
      }
      if (has(c, 'massage')) b.push(block('massage', 'Sports massage', 'recovery', 16.5, 17.5));
      b.push(block('dinner', 'Dinner out', 'meal', 19.5, 21));
      days.push(day(i, 'Land day', 'rest', false, b));
    } else if (courseDays.includes(i)) {
      const step = courseDays.indexOf(i);
      days.push(courseDay(c, w, i, step, step === courseDays.length - 1 && courseDays.length < 3));
    } else if (i === mola) {
      days.push(molaDay(c, w, i));
    } else {
      days.push(diveDay(c, w, i));
    }
  }
  return days;
}

const planner: PlannerSpec = {
  levels: [
    { id: 'new', name: 'Never dived', note: 'PADI Open Water during the week' },
    { id: 'certified', name: 'Certified', note: 'Open Water or Advanced, under about 50 dives' },
    { id: 'experienced', name: 'Experienced', note: '50 dives or more, comfortable in current' },
  ],
  intensities: [
    { id: 'easy', name: 'Easy', note: 'Two morning dives, the afternoon on land', sessions: '2 dives/day', perDay: 110 },
    { id: 'full', name: 'Full', note: 'Two in the morning, one after lunch', sessions: '3 dives/day', perDay: 160 },
    { id: 'max', name: 'Maximum', note: 'Three a day, and night dives on alternate days', sessions: '3–4 dives/day', perDay: 205 },
  ],
  bases: [
    { id: 'amed', name: 'Amed & Tulamben', note: 'Shore diving, the Liberty wreck, calm training water', detail: 'Wreck 40 m from the beach', multiplier: 0.85 },
    { id: 'penida', name: 'Nusa Lembongan', note: 'Boat to Penida: mantas, and mola in season', detail: 'Manta Point, Crystal Bay', multiplier: 1.1 },
    { id: 'pemuteran', name: 'Pemuteran', note: 'Menjangan walls, muck at Secret Bay', detail: 'West Bali National Park', multiplier: 0.9 },
    { id: 'padangbai', name: 'Padang Bai', note: 'East coast reefs, sharks and the Candidasa Gilis', detail: 'Blue Lagoon, Gili Mimpang', multiplier: 0.9 },
  ],
  stays: STAYS,
  extras: [
    { id: 'nitrox', name: 'Nitrox', note: 'The Enriched Air course if you need it, then fills all week', perPerson: 120, group: 'water', levels: ['certified', 'experienced'], needs: 'For certified divers' },
    { id: 'night', name: 'Night dives', note: 'Two in the week, with a torch and a guide', perPerson: 90, group: 'water', levels: ['certified', 'experienced'], needs: 'For certified divers' },
    { id: 'advanced', name: 'PADI Advanced course', note: 'Five adventure dives, deep and navigation among them', perPerson: 380, group: 'water', levels: ['certified'], minNights: 5, needs: 'Certified divers, five nights or more' },
    { id: 'mola', name: 'Mola dawn dive, Crystal Bay', note: 'July–October only. From Amed or Pemuteran it adds a night on Lembongan', perPerson: 150, group: 'water', levels: ['experienced'], minNights: 5, needs: 'Experienced divers, five nights or more' },
    { id: 'camera', name: 'Underwater photographer', note: 'Two days in the water with you, camera hire for the rest', perPerson: 140, group: 'water' },
    { id: 'freedive', name: 'Freediving intro', note: 'Half a day on one breath, before any tanks', perPerson: 110, group: 'water', levels: ['certified', 'experienced'], needs: 'For certified divers' },
    { id: 'yoga', name: 'Sunrise yoga', note: 'Breathing and mobility before the boat', perPerson: 70, group: 'recovery' },
    { id: 'massage', name: 'Sports massage', note: 'One every third night', perPerson: 55, group: 'recovery', everyNights: 3 },
    { id: 'land', name: 'Land day', note: 'Temples, water palaces or cliffs, with a driver — on low ground', perPerson: 120, group: 'island', minNights: 5, needs: 'Five nights or more' },
    { id: 'airport', name: 'Airport transfers', note: 'Both ways, by the coast road', perPerson: 60, group: 'logistics' },
  ],
  extraGroups: [
    { key: 'water', title: 'In the water' },
    { key: 'recovery', title: 'Recovery' },
    { key: 'island', title: 'The island' },
    { key: 'logistics', title: 'Logistics' },
  ],
  defaultConfig: {
    nights: 7,
    guests: 2,
    level: 'certified',
    intensity: 'full',
    stay: 'private',
    base: 'amed',
    extras: ['nitrox', 'airport'],
  },
  nightLimits: { min: 3, max: 14 },
  guestLimits: { min: 1, max: 8 },
  dayStart: 6,
  dayEnd: 21,
  words: {
    levelTitle: 'Your diving',
    intensityTitle: 'How much diving',
    baseTitle: 'Dive base',
    coachingLine: 'Dives, boats and guiding',
    people: 'divers',
    person: 'diver',
  },
  metric: { label: 'logged dives', measure: unitsIn },
  logistics: { base: 60, perNight: 15 },
  statusNote: 'The important dives go in before midday, and the last full day is kept dry so you fly with more than 24 hours behind you.',
  rules: [
    'Nothing in the water for the 24 hours before your flight. DAN’s minimum after repeat dives is 18 hours; we keep the last full day as a surface day.',
    'New divers do the PADI Open Water on days two to four: theory and the pool, then four training dives over two days. A week shorter than five nights starts the course as a referral.',
    'Current-swept sites — Crystal Bay, Toyapakeh, Gili Tepekong, Gili Biaha — are for experienced divers only. Everyone else dives the sheltered side.',
    'Dives one and two run before midday, when the sea is flattest and the visibility best. Eight nights or more earns a land day in the middle.',
    'Land days stay on low ground. The mountain roads climb past 600 m, which counts as altitude after diving.',
  ],
  build,
};

/* ------------------------------------------------------------ content --- */

export const DIVING: SportSite = {
  id: 'diving',
  name: 'Diving',
  descriptor: 'Dive retreats in Bali',
  coreIdea: 'Dive every morning. Surface slowly. Go home a better diver.',
  description:
    'Small guided dive weeks in Bali, from your first Open Water to mola season at Crystal Bay. Plan your own week — sites, courses, nitrox and the island — and talk to the instructors who run it.',

  hero: {
    eyebrow: 'Dive retreats in Bali',
    headline: 'Dive Every Morning. Surface Slowly. Go Home a Better Diver.',
    support:
      'Guided dive weeks on four very different coasts — a wartime wreck, manta cleaning stations, national park walls — with no more than four divers to a guide, and planned with you before anything is booked.',
    photos: [D.splitVolcano, D.mantas, D.turtleReef],
  },
  stats: [
    { value: '268', label: 'Divers hosted since 2023' },
    { value: '4', label: 'Instructors, all resident on the island' },
    { value: '4:1', label: 'Divers to a guide, at most' },
    { value: '9.5/10', label: 'Average week rating' },
  ],

  values: [
    {
      eyebrow: 'The diving',
      title: 'Guiding that makes you better',
      lead: 'Small groups, the same instructor all week, and dives chosen for the diver rather than the boat.',
      body: 'Four divers to a guide, grouped by experience rather than by who booked together. The week builds from easy water to the sites that need more of you, and every dive ends with a proper debrief — air, trim, what you saw and what you missed.',
      points: ['Four divers to a guide, never more.', 'Sites matched to experience, not to the boat schedule.', 'A logbook with notes worth reading later.'],
      photo: D.reefDiver,
    },
    {
      eyebrow: 'The island',
      title: 'A week built around the surface, too',
      lead: 'Most of a dive week is spent out of the water. We plan that part as carefully.',
      body: 'Two dives before lunch, then the afternoon is yours: a siesta, a third dive, a temple on low ground. The last full day is always dry, so the week ends on a beach rather than in an airport queue worrying about nitrogen.',
      points: ['Afternoons are genuinely free on lighter weeks.', 'A surface day before every flight, without exception.', 'Four bases, each a different kind of diving.'],
      photo: B.penidaBeach,
    },
  ],

  sport: {
    eyebrow: 'The sport',
    title: 'Why Dive, and Why Here',
    lead: 'Diving is a skill rather than a ride, and a week of good guiding moves it further than a year of occasional holiday dives.',
    paragraphs: [
      'Most people learn to dive in a few days and then stop learning. They dive once a year, overweighted and burning through their air, and assume that is what diving is. It is not: buoyancy, trim and breathing are learnable, and the difference they make is the difference between watching a reef and fighting one.',
      'Bali is unusually good for that kind of week because the coasts are so different. Sheltered slopes for training, a wreck you can reach from the beach, walls in a national park and some of the strongest currents in the region are all within a day’s travel. A diver can start the week in easy water and end it somewhere that asks more.',
    ],
    drivers: [
      { icon: 'compass', title: 'Range', text: 'Wreck, wall, muck and drift on one island, each a few hours apart.' },
      { icon: 'aim', title: 'Buoyancy', text: 'The skill that changes everything else, and the one a week fixes fastest.' },
      { icon: 'team', title: 'Small groups', text: 'Four divers to a guide, so the guide is watching you rather than counting heads.' },
      { icon: 'safety', title: 'Conservative', text: 'Sheltered sites first, currents only for the experienced, a dry day before flying.' },
    ],
    facts: [
      { value: '18 m', label: 'the depth limit of a PADI Open Water Diver', source: 'PADI' },
      { value: '4', label: 'open-water training dives in the Open Water course, after five confined-water sessions', source: 'PADI' },
    ],
  },

  bali: {
    eyebrow: 'Diving in Bali',
    title: 'Four coasts, four kinds of diving',
    lead: 'Bali’s dive sites barely resemble each other: a wartime wreck off a black-stone beach, cold upwellings off Nusa Penida, walls in a national park, and muck where the small things live.',
    paragraphs: [
      'On the north-east coast, the USAT Liberty — an American cargo ship torpedoed in 1942 and beached at Tulamben — was pushed into the sea by the 1963 eruption of Mount Agung. It now lies about forty metres from the shore, roughly 120 metres long, from about five metres to thirty deep. You walk in over the stones; no boat is needed. Amed, a few kilometres up the coast, has gentle reef slopes and the calmest training water on the island, at its best in April and May.',
      'Across the strait, Nusa Penida is a different kind of diving. Manta Point is a shallow cleaning station where reef mantas are seen almost year round, though the surge can be heavy. Crystal Bay is where mola mola come up from deep water, from roughly July to October, in upwellings of 16–22°C and colder below the thermocline. The currents around Penida are strong and change quickly, and the exposed sites are for experienced divers. Manta rays have been fully protected in Indonesia since 2014.',
      'In the north-west, Menjangan Island sits in West Bali National Park, a short boat ride from Pemuteran: reef tops at about three metres falling to walls of around thirty. Pemuteran has run a Biorock reef restoration project since 2000, and Secret Bay at Gilimanuk is muck diving at two to twelve metres — ghost pipefish, seahorses, frogfish and Banggai cardinalfish.',
      'The east coast fills the gap. From Padang Bai, the Blue Lagoon has white-tip reef sharks in sheltered water and Gili Mimpang is a short boat ride beyond it. Gili Tepekong and Gili Biaha, off Candidasa, are pinnacles, canyons and a shark cave in current that deserves its reputation — experienced divers only.',
    ],
    numbers: [
      { value: '5–30 m', label: 'the depth range of the USAT Liberty, about 40 m from the beach at Tulamben', source: 'Wikipedia; Tulamben dive operators' },
      { value: '16–22°C', label: 'water at Crystal Bay in mola season, and colder below the thermocline', source: 'Nusa Penida dive operators, 2025–26' },
      { value: '18 hours', label: 'DAN’s minimum surface interval before flying after repeat dives', source: 'Divers Alert Network' },
      { value: '2014', label: 'the year manta rays became fully protected in Indonesia', source: 'KEPMEN-KP No. 4/2014, Ministry of Marine Affairs and Fisheries' },
    ],
    venues: [
      { name: 'USAT Liberty', area: 'Tulamben', note: 'A wartime wreck forty metres off the beach, from five metres down. Best early, before the day boats.' },
      { name: 'Manta Point', area: 'Nusa Penida', note: 'A shallow cleaning station where reef mantas come most of the year. Expect surge.' },
      { name: 'Crystal Bay', area: 'Nusa Penida', note: 'Mola mola from July to October, cold upwellings and strong currents. Experienced divers.' },
      { name: 'Menjangan Island', area: 'West Bali National Park', note: 'Shallow reef tops and walls to about thirty metres, reached by boat from Pemuteran.' },
      { name: 'Blue Lagoon and the Gilis', area: 'Padang Bai · Candidasa', note: 'White-tips in sheltered water; Tepekong and Biaha in current, for the experienced.' },
      { name: 'Secret Bay', area: 'Gilimanuk', note: 'Muck diving at two to twelve metres. Ghost pipefish, seahorses, frogfish.' },
    ],
    season: {
      ratings: [1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 2, 1],
      summary: 'Bali is dived all year. April to November is best; from December to March rain run-off can bring visibility down to 5–10 m on some coasts, against up to about 30 m in the dry season.',
      notes: [
        { label: 'Dry season', months: 'April – November', text: 'Calmer seas and the best visibility. North and east coast water runs at about 27–30°C.' },
        { label: 'Mola season', months: 'July – October', text: 'Cold upwellings off Nusa Penida bring mola mola shallow, most reliably from July to September.' },
        { label: 'Wet season', months: 'December – March', text: 'Lower visibility near river mouths and afternoon storms. Nyepi, in March, closes the island and airport for a day.' },
      ],
    },
    practical: [
      { icon: 'medicine-box', title: 'Recompression', text: 'The island’s chamber is at Prof. Ngoerah General Hospital (formerly Sanglah), Denpasar. Dive insurance that covers treatment is a condition of joining.' },
      { icon: 'wallet', title: 'Park fees', text: 'Penida’s marine park fee is IDR 100,000 plus a IDR 25,000 Klungkung charge; Menjangan has its own national park fee. All included.' },
      { icon: 'field-time', title: 'Flying after diving', text: 'DAN’s minimum is 18 hours after repeat dives. We keep the last full day dry, so you have more than a day.' },
      { icon: 'safety', title: 'Wetsuits', text: 'A 3 mm suit is enough on the north and east coasts. At Penida in mola season we issue 5 mm and a hood.' },
    ],
    sources: [
      { label: 'Divers Alert Network — flying after diving', url: 'https://dan.org/health-medicine/health-resources/diseases-conditions/flying-after-diving/' },
      { label: 'Wikipedia — USAT Liberty', url: 'https://en.wikipedia.org/wiki/USAT_Liberty' },
      { label: 'PADI — Open Water Diver course', url: 'https://www.padi.com/courses/open-water-diver' },
      { label: 'Wikipedia — West Bali National Park', url: 'https://en.wikipedia.org/wiki/West_Bali_National_Park' },
      { label: 'Love Bali — the Bali tourist levy', url: 'https://lovebali.baliprov.go.id' },
    ],
    checked: 'October 2026',
  },

  profiles: [
    {
      id: 'new',
      name: 'Never dived',
      subtitle: 'Or tried it once on holiday',
      description: 'The PADI Open Water across days two to four, in the calmest water we have, then fun dives as a certified diver. Two dives a day is plenty; the habits you build in the first ten are the ones you keep.',
      priorities: ['Learn it properly the first time', 'Feel calm underwater', 'Leave certified, and still have a holiday'],
      photo: D.surface,
    },
    {
      id: 'certified',
      name: 'Certified',
      subtitle: 'And not quite at home down there',
      description: 'The most common diver here. Guided dives in groups of four, buoyancy and air use worked on quietly from the first morning, and the Advanced course if you want it.',
      priorities: ['Better buoyancy, longer dives', 'See the sites Bali is known for', 'Dive with the same guide all week'],
      photo: D.colourReef,
    },
    {
      id: 'experienced',
      name: 'Experienced',
      subtitle: 'Fifty dives or more, at ease in current',
      description: 'The sites that need more of you: drifts off Penida, the pinnacles off Candidasa, Crystal Bay in mola season. Three dives a day, night dives if you want them, and guides who know when to call it.',
      priorities: ['Currents and big animals', 'Volume without shortcuts', 'A guide who reads the water'],
      photo: D.fishWall,
    },
  ],

  dayShape: [
    { icon: 'coffee', time: '06:45', title: 'Light breakfast', text: 'Enough to dive on. The proper one comes later.' },
    { icon: 'compass', time: '07:30', title: 'Briefing', text: 'The site, the plan, the turn pressure — then the boat or the beach.' },
    { icon: 'eye', time: '08:15', title: 'First dive', text: 'Flattest water and best visibility of the day.' },
    { icon: 'field-time', time: '10:30', title: 'Second dive', text: 'After a full surface interval. Shallower than the first.' },
    { icon: 'sun', time: '14:30', title: 'Third dive, or not', text: 'On fuller weeks. On lighter ones, the afternoon is yours.' },
    { icon: 'team', time: '19:30', title: 'Dinner', text: 'Logbooks on the table. Night dives go in first, on the nights there are any.' },
  ],
  included: [
    'Guided dives, four divers to a guide',
    'Boats, tanks, weights and park fees',
    'Accommodation at the tier you pick',
    'Airport transfers, where the week includes them',
    'Breakfast daily, and dinner together most nights',
    'A signed logbook and notes on what to work on',
  ],
  notIncluded: [
    'Flights — you will find better ones than we would',
    'Dive insurance that covers recompression, which we ask you to hold',
    'Your own mask and computer, if you prefer them — ours are fine',
    'The Bali tourist levy (IDR 150,000, paid once online)',
  ],

  bases: [
    {
      id: 'amed',
      name: 'Amed & Tulamben',
      subtitle: 'Karangasem · North-east coast',
      tagline: 'Shore diving under the volcano.',
      description: 'A string of fishing villages below Mount Agung, with calm reef slopes off every beach and the Liberty wreck twenty minutes up the road. Almost everything is a shore entry, which makes it the best place on the island to learn and the easiest to dive three times a day.',
      lat: -8.34,
      lon: 115.66,
      stats: [{ label: 'Liberty wreck', value: '5–30 m' }, { label: 'Entry', value: 'Shore' }],
      driveToAirportMin: 150,
      bestFor: ['Open Water courses', 'Wreck diving', 'Three-dive days'],
      photo: B.agungDusk,
    },
    {
      id: 'penida',
      name: 'Nusa Lembongan',
      subtitle: 'Klungkung · Across the strait',
      tagline: 'Mantas, mola and real current.',
      description: 'We stay on Lembongan and take the boat across to Penida each morning. Manta Point is a short ride, and in season Crystal Bay is where the mola come up. The currents here are the strongest we dive, so new divers stay on the sheltered side and the exposed sites wait for the experienced.',
      lat: -8.68,
      lon: 115.45,
      stats: [{ label: 'Mola season', value: 'Jul–Oct' }, { label: 'Boat from Sanur', value: '~30 min' }],
      driveToAirportMin: 105,
      bestFor: ['Manta rays', 'Experienced divers', 'Mola season'],
      photo: B.kelingking,
    },
    {
      id: 'pemuteran',
      name: 'Pemuteran',
      subtitle: 'Buleleng · North-west coast',
      tagline: 'Walls, clear water and the quietest coast.',
      description: 'A small bay on the far north-west, with boats out to Menjangan Island in West Bali National Park and the muck of Secret Bay down the coast. The water is usually calm and in October and November the visibility can be the best on the island. We take the coast road to and from the airport, never the mountain pass.',
      lat: -8.14,
      lon: 114.65,
      stats: [{ label: 'Menjangan walls', value: 'to ~30 m' }, { label: 'Biorock since', value: '2000' }],
      driveToAirportMin: 240,
      bestFor: ['Wall diving', 'Macro and photography', 'Quiet weeks'],
      photo: D.coralDiver,
    },
    {
      id: 'padangbai',
      name: 'Padang Bai',
      subtitle: 'Karangasem · East coast',
      tagline: 'Sheltered reefs, and the Gilis beyond.',
      description: 'A harbour town with the Blue Lagoon on one side and the islets off Candidasa a short boat ride away. Easy reef and white-tip sharks for certified divers, and Tepekong and Biaha for those ready for current. Ninety minutes from the airport, and the closest base to Penida for the mola trip.',
      lat: -8.53,
      lon: 115.51,
      stats: [{ label: 'Sites', value: 'Reef, pinnacle, cave' }, { label: 'To Penida', value: '~1 h by boat' }],
      driveToAirportMin: 90,
      bestFor: ['Short trips', 'Mixed groups', 'Sharks'],
      photo: D.turtle,
    },
  ],

  coaches: [
    { id: 'wayan', name: 'Wayan Sudarma', role: 'Head instructor', from: 'Amed, Indonesia', level: 'PADI Master Instructor', years: 16, bio: 'Grew up in Amed and has dived the Liberty more times than he has counted. Wayan plans every week, chooses every site against the conditions that morning, and is the reason our divers come back with better buoyancy rather than just more dives.', speaks: ['Indonesian', 'Balinese', 'English'] },
    { id: 'claire', name: 'Claire Holloway', role: 'Instructor, courses', from: 'Plymouth, England', level: 'PADI Staff Instructor', years: 10, bio: 'Taught in cold British water for six years before Bali, which shows in how calmly she runs a first dive. Claire teaches the Open Water and Advanced courses and is particularly good with people who are nervous about the first breath.', speaks: ['English', 'French'] },
    { id: 'kadek', name: 'Kadek Ayu Lestari', role: 'Guide, Nusa Penida', from: 'Nusa Lembongan, Indonesia', level: 'PADI Instructor', years: 9, bio: 'Has guided the Penida channel since she was nineteen and reads its currents better than any tide table. Kadek leads the mola weeks and decides, sometimes from the boat, which sites are diveable that day.', speaks: ['Indonesian', 'English'] },
    { id: 'hana', name: 'Hana Okabe', role: 'Instructor, photography', from: 'Osaka, Japan', level: 'PADI Instructor, EFR Instructor', years: 11, bio: 'Came to Pemuteran for the muck and stayed. Hana runs the photography days, the Menjangan weeks and our first-aid and oxygen training, and has a gift for finding things the size of a grain of rice.', speaks: ['Japanese', 'English', 'Indonesian'] },
  ],

  retreats: [
    {
      id: 'd1', slug: 'open-water-amed', name: 'First Breath', headline: 'Seven nights from never dived to certified.',
      base: 'amed', level: 'new', intensity: 'easy', stay: 'private', nights: 7,
      dates: '10–17 April 2027', month: 'April', priceFromUsd: 1340, spotsTotal: 8, spotsLeft: 5, status: 'open', coachId: 'claire',
      summary: 'The PADI Open Water in the calmest water on the island, then two days of fun dives as a certified diver. No previous experience needed.',
      body: [
        'Amed is where we teach because the water lets us. Reef slopes start at the beach, there is rarely current, and the first open-water dive can be done from the sand rather than off the back of a boat.',
        'Days two to four are the course: theory and the pool, then four training dives over two days, two a day and never rushed. On day four you are an Open Water Diver, certified to eighteen metres.',
        'After that you dive as a certified diver with the same instructor, including the Liberty wreck, and the last full day is kept dry before your flight home.',
      ],
      includes: ['PADI Open Water course and certification', '8 logged dives', 'Groups of four, one instructor', 'Private suite, seven nights', 'Airport transfers both ways', 'Breakfast daily, dinner together most nights'],
      photo: D.surface, extras: ['airport'],
    },
    {
      id: 'd2', slug: 'east-coast-padang-bai', name: 'East Coast Week', headline: 'Seven nights of reef, sharks and the Gilis.',
      base: 'padangbai', level: 'certified', intensity: 'full', stay: 'private', nights: 7,
      dates: '7–14 November 2026', month: 'November', priceFromUsd: 1740, spotsTotal: 8, spotsLeft: 3, status: 'filling', coachId: 'wayan',
      summary: 'A guided week for certified divers on the east coast. Blue Lagoon, Gili Mimpang and the sheltered side of the Candidasa islets, on nitrox.',
      body: [
        'Padang Bai is the easiest base to recommend to a certified diver who has not dived Bali before: sheltered reefs within minutes of the harbour, white-tip reef sharks in the Blue Lagoon, and the islets off Candidasa a short boat ride away.',
        'Three dives a day, two before lunch and one after, in groups of four with the same guide. Buoyancy and air use are worked on quietly from the first morning; by the end of the week most people are diving longer on the same tank.',
        'Early November is the end of the dry season. Visibility is usually still good, and the afternoon rain, when it comes, falls after the diving is done.',
      ],
      includes: ['16 logged dives', 'Nitrox fills all week', 'Groups of four, one guide', 'Private suite, seven nights', 'Airport transfers both ways', 'Surface day before the flight'],
      photo: D.turtleBlue, extras: ['nitrox', 'airport'],
    },
    {
      id: 'd3', slug: 'mola-season-penida', name: 'Mola Season', headline: 'Eight nights on Lembongan, at the right time of year.',
      base: 'penida', level: 'experienced', intensity: 'max', stay: 'villa', nights: 8,
      dates: '24 August – 1 September 2027', month: 'August', priceFromUsd: 3150, spotsTotal: 8, spotsLeft: 2, status: 'filling', coachId: 'kadek',
      summary: 'For experienced divers. Crystal Bay at dawn in the heart of mola season, Manta Point, the Penida drifts, and night dives on alternate days.',
      body: [
        'Mola mola come up from deep water off Nusa Penida from roughly July to October, most reliably in August and September. They are never guaranteed, and anyone who promises one is guessing. What we can do is be on the site first, more than once, in the right month.',
        'The water at Crystal Bay in season can be 16–22°C and colder below the thermocline, and the current there can turn without warning. That is why this week is for experienced divers only, and why Kadek decides on the boat, not the night before, where we go in.',
        'The rest of the week is Manta Point, the drifts along the north coast, and night dives on alternate evenings. A land day in the middle and a dry day at the end keep eight nights of heavy diving sensible.',
      ],
      includes: ['18 logged dives', 'Crystal Bay at dawn, first boat on site', 'Nitrox fills all week', 'Whole villa on Lembongan, eight nights', 'Sports massage every third night', 'Land day mid-week, surface day before the flight'],
      photo: D.mantaBelly, extras: ['nitrox', 'mola', 'massage', 'airport'],
    },
    {
      id: 'd4', slug: 'menjangan-walls', name: 'Menjangan Walls', headline: 'Seven nights in the clearest water of the year.',
      base: 'pemuteran', level: 'certified', intensity: 'full', stay: 'private', nights: 7,
      dates: '9–16 October 2027', month: 'October', priceFromUsd: 1880, spotsTotal: 6, spotsLeft: 6, status: 'open', coachId: 'hana',
      summary: 'Wall diving in West Bali National Park and muck at Secret Bay, with a photographer in the water on two days.',
      body: [
        'Menjangan Island sits inside West Bali National Park, a short boat ride from Pemuteran. Reef tops at about three metres fall away to walls of around thirty, and in October the visibility is often the best of the year.',
        'Hana splits the week between the walls and the small things: a morning at Secret Bay looking for ghost pipefish and seahorses, the Biorock reef at Pemuteran, and two days with a photographer in the water and a camera for the rest.',
        'It is a long drive from the airport, and the quietest week we run. People who book it tend to say that was the point.',
      ],
      includes: ['16 logged dives', 'Photographer in the water on two days', 'Camera hire for the rest of the week', 'Nitrox fills all week', 'Private suite, seven nights', 'Airport transfers by the coast road'],
      photo: D.reef, extras: ['nitrox', 'camera', 'airport'],
    },
    {
      id: 'd5', slug: 'advanced-week-amed', name: 'Advanced in a Week', headline: 'Six nights, five adventure dives, and the Liberty at night.',
      base: 'amed', level: 'certified', intensity: 'full', stay: 'shared', nights: 6,
      dates: '6–12 June 2027', month: 'June', priceFromUsd: 1600, spotsTotal: 8, spotsLeft: 4, status: 'open', coachId: 'wayan',
      summary: 'The PADI Advanced course in the first two days — deep, navigation, buoyancy, the wreck — then guided diving and two night dives.',
      body: [
        'The Advanced course is five adventure dives, and it is only as good as the water it is taught in. Amed and Tulamben are close to ideal: a wreck for the wreck dive, a drop-off for the deep dive, and calm slopes for navigation and buoyancy.',
        'The course takes the first two days. After that you dive as an Advanced diver, certified to thirty metres, with the same instructor and a group of four.',
        'Two night dives sit in the middle of the week, one on the Liberty. It is a different wreck in torchlight.',
      ],
      includes: ['PADI Advanced course and certification', '15 logged dives, two of them at night', 'Groups of four, one instructor', 'Shared villa room, six nights', 'Airport transfers both ways', 'Surface day before the flight'],
      photo: D.silhouette, extras: ['advanced', 'night', 'airport'],
    },
    {
      id: 'd6', slug: 'manta-weekend-lembongan', name: 'Manta Weekend', headline: 'Four nights, if that is all you have.',
      base: 'penida', level: 'certified', intensity: 'easy', stay: 'private', nights: 4,
      dates: 'Most weeks, April to November', month: 'Flexible', priceFromUsd: 820, spotsTotal: 8, spotsLeft: 6, status: 'open', coachId: 'kadek',
      summary: 'For certified divers already in the region. Two days of diving off Penida, Manta Point included, and a dry day before you fly.',
      body: [
        'Short, and honest about it. Two days in the water, two dives each morning, and a check dive on the afternoon you arrive. Manta Point is on the list; the mantas usually are too, though nobody can promise them.',
        'The dry day before you fly is not optional, which on a four-night trip feels like a lot. It is the reason the trip is four nights and not three.',
        'Popular with people living in Singapore, Jakarta and Perth who come more than once a year.',
      ],
      includes: ['5 logged dives', 'Manta Point included', 'Groups of four, one guide', 'Private suite on Lembongan, four nights', 'Airport transfers and the boat both ways'],
      photo: D.manta, extras: ['airport'],
    },
  ],

  testimonials: [
    { quote: 'I was terrified of the first breath. Claire did the whole first pool session kneeling in front of me, and by the fourth training dive I had stopped thinking about the regulator at all.', name: 'Sophie L.', detail: 'First Breath, Amed · learnt at 41' },
    { quote: 'We saw a mola on the second morning at Crystal Bay and not on the other two. Kadek had told us exactly that might happen, which is why I believed everything else she said.', name: 'Henrik A.', detail: 'Mola Season, Lembongan · 300 dives' },
    { quote: 'I came with eighty dives and went home with better air consumption than I had after a hundred. Nobody lectured me; Wayan just kept adjusting my weights.', name: 'Rachel M.', detail: 'East Coast Week, Padang Bai · dives in Sydney' },
    { quote: 'The surface day annoyed me when I booked and was my favourite day of the week. The flight home was the first one after diving I did not spend worrying about.', name: 'David K.', detail: 'Menjangan Walls, Pemuteran · dives in Hong Kong' },
  ],

  faqs: [
    { question: 'Do I need to be certified?', answer: 'No. New divers take the PADI Open Water during the week, on days two to four, and dive as certified divers after that. A week shorter than five nights starts the course as a referral, to finish on a later trip.' },
    { question: 'Is this a booking?', answer: 'Not yet. Everything you build here is an indication, including the price. We come back with the dates we can actually hold — boats, rooms and instructors — and you confirm in writing before any money moves.' },
    { question: 'Why is the last full day dry?', answer: 'Because you fly the day after. DAN’s minimum surface interval before flying after repeat dives is 18 hours; we keep the whole last day out of the water so you have well over a day. Snorkelling is fine.' },
    { question: 'Do I need a medical?', answer: 'Everybody fills in the standard diver medical questionnaire before the trip. If you answer yes to anything on it, you will need a doctor’s sign-off before diving, so send it early.' },
    { question: 'Will I see a mola or a manta?', answer: 'Mantas at Manta Point are likely most of the year. Mola are seasonal, roughly July to October, and never certain. We put you on the right site at the right time; the animals decide the rest.' },
    { question: 'What if something goes wrong?', answer: 'Every guide carries oxygen and first aid, and the island’s recompression chamber is at Prof. Ngoerah General Hospital in Denpasar. Dive insurance that covers treatment is a condition of joining.' },
    { question: 'Do I need my own kit?', answer: 'No. Full kit is included, and fitted on the first afternoon. Most people bring their own mask and computer, which we recommend if you have them.' },
    { question: 'Can a non-diver come?', answer: 'Yes. Partners who do not dive stay at the same base, join the boat to snorkel where it is safe to, and have the land day with everyone else.' },
  ],

  journal: [
    {
      slug: 'mola-season-crystal-bay', title: 'Mola at Crystal Bay: what the season is really like', category: 'Bali',
      excerpt: 'Cold water, strong current and a fish that may not turn up. Why it is still worth the early boat.',
      readMinutes: 6, date: '2026-09-04', author: 'Kadek Ayu Lestari', photo: D.mantaGlide,
      body: [
        'Mola mola live deep and come up to cleaning stations off Nusa Penida when cold water rises from below. The season runs roughly July to October, and in most years August and September are the most reliable. Even then, a sighting is a good morning, not a promise.',
        'The cold is real. On a mola dive the water can be 16–22°C, and below a thermocline it can drop further in a single metre. We issue 5 mm suits and hoods for these weeks, and people who arrive with a 3 mm shorty learn why on the first descent.',
        'The current matters more than the cold. Crystal Bay can be still at the start of a dive and running hard twenty minutes later, sometimes downwards. That is why we take only experienced divers there, and why the decision to go in is made on the boat.',
        'The early boat is the other half of it. Being first on the site means the mola, if they are there, have not yet been surrounded. It is the one dive of the week worth setting an alarm for.',
      ],
    },
    {
      slug: 'why-we-keep-the-last-day-dry', title: 'Why we keep the last day dry', category: 'Safety',
      excerpt: 'Eighteen hours is the minimum. Here is why we plan for more, and what the day is for.',
      readMinutes: 5, date: '2026-08-12', author: 'Wayan Sudarma', photo: B.dock,
      body: [
        'After a week of repeat diving your body is still carrying nitrogen when you surface from the last dive. A commercial cabin is pressurised to the equivalent of a mountain, and going to altitude too soon raises the risk of decompression sickness.',
        'Divers Alert Network’s guidance is a minimum surface interval of 18 hours before flying after multiple dives or multiple days of diving, and it notes that a longer interval appears prudent. We keep the whole last day out of the water, which gives every diver well over a day.',
        'The same reasoning applies on land. The roads up to Kintamani and Bedugul climb past a thousand metres, so the land days after diving stay on low ground: water palaces, coast and cliffs rather than crater rims.',
        'The day itself is not wasted. People snorkel, sleep, have a massage, fill in their logbooks properly and go to dinner without worrying about tomorrow.',
      ],
    },
    {
      slug: 'secret-bay-and-the-case-for-muck', title: 'Secret Bay, and the case for muck', category: 'Technique',
      excerpt: 'Two to twelve metres of grey sand, and some of the best diving on the island.',
      readMinutes: 6, date: '2026-07-08', author: 'Hana Okabe', photo: D.nudibranch,
      body: [
        'Secret Bay at Gilimanuk does not look like much from the surface: a sheltered bay, grey sand, a few metres of water. Underneath it is one of the richest muck sites in Bali — ghost pipefish, seahorses, frogfish, Banggai cardinalfish.',
        'Muck diving rewards a different kind of diver. You move slowly, you stay off the bottom, and you look at things the size of a fingernail for minutes at a time. Good buoyancy is the whole skill, which is why it is the best buoyancy lesson we know.',
        'It is also shallow, sheltered and usually calm, so newly certified divers can do it. Some of the best photographs our guests take all week come from two metres of water.',
      ],
    },
  ],

  planner,

  whatsapp: 'Hello Sports in Paradise, I’d like to talk about a dive retreat in Bali.',
  cta: {
    heading: 'Tell Us How You Dive.',
    lede: 'How many dives you have, roughly when you can travel, and what you want to see. You will get a real schedule and a real price back — and nothing is held until you say so.',
  },
};
