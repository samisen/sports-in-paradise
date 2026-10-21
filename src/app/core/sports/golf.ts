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

const G = PHOTOS.golf;
const B = PHOTOS.bali;

/* ------------------------------------------------------------ planner --- */

type CourseId = 'newkuta' | 'pandawa' | 'handara';

/** The three courses a week is built from. Bukit Pandawa is all par 3s, so it plays quicker. */
const COURSES: Record<CourseId, { name: string; par3: boolean; sub: string }> = {
  newkuta: { name: 'New Kuta', par3: false, sub: 'Links-style, on the Pecatu cliffs' },
  pandawa: { name: 'Bukit Pandawa', par3: true, sub: 'Eighteen par 3s above the ocean' },
  handara: { name: 'Handara', par3: false, sub: 'Parkland at 1,200 m, cool air' },
};

/** Road time from each base to each course, in hours, at the hour we drive it. */
const TRANSFER: Record<string, Record<CourseId, number>> = {
  bukit: { newkuta: 0.25, pandawa: 0.25, handara: 2.25 },
  nusadua: { newkuta: 0.5, pandawa: 0.5, handara: 2 },
  sanur: { newkuta: 0.75, pandawa: 0.75, handara: 1.75 },
  bedugul: { newkuta: 2, pandawa: 2, handara: 0 },
};

/** Minutes from the airport, for arrival and departure days. */
const AIRPORT_MIN: Record<string, number> = { bukit: 40, nusadua: 25, sanur: 30, bedugul: 150 };

const LEVEL_WORDS: Record<string, { lesson: string; sub: string; round: string }> = {
  beginner: { lesson: 'Lesson: the basics', sub: 'Grip, set-up, solid contact', round: 'Coach plays with your group' },
  mid: { lesson: 'Technical lesson', sub: 'One swing change, built properly', round: 'Coach walks the round with you' },
  low: { lesson: 'Performance lesson', sub: 'Wedge distances, shot shape, numbers', round: 'Course management, scored' },
};

const transferTo = (c: RetreatConfig, course: CourseId) => (TRANSFER[c.base] ?? TRANSFER['bukit'])[course];

/** Where the practice ground is: Handara if you sleep there, New Kuta otherwise. */
const practiceCourse = (c: RetreatConfig): CourseId => (c.base === 'bedugul' ? 'handara' : 'newkuta');

/**
 * Which course a training day plays. Beginners live on the par-3 course and
 * see New Kuta every third day; everyone else plays New Kuta and drops to
 * Bukit Pandawa every third day for a round that is all short game.
 */
function courseFor(c: RetreatConfig, k: number): CourseId {
  if (c.base === 'bedugul') return 'handara';
  if (c.level === 'beginner') return k % 3 === 2 ? 'newkuta' : 'pandawa';
  return k % 3 === 2 ? 'pandawa' : 'newkuta';
}

/** Holes and hours for a round. Beginners play nine on a full-length course, whatever the week. */
function roundFor(c: RetreatConfig, course: CourseId): { holes: number; hours: number } {
  const info = COURSES[course];
  let holes = c.intensity === 'nine' ? 9 : 18;
  if (c.level === 'beginner' && !info.par3) holes = 9;
  const hours = info.par3 ? holes / 6 : holes / 4;
  return { holes, hours };
}

/**
 * The morning at the course: drive, warm up, play. Tee times are as early as
 * the drive allows — by eleven the fairways on the Bukit are well over thirty
 * degrees and the round that matters has to be finished.
 */
function morningRound(c: RetreatConfig, course: CourseId, blocks: Block[], label?: string, sub?: string): number {
  const t = transferTo(c, course);
  const tee = Math.max(6.75, 6 + t + 0.5);
  if (t > 0) blocks.push(block('drive', `Drive to ${COURSES[course].name}`, 'travel', tee - 0.5 - t, tee - 0.5));
  blocks.push(block('warmup', 'Range warm-up', 'coaching', tee - 0.5, tee, 'Wedges to driver, then the putting green'));
  const { holes, hours } = roundFor(c, course);
  const name = label ?? `${holes} holes · ${COURSES[course].name}`;
  blocks.push(block('round', name, 'play', tee, tee + hours, sub ?? COURSES[course].sub, holes));
  return tee + hours;
}

/** Dinner never runs past the end of the day: evening extras give way first. */
function evening(c: RetreatConfig, i: number, from: number, blocks: Block[], label = 'Dinner together'): void {
  let cur = from;
  if (has(c, 'massage') && i % 3 === 0 && cur <= 18.5) {
    blocks.push(block('massage', 'Sports massage', 'recovery', cur, cur + 1, 'Back, hips and forearms'));
    cur += 1.25;
  }
  if (has(c, 'mobility') && cur <= 18.75) {
    blocks.push(block('mobility', 'Mobility and yoga', 'recovery', cur, cur + 0.75, 'Hips and upper back'));
    cur += 1;
  }
  blocks.push(block('dinner', label, 'meal', Math.max(19.5, cur), 21));
}

function trainingDay(c: RetreatConfig, i: number, k: number): Day {
  const w = LEVEL_WORDS[c.level] ?? LEVEL_WORDS['mid'];
  const course = courseFor(c, k);
  const blocks: Block[] = [];
  let cur = morningRound(c, course, blocks, undefined, `${COURSES[course].sub} · ${w.round}`);

  if (c.intensity === 'nine') {
    blocks.push(block('lesson', w.lesson, 'coaching', cur + 0.25, cur + 1.5, w.sub));
    cur += 1.5;
  }
  blocks.push(block('lunch', 'Lunch at the clubhouse', 'meal', cur + 0.25, cur + 1.25));
  cur += 1.25;
  if (c.intensity !== 'nine') {
    blocks.push(block('review', 'Round review', 'coaching', cur, cur + 0.5, 'Where the shots went, with the card'));
    cur += 0.5;
  }

  const trackmanDay = has(c, 'trackman') && (k === 0 || k === 3);
  const shortDay = has(c, 'shortgame') && (k === 1 || k === 4);

  if (c.intensity === 'tour') {
    // the afternoon block is the practice ground, whatever it is focused on
    const home = practiceCourse(c);
    const back = transferTo(c, course);
    const pt = transferTo(c, home);
    if (back > 0) blocks.push(block('home', 'Back to base', 'travel', cur, cur + back));
    cur += back;
    blocks.push(block('midday', 'Afternoon off', 'free', cur, 16 - pt, 'Pool, sleep, shade'));
    if (pt > 0) blocks.push(block('drive2', `Drive to ${COURSES[home].name}`, 'travel', 16 - pt, 16));
    const label = trackmanDay ? 'Launch-monitor session' : shortDay ? 'Short-game school' : 'Coached practice';
    const sub = trackmanDay
      ? 'Carry numbers for every club'
      : shortDay
        ? 'Inside eighty yards, and bunkers'
        : 'What the morning round asked for';
    blocks.push(block('practice', label, 'coaching', 16, 18, sub));
    cur = 18;
    if (pt > 0) blocks.push(block('home2', 'Back to base', 'travel', cur, cur + pt));
    cur += pt;
    evening(c, i, cur + 0.25, blocks);
  } else {
    if (trackmanDay) {
      blocks.push(block('trackman', 'Launch-monitor session', 'coaching', cur, cur + 1, 'Carry numbers for every club'));
      cur += 1;
    } else if (shortDay) {
      blocks.push(block('shortgame', 'Short-game school', 'coaching', cur, cur + 1.5, 'Inside eighty yards, and bunkers'));
      cur += 1.5;
    }
    const back = transferTo(c, course);
    if (back > 0) blocks.push(block('home', 'Back to base', 'travel', cur, cur + back));
    cur += back;
    blocks.push(block('midday', 'Afternoon off', 'free', cur, 17.5, 'Too hot for golf'));
    evening(c, i, 17.5, blocks);
  }
  return day(i, 'Golf', 'core', true, blocks);
}

/**
 * The away day. From the south it is Handara: two hours up into the
 * highlands, a round in cool air, the lake temple, and the drive home. From
 * Bedugul it runs the other way, down to New Kuta and the ocean.
 */
function awayDay(c: RetreatConfig, i: number): Day {
  const blocks: Block[] = [];
  if (c.base === 'bedugul') {
    const course: CourseId = c.level === 'beginner' ? 'pandawa' : 'newkuta';
    let cur = morningRound(c, course, blocks, undefined, 'Later tee time; the coast is hotter');
    blocks.push(block('lunch', 'Lunch by the sea', 'meal', cur + 0.25, cur + 1.25));
    cur += 1.25;
    blocks.push(block('beach', 'Beach afternoon', 'experience', cur + 0.25, cur + 2, 'Dreamland or Balangan'));
    cur += 2;
    blocks.push(block('home', 'Back up to Bedugul', 'travel', cur + 0.25, cur + 2.25));
    blocks.push(block('dinner', 'Dinner at Handara', 'meal', Math.max(19.5, cur + 2.5), 21));
    return day(i, 'Coast day', 'peak', true, blocks);
  }
  let cur = morningRound(c, 'handara', blocks, undefined, 'Peter Thomson’s course, 1,200 m up');
  blocks.push(block('lunch', 'Lunch at Handara', 'meal', cur + 0.25, cur + 1.25));
  cur += 1.25;
  blocks.push(block('temple', 'Ulun Danu Beratan', 'experience', cur + 0.25, cur + 1.25, 'The lake temple, ten minutes away'));
  cur += 1.25;
  const back = transferTo(c, 'handara');
  blocks.push(block('home', 'Drive back south', 'travel', cur + 0.25, cur + 0.25 + back));
  blocks.push(block('dinner', 'Late dinner', 'meal', Math.max(19.5, cur + 0.5 + back), 21));
  return day(i, 'Highlands', 'peak', true, blocks);
}

function competitionDay(c: RetreatConfig, i: number): Day {
  const blocks: Block[] = [];
  const course: CourseId = c.base === 'bedugul' ? 'handara' : 'newkuta';
  const format = c.level === 'beginner' ? 'Closing scramble' : 'Closing stableford';
  const sub = c.level === 'beginner' ? 'Teams of four, best ball counts' : 'Full handicaps, scored cards';
  let cur = morningRound(c, course, blocks, `${format} · ${COURSES[course].name}`, sub);
  blocks.push(block('lunch', 'Lunch at the clubhouse', 'meal', cur + 0.25, cur + 1.25));
  cur += 1.25;
  const back = transferTo(c, course);
  if (back > 0) blocks.push(block('home', 'Back to base', 'travel', cur, cur + back));
  cur += back;
  blocks.push(block('midday', 'Afternoon off', 'free', cur, 17.5));
  if (has(c, 'massage')) blocks.push(block('massage', 'Sports massage', 'recovery', 17.5, 18.5));
  blocks.push(block('dinner', 'Prizes and closing dinner', 'meal', 19, 21));
  return day(i, 'Competition', 'peak', true, blocks);
}

function restDay(c: RetreatConfig, i: number): Day {
  const b: Block[] = [];
  if (has(c, 'mobility')) b.push(block('mobility', 'Sunrise mobility', 'recovery', 6.5, 7.25, 'No clubs today'));
  b.push(block('slow', 'Slow morning', 'free', 7.5, 11, 'No alarm, no tee time'));
  b.push(block('beach', c.base === 'bedugul' ? 'Lakes and gardens' : 'Beach or pool', 'free', 11, 14));
  if (has(c, 'spa')) b.push(block('spa', 'Spa afternoon', 'recovery', 14.5, 16.5, 'Balinese massage and a long soak'));
  let dinnerAt = 19.5;
  if (has(c, 'temple')) {
    if (c.base === 'bedugul') {
      b.push(block('temple', 'Ulun Danu Beratan', 'experience', 17, 18.5, 'The lake temple at dusk'));
    } else {
      b.push(block('temple', 'Uluwatu temple and Kecak', 'experience', 17, 19.5, 'Sunset on the cliffs, with a guide'));
      dinnerAt = 19.75;
    }
  } else {
    b.push(block('putting', 'Putting game', 'play', 17, 18, 'Nine holes on the practice green, drinks after'));
  }
  b.push(block('dinner', 'Dinner out', 'meal', dinnerAt, 21));
  return day(i, 'Rest day', 'rest', false, b);
}

function build(c: RetreatConfig): Day[] {
  const days: Day[] = [];
  const total = c.nights + 1;
  const rest = restDayIndex(c.nights);
  const finals = has(c, 'competition') && c.nights >= 4 ? total - 1 : -1;
  let away = -1;
  if (has(c, 'highlands') && c.nights >= 5) {
    away = rest > 0 && rest + 1 < total && rest + 1 !== finals ? rest + 1 : rest - 1;
  }
  const airport = (AIRPORT_MIN[c.base] ?? 40) / 60;
  const home = practiceCourse(c);
  const pt = transferTo(c, home);

  let k = 0;
  for (let i = 1; i <= total; i++) {
    if (i === 1) {
      const b: Block[] = [];
      let settleFrom = 12;
      if (has(c, 'airport')) {
        b.push(block('transfer', 'Airport pickup', 'travel', 10, 10 + airport));
        settleFrom = Math.max(12, 10 + airport + 0.25);
      }
      b.push(block('settle', 'Check in and settle', 'free', settleFrom, 15));
      if (pt > 0) b.push(block('drive', `Drive to ${COURSES[home].name}`, 'travel', 16 - pt, 16));
      b.push(block('range', 'Range session', 'coaching', 16, 17.5, 'Your swing seen, your clubs checked, a plan made'));
      if (pt > 0) b.push(block('home', 'Back to base', 'travel', 17.5, 17.5 + pt));
      b.push(block('dinner', 'Welcome dinner', 'meal', 19.5, 21));
      days.push(day(i, 'Arrival', 'arrival', false, b));
    } else if (i === total) {
      const b: Block[] = [block('breakfast', 'Breakfast', 'meal', 7.5, 8.5)];
      b.push(block('plan', 'Plan for home', 'coaching', 9, 10, 'A last look at the putting stroke, and a written practice plan'));
      b.push(block('checkout', 'Check out', 'free', 11, 12));
      if (has(c, 'airport')) b.push(block('transfer', 'Airport drop-off', 'travel', 13, 13 + airport));
      days.push(day(i, 'Departure', 'departure', false, b));
    } else if (i === rest) {
      days.push(restDay(c, i));
    } else if (i === finals) {
      days.push(competitionDay(c, i));
    } else if (i === away) {
      days.push(awayDay(c, i));
    } else {
      days.push(trainingDay(c, i, k));
      k++;
    }
  }
  return days;
}

const planner: PlannerSpec = {
  levels: [
    { id: 'beginner', name: 'No handicap yet', note: 'Range, short game and the par-3 course' },
    { id: 'mid', name: 'Club golfer', note: 'Handicap roughly 12 to 28' },
    { id: 'low', name: 'Single figures', note: 'Low handicap, or competes' },
  ],
  intensities: [
    { id: 'nine', name: 'Nine and a lesson', note: 'Nine holes at dawn, then an hour on the range', sessions: '9 holes/day', perDay: 130 },
    { id: 'eighteen', name: 'A round a day', note: 'Eighteen holes every morning, coach in the group', sessions: '18 holes/day', perDay: 185 },
    { id: 'tour', name: 'Tour week', note: 'A morning round and two hours of practice in the cool', sessions: '18 holes + practice', perDay: 240 },
  ],
  bases: [
    { id: 'bukit', name: 'Bukit', note: 'New Kuta and Bukit Pandawa on the doorstep', detail: '2 courses within 15 min', multiplier: 1.15 },
    { id: 'nusadua', name: 'Nusa Dua', note: 'Resort strip, calm beach, 25 minutes to the tee', detail: 'Local course closed', multiplier: 1.2 },
    { id: 'bedugul', name: 'Bedugul', note: 'Stay at Handara, in the cool of the highlands', detail: '1,200 m, home course', multiplier: 0.85 },
    { id: 'sanur', name: 'Sanur', note: 'Quiet east coast, shortest airport run', detail: '45 min to New Kuta', multiplier: 0.9 },
  ],
  stays: STAYS,
  extras: [
    { id: 'trackman', name: 'Launch-monitor analysis', note: 'Two sessions, carry numbers for every club', perPerson: 120, group: 'course', levels: ['mid', 'low'], needs: 'For golfers with a repeatable swing' },
    { id: 'shortgame', name: 'Short-game school', note: 'Two sessions inside eighty yards', perPerson: 110, group: 'course' },
    { id: 'clubs', name: 'Premium club hire', note: 'A current fitted set, per day', perPerson: 35, group: 'course', everyNights: 1 },
    { id: 'highlands', name: 'Highlands day at Handara', note: 'A round at 1,200 m and the lake temple. From Bedugul, a coast day at New Kuta instead', perPerson: 160, group: 'course', minNights: 5, needs: 'Needs five nights or more' },
    { id: 'competition', name: 'Closing competition', note: 'Stableford, or a scramble for beginners, on the last full day', perPerson: 60, group: 'course', minNights: 4, needs: 'Needs at least four nights' },
    { id: 'massage', name: 'Sports massage', note: 'One every third night', perPerson: 55, group: 'recovery', everyNights: 3 },
    { id: 'mobility', name: 'Mobility and yoga', note: 'Before dinner, for backs that are not used to daily golf', perPerson: 70, group: 'recovery' },
    { id: 'spa', name: 'Spa afternoon', note: 'Balinese massage on the rest day', perPerson: 85, group: 'recovery', minNights: 5, needs: 'Needs a rest day, so five nights or more' },
    { id: 'temple', name: 'Temple at sunset', note: 'Uluwatu and the Kecak dance, with a guide, on the rest day', perPerson: 75, group: 'island', minNights: 5, needs: 'Needs a rest day, so five nights or more' },
    { id: 'photo', name: 'Photographer', note: 'One round photographed, files sent after', perPerson: 140, group: 'island' },
    { id: 'airport', name: 'Airport transfers', note: 'Both ways, clubs and all', perPerson: 50, group: 'logistics' },
  ],
  extraGroups: [
    { key: 'course', title: 'On the course' },
    { key: 'recovery', title: 'Recovery' },
    { key: 'island', title: 'The island' },
    { key: 'logistics', title: 'Logistics' },
  ],
  defaultConfig: {
    nights: 7,
    guests: 4,
    level: 'mid',
    intensity: 'eighteen',
    stay: 'private',
    base: 'bukit',
    extras: ['competition', 'airport'],
  },
  nightLimits: { min: 3, max: 14 },
  guestLimits: { min: 1, max: 8 },
  dayStart: 6,
  dayEnd: 21,
  words: {
    levelTitle: 'Your golf now',
    intensityTitle: 'How much golf',
    baseTitle: 'Base',
    coachingLine: 'Green fees, caddies and coaching',
    people: 'golfers',
    person: 'golfer',
  },
  metric: { label: 'holes of golf', measure: (days) => unitsIn(days) },
  logistics: { base: 40, perNight: 18 },
  statusNote: 'Rounds tee off as early as the drive allows, and nothing on the course is scheduled in the midday heat.',
  rules: [
    'First tee is 06:45 from the Bukit, a little later from Nusa Dua and Sanur. Eighteen holes take about four and a half hours, so the round is done before the worst of the heat.',
    'Courses rotate: New Kuta most days, Bukit Pandawa’s par 3s every third day. Beginners play the other way round.',
    'Handara is two hours from the south coast each way, so a day there replaces a normal day rather than squeezing in. Based in Bedugul, Handara is home and New Kuta is the away day.',
    'Caddies are standard on every course in Bali and included in the price, as are carts. Tips are yours, usually IDR 150,000–300,000 a round.',
  ],
  build,
};

/* ------------------------------------------------------------ content --- */

export const GOLF: SportSite = {
  id: 'golf',
  name: 'Golf',
  descriptor: 'Golf retreats in Bali',
  coreIdea: 'Play early. Practise properly. Go home with a lower number.',
  description:
    'Coached golf weeks in Bali, on the courses that are actually open. Plan your own week — rounds, coaching, the highlands and the island — and talk to the team who runs it.',

  hero: {
    eyebrow: 'Golf retreats in Bali',
    headline: 'Play Early. Practise Properly. Go Home With a Lower Number.',
    support:
      'Small coached golf weeks on the clifftops and in the highlands — tee times, caddies and coaching arranged with you before anything is booked.',
    photos: [G.palmsOcean, G.oceanCliff, G.sunrise],
  },
  stats: [
    { value: '186', label: 'Golfers hosted since 2023' },
    { value: '4', label: 'Coaches, two of them PGA professionals' },
    { value: '3.6', label: 'Average handicap shots saved after a week' },
    { value: '41%', label: 'Who come back within a year' },
  ],

  values: [
    {
      eyebrow: 'The golf',
      title: 'Coaching on the course, not just the range',
      lead: 'A coach in your group for the round, and practice built from what the round showed.',
      body: 'Range lessons fix swings that then fall apart on the first tee. Here the coach walks the round with you, sees the shots you actually play, and the afternoon practice is built from the card rather than from a lesson plan.',
      points: ['Four golfers to a coach, one group per tee time.', 'Rounds in the cool of the morning, never at noon.', 'A written practice plan for the months after.'],
      photo: G.swing,
    },
    {
      eyebrow: 'The island',
      title: 'Half the day is still yours',
      lead: 'Off the course by lunchtime, which leaves Bali for the afternoon.',
      body: 'An early tee time is the price of playing well here, and the reward is the afternoon. Sleep, swim, find a beach club or a temple — and if you chose the harder week, come back to the practice ground at four when it is pleasant again.',
      points: ['Afternoons are free on most days.', 'Caddies, carts and green fees are handled.', 'Four bases, from the cliffs to the highlands.'],
      photo: B.uluwatuCliffs,
    },
  ],

  sport: {
    eyebrow: 'The sport',
    title: 'Why Golf, and Why a Week',
    lead: 'A game most people play for decades without being coached through a single round. A week changes that.',
    paragraphs: [
      'Outside the United States and Mexico, more than a hundred and twelve million people now play some form of golf, according to the R&A’s 2025 participation report — about forty-four million of them on full nine- and eighteen-hole courses, and the number is still rising, led by juniors.',
      'What makes a retreat worth it is how most golfers learn. A lesson is an hour on a range; the game is four hours on a course. The gap between the two is where handicaps stall, and a week of rounds with a coach in the group is the most direct way to close it.',
    ],
    drivers: [
      { icon: 'rise', title: 'Growth', text: 'More people playing every year, and more of them young.' },
      { icon: 'aim', title: 'On-course coaching', text: 'Seeing your real shots under a real score is what moves a handicap.' },
      { icon: 'team', title: 'Fourballs', text: 'Groups of four per tee time, which is why a week alone still produces a group.' },
      { icon: 'field-time', title: 'A lifetime game', text: 'Played well into your seventies, which makes the fundamentals worth getting right.' },
    ],
    facts: [
      { value: '112 million', label: 'people playing golf in all forms, outside the USA and Mexico', source: 'R&A Global Participation Report, 2025' },
      { value: '43.9 million', label: 'nine- and eighteen-hole golfers in the same regions', source: 'R&A Global Participation Report, 2025' },
    ],
  },

  bali: {
    eyebrow: 'Golf in Bali',
    title: 'Fewer courses than the brochures say',
    lead: 'Bali was once sold as a golf island. In 2026 there are two full eighteen-hole courses open, one par-3 course, and two famous names that are closed.',
    paragraphs: [
      'The honest starting point is what has gone. Nirwana Bali, the Greg Norman course beside Tanah Lot, has been closed since 2017 and plans to relaunch it have stalled. Bali National in Nusa Dua, on the site of the old Nusa Dua course, played its last rounds in May 2025 and closed that summer for redevelopment under new owners. It is reported to be reopening as Bali Beach Country Club, possibly in 2027, but nothing is confirmed.',
      'That leaves New Kuta Golf as the main championship course in the south: eighteen links-style holes over limestone on the Pecatu cliffs, above Dreamland and Balangan beaches, designed by Ronald Fream, David Dale and Kevin Ramsey. It is busy, well kept and hosts most of the island’s tournaments. A few minutes along the coast, Bukit Pandawa is an eighteen-hole par-3 course on the cliffs — the best short-game classroom on the island.',
      'Up in the highlands, Handara has been there since 1974: a Peter Thomson course with Michael Wolveridge and Ronald Fream, par 72, set in an old volcanic caldera at about 1,200 metres. Days are around twenty-five degrees, the greens are bent grass, and it is roughly two hours from the south coast by road, which shapes how we use it.',
      'Caddies are part of golf here. Every course works with them, every package includes one, and they are usually the best local knowledge you will get on a green. Tips are on top, and expected.',
    ],
    numbers: [
      { value: '1974', label: 'the year Handara opened, designed by Peter Thomson', source: 'Inside Golf — Handara Golf & Resort at 50' },
      { value: '1,200 m', label: 'Handara’s altitude, with days around 25°C', source: 'Course and operator information, 2025' },
      { value: 'July 2025', label: 'Bali National in Nusa Dua closed for redevelopment', source: 'Top 100 Golf Courses' },
      { value: '6.95 million', label: 'foreign visitors to Bali in 2025, up 9.7% on 2024', source: 'BPS Bali, February 2026' },
    ],
    venues: [
      { name: 'New Kuta Golf', area: 'Pecatu · Bukit', note: 'Eighteen links-style holes on the clifftop; the main championship course in the south.' },
      { name: 'Bukit Pandawa Golf & Country Club', area: 'Bukit · south coast', note: 'Eighteen par 3s above the ocean. Where the short game gets done.' },
      { name: 'Handara Golf & Resort', area: 'Bedugul · highlands', note: 'Peter Thomson’s 1974 course at about 1,200 m. Cool, green, two hours from the coast.' },
      { name: 'Bali Beach Golf Course', area: 'Sanur', note: 'The island’s only nine-hole course, dating from 1972. Check it is open before you go.' },
      { name: 'Bali National Golf Club', area: 'Nusa Dua', note: 'Closed since mid-2025 for redevelopment. Reportedly to reopen under a new name.' },
      { name: 'Nirwana Bali', area: 'Tanah Lot', note: 'Closed since 2017. Still listed on older golf-travel sites; not playable.' },
    ],
    season: {
      ratings: [2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2],
      summary: 'Golf is played year round. Mornings are reliable in every month; in the wet season the storms usually come after lunch.',
      notes: [
        { label: 'Dry season', months: 'April – October', text: 'Firm fairways, lower humidity and the most dependable mornings of the year.' },
        { label: 'Wet season', months: 'November – March', text: 'Afternoon and evening storms on most days. Morning rounds are rarely lost; afternoon practice sometimes is.' },
        { label: 'Nyepi', months: 'March (19 March in 2026)', text: 'Day of Silence: the island and the airport close for twenty-four hours. No golf, no travel.' },
      ],
    },
    practical: [
      { icon: 'clock-circle', title: 'Tee off early', text: 'Tee times between 06:30 and 07:30 avoid the heat and, in the wet season, the storms.' },
      { icon: 'team', title: 'Caddies', text: 'Standard on every course and included in the green fee. Tip IDR 150,000–300,000 a round.' },
      { icon: 'wallet', title: 'Green fees', text: 'Around IDR 2 million at New Kuta with caddie, cart and tax. Included in every retreat.' },
      { icon: 'shop', title: 'Club hire', text: 'Around IDR 600,000 a round at New Kuta. Fine for a week; bring your own if you are particular.' },
    ],
    sources: [
      { label: 'Top 100 Golf Courses — Bali National', url: 'https://www.top100golfcourses.com/golf-course/bali-national' },
      { label: 'Inside Golf — Handara Golf & Resort at 50', url: 'https://www.insidegolf.com.au/golf-travel/golf_bali/balis-miracle-in-the-mist/' },
      { label: 'Bali.com — New Kuta Golf', url: 'https://bali.com/places/new-kuta-golf-club/' },
      { label: 'BPS Bali — foreign arrivals, January–December 2025', url: 'https://bali.bps.go.id/en/news/2026/02/02/347/bali-s-foreign-arrivals-jan-dec-2025-rise--with-australia-remaining-the-largest-contributor-overall-.html' },
      { label: 'R&A — global golf participation, 2025', url: 'https://www.randa.org/articles/the-randa-aims-to-open-golf-to-the-world-as-global-participation-rises-to-more-than-112-million' },
    ],
    checked: 'October 2026',
  },

  profiles: [
    {
      id: 'beginner',
      name: 'No handicap yet',
      subtitle: 'Or a few range sessions and a holiday nine',
      description: 'Nine holes a day on the par-3 course, a lesson after every round, and a full-length course by the end of the week. The pace is gentle and the caddies are patient — this is a good place to learn.',
      priorities: ['Make solid contact, reliably', 'Learn the etiquette without the embarrassment', 'Still have a holiday'],
      photo: G.tee,
    },
    {
      id: 'mid',
      name: 'Club golfer',
      subtitle: 'Handicap somewhere between 12 and 28',
      description: 'The most common golfer here. A round every morning with the coach in your group, a review of the card after lunch, and one swing change built properly rather than five half-made.',
      priorities: ['Stop the big numbers', 'Fix one thing that lasts', 'Understand course management'],
      photo: G.bunkerShot,
    },
    {
      id: 'low',
      name: 'Single figures',
      subtitle: 'Or competes at club and county level',
      description: 'A real practice block: a scored round in the morning, two hours on the practice ground in the late afternoon, launch-monitor numbers and a closing stableford that is taken seriously.',
      priorities: ['Wedge distances you trust', 'Volume with a purpose', 'Arrive at the season sharp'],
      photo: G.driver,
    },
  ],

  dayShape: [
    { icon: 'car', time: '06:00', title: 'Out early', text: 'Coffee, the drive to the course, and the range while it is still cool.' },
    { icon: 'flag', time: '06:45', title: 'First tee', text: 'Nine or eighteen holes, with a coach in the group and a caddie each.' },
    { icon: 'coffee', time: '11:30', title: 'Lunch', text: 'At the clubhouse, followed by twenty minutes on the card.' },
    { icon: 'sun', time: '13:00', title: 'The middle', text: 'Yours. Nobody plays good golf on the Bukit at one in the afternoon.' },
    { icon: 'aim', time: '16:00', title: 'Practice ground', text: 'On the harder weeks: two hours on whatever the morning exposed.' },
    { icon: 'team', time: '19:30', title: 'Dinner', text: 'Together, most nights. Where the round gets replayed, hole by hole.' },
  ],
  included: [
    'Green fees, carts and a caddie for every round',
    'Coaching in groups of four, one coach per tee time',
    'Accommodation at the tier you pick',
    'Transfers to and from every course',
    'Breakfast daily, and dinner together several nights',
    'A written practice plan for the three months after',
  ],
  notIncluded: [
    'Flights — you will find better ones than we would',
    'Caddie tips, usually IDR 150,000–300,000 a round',
    'Travel and sports insurance, which we ask you to hold',
    'The Bali tourist levy (IDR 150,000, paid once online)',
  ],

  bases: [
    {
      id: 'bukit',
      name: 'Bukit',
      subtitle: 'Badung · Pecatu and Uluwatu',
      tagline: 'Ten minutes to the first tee.',
      description: 'New Kuta and Bukit Pandawa are both a short drive from the villas, which means the earliest tee times on the island and the shortest days. The cliffs, the beaches below them and the best sunsets in Bali are the rest of it.',
      lat: -8.81,
      lon: 115.12,
      stats: [{ label: 'Courses nearby', value: '2' }, { label: 'To New Kuta', value: '10 min' }],
      driveToAirportMin: 40,
      bestFor: ['Most golf weeks', 'Tour weeks', 'Early starters'],
      photo: G.byTheSea,
    },
    {
      id: 'nusadua',
      name: 'Nusa Dua',
      subtitle: 'Badung · Resort coast',
      tagline: 'A calm beach and twenty-five minutes to the tee.',
      description: 'The resort strip, with gentle water and every kind of hotel. Its own course, Bali National, closed in 2025 for redevelopment, so we play New Kuta and Bukit Pandawa from here — a short drive either way, and a better fit for partners who do not play.',
      lat: -8.8,
      lon: 115.23,
      stats: [{ label: 'To New Kuta', value: '20–25 min' }, { label: 'Local course', value: 'Closed' }],
      driveToAirportMin: 25,
      bestFor: ['Partners who do not play', 'Families', 'Resort comfort'],
      photo: B.resortAerial,
    },
    {
      id: 'bedugul',
      name: 'Bedugul',
      subtitle: 'Tabanan · Central highlands',
      tagline: 'Twenty-five degrees and a course on the doorstep.',
      description: 'You stay at Handara, in the caldera at about 1,200 metres, and the first tee is a walk from your room. The air is cool enough to play all day, the lake temple is ten minutes away, and the coast is a long drive — which is the point.',
      lat: -8.27,
      lon: 115.16,
      stats: [{ label: 'Altitude', value: '1,200 m' }, { label: 'Course', value: 'Par 72' }],
      driveToAirportMin: 150,
      bestFor: ['Playing all day', 'Escaping the heat', 'Longer weeks'],
      photo: B.ulunDanu,
    },
    {
      id: 'sanur',
      name: 'Sanur',
      subtitle: 'Denpasar · East coast',
      tagline: 'Flat water, short transfers, easy evenings.',
      description: 'The quietest base and the shortest airport run, with a reef-protected beach and a path along the shore. The courses are forty-five minutes away, so tee times are a little later — a fair trade on a short trip.',
      lat: -8.69,
      lon: 115.26,
      stats: [{ label: 'To New Kuta', value: '45 min' }, { label: 'To airport', value: '30 min' }],
      driveToAirportMin: 30,
      bestFor: ['Short trips', 'Nine-hole weeks', 'First time in Bali'],
      photo: B.sanurDawn,
    },
  ],

  coaches: [
    { id: 'james', name: 'James Hollis', role: 'Head professional', from: 'Surrey, England', level: 'PGA Advanced Professional', years: 16, bio: 'Sixteen years teaching, ten of them as head professional at a members’ club in the south of England. James runs the on-course coaching and is known for changing one thing at a time and refusing to change the second until the first holds.', speaks: ['English'] },
    { id: 'wayan', name: 'Wayan Sudarsana', role: 'Tour professional, Bali', from: 'Tabanan, Indonesia', level: 'Indonesian tour professional', years: 9, bio: 'Grew up caddying at Handara and turned professional at twenty-three. Wayan plays the Indonesian circuit, leads the low-handicap weeks and knows every green on the island, including which way the grain runs at ten in the morning.', speaks: ['Indonesian', 'English'] },
    { id: 'claire', name: 'Claire Moreau', role: 'Short-game coach', from: 'Biarritz, France', level: 'PGA of France professional', years: 12, bio: 'Claire teaches everything inside eighty yards, which is where most handicaps are hiding. Beginners tend to start with her, and single-figure players tend to be sent to her by the end of the week.', speaks: ['French', 'English', 'Spanish'] },
    { id: 'ben', name: 'Ben Okafor', role: 'Fitness and mobility', from: 'Leeds, England', level: 'TPI-certified, MSc Sport Science', years: 10, bio: 'Builds the mobility and recovery around five or more rounds in a row, which most bodies are not used to. Ben is also the one who checks your back on day three and changes the plan if it needs changing.', speaks: ['English'] },
  ],

  retreats: [
    {
      id: 'g1', slug: 'clifftop-week-bukit', name: 'Clifftop Week', headline: 'Seven nights, a round every morning above the ocean.',
      base: 'bukit', level: 'mid', intensity: 'eighteen', stay: 'private', nights: 7,
      dates: '12–19 April 2027', month: 'April', priceFromUsd: 2090, spotsTotal: 12, spotsLeft: 5, status: 'filling', coachId: 'james',
      summary: 'The week most club golfers should start with. A round each morning with a coach in the group, the afternoons free, and a closing stableford.',
      body: [
        'Most club golfers have never had a lesson on a golf course. They have had lessons on a range, and then played the same round they always play. This week is built the other way round: the coach is in your group, sees the shots you actually hit, and the review after lunch is about your card, not a textbook.',
        'You tee off at quarter to seven, mostly at New Kuta, with Bukit Pandawa’s par 3s every third day for a round that is nothing but short game. By half past eleven you are at lunch, and by one the day is yours.',
        'The last full day is a stableford, scored and taken seriously, with prizes at dinner. Most people play it better than anything else in the week, which is the point.',
      ],
      includes: ['Five rounds with a coach in the group', 'Green fees, carts and caddies', 'Two launch-monitor sessions', 'Private suite, seven nights', 'Closing stableford and prizes', 'Airport transfers both ways'],
      photo: G.seaSwing, extras: ['trackman', 'competition', 'airport'],
    },
    {
      id: 'g2', slug: 'single-figures-block', name: 'Single Figures Block', headline: 'Ten nights of rounds, numbers and practice.',
      base: 'bukit', level: 'low', intensity: 'tour', stay: 'villa', nights: 10,
      dates: '10–20 May 2027', month: 'May', priceFromUsd: 4690, spotsTotal: 8, spotsLeft: 3, status: 'filling', coachId: 'wayan',
      summary: 'A practice block for low handicappers. A scored round each morning, two hours on the practice ground each evening, and a day at Handara in the middle.',
      body: [
        'This is the hardest golf week we run. Eighteen holes at dawn, a review of the card at lunch, and from four until six on the practice ground working on whatever the round exposed. Ten nights of that is a genuine block.',
        'Wayan sets distances for every wedge on the first two days with a launch monitor, and from then on the practice is built from the numbers. Claire takes the short-game afternoons, because that is where single-figure players still lose most of their shots.',
        'After the rest day you drive up to Handara for a round in cool air at 1,200 metres — a different game, on bent-grass greens, and a good test of whether the week has held. The block closes with a full-handicap stableford.',
      ],
      includes: ['Eight rounds, one at Handara', 'Two hours of coached practice most evenings', 'Launch-monitor and short-game sessions', 'Whole villa, eight golfers, ten nights', 'Sports massage every third night', 'Closing stableford on the last full day'],
      photo: G.flag, extras: ['trackman', 'shortgame', 'highlands', 'competition', 'massage', 'airport'],
    },
    {
      id: 'g3', slug: 'first-swing-nusadua', name: 'First Swing', headline: 'Five nights for people who have never had a handicap.',
      base: 'nusadua', level: 'beginner', intensity: 'nine', stay: 'private', nights: 5,
      dates: '23–28 November 2026', month: 'November', priceFromUsd: 1320, spotsTotal: 8, spotsLeft: 6, status: 'open', coachId: 'claire',
      summary: 'Never played a proper round? Nine holes a day on the par-3 course, a lesson after each, and nine holes on a full course by the end.',
      body: [
        'Golf is easier to learn properly than to unlearn, and a week with the same coach is the fastest way to start well. Every morning is nine holes, mostly on Bukit Pandawa, where every hole is a par 3 and a beginner can reach every green.',
        'After the round there is an hour on the range: grip, set-up and contact, one piece at a time. Clubs are provided, and the caddies — who have seen every kind of first round — are better company than you would expect.',
        'Nusa Dua is the base because it is gentle and comfortable, and because partners who do not play have plenty to do. The local course is closed for redevelopment, so we drive twenty-five minutes to the Bukit each morning.',
      ],
      includes: ['Three rounds of nine holes', 'A lesson after every round', 'Premium club hire all week', 'Private suite, five nights', 'Green fees, carts and caddies', 'Airport transfers both ways'],
      photo: G.putt, extras: ['clubs', 'airport'],
    },
    {
      id: 'g4', slug: 'highlands-week-bedugul', name: 'Highlands Week', headline: 'Six nights at 1,200 metres, the first tee outside your door.',
      base: 'bedugul', level: 'mid', intensity: 'eighteen', stay: 'private', nights: 6,
      dates: '14–20 June 2027', month: 'June', priceFromUsd: 1690, spotsTotal: 8, spotsLeft: 8, status: 'open', coachId: 'wayan',
      summary: 'A golf week in cool air. You stay at Handara, play it every morning, and drive down to New Kuta once for a day by the ocean.',
      body: [
        'At 1,200 metres the days sit around twenty-five degrees and the evenings need a jumper. That changes what a week can be: rounds are less of an ordeal, and your body recovers between them in a way it does not on the coast.',
        'Handara is a Peter Thomson course from 1974, laid out in a volcanic caldera, with bent-grass greens that roll truer than most in the tropics. You play it most mornings with Wayan, who grew up caddying there.',
        'Once in the week we reverse the usual trip and drive down to New Kuta for a round on the cliffs and an afternoon on the beach. It is a long day, and the contrast is the reason to do it.',
      ],
      includes: ['Four rounds, three at Handara', 'Coach in the group every round', 'Coast day at New Kuta', 'Private suite at Handara, six nights', 'Sports massage every third night', 'Airport transfers both ways'],
      photo: G.greenHills, extras: ['highlands', 'massage', 'airport'],
    },
    {
      id: 'g5', slug: 'short-game-week-sanur', name: 'Short Game Week', headline: 'Seven nights inside eighty yards.',
      base: 'sanur', level: 'mid', intensity: 'nine', stay: 'shared', nights: 7,
      dates: '6–13 September 2027', month: 'September', priceFromUsd: 1390, spotsTotal: 12, spotsLeft: 9, status: 'open', coachId: 'claire',
      summary: 'Where most handicaps are hiding. Nine holes each morning, a lesson after, and two afternoons of short-game school.',
      body: [
        'Most club golfers lose more shots within eighty yards of the green than everywhere else combined, and practise there least. This week turns that round.',
        'Nine holes each morning, a lesson straight after on chipping, pitching, bunkers or putting, and two longer short-game sessions in the week. Every third day is Bukit Pandawa, where every hole is a par 3 and every one of them ends in a short game.',
        'Sanur is quiet and close to the airport, and nine-hole days mean you are back by early afternoon with time for the beach.',
      ],
      includes: ['Five rounds of nine holes', 'A lesson after every round', 'Two short-game school sessions', 'Shared villa room, seven nights', 'Mobility before dinner each night', 'Airport transfers both ways'],
      photo: G.splash, extras: ['shortgame', 'mobility', 'airport'],
    },
    {
      id: 'g6', slug: 'long-weekend-bukit', name: 'Long Weekend', headline: 'Three nights, if that is all you have.',
      base: 'bukit', level: 'mid', intensity: 'eighteen', stay: 'private', nights: 3,
      dates: 'Most weekends, year round', month: 'Flexible', priceFromUsd: 850, spotsTotal: 8, spotsLeft: 6, status: 'open', coachId: 'james',
      summary: 'For golfers already in the region. Two rounds with a coach, the earliest tee times on the island, and a plan for home.',
      body: [
        'Short, and honest about it. You will not rebuild a swing in three nights, but two rounds with a coach in the group will tell you more about your game than a season of range lessons.',
        'The Bukit is the base because the courses are ten minutes away, and on a short trip every saved hour goes to golf or to sleep.',
        'Popular with golfers living in Singapore, Jakarta and Perth who come more than once a year.',
      ],
      includes: ['Two rounds with a coach in the group', 'Green fees, carts and caddies', 'Range session on arrival', 'Private suite, three nights', 'Airport transfers both ways', 'A written practice plan'],
      photo: G.carts, extras: ['airport'],
    },
  ],

  testimonials: [
    { quote: 'Twenty years of lessons on ranges and nobody had ever watched me play a hole. James saw in one round what I had been paying people to miss.', name: 'Richard M.', detail: 'Clifftop Week, Bukit · plays off 17 in Kent' },
    { quote: 'The launch-monitor numbers on day one decided the whole block. By day eight I knew my wedges to five yards, and I still do.', name: 'Siew Ling T.', detail: 'Single Figures Block, Bukit · plays off 4 in Singapore' },
    { quote: 'I came because my husband plays. I left with a nine-hole score I am proud of and a caddie who taught me more than either of us expected.', name: 'Katrin B.', detail: 'First Swing, Nusa Dua · started that week' },
    { quote: 'Handara at seven in the morning, in cool air, with a coach who grew up on the course. I have played a lot of golf trips and none that felt like that.', name: 'Graham W.', detail: 'Highlands Week, Bedugul · plays off 12 in Melbourne' },
  ],

  faqs: [
    { question: 'Do I need a handicap?', answer: 'No. We run weeks for people who have never played a full round and weeks for single-figure golfers, and they are genuinely different weeks. Tell us how you play and we will tell you which one fits.' },
    { question: 'Is this a booking?', answer: 'Not yet. Everything you build here is an indication, including the price. We come back with the tee times, rooms and coaches we can actually hold, and you confirm in writing before any money moves.' },
    { question: 'Why are the tee times so early?', answer: 'Because by eleven in the morning the fairways on the Bukit are well over thirty degrees. Teeing off at a quarter to seven means eighteen holes are done before the heat, and the afternoon is yours.' },
    { question: 'Are caddies included?', answer: 'Yes. Caddies are standard on every course in Bali and one is included for every round, along with carts and green fees. Tips are on top and expected — usually IDR 150,000 to 300,000 a round.' },
    { question: 'Which courses will I play?', answer: 'Mostly New Kuta and Bukit Pandawa on the Bukit, and Handara if you stay in the highlands or add a highlands day. Bali National in Nusa Dua and Nirwana Bali are both closed, whatever older guides say.' },
    { question: 'Should I bring my own clubs?', answer: 'If you are particular, yes — most airlines carry them for a fee. Otherwise our premium hire sets are current models, fitted to you on the first afternoon.' },
    { question: 'What happens when it rains?', answer: 'From November to March storms usually come in the afternoon, after the round. If a morning is lost, we move the round and use the time for short game under cover.' },
    { question: 'Can I bring a partner who does not play?', answer: 'Yes, and many people do. Nusa Dua and Sanur are the easiest bases for that, and the afternoons are free to spend together.' },
  ],

  journal: [
    {
      slug: 'golf-in-bali-2026', title: 'Golf in Bali: what is actually open', category: 'Bali',
      excerpt: 'Two famous courses have closed. Here is where a visiting golfer can play in 2026, and how far apart it all is.',
      readMinutes: 6, date: '2026-09-22', author: 'Wayan Sudarsana', photo: G.aerialGreen,
      body: [
        'Older guides list five or six courses on the island. As of autumn 2026, two of the best known are closed: Nirwana Bali near Tanah Lot has not been played since 2017, and Bali National in Nusa Dua closed in the summer of 2025 for redevelopment. There is talk of it reopening under a new name, but nothing is confirmed, so plan as though it is not there.',
        'In the south that leaves New Kuta, on the Pecatu cliffs, as the eighteen-hole course, with Bukit Pandawa’s par-3 course a few minutes away. Both are a short drive from the airport, and both are at their best before nine in the morning.',
        'In the highlands there is Handara, where I learned the game as a caddie. It is about two hours from the south coast by road, cool, green and unlike anything else on the island. It is worth the drive, but it is a full day, not a morning.',
        'Sanur has a nine-hole course by the beach that has been there since 1972. We do not build weeks around it, but check before you go if you would like a quiet nine.',
      ],
    },
    {
      slug: 'playing-golf-in-the-heat', title: 'Playing golf in the heat, without losing the back nine', category: 'Training',
      excerpt: 'Thirty-plus degrees and high humidity change how a round should be played. Here is how the days are built around it.',
      readMinutes: 5, date: '2026-07-15', author: 'Ben Okafor', photo: G.sunsetSwing,
      body: [
        'A round on the Bukit at midday is four and a half hours in direct sun at eight degrees south. Concentration goes first, then tempo, and most golfers notice it on the scorecard before they notice it in themselves.',
        'The answer is the tee time. Off at quarter to seven, you play the hardest holes in the cool and finish before the heat peaks. The afternoon is for rest, and the practice ground is for four o’clock, when it is pleasant again.',
        'In between: drink before you are thirsty, take salt with the water, and let the caddie carry the umbrella. Over five rounds in a row, those small things decide whether the last day is your best or your worst.',
      ],
    },
    {
      slug: 'the-shots-inside-eighty-yards', title: 'The shots inside eighty yards', category: 'Technique',
      excerpt: 'Where most handicaps are hiding, and why a par-3 course is the best classroom on the island.',
      readMinutes: 6, date: '2026-08-20', author: 'Claire Moreau', photo: G.cup,
      body: [
        'Ask a club golfer where they lose shots and they will usually point at the driver. Count the shots, and most of them are lost from inside eighty yards: the chip that runs through, the pitch left short, the third putt.',
        'Those shots are also the easiest to improve in a week, because they do not depend on strength or flexibility. They depend on a repeatable set-up, a clear picture of where the ball should land, and enough repetitions to trust both.',
        'That is why we use Bukit Pandawa. Eighteen par 3s means eighteen short-game tests in a round, under a real score, with the ocean as a distraction. By the end of the week most people have stopped dreading the short ones.',
        'The fix we start with is deliberately dull: one club, one landing spot, twenty balls. Nobody enjoys it. Everyone’s scores are different by Thursday.',
      ],
    },
  ],

  planner,

  whatsapp: 'Hello Sports in Paradise, I’d like to talk about a golf retreat in Bali.',
  cta: {
    heading: 'Tell Us How You Play.',
    lede: 'Your handicap or roughly where you are, when you can travel, and what you want out of the week. You will get a real schedule and a real price back — and nothing is held until you say so.',
  },
};
