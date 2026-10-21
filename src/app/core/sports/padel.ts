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
  hoursIn,
  restDayIndex,
} from '../planner/engine';

const P = PHOTOS.padel;
const B = PHOTOS.bali;
const L = PHOTOS.life;

/* ------------------------------------------------------------ planner --- */

const LEVEL_WORDS: Record<string, { clinic: string; match: string; sub: string }> = {
  newcomer: { clinic: 'Fundamentals', match: 'Supervised games', sub: 'Grip, contact, the glass' },
  improver: { clinic: 'Technical clinic', match: 'Match play', sub: 'Bandeja, víbora, positioning' },
  competitor: { clinic: 'Tactical clinic', match: 'Competitive sets', sub: 'Patterns, pressure, court craft' },
};

/**
 * A day on the island, not a day in a sports hall.
 *
 * Nothing serious is scheduled between ten and four: at 8°S a glass court is
 * 32°C by late morning and the sessions that matter would be wasted. Play
 * sits at either end of the day and the middle belongs to the guest.
 */
function trainingDay(c: RetreatConfig, i: number): Day {
  const w = LEVEL_WORDS[c.level];
  const blocks: Block[] = [];
  if (has(c, 'yoga')) blocks.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 7));

  const clinicEnd = c.intensity === 'light' ? 9 : 9.5;
  blocks.push(block('clinic', w.clinic, 'coaching', 7.5, clinicEnd, w.sub));
  if (has(c, 'ice-bath')) blocks.push(block('ice', 'Ice bath', 'recovery', clinicEnd + 0.25, clinicEnd + 0.75));
  blocks.push(block('breakfast', 'Breakfast', 'meal', clinicEnd + 1, clinicEnd + 2));

  if (has(c, 'video') && (i === 2 || i === 5)) {
    blocks.push(block('video', 'Video review', 'coaching', 12, 13, 'Yesterday’s footage'));
  }

  const heavy = c.intensity === 'heavy';
  blocks.push(block('midday', 'Open afternoon', 'free', 13, heavy ? 15 : 16, 'Too hot for the glass'));
  if (heavy) blocks.push(block('fitness', 'Conditioning', 'fitness', 15, 16, 'Legs, shoulders, change of direction'));

  let lastEnd = 16;
  if (c.intensity !== 'light' || i % 2 === 0) {
    lastEnd = heavy ? 18.5 : 18;
    blocks.push(block('match', w.match, 'play', 16.25, lastEnd));
  }

  // dinner waits for the massage rather than colliding with it
  let dinnerAt = 19.5;
  if (has(c, 'massage') && i % 3 === 0) {
    const start = lastEnd + 0.25;
    blocks.push(block('massage', 'Sports massage', 'recovery', start, start + 1));
    dinnerAt = Math.max(dinnerAt, start + 1.25);
  }
  blocks.push(block('dinner', 'Dinner together', 'meal', dinnerAt, Math.max(21, dinnerAt + 1.25)));
  return day(i, 'Training', 'core', true, blocks);
}

function build(c: RetreatConfig): Day[] {
  const days: Day[] = [];
  const total = c.nights + 1;
  const rest = restDayIndex(c.nights);
  const finals = has(c, 'tournament') && c.nights >= 4 ? total - 1 : -1;

  for (let i = 1; i <= total; i++) {
    if (i === 1) {
      const b: Block[] = [];
      if (has(c, 'airport')) b.push(block('transfer', 'Airport pickup', 'travel', 10, 11.5));
      b.push(block('settle', 'Check in and settle', 'free', 12, 15));
      b.push(block('hit', 'First hit', 'coaching', 16.5, 18, 'Levels, pairs, where you are'));
      b.push(block('dinner', 'Welcome dinner', 'meal', 19.5, 21));
      days.push(day(i, 'Arrival', 'arrival', false, b));
    } else if (i === total) {
      const b: Block[] = [block('clinic', 'Last court', 'coaching', 7.5, 9, 'Loose games, no drills')];
      b.push(block('breakfast', 'Breakfast', 'meal', 10, 11));
      b.push(block('checkout', 'Check out', 'free', 11, 12));
      if (has(c, 'airport')) b.push(block('transfer', 'Airport drop-off', 'travel', 13, 14.5));
      days.push(day(i, 'Departure', 'departure', false, b));
    } else if (i === rest) {
      const b: Block[] = [];
      if (has(c, 'yoga')) b.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 7));
      if (has(c, 'surf')) b.push(block('surf', 'Surf morning', 'experience', 7, 10.5, 'Board and coach included'));
      else if (has(c, 'excursion')) b.push(block('excursion', 'Island day', 'experience', 8, 16, 'Driver for the day'));
      else b.push(block('slow', 'Slow morning', 'free', 7, 11, 'No alarm'));
      if (has(c, 'massage')) b.push(block('massage', 'Sports massage', 'recovery', 16, 17));
      b.push(block('social', 'Social doubles', 'play', 17, 18.5, 'Mixed pairs, no scoring'));
      b.push(block('dinner', 'Dinner out', 'meal', 19.5, 21));
      days.push(day(i, 'Rest & explore', 'rest', false, b));
    } else if (i === finals) {
      const b: Block[] = [];
      if (has(c, 'yoga')) b.push(block('yoga', 'Sunrise yoga', 'recovery', 6.25, 7));
      b.push(block('warmup', 'Warm-up and draw', 'coaching', 7.5, 8.5));
      b.push(block('tournament', 'Americano tournament', 'play', 8.5, 11.5, 'Everyone plays everyone'));
      b.push(block('breakfast', 'Late breakfast', 'meal', 12, 13));
      if (has(c, 'ice-bath')) b.push(block('ice', 'Ice bath', 'recovery', 13.5, 14));
      b.push(block('midday', 'Open afternoon', 'free', 14, 17));
      b.push(block('final', 'Finals and prizes', 'play', 17, 18.5));
      b.push(block('dinner', 'Closing dinner', 'meal', 19.5, 21));
      days.push(day(i, 'Match day', 'peak', true, b));
    } else {
      days.push(trainingDay(c, i));
    }
  }
  return days;
}

const planner: PlannerSpec = {
  levels: [
    { id: 'newcomer', name: 'New to padel', note: 'Played a handful of times, or none' },
    { id: 'improver', name: 'Improver', note: 'Play weekly, want the technique fixed' },
    { id: 'competitor', name: 'Competitor', note: 'League or tournament player' },
  ],
  intensities: [
    { id: 'light', name: 'Light', note: 'One session a day, the island for the rest', sessions: '1 session/day', perDay: 60 },
    { id: 'balanced', name: 'Balanced', note: 'Coaching in the morning, matches in the cool', sessions: '2 sessions/day', perDay: 95 },
    { id: 'heavy', name: 'Heavy', note: 'Two on court plus conditioning', sessions: '3 sessions/day', perDay: 140 },
  ],
  bases: [
    { id: 'canggu', name: 'Canggu', note: 'Busiest padel scene, everything walkable', detail: '20+ courts nearby', multiplier: 1 },
    { id: 'uluwatu', name: 'Uluwatu', note: 'Clifftop, quieter, best for a focused block', detail: 'Covered courts', multiplier: 1.15 },
    { id: 'ubud', name: 'Ubud', note: 'Jungle and recovery, cooler air', detail: '2 clubs', multiplier: 0.85 },
    { id: 'sanur', name: 'Sanur', note: 'Calm east coast, easiest travel days', detail: 'Open 6am–11pm', multiplier: 0.9 },
  ],
  stays: STAYS,
  extras: [
    { id: 'video', name: 'Video analysis', note: 'Filmed and reviewed twice in the week', perPerson: 90, group: 'court' },
    { id: 'tournament', name: 'Closing tournament', note: 'Americano format on the last full day', perPerson: 80, group: 'court', minNights: 4, needs: 'Needs at least four nights' },
    { id: 'rackets', name: 'Racket and ball package', note: 'Demo rackets and fresh balls all week', perPerson: 60, group: 'court' },
    { id: 'ice-bath', name: 'Ice bath', note: 'After every hard session', perPerson: 60, group: 'recovery' },
    { id: 'massage', name: 'Sports massage', note: 'One every third night', perPerson: 55, group: 'recovery', everyNights: 3 },
    { id: 'yoga', name: 'Sunrise yoga', note: 'Before the morning court', perPerson: 70, group: 'recovery' },
    { id: 'gym', name: 'Strength sessions', note: 'Padel-specific conditioning', perPerson: 50, group: 'recovery' },
    { id: 'nutrition', name: 'Nutrition plan', note: 'Written for the week, food included', perPerson: 110, group: 'recovery' },
    { id: 'surf', name: 'Surf morning', note: 'Board, coach and transfer, on the rest day', perPerson: 120, group: 'island', minNights: 5, needs: 'Needs a rest day, so five nights or more' },
    { id: 'excursion', name: 'Island day', note: 'Waterfall, temple or volcano, with a driver', perPerson: 140, group: 'island', minNights: 5, needs: 'Needs a rest day, so five nights or more' },
    { id: 'photo', name: 'Photographer', note: 'On court and off, files sent after', perPerson: 130, group: 'island' },
    { id: 'airport', name: 'Airport transfers', note: 'Both ways, however late the flight', perPerson: 45, group: 'logistics' },
  ],
  extraGroups: [
    { key: 'court', title: 'On court' },
    { key: 'recovery', title: 'Recovery and wellness' },
    { key: 'island', title: 'The island' },
    { key: 'logistics', title: 'Logistics' },
  ],
  defaultConfig: {
    nights: 7,
    guests: 2,
    level: 'improver',
    intensity: 'balanced',
    stay: 'private',
    base: 'canggu',
    extras: ['ice-bath', 'airport'],
  },
  nightLimits: { min: 3, max: 14 },
  guestLimits: { min: 1, max: 8 },
  dayStart: 6,
  dayEnd: 21,
  words: {
    levelTitle: 'Where you play now',
    intensityTitle: 'How hard',
    baseTitle: 'Base',
    coachingLine: 'Coaching and court time',
    people: 'players',
    person: 'player',
  },
  metric: { label: 'hours on court', measure: (days) => hoursIn(days, ['coaching', 'play']) },
  logistics: { base: 40, perNight: 12 },
  statusNote: 'Sessions sit at either end of the day — nothing is scheduled in the midday heat.',
  rules: [
    'Court time runs 07:30–09:30 and from 16:15. Between ten and four a glass court in Bali is a sauna.',
    'Five nights or more earns a rest day in the middle, with social doubles in the cool of the evening.',
    'A closing Americano takes the last full day, so the night before you fly is a recovery night.',
  ],
  build,
};

/* ------------------------------------------------------------ content --- */

export const PADEL: SportSite = {
  id: 'padel',
  name: 'Padel',
  descriptor: 'Padel retreats in Bali',
  coreIdea: 'Play every day. Recover properly. Go home a better player.',
  description:
    'Coached padel weeks in Bali, built around how you want to play. Plan your own week — coaching, match play, recovery and the island — and talk to the team who runs it.',

  hero: {
    eyebrow: 'Padel retreats in Bali',
    headline: 'Play Every Day. Recover Properly. Go Home a Better Player.',
    support:
      'Small coached padel weeks on the island with Indonesia’s fastest-growing padel scene — planned with you before anything is booked.',
    photos: [P.courtsOutdoor, P.smash, P.pair],
  },
  stats: [
    { value: '312', label: 'Players hosted since 2023' },
    { value: '4', label: 'Coaches, none of them seasonal' },
    { value: '9.4/10', label: 'Average week rating' },
    { value: '38%', label: 'Who come back within a year' },
  ],

  values: [
    {
      eyebrow: 'The padel',
      title: 'Coaching that changes something',
      lead: 'Small groups, the same coach all week, and a plan that survives contact with a real match.',
      body: 'Groups of four, set by level rather than by who booked together. Mornings on the shots you avoid, afternoons using them under pressure, and a written list of what to work on when you get home.',
      points: ['Four players to a coach, never more.', 'Sessions at the ends of the day, not in the heat.', 'You leave with something specific to practise.'],
      photo: P.playerCourt,
    },
    {
      eyebrow: 'The island',
      title: 'A week you would want anyway',
      lead: 'Bali is not the backdrop. It is half the reason the week works.',
      body: 'The middle of every day is yours, because nothing useful happens on a glass court at one in the afternoon. Surf, sleep, eat, or go and find a waterfall — and come back to the court when it is a pleasure again.',
      points: ['The hours between sessions are genuinely free.', 'Recovery that is part of the plan, not an upsell.', 'Four bases on the island, each for a different week.'],
      photo: B.uluwatuCliffs,
    },
  ],

  sport: {
    eyebrow: 'The sport',
    title: 'Why Padel, and Why Now',
    lead: 'The fastest-growing racket sport in the world, and the one where a week of coaching still moves you a long way.',
    paragraphs: [
      'Padel is played by around thirty million people in more than a hundred and thirty countries, on a court count that has gone from roughly fourteen thousand in 2018 to over seventy thousand today.',
      'What matters for a retreat is the shape of the learning curve. The floor is unusually low — a beginner sustains a rally in their first hour — and the ceiling is high. The gap between a club player and a good one is enormous, and unlike most sports it is closable with a week of proper coaching.',
    ],
    drivers: [
      { icon: 'rise', title: 'Growth', text: 'Thirty million players, seventy thousand courts, and both still climbing.' },
      { icon: 'thunderbolt', title: 'Learning curve', text: 'Playable in an hour, and a long way from good. That gap is what a week closes.' },
      { icon: 'team', title: 'Doubles', text: 'Four players to a court, which is why a week alone still produces a group.' },
      { icon: 'safety-certificate', title: 'Low impact', text: 'Short court, soft ball. Bodies that cannot take tennis often can take this.' },
    ],
    facts: [
      { value: '30 million', label: 'people playing padel worldwide', source: 'International Padel Federation (FIP), 2025' },
      { value: '70,000+', label: 'courts worldwide, up from about 14,000 in 2018', source: 'Playtomic / FIP market reporting, 2025' },
    ],
  },

  bali: {
    eyebrow: 'Padel in Bali',
    title: 'From one court to a scene in four years',
    lead: 'Indonesia’s first padel court went up in Bali in March 2022. Today the island has one of the busiest — and most expensive — padel scenes in Asia.',
    paragraphs: [
      'Expats brought the sport over, and for the first year it was a handful of courts in Canggu shared between Spaniards, Argentines and curious surfers. The local players followed fast. By 2025 Indonesia had 293 clubs and 947 courts, up from 3 clubs and 15 courts in 2021, and Bali sits in the top five provinces by court count.',
      'Canggu and Kerobokan are the centre of gravity: the largest academy on the island has seven courts and a 200-seat show court, and a chain of jungle clubs runs from Kedungu to Sanur and Ubud. Uluwatu, Jimbaran and Nusa Dua have their own clubs now, several with covered or indoor courts — which matters more than anything else in the wet season.',
      'Courts are not cheap. Bali has the highest average court rental of any Indonesian province, around IDR 430,000 an hour, and the early slots go first for reasons anyone who has played at noon will understand. That is one practical reason a retreat works: the courts, the coach and the timing are booked as a block before you land.',
      'The sport is starting to get serious events, too. In August 2026 the island hosted FIP Promises Bali, a youth event whose 138 pairs were a record for an FIP youth tournament in Asia.',
    ],
    numbers: [
      { value: '947', label: 'padel courts in Indonesia in 2025, up from 15 in 2021', source: 'Core & Court Indonesia Padel Report 2025' },
      { value: 'IDR 430k', label: 'average hourly court rental in Bali — the highest of any province', source: 'Core & Court / Growell, 2025' },
      { value: '2022', label: 'the year Indonesia’s first padel court opened, in Bali', source: 'Le Petit Journal Jakarta' },
      { value: '138', label: 'pairs at FIP Promises Bali, August 2026 — an Asian youth record', source: 'International Padel Federation' },
    ],
    venues: [
      { name: 'Bali Padel Academy', area: 'Canggu', note: 'Seven courts and a 200-seat show court; the island’s training hub.' },
      { name: 'Jungle Padel', area: 'Canggu · Kedungu · Sanur · Ubud', note: 'A chain of clubs set into the green, most bookable on Playtomic.' },
      { name: 'Amare Padel', area: 'Umalas', note: 'Five indoor courts, the answer to a wet-season afternoon.' },
      { name: 'Sanur Padel & Social Club', area: 'Sanur', note: 'Three courts, open from six in the morning to eleven at night.' },
      { name: 'Monkey Padel', area: 'Ubud', note: 'Three courts in the hills, and the slowest-paced scene on the island.' },
      { name: 'Island Sports', area: 'Uluwatu', note: 'Covered courts on the Bukit; host of FIP events.' },
    ],
    season: {
      ratings: [2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2],
      summary: 'Padel is played year round. The dry season is easiest; in the wet season afternoon storms move play under cover.',
      notes: [
        { label: 'Dry season', months: 'April – October', text: 'Reliable mornings and evenings, lower humidity, the best weeks of the year.' },
        { label: 'Wet season', months: 'November – March', text: 'Heavy afternoon rain most days. We book covered courts for the second session.' },
        { label: 'Nyepi', months: 'March (19 March 2026)', text: 'Day of Silence: the island and airport close for 24 hours. No play, no travel.' },
      ],
    },
    practical: [
      { icon: 'clock-circle', title: 'Book early, play early', text: 'Slots before eight in the morning go first. We hold them before you arrive.' },
      { icon: 'shop', title: 'Rackets', text: 'Hire is about IDR 30–60k a session at most clubs. Bring your own if you are particular.' },
      { icon: 'cloud', title: 'Covered courts', text: 'Several clubs have roofs or are fully indoor, which keeps a wet-season week on track.' },
      { icon: 'wallet', title: 'Court prices', text: 'Expect IDR 350k–800k an hour depending on club and time. Courts are included in every retreat.' },
    ],
    sources: [
      { label: 'Databoks — padel clubs and courts in Indonesia, 2025', url: 'https://databoks.katadata.co.id/en/sport/statistics/699fd44e1c1db/number-of-padel-clubs-and-courts-in-indonesia-grew-rapidly-through-2025' },
      { label: 'Databoks — average padel court rental by province, 2025', url: 'https://databoks.katadata.co.id/en/sport/statistics/69957685c7ceb/this-is-the-province-with-the-most-expensive-average-padel-court-rental-costs-in-2025-with-bali-ranking-at-the-top' },
      { label: 'FIP — record entry for FIP Promises Bali, 2026', url: 'https://www.padelfip.com/2026/08/historic-record-for-fip-promises-in-asia-138-pairs-set-to-compete-in-bali/' },
      { label: 'Le Petit Journal — padel mania in Indonesia', url: 'https://lepetitjournal.com/jakarta/comprendre-indonesie/la-padelmania-deferle-sur-lindonesie-422796' },
    ],
    checked: 'October 2026',
  },

  profiles: [
    {
      id: 'newcomer',
      name: 'Never played',
      subtitle: 'Or played three times on holiday',
      description: 'One session a day, rackets provided, and a real scored match by the last morning. The pace is deliberately gentle — the habits you build in the first ten hours are the ones you keep.',
      priorities: ['Learn it properly the first time', 'Not be the worst person there', 'Still have a holiday'],
      photo: P.racketHand,
    },
    {
      id: 'improver',
      name: 'Plays weekly',
      subtitle: 'And has stopped getting better',
      description: 'The most common player here. Two sessions a day, mornings on the two or three shots you quietly avoid, afternoons proving they hold up when the point matters.',
      priorities: ['Fix a specific shot', 'Understand court position', 'Take something home to practise'],
      photo: P.lunge,
    },
    {
      id: 'competitor',
      name: 'Competes',
      subtitle: 'League, circuit or tournament',
      description: 'A genuine training block: three sessions a day, periodised, with conditioning built around the court load and a taper at the end so you leave sharp.',
      priorities: ['Volume with a plan', 'A partner to practise with', 'Arrive at the season ready'],
      photo: P.ready,
    },
  ],

  dayShape: [
    { icon: 'sun', time: '06:15', title: 'Sunrise', text: 'Yoga if you chose it, coffee if you did not.' },
    { icon: 'trophy', time: '07:30', title: 'Morning court', text: 'The technical session, while the glass is still cool.' },
    { icon: 'heart', time: '09:45', title: 'Recovery', text: 'Ice, breakfast, and nothing asked of you.' },
    { icon: 'coffee', time: '13:00', title: 'The middle', text: 'Yours. Nothing useful happens on a court at one in the afternoon.' },
    { icon: 'thunderbolt', time: '16:15', title: 'Afternoon court', text: 'Match play, using whatever the morning worked on.' },
    { icon: 'team', time: '19:30', title: 'Dinner', text: 'Together, most nights. Where the tactical talk actually happens.' },
  ],
  included: [
    'Coached court time, in groups of four',
    'Courts booked and paid for',
    'Accommodation at the tier you pick',
    'Airport transfers, where the week includes them',
    'Breakfast daily, and dinner together several nights',
    'A written plan for the three months after',
  ],
  notIncluded: [
    'Flights — you will find better ones than we would',
    'Travel and sports insurance, which we ask you to hold',
    'Lunches and the meals you would rather choose yourself',
    'The Bali tourist levy (IDR 150,000, paid once online)',
  ],

  bases: [
    {
      id: 'canggu',
      name: 'Canggu',
      subtitle: 'Badung · West coast',
      tagline: 'Where the island’s padel actually happens.',
      description: 'The academy, the jungle clubs and the indoor courts in Umalas are all within fifteen minutes, and enough players pass through that a fourth is never a problem. Coffee, physio, a gym and dinner are on the same street.',
      lat: -8.647,
      lon: 115.138,
      stats: [{ label: 'Courts nearby', value: '20+' }, { label: 'Clubs', value: '6' }],
      driveToAirportMin: 45,
      bestFor: ['First retreats', 'Social weeks', 'Anyone who wants a scene'],
      photo: L.surfPalms,
    },
    {
      id: 'uluwatu',
      name: 'Uluwatu',
      subtitle: 'Badung · The Bukit',
      tagline: 'Clifftop, quiet, and nothing to do but play.',
      description: 'Up on the limestone the air moves and the courts are covered. Fewer distractions than the coast, which is exactly why the serious blocks run here.',
      lat: -8.812,
      lon: 115.118,
      stats: [{ label: 'Covered courts', value: '4+' }, { label: 'Clubs', value: '3' }],
      driveToAirportMin: 40,
      bestFor: ['Focused blocks', 'Competitors', 'Pre-season'],
      photo: B.uluwatuTemple,
    },
    {
      id: 'ubud',
      name: 'Ubud',
      subtitle: 'Gianyar · Central highlands',
      tagline: 'Cooler air, and a week your body forgives.',
      description: 'Two hundred metres of altitude takes the edge off the heat, and the recovery infrastructure here is better than anywhere on the coast. Fewer courts, so the week is built around longer sessions with more time between them.',
      lat: -8.507,
      lon: 115.263,
      stats: [{ label: 'Courts', value: '5' }, { label: 'Clubs', value: '2' }],
      driveToAirportMin: 75,
      bestFor: ['Light weeks', 'Recovery', 'Coming back from injury'],
      photo: B.tegalalang,
    },
    {
      id: 'sanur',
      name: 'Sanur',
      subtitle: 'Denpasar · East coast',
      tagline: 'Flat water, short transfers, easy days.',
      description: 'The calmest base we use and the closest to the airport, which matters more than people expect on a short trip. A reef-protected beach, a flat path the length of the shore, and courts open from six until eleven.',
      lat: -8.688,
      lon: 115.262,
      stats: [{ label: 'Courts', value: '6' }, { label: 'Clubs', value: '2' }],
      driveToAirportMin: 35,
      bestFor: ['Short trips', 'Families', 'First time in Bali'],
      photo: B.sanurDawn,
    },
  ],

  coaches: [
    { id: 'marta', name: 'Marta Ferrer', role: 'Head coach', from: 'Madrid, Spain', level: 'Former WPT qualifier', years: 12, bio: 'Twelve years coaching, eight of them at a club that fed players into the Spanish second tier. Marta runs the technical mornings and is the reason people leave with a bandeja that survives a real match.', speaks: ['Spanish', 'English'] },
    { id: 'deni', name: 'Deni Prasetyo', role: 'Coach, Bali', from: 'Denpasar, Indonesia', level: 'National team, Indonesia', years: 6, bio: 'Came to padel from tennis and has played for Indonesia since 2022. Deni handles match play and knows every court, every club owner and every physio on the island.', speaks: ['Indonesian', 'English'] },
    { id: 'lucia', name: 'Lucía Márquez', role: 'Coach, technique', from: 'Buenos Aires, Argentina', level: 'Argentine circuit', years: 9, bio: 'Lucía teaches the parts of the game that do not look like padel: where to stand, when not to hit, how to lose a point on purpose. Players who have plateaued tend to be sent to her.', speaks: ['Spanish', 'English', 'Portuguese'] },
    { id: 'tom', name: 'Tom Whitfield', role: 'Strength and recovery', from: 'Manchester, England', level: 'MSc Sport Science', years: 11, bio: 'Builds the conditioning and the recovery around whatever the court work is doing to you. Tom is also the one who tells people to stop, which is worth more in a heavy week than another hour of drills.', speaks: ['English'] },
  ],

  retreats: [
    {
      id: 'p1', slug: 'technique-week-canggu', name: 'Technique Week', headline: 'Seven nights rebuilding the shots you avoid.',
      base: 'canggu', level: 'improver', intensity: 'balanced', stay: 'private', nights: 7,
      dates: '12–19 April 2027', month: 'April', priceFromUsd: 1390, spotsTotal: 12, spotsLeft: 4, status: 'filling', coachId: 'marta',
      summary: 'The week most people should start with. Mornings on technique, afternoons playing what you worked on, and enough time in between to remember you are in Bali.',
      body: [
        'Almost everybody who plays weekly has two or three shots they quietly avoid. The bandeja that goes long, the volley off the glass, the serve they cannot vary. A week is exactly long enough to fix one of them properly and start on the next.',
        'Mornings run seven-thirty to nine-thirty while the court is still cool, in groups of four with one coach. Afternoons are match play from four, where the only instruction is to use what you did in the morning even when it costs you the point.',
        'The middle of the day is yours. Nothing is scheduled there because nothing useful happens on a glass court at one in the afternoon.',
      ],
      includes: ['10 hours of coached court time', 'Groups of four, one coach', 'Video review twice in the week', 'Private suite, seven nights', 'Airport transfers both ways', 'Breakfast daily, dinner together four nights'],
      photo: P.playerCourt, extras: ['video', 'ice-bath', 'airport'],
    },
    {
      id: 'p2', slug: 'bukit-block-uluwatu', name: 'The Bukit Block', headline: 'Ten nights of real work, above the ocean.',
      base: 'uluwatu', level: 'competitor', intensity: 'heavy', stay: 'villa', nights: 10,
      dates: '3–13 May 2027', month: 'May', priceFromUsd: 2680, spotsTotal: 8, spotsLeft: 2, status: 'filling', coachId: 'lucia',
      summary: 'A training block for players who compete. Three sessions a day, conditioning built around the court load, and a closing tournament that means something.',
      body: [
        'This is the hardest week we run and it is not for everyone. Technical at dawn, conditioning in the late afternoon, match play as the light goes. Ten nights of that is a genuine block, not a holiday with padel in it.',
        'Pairs are set on the first evening and stay together, because the thing most competitive players are missing is not a shot, it is a partner they have actually practised with. The Americano on day ten is scored and taken seriously.',
        'You stay in one villa, eight of you, which is the point. The tactical conversations that change a player happen at dinner, not on court.',
      ],
      includes: ['26 hours of coached court time', 'Fixed pairs for the block', 'Daily conditioning with a sport scientist', 'Whole villa, eight players, ten nights', 'Ice bath after every hard session', 'Scored Americano on the final full day'],
      photo: P.smash, extras: ['video', 'ice-bath', 'gym', 'tournament', 'massage', 'airport'],
    },
    {
      id: 'p3', slug: 'first-racket-sanur', name: 'First Racket', headline: 'Five nights for people who have never played.',
      base: 'sanur', level: 'newcomer', intensity: 'light', stay: 'private', nights: 5,
      dates: '8–13 February 2027', month: 'February', priceFromUsd: 890, spotsTotal: 10, spotsLeft: 7, status: 'open', coachId: 'deni',
      summary: 'No previous padel, no problem. One session a day, a racket in your hand by the first afternoon, and a real game by the last.',
      body: [
        'Padel is the easiest racket sport to start and the hardest to start badly — the habits you build in the first ten hours tend to stay. That is the whole argument for learning it properly.',
        'One session a day, ninety minutes, never more. The rest of the time you are in Sanur, the gentlest part of the island: flat water, a beach path you can cycle, and the shortest airport run we have.',
        'By the last morning everybody plays a real set with scoring. Most people book the next week before they fly home.',
      ],
      includes: ['7.5 hours of coached court time', 'Rackets and balls provided', 'Groups of four, never more', 'Private suite, five nights', 'Airport transfers both ways', 'A real scored match on the last day'],
      photo: P.racketsCircle, extras: ['rackets', 'airport'],
    },
    {
      id: 'p4', slug: 'ubud-reset', name: 'Ubud Reset', headline: 'Six nights of padel your body can absorb.',
      base: 'ubud', level: 'improver', intensity: 'light', stay: 'villa', nights: 6,
      dates: '19–25 June 2027', month: 'June', priceFromUsd: 1480, spotsTotal: 8, spotsLeft: 8, status: 'open', coachId: 'tom',
      summary: 'Built for players coming back from something, or going into something. One court session a day, everything else pointed at recovery.',
      body: [
        'Two hundred metres up, the air is cooler and the nights are properly fresh. That is the practical reason this week is in Ubud: the same session costs your body less here than it does on the coast.',
        'One court session a day. Around it: yoga at sunrise, a sports massage every third day, a nutrition plan written for the week, and strength work that is about tendons rather than numbers.',
        'People book this after a long season, before a long season, or after an injury that has made them cautious.',
      ],
      includes: ['9 hours of coached court time', 'Sunrise yoga daily', 'Sports massage every third day', 'Written nutrition plan', 'Whole villa, six nights', 'Strength work with a sport scientist'],
      photo: L.yogaDeck, extras: ['yoga', 'massage', 'nutrition', 'gym', 'airport'],
    },
    {
      id: 'p5', slug: 'americano-week-canggu', name: 'Americano Week', headline: 'Seven nights where everything counts.',
      base: 'canggu', level: 'improver', intensity: 'balanced', stay: 'shared', nights: 7,
      dates: '5–12 July 2027', month: 'July', priceFromUsd: 1180, spotsTotal: 16, spotsLeft: 11, status: 'open', coachId: 'deni',
      summary: 'A competitive week in a social format. Points from every session carry into a running table, and the last day settles it.',
      body: [
        'Americano scoring means you rotate partners and every point you win is yours. Over a week it produces a table that is a surprisingly honest read on who has actually improved.',
        'Sessions are the usual shape — coaching in the morning, play in the late afternoon — but everything is scored from day two. It changes how people practise, which is the point.',
        'Sixteen players is the largest group we run, and the reason is this format: it needs a crowd to work.',
      ],
      includes: ['11 hours of coached court time', 'Running Americano table all week', 'Shared villa room, seven nights', 'Finals and prizes on the last full day', 'Photographer on the final day', 'Airport transfers both ways'],
      photo: P.pair, extras: ['tournament', 'photo', 'airport'],
    },
    {
      id: 'p6', slug: 'long-weekend-sanur', name: 'Long Weekend', headline: 'Three nights, if that is all you have.',
      base: 'sanur', level: 'improver', intensity: 'balanced', stay: 'private', nights: 3,
      dates: 'Most weekends, year round', month: 'Flexible', priceFromUsd: 640, spotsTotal: 8, spotsLeft: 6, status: 'open', coachId: 'deni',
      summary: 'For people already in the region. Two full days of padel with the shortest transfers on the island either side.',
      body: [
        'Short, and honest about it. You will not rebuild a technique in three nights, but you will get eight hours of proper coaching and a clear list of what to work on when you get home.',
        'Sanur is the base because the airport run is thirty-five minutes, which on a three-night trip is most of a session saved.',
        'Popular with people living in Singapore, Jakarta and Perth who come more than once a year.',
      ],
      includes: ['8 hours of coached court time', 'Two full days on court', 'Private suite, three nights', 'Airport transfers both ways', 'A written list of what to work on next'],
      photo: P.courtGlass, extras: ['airport'],
    },
  ],

  testimonials: [
    { quote: 'I had been hitting the same bandeja into the net for three years. Marta fixed it in two mornings. The other five days were about trusting it under pressure.', name: 'Jonas R.', detail: 'Technique Week, Canggu · plays in Hamburg' },
    { quote: 'The Bukit block was the hardest ten days of training I have done and the schedule was the reason it worked. Somebody had thought about what happens to your legs on day seven.', name: 'Ana P.', detail: 'The Bukit Block, Uluwatu · Argentine circuit' },
    { quote: 'I had never held a padel racket. By Friday I was playing a real set and enjoying it, which I genuinely did not expect at forty-eight.', name: 'Hélène D.', detail: 'First Racket, Sanur · plays in Lyon' },
    { quote: 'We brought eleven people from our club and expected chaos. The groups were right on the first morning, which never happens.', name: 'Mark T.', detail: 'Club week, Canggu · club captain, Leeds' },
  ],

  faqs: [
    { question: 'Do I need to be any good?', answer: 'No. We run weeks for people who have never held a racket and weeks for players on a national circuit, and they are genuinely different weeks. Tell us where you play and we will tell you which one fits.' },
    { question: 'Is this a booking?', answer: 'Not yet. Everything you build here is an indication, including the price. We come back with the dates we can actually hold — courts, villa and coaches — and you confirm in writing before any money moves.' },
    { question: 'How hot does it get on court?', answer: 'Thirty to thirty-three degrees at midday, which is why nothing is scheduled between ten and four. Sessions run at seven-thirty in the morning and four in the afternoon.' },
    { question: 'What happens when it rains?', answer: 'From November to March most afternoons bring a storm. We book covered or indoor courts for the second session, so the week stays on plan.' },
    { question: 'Can I come alone?', answer: 'Most people do. Groups are set by level on the first evening and pairs rotate through the week, so you will have played with everyone by the end.' },
    { question: 'What if I get injured?', answer: 'We work with physios in Canggu and Uluwatu, and the coaches will change your week rather than push you through it. Travel insurance that covers sport is a condition of joining.' },
    { question: 'Are flights included?', answer: 'No. People fly from too many places for us to add anything useful. Everything on the ground from the airport onwards is included where the retreat says so.' },
    { question: 'Can you take a whole club?', answer: 'Yes, and it is the format that works best. Eight to twelve players from one club means we know the levels before anyone lands.' },
  ],

  journal: [
    {
      slug: 'why-your-bandeja-goes-long', title: 'Why your bandeja goes long', category: 'Technique',
      excerpt: 'The shot that separates club players from the rest, and the three reasons it keeps finding the back glass.',
      readMinutes: 6, date: '2026-08-14', author: 'Marta Ferrer', photo: P.smash,
      body: [
        'The bandeja is the first shot that is genuinely padel rather than borrowed from tennis, and it is where most players stall. It is not a smash and it is not a volley: it is a controlled, sliced overhead whose job is to keep you at the net.',
        'When it goes long, it is almost always one of three things. The contact point is behind the head instead of in front of it. The shoulder is doing the work instead of the legs. Or — most often — the player is trying to win with it.',
        'That last one is the hardest to coach away, because it is a decision rather than a technique. The bandeja buys you time and position. A player who accepts that will hit three of them in a rally and still be at the net.',
        'The fix we use in the morning sessions is deliberately unsatisfying: hit twenty in a row with the only instruction being that they land past the service line and stay low. Nobody enjoys it. Everybody’s match play is different by Thursday.',
      ],
    },
    {
      slug: 'padel-in-bali-2026', title: 'Padel in Bali: what is actually on the island', category: 'Bali',
      excerpt: 'Courts, clubs and prices as they stand in 2026 — and where a visiting player will find a game.',
      readMinutes: 5, date: '2026-09-18', author: 'Deni Prasetyo', photo: P.courtsOutdoor,
      body: [
        'The first court went up in 2022. Four years later there are more than twenty courts within fifteen minutes of Canggu alone, and clubs in Uluwatu, Jimbaran, Nusa Dua, Sanur and Ubud.',
        'Canggu is the centre of it: an academy with seven courts and a show court, a chain of jungle clubs, and indoor courts in Umalas for the wet season. Most clubs book through Playtomic, and a fourth can usually be found within the hour.',
        'For a visiting player the practical answer is: bring your own racket if you are particular, expect to pay IDR 350,000 to 500,000 an hour, and book the early slot.',
        'The standard is rising fast. Indonesian juniors are now playing FIP events on the island, and the scene is mixing far more than it did in the first two years.',
      ],
    },
    {
      slug: 'training-in-the-tropics', title: 'Training in the tropics, without wasting the week', category: 'Training',
      excerpt: 'Thirty-two degrees changes what a session can be. Here is how the days are built around it.',
      readMinutes: 7, date: '2026-07-02', author: 'Tom Whitfield', photo: P.courtGlass,
      body: [
        'A glass court in the tropics is not a neutral environment. At eight degrees south, with humidity above seventy per cent, core temperature climbs faster than the effort suggests and the quality of everything technical falls with it.',
        'The answer is not to train less, it is to train at the ends of the day. Seven-thirty in the morning the surface is cool. Four in the afternoon it has dropped enough to play properly again.',
        'The middle of the day is therefore not a gap in the schedule, it is part of it. Sleep, shade, and enough salt — in this climate a hard morning can cost two litres and thirst lags well behind the loss.',
      ],
    },
  ],

  planner,

  whatsapp: 'Hello Sports in Paradise, I’d like to talk about a padel retreat in Bali.',
  cta: {
    heading: 'Tell Us How You Want to Play.',
    lede: 'Where you play now, roughly when you can travel, and what you want out of the week. You will get a real schedule and a real price back — and nothing is held until you say so.',
  },
};
