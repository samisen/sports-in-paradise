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

const T = PHOTOS.tennis;
const B = PHOTOS.bali;
const L = PHOTOS.life;

/* ------------------------------------------------------------ planner --- */

interface Focus {
  label: string;
  sub: string;
}

/**
 * The morning session rotates through three themes so a week touches every
 * part of the game. The second theme is always serve and return, which is why
 * the serve clinic lands on the same days.
 */
const MORNING: Record<string, [Focus, Focus, Focus]> = {
  starter: [
    { label: 'Footwork and contact', sub: 'Split step, ready position, contact in front' },
    { label: 'Serve basics', sub: 'Continental grip, toss, a second serve that goes in' },
    { label: 'Groundstrokes', sub: 'A topspin forehand, a backhand you trust' },
  ],
  club: [
    { label: 'Groundstroke clinic', sub: 'Depth, topspin, rally tolerance' },
    { label: 'Serve and return', sub: 'Second serve, return position, the first ball' },
    { label: 'Footwork and transition', sub: 'Recovery steps, the approach, the first volley' },
  ],
  competitive: [
    { label: 'Patterns under load', sub: 'Serve plus one, forehand to the open court' },
    { label: 'Serve and return', sub: 'Kick serve, placement, chip and block returns' },
    { label: 'Movement and defence', sub: 'Open stance, sliding on a hard court, neutral balls' },
  ],
};

/** Afternoon play: singles and doubles alternate once there is a game to shape. */
function afternoonPlay(level: string, i: number): Focus {
  if (level === 'starter') return { label: 'Live-ball games', sub: 'Coach-fed rallies, then scoring' };
  const doubles = i % 2 === 1;
  if (level === 'club') {
    return doubles
      ? { label: 'Doubles tactics', sub: 'Who covers the middle, when to poach' }
      : { label: 'Singles match play', sub: 'Tie-breaks from the morning’s theme' };
  }
  return doubles
    ? { label: 'Doubles patterns', sub: 'I-formation, signals, first volley' }
    : { label: 'Singles sets', sub: 'Scored, charted, reviewed at dinner' };
}

const isServeDay = (i: number) => i % 3 === 0;

/**
 * A day on the island, not a day at a tennis centre.
 *
 * At 8°S an uncovered hard court is unplayable by late morning, so the two
 * sessions that matter sit at either end of the day. Whatever the guest adds
 * — a clinic, the gym, an afternoon at the ITF — goes into the middle, and
 * whatever is left of the middle is theirs.
 */
function trainingDay(c: RetreatConfig, i: number, itfDay: number): Day {
  const light = c.intensity === 'light';
  const heavy = c.intensity === 'heavy';
  const focus = MORNING[c.level][(i - 2 + 3) % 3];
  const blocks: Block[] = [];

  if (has(c, 'yoga')) blocks.push(block('yoga', 'Sunrise yoga', 'recovery', 6, 6.75));

  const drillEnd = light ? 9 : 9.5;
  blocks.push(block('drill', focus.label, 'coaching', 7, drillEnd, focus.sub));
  if (has(c, 'ice-bath')) blocks.push(block('ice', 'Ice bath', 'recovery', drillEnd + 0.25, drillEnd + 0.75));
  blocks.push(block('breakfast', 'Breakfast', 'meal', drillEnd + 1, drillEnd + 2));

  // The middle of the day, booked from noon outwards.
  const middle: Block[] = [];
  const video = has(c, 'video') && (i === 2 || i === 5);
  if (video) middle.push(block('video', 'Video review', 'coaching', 12, 13, 'Yesterday’s footage, frame by frame'));
  const itf = i === itfDay;
  if (itf) middle.push(block('itf', 'ITF M15 session', 'experience', 12.5, 15, 'National tennis centre, Nusa Dua'));
  if (has(c, 'gym') && i % 2 === 0 && !itf) {
    middle.push(block('gym', 'Strength session', 'fitness', 14, 15, 'Air-conditioned gym'));
  }
  const clinic = has(c, 'serve-clinic') && isServeDay(i);
  if (clinic) {
    middle.push(block('serve', 'Serve clinic', 'coaching', 15, 16, heavy ? 'Covered court, in place of conditioning' : 'Covered court, a basket each'));
  } else if (heavy) {
    middle.push(block('fitness', 'Footwork and conditioning', 'fitness', 15, 16, 'Ladders, change of direction, shoulders'));
  }

  const partner = has(c, 'partner') && c.level !== 'starter' && i % 2 === 1;
  const plays = !light || i % 2 === 0 || partner;
  const play = partner ? { label: 'Sets against a local pro', sub: 'A ranked Indonesian player, scored' } : afternoonPlay(c.level, i);
  if (plays) middle.push(block('match', play.label, 'play', 16, 18, play.sub));

  // Whatever the middle has not used is an open afternoon.
  const freeStart = video ? 13 : 12;
  const firstAfter = middle.filter((b) => b.start >= freeStart).reduce((m, b) => Math.min(m, b.start), 16);
  if (!itf && firstAfter - freeStart >= 0.75) {
    blocks.push(block('midday', 'Open afternoon', 'free', freeStart, firstAfter, 'Too hot for a hard court'));
  }
  blocks.push(...middle);

  let lastEnd = plays ? 18 : 16;
  let dinnerAt = 19.5;
  if (has(c, 'massage') && i % 3 === 0) {
    const start = lastEnd + 0.25;
    blocks.push(block('massage', 'Sports massage', 'recovery', start, start + 1));
    lastEnd = start + 1;
    dinnerAt = Math.max(dinnerAt, lastEnd + 0.25);
  }
  blocks.push(block('dinner', 'Dinner together', 'meal', dinnerAt, Math.max(21, dinnerAt + 1.25)));

  const tag = isServeDay(i) ? 'Serve day' : 'Training';
  return day(i, tag, 'core', true, blocks.sort((a, b) => a.start - b.start));
}

function build(c: RetreatConfig): Day[] {
  const days: Day[] = [];
  const total = c.nights + 1;
  const rest = restDayIndex(c.nights);
  const finals = has(c, 'tournament') && c.nights >= 4 ? total - 1 : -1;

  // The ITF afternoon goes on the first ordinary training day without video.
  let itfDay = -1;
  if (has(c, 'itf')) {
    for (let i = 3; i < total; i++) {
      if (i !== rest && i !== finals && i !== 5) {
        itfDay = i;
        break;
      }
    }
    if (itfDay === -1 && total > 2 && 2 !== finals && 2 !== rest && !has(c, 'video')) itfDay = 2;
  }

  for (let i = 1; i <= total; i++) {
    if (i === 1) {
      const b: Block[] = [];
      if (has(c, 'airport')) b.push(block('transfer', 'Airport pickup', 'travel', 10, 11.5));
      b.push(block('settle', 'Check in and settle', 'free', 12, 15.5));
      b.push(block('hit', 'Evening hit', 'coaching', 16.5, 18, 'Rally, serve, movement: where you are'));
      b.push(block('dinner', 'Welcome dinner', 'meal', 19.5, 21));
      days.push(day(i, 'Arrival', 'arrival', false, b));
    } else if (i === total) {
      const b: Block[] = [block('hit', 'Last hit', 'coaching', 7, 8.5, 'Points and a few serves, no drills')];
      b.push(block('breakfast', 'Breakfast', 'meal', 9.5, 10.5));
      b.push(block('checkout', 'Check out', 'free', 11, 12));
      if (has(c, 'airport')) b.push(block('transfer', 'Airport drop-off', 'travel', 13, 14.5));
      days.push(day(i, 'Departure', 'departure', false, b));
    } else if (i === rest) {
      const b: Block[] = [];
      if (has(c, 'yoga')) b.push(block('yoga', 'Sunrise yoga', 'recovery', 6, 6.75));
      let freeFrom = 11;
      if (has(c, 'surf')) {
        b.push(block('surf', 'Surf morning', 'experience', 7, 10.5, 'Board and coach included'));
      } else if (has(c, 'excursion')) {
        b.push(block('excursion', 'Island day', 'experience', 8, 16, 'Driver for the day'));
        freeFrom = 16;
      } else {
        b.push(block('slow', 'Slow morning', 'free', 7, 11, 'No alarm, no racket'));
      }
      let socialAt = 17.25;
      if (has(c, 'massage')) {
        b.push(block('massage', 'Sports massage', 'recovery', 16, 17));
      } else if (freeFrom < 16) {
        b.push(block('free', 'Free afternoon', 'free', 12, 16.5));
      }
      if (freeFrom === 16 && !has(c, 'massage')) socialAt = 17;
      b.push(block('social', 'Social doubles', 'play', socialAt, socialAt + 1.25, 'Mixed pairs, no scoring'));
      b.push(block('dinner', 'Dinner out', 'meal', 19.5, 21));
      days.push(day(i, 'Rest & explore', 'rest', false, b));
    } else if (i === finals) {
      const b: Block[] = [];
      if (has(c, 'yoga')) b.push(block('yoga', 'Sunrise yoga', 'recovery', 6, 6.75));
      b.push(block('warmup', 'Warm-up and draw', 'coaching', 7, 7.75));
      b.push(block('tournament', 'Round-robin', 'play', 7.75, 10.75, 'Short sets, everyone plays everyone'));
      b.push(block('breakfast', 'Late breakfast', 'meal', 11, 12));
      const iced = has(c, 'ice-bath');
      if (iced) b.push(block('ice', 'Ice bath', 'recovery', 12.5, 13));
      b.push(block('midday', 'Open afternoon', 'free', iced ? 13 : 12.5, 16.25));
      b.push(block('final', 'Finals', 'play', 16.5, 18, 'Singles and doubles, then prizes'));
      b.push(block('dinner', 'Closing dinner', 'meal', 19.5, 21));
      days.push(day(i, 'Match day', 'peak', true, b));
    } else {
      days.push(trainingDay(c, i, itfDay));
    }
  }
  return days;
}

const planner: PlannerSpec = {
  levels: [
    { id: 'starter', name: 'Starter', note: 'Beginner, or returning after years away' },
    { id: 'club', name: 'Club player', note: 'Plays weekly, wants the game to move on' },
    { id: 'competitive', name: 'Competitive', note: 'Tournament player, ranked junior or adult' },
  ],
  intensities: [
    { id: 'light', name: 'Light', note: 'One session a day, the island for the rest', sessions: '1 session/day', perDay: 65 },
    { id: 'balanced', name: 'Balanced', note: 'Drilling in the morning, match play in the cool', sessions: '2 sessions/day', perDay: 100 },
    { id: 'heavy', name: 'Heavy', note: 'Two on court plus footwork and conditioning', sessions: '3 sessions/day', perDay: 150 },
  ],
  bases: [
    { id: 'nusadua', name: 'Nusa Dua', note: 'Resort courts and the national tennis centre', detail: 'Indoor courts at a hotel', multiplier: 1.2 },
    { id: 'umalas', name: 'Umalas', note: 'Covered courts and the busiest club scene', detail: 'Covered courts, Canggu nearby', multiplier: 1 },
    { id: 'sanur', name: 'Sanur', note: 'Calm east coast, short airport run', detail: 'Covered courts', multiplier: 0.9 },
    { id: 'ubud', name: 'Ubud', note: 'Cooler, quieter, built for recovery', detail: 'Fewer courts, cooler air', multiplier: 0.85 },
  ],
  stays: STAYS,
  extras: [
    { id: 'video', name: 'Video analysis', note: 'Serve and forehand filmed, reviewed twice in the week', perPerson: 90, group: 'court' },
    { id: 'serve-clinic', name: 'Serve clinic', note: 'An extra hour on serve days, on a covered court', perPerson: 70, group: 'court' },
    { id: 'partner', name: 'Local pro hitting partner', note: 'Scored sets against a ranked Indonesian player', perPerson: 120, group: 'court', levels: ['club', 'competitive'], needs: 'For club and competitive players' },
    { id: 'stringing', name: 'Stringing and demo rackets', note: 'Restrung on arrival, demo frames all week', perPerson: 55, group: 'court' },
    { id: 'tournament', name: 'Closing round-robin', note: 'Short sets on the last full day, finals in the evening', perPerson: 80, group: 'court', minNights: 4, needs: 'Needs at least four nights' },
    { id: 'ice-bath', name: 'Ice bath', note: 'After every morning session', perPerson: 60, group: 'recovery' },
    { id: 'massage', name: 'Sports massage', note: 'One every third night', perPerson: 55, group: 'recovery', everyNights: 3 },
    { id: 'yoga', name: 'Sunrise yoga', note: 'Hips, back and shoulders, before the morning court', perPerson: 70, group: 'recovery' },
    { id: 'gym', name: 'Strength sessions', note: 'Tennis-specific, every other day, indoors', perPerson: 50, group: 'recovery' },
    { id: 'itf', name: 'An afternoon at the ITF', note: 'Watch an M15 session at the national tennis centre. July to December only', perPerson: 40, group: 'island' },
    { id: 'surf', name: 'Surf morning', note: 'Board, coach and transfer, on the rest day', perPerson: 120, group: 'island', minNights: 5, needs: 'Needs a rest day, so five nights or more' },
    { id: 'excursion', name: 'Island day', note: 'Waterfall, temple or volcano, with a driver', perPerson: 140, group: 'island', minNights: 5, needs: 'Needs a rest day, so five nights or more' },
    { id: 'airport', name: 'Airport transfers', note: 'Both ways, however late the flight', perPerson: 45, group: 'logistics' },
  ],
  extraGroups: [
    { key: 'court', title: 'On court' },
    { key: 'recovery', title: 'Recovery and fitness' },
    { key: 'island', title: 'The island' },
    { key: 'logistics', title: 'Logistics' },
  ],
  defaultConfig: {
    nights: 7,
    guests: 2,
    level: 'club',
    intensity: 'balanced',
    stay: 'private',
    base: 'umalas',
    extras: ['video', 'airport'],
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
  statusNote: 'Court time sits at either end of the day; the midday heat on a hard court is left alone.',
  rules: [
    'Drilling runs 07:00–09:30 and match play from 16:00. Between eleven and four an open hard court in Bali is too hot to learn anything on.',
    'Afternoon sessions are booked on covered courts from November to March, when most days end in a storm.',
    'Five nights or more earns a rest day in the middle, with social doubles in the evening and no drills.',
    'A closing round-robin takes the last full day, so the night before you fly is a quiet one.',
  ],
  build,
};

/* ------------------------------------------------------------ content --- */

export const TENNIS: SportSite = {
  id: 'tennis',
  name: 'Tennis',
  descriptor: 'Tennis retreats in Bali',
  coreIdea: 'Train at the cool ends of the day. Play the points that matter. Go home with a better game.',
  description:
    'Coached tennis weeks in Bali for beginners, club players and competitors. Plan your own week — drilling, match play, recovery and the island — and talk to the team who runs it.',

  hero: {
    eyebrow: 'Tennis retreats in Bali',
    headline: 'Two Sessions a Day. The Middle of It Yours. A Better Game at the End.',
    support:
      'Small coached tennis weeks on hard courts and covered courts across the island — planned with you before anything is booked.',
    photos: [T.palms, T.serveTall, T.rally],
  },
  stats: [
    { value: '264', label: 'Players hosted since 2023' },
    { value: '4', label: 'Coaches, all year round' },
    { value: '9.3/10', label: 'Average week rating' },
    { value: '41%', label: 'Who come back within a year' },
  ],

  values: [
    {
      eyebrow: 'The tennis',
      title: 'Coaching you can still use in March',
      lead: 'Four players to a coach, the same coach all week, and a plan built around one or two things that will actually change.',
      body: 'Groups are set by level on the first evening, not by who booked together. Mornings take one part of the game apart — the second serve, the backhand return, the recovery step — and afternoons put it back together in live points, singles and doubles.',
      points: ['Four players to a coach, never more.', 'Drilling in the cool, match play as the heat drops.', 'A written plan for the months after the week.'],
      photo: T.forehand,
    },
    {
      eyebrow: 'The island',
      title: 'A week you would want anyway',
      lead: 'The hours between sessions are not a gap in the schedule. They are why the sessions are any good.',
      body: 'Nothing is scheduled on an open hard court between late morning and four, because nothing useful happens there. Sleep, swim, eat, or go and see the island — and come back to the court when the shadows are long and the ball is worth hitting again.',
      points: ['The middle of every day is genuinely free.', 'Recovery that is part of the plan, not an upsell.', 'Four bases, each for a different kind of week.'],
      photo: B.resortAerial,
    },
  ],

  sport: {
    eyebrow: 'The sport',
    title: 'Why Tennis Rewards a Week Away',
    lead: 'Most club players do not need more tennis. They need concentrated tennis, with someone watching.',
    paragraphs: [
      'Tennis is a sport of habits. A weekly hit reinforces whatever you already do, good and bad, and an hour-long lesson is rarely long enough to replace one movement pattern with another before the next match undoes it.',
      'A week changes the arithmetic. Thirty hours on court, the same coach every session, and the same theme returned to morning after morning is long enough for a new serve toss or a new split step to stop feeling foreign — and that is the point at which it survives a real match.',
      'It is also a week of both formats. Singles teaches you to build a point on your own; doubles teaches you where to stand and when to move. Most players are noticeably better at one, and the gap closes quickly once someone points it out.',
    ],
    drivers: [
      { icon: 'aim', title: 'Repetition', text: 'Hundreds of serves in a week, each one looked at. That is how a toss changes.' },
      { icon: 'team', title: 'Singles and doubles', text: 'Both formats every week, because most players are only good at one.' },
      { icon: 'field-time', title: 'Rally tolerance', text: 'Holding a rally of ten balls under pressure is a skill, and it can be trained.' },
      { icon: 'sun', title: 'Heat, managed', text: 'Sessions at either end of the day, so the quality stays high all week.' },
    ],
    facts: [
      { value: '4:1', label: 'players to a coach on every session we run', source: 'Sports in Paradise' },
      { value: '30+', label: 'hours on court in a balanced seven-night week', source: 'Sports in Paradise planner' },
    ],
  },

  bali: {
    eyebrow: 'Tennis in Bali',
    title: 'Resort courts, club courts, and a professional circuit',
    lead: 'Tennis in Bali has always lived at the resorts. It now has covered club courts, a busy mixed racket scene, and a run of professional tournaments in Nusa Dua.',
    paragraphs: [
      'For decades the island’s courts were hotel courts — mostly hard, mostly outdoor, and mostly in Nusa Dua and the big resort strips. That is still where a lot of the tennis is, but it is no longer the whole picture. Multi-sport clubs have opened across the south, and many now put tennis, padel and pickleball side by side.',
      'Liga.Tennis runs courts at seven sites on the island: Umalas, Sanur, Nusa Dua, Seminyak, Ubud, Uluwatu and Tanah Lot. Several are covered. In Nusa Dua it uses three indoor courts at the Hilton and three outdoor courts at the Grand Hyatt, which is about as useful a combination as the island offers in the wet season. In July 2026 Trinity Courts opened at The Laguna in Nusa Dua, with tennis, pickleball and padel under one roof of management.',
      'The serious tennis is in Nusa Dua too. The Bali National Tennis Center is hosting seven ITF M15 men’s tournaments between July and December 2026, each with US$15,000 in prize money, on hard courts. For a visiting player that means a week of professional tennis within a short drive of the resort courts — free to watch on most days.',
      'Hard courts dominate across the island. Covered courts matter more than anything else from November to March, when most afternoons end in rain, and they are the first thing we book for any wet-season week.',
    ],
    numbers: [
      { value: '7', label: 'Liga.Tennis sites in Bali, from Tanah Lot to Sanur', source: 'Liga.Tennis, 2026' },
      { value: '7', label: 'ITF M15 tournaments at the Bali National Tennis Center, July–December 2026', source: 'International Tennis Federation' },
      { value: 'US$15k', label: 'prize money at each of those tournaments, on hard courts', source: 'International Tennis Federation' },
      { value: 'IDR 250k', label: 'an hour for a court in Nusa Dua, indoor or outdoor', source: 'Liga.Tennis Nusa Dua, 2026' },
    ],
    venues: [
      { name: 'Bali National Tennis Center', area: 'Nusa Dua', note: 'Hard courts; host of seven ITF M15 events from July to December 2026.' },
      { name: 'Liga.Tennis Nusa Dua', area: 'Nusa Dua', note: 'Three indoor courts at the Hilton, three outdoor at the Grand Hyatt.' },
      { name: 'Trinity Courts, The Laguna', area: 'Nusa Dua', note: 'Tennis, pickleball and padel; opened July 2026, open 7am to 8pm.' },
      { name: 'Liga.Tennis Umalas', area: 'Umalas', note: 'Covered courts between Canggu and Seminyak, and the busiest club scene.' },
      { name: 'Liga.Tennis Sanur', area: 'Sanur', note: 'Covered courts on the calm east coast, close to the airport.' },
      { name: 'Liga.Tennis Uluwatu', area: 'Uluwatu', note: 'Two covered courts up on the Bukit.' },
    ],
    season: {
      ratings: [2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2],
      summary: 'Tennis is played year round. The dry season is easiest; in the wet season the afternoon session moves under cover.',
      notes: [
        { label: 'Dry season', months: 'April – October', text: 'Reliable mornings and evenings, lower humidity, and the best weeks of the year.' },
        { label: 'Wet season', months: 'November – March', text: 'Heavy afternoon rain most days. We book covered or indoor courts for the second session.' },
        { label: 'ITF season', months: 'July – December 2026', text: 'Professional M15 events at the national tennis centre in Nusa Dua. The 2027 calendar is not yet published.' },
        { label: 'Nyepi', months: 'March', text: 'Day of Silence: the island and airport close for 24 hours. The date follows the Balinese calendar, so we check it before setting March weeks.' },
      ],
    },
    practical: [
      { icon: 'clock-circle', title: 'Play early', text: 'The first slots of the morning go first, and they are the only ones worth having. We hold them before you arrive.' },
      { icon: 'cloud', title: 'Covered courts', text: 'Several clubs have roofs or indoor courts, which keeps a wet-season week on plan.' },
      { icon: 'shop', title: 'Strings and balls', text: 'Heat and humidity kill strings and balls quickly. Bring a spare racket, or take the stringing package.' },
      { icon: 'wallet', title: 'Court prices', text: 'Hotel and club courts vary widely by site and time. Courts are included in every retreat.' },
    ],
    sources: [
      { label: 'Liga.Tennis — Nusa Dua courts and prices', url: 'https://liga.tennis/nusa-dua' },
      { label: 'ITF — M15 Bali, 2026', url: 'https://www.itftennis.com/en/tournament/m15-bali/ina/2026/m-itf-ina-2026-002/' },
      { label: 'Love Bali — the tourist levy', url: 'https://lovebali.baliprov.go.id' },
    ],
    checked: 'October 2026',
  },

  profiles: [
    {
      id: 'starter',
      name: 'Starting, or starting again',
      subtitle: 'Never played, or not for fifteen years',
      description: 'One session a day, rackets provided if you need them, and a scored game by the last morning. The pace is deliberately gentle: a serve that goes in and a forehand you can repeat are worth more than anything flashy.',
      priorities: ['A serve that goes in', 'Rallies that last', 'Still have a holiday'],
      photo: T.balls,
    },
    {
      id: 'club',
      name: 'Plays weekly',
      subtitle: 'And has stopped getting better',
      description: 'The most common player here. Two sessions a day: mornings on the shot you quietly avoid — usually the second serve or the backhand return — and afternoons proving it holds up in singles and doubles points.',
      priorities: ['Fix one specific shot', 'Understand doubles positioning', 'Take a plan home'],
      photo: T.blueCourt,
    },
    {
      id: 'competitive',
      name: 'Competes',
      subtitle: 'Ranked junior, league or tournament',
      description: 'A genuine training block: drilling, conditioning and scored sets every day, with patterns charted and reviewed, and a lighter final day so you leave sharp rather than tired.',
      priorities: ['Volume with a plan', 'Hitting partners at the right level', 'Arrive at the season ready'],
      photo: T.serveDark,
    },
  ],

  dayShape: [
    { icon: 'sun', time: '06:00', title: 'Sunrise', text: 'Yoga if you chose it, coffee if you did not.' },
    { icon: 'aim', time: '07:00', title: 'Morning court', text: 'Footwork, serve or groundstrokes, while the court is still cool.' },
    { icon: 'heart', time: '09:45', title: 'Recovery', text: 'Ice, breakfast, and nothing asked of you.' },
    { icon: 'coffee', time: '12:00', title: 'The middle', text: 'Yours. A hard court at one in the afternoon is no place to learn anything.' },
    { icon: 'trophy', time: '16:00', title: 'Match play', text: 'Live points, singles and doubles, using whatever the morning worked on.' },
    { icon: 'team', time: '19:30', title: 'Dinner', text: 'Together, most nights. The tactics talk happens here.' },
  ],
  included: [
    'Coached court time, in groups of four',
    'Courts booked and paid for, covered in the wet season',
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
      id: 'nusadua',
      name: 'Nusa Dua',
      subtitle: 'Badung · The southern resorts',
      tagline: 'Resort courts, and the professionals down the road.',
      description: 'The island’s traditional home of tennis. Indoor courts at a hotel for the wet season, outdoor hard courts for the dry, and the national tennis centre close by — with ITF tournaments on through the second half of 2026.',
      lat: -8.8,
      lon: 115.23,
      stats: [{ label: 'Indoor courts', value: '3' }, { label: 'ITF events, 2026', value: '7' }],
      driveToAirportMin: 25,
      bestFor: ['Competitive weeks', 'Wet-season trips', 'Watching pro tennis'],
      photo: B.resortAerial,
    },
    {
      id: 'umalas',
      name: 'Umalas',
      subtitle: 'Badung · Between Canggu and Seminyak',
      tagline: 'Covered courts and plenty of people to play.',
      description: 'Rice fields, villas and the busiest racket scene on the island. Covered courts keep the afternoon session on plan, and Canggu’s cafés, physios and beaches are ten minutes away.',
      lat: -8.66,
      lon: 115.16,
      stats: [{ label: 'Covered courts', value: 'Yes' }, { label: 'To Canggu', value: '10 min' }],
      driveToAirportMin: 40,
      bestFor: ['First retreats', 'Social weeks', 'Doubles'],
      photo: L.surfPalms,
    },
    {
      id: 'sanur',
      name: 'Sanur',
      subtitle: 'Denpasar · East coast',
      tagline: 'Flat water, short transfers, easy days.',
      description: 'The calmest base we use and among the closest to the airport, which matters more than people expect on a short trip. Covered courts, a reef-protected beach and a flat path the length of the shore.',
      lat: -8.69,
      lon: 115.26,
      stats: [{ label: 'Covered courts', value: 'Yes' }, { label: 'Airport', value: '30 min' }],
      driveToAirportMin: 30,
      bestFor: ['Starters', 'Short trips', 'First time in Bali'],
      photo: B.sanurDawn,
    },
    {
      id: 'ubud',
      name: 'Ubud',
      subtitle: 'Gianyar · Central highlands',
      tagline: 'Cooler air, and a week your body forgives.',
      description: 'A little altitude takes the edge off the heat and the recovery on offer is the best on the island. Fewer courts, so the week is built around one longer session a day with more time between.',
      lat: -8.507,
      lon: 115.263,
      stats: [{ label: 'Pace', value: 'Slow' }, { label: 'Sessions', value: '1 a day' }],
      driveToAirportMin: 75,
      bestFor: ['Light weeks', 'Recovery', 'Coming back from injury'],
      photo: B.tegalalang,
    },
  ],

  coaches: [
    { id: 'claire', name: 'Claire Hollis', role: 'Head coach', from: 'Bath, England', level: 'Former WTA top 300', years: 14, bio: 'Played the professional tour for six years before coaching at a performance centre in the south of England. Claire runs the morning sessions and has rebuilt more second serves than she can count, most of them in under a week.', speaks: ['English', 'French'] },
    { id: 'wayan', name: 'Wayan Sudarsana', role: 'Coach, Bali', from: 'Denpasar, Indonesia', level: 'Indonesian national championships', years: 8, bio: 'Grew up on the resort courts of Nusa Dua and has played the national championships three times. Wayan runs match play, books every court on the island, and is very hard to beat in a doubles point.', speaks: ['Indonesian', 'English'] },
    { id: 'mateo', name: 'Mateo Ibáñez', role: 'Coach, competitive', from: 'Valencia, Spain', level: 'Former ATP ranked', years: 10, bio: 'Spent four years on the ITF circuit, which is why he coaches patterns rather than strokes. Mateo takes the competitive blocks and charts every set his players play.', speaks: ['Spanish', 'English', 'Catalan'] },
    { id: 'priya', name: 'Priya Raman', role: 'Movement and recovery', from: 'Singapore', level: 'MSc Sport and Exercise Science', years: 9, bio: 'Builds the footwork, strength and recovery around whatever the court is doing to you. Priya is also the person who tells players to stop, which in a heavy week is worth more than another basket of balls.', speaks: ['English', 'Tamil', 'Malay'] },
  ],

  retreats: [
    {
      id: 't1', slug: 'serve-and-return-umalas', name: 'Serve and Return Week', headline: 'Seven nights on the two shots that start every point.',
      base: 'umalas', level: 'club', intensity: 'balanced', stay: 'private', nights: 7,
      dates: '15–22 February 2027', month: 'February', priceFromUsd: 1490, spotsTotal: 12, spotsLeft: 5, status: 'filling', coachId: 'claire',
      summary: 'The week most club players should start with. Mornings on serve and return, afternoons using them in live points, and covered courts for the wet-season storms.',
      body: [
        'Every point starts with a serve and a return, and most club players have spent years practising neither. A second serve that sits up and a return hit from the wrong position decide more matches than any forehand.',
        'Mornings run from seven to half past nine, with serve days built in through the week and an extra clinic hour on a covered court. Afternoons from four are live points, singles one day and doubles the next, where the only instruction is to use what you did in the morning.',
        'February is the wet season, so the afternoon session is booked under cover. The middle of the day is yours either way.',
      ],
      includes: ['31 hours of coached court time', 'Serve clinic on serve days', 'Video review twice in the week', 'Private suite, seven nights', 'Airport transfers both ways', 'Breakfast daily, dinner together four nights'],
      photo: T.forehand, extras: ['video', 'serve-clinic', 'airport'],
    },
    {
      id: 't2', slug: 'itf-season-block-nusa-dua', name: 'The Nusa Dua Block', headline: 'Ten nights of real training, during the ITF season.',
      base: 'nusadua', level: 'competitive', intensity: 'heavy', stay: 'villa', nights: 10,
      dates: '25 October – 4 November 2027', month: 'October', priceFromUsd: 3790, spotsTotal: 8, spotsLeft: 3, status: 'filling', coachId: 'mateo',
      summary: 'A training block for players who compete. Drilling, conditioning and scored sets every day, local hitting partners, and an afternoon watching professionals at the national tennis centre.',
      body: [
        'This is the hardest week we run and it is not for everyone. Patterns at seven, footwork and conditioning at three, scored sets as the heat drops. Ten nights of that is a genuine block, not a holiday with tennis in it.',
        'The week is timed for the autumn ITF season at the national tennis centre, if the 2027 calendar follows 2026. Watching an M15 match from a few metres away is the fastest way to see what the next level asks of your movement and shot tolerance.',
        'Sets against ranked Indonesian players on alternate days give you opponents who do not know your game. The round-robin on day ten is scored and taken seriously.',
      ],
      includes: ['43 hours of coached court time', 'Sets against local ranked players', 'Daily conditioning with a sport scientist', 'Whole villa, eight players, ten nights', 'An afternoon at the ITF', 'Scored round-robin on the final full day'],
      photo: T.serveDark, extras: ['video', 'partner', 'itf', 'gym', 'tournament', 'ice-bath', 'airport'],
    },
    {
      id: 't3', slug: 'first-serve-sanur', name: 'First Serve', headline: 'Five nights for beginners, and for people starting again.',
      base: 'sanur', level: 'starter', intensity: 'light', stay: 'private', nights: 5,
      dates: '12–17 April 2027', month: 'April', priceFromUsd: 820, spotsTotal: 8, spotsLeft: 6, status: 'open', coachId: 'wayan',
      summary: 'Never played, or not since school. One session a day, a racket that suits you, and a scored game by the last morning.',
      body: [
        'Tennis is easier to learn properly the first time than to fix later. Grip, ready position and contact in front of the body are not exciting, but they are what lets a rally last longer than three balls.',
        'One session a day, two hours at most, at seven in the morning. The rest of the time you are in Sanur, the gentlest part of the island, with a beach path you can cycle and the short airport run.',
        'By the last morning everyone plays a scored game. Returning players usually find the old strokes are closer than they thought.',
      ],
      includes: ['14 hours of coached court time', 'Racket restrung or a demo frame', 'Groups of four, never more', 'Private suite, five nights', 'Airport transfers both ways', 'A scored game on the last morning'],
      photo: T.balls, extras: ['stringing', 'airport'],
    },
    {
      id: 't4', slug: 'ubud-comeback', name: 'Ubud Comeback', headline: 'Six nights of tennis your body can absorb.',
      base: 'ubud', level: 'club', intensity: 'light', stay: 'villa', nights: 6,
      dates: '14–20 June 2027', month: 'June', priceFromUsd: 1490, spotsTotal: 8, spotsLeft: 8, status: 'open', coachId: 'priya',
      summary: 'For players coming back from an injury, a long season or a long break. One court session a day, and everything else pointed at recovery.',
      body: [
        'Ubud is cooler than the coast and the nights are properly fresh. That is the practical reason for this week: the same session costs your body less here.',
        'One session a day, built around movement and the serve shoulder. Around it: yoga at sunrise, a sports massage every third day, and strength work aimed at tendons rather than numbers.',
        'People book it after a tennis elbow, a calf strain, or a season that went on too long.',
      ],
      includes: ['16 hours of coached court time', 'Sunrise yoga daily', 'Sports massage every third day', 'Strength work every other day', 'Whole villa, six nights', 'A return-to-play plan for home'],
      photo: L.yogaDeck, extras: ['yoga', 'massage', 'gym', 'airport'],
    },
    {
      id: 't5', slug: 'doubles-week-umalas', name: 'Doubles Week', headline: 'Seven nights on the half of the game nobody coaches.',
      base: 'umalas', level: 'club', intensity: 'balanced', stay: 'shared', nights: 7,
      dates: '5–12 July 2027', month: 'July', priceFromUsd: 1190, spotsTotal: 16, spotsLeft: 11, status: 'open', coachId: 'wayan',
      summary: 'Most club tennis is doubles and most coaching is singles. This week reverses that, and finishes with a round-robin.',
      body: [
        'Club players spend most of their tennis lives in doubles and almost none of their lessons there. Where to stand when your partner serves, when to poach, who takes the middle ball: these are learnable, and they win more points than a better forehand.',
        'Sessions keep the usual shape, morning drilling and afternoon play, with the afternoons weighted to doubles and partners rotated so you play with everyone.',
        'The last full day is a round-robin with a doubles final in the evening. Sixteen players is the largest group we run, because the format needs a crowd.',
      ],
      includes: ['28 hours of coached court time', 'Doubles tactics most afternoons', 'Shared villa room, seven nights', 'Round-robin and finals on the last full day', 'Stringing and demo rackets', 'Airport transfers both ways'],
      photo: T.courtTrees, extras: ['tournament', 'stringing', 'airport'],
    },
    {
      id: 't6', slug: 'long-weekend-nusa-dua', name: 'Long Weekend', headline: 'Three nights, if that is all you have.',
      base: 'nusadua', level: 'club', intensity: 'balanced', stay: 'private', nights: 3,
      dates: 'Most weekends, year round', month: 'Flexible', priceFromUsd: 660, spotsTotal: 8, spotsLeft: 6, status: 'open', coachId: 'claire',
      summary: 'For people already in the region. Two full days of tennis, indoor courts if it rains, and the shortest airport run we have.',
      body: [
        'Short, and honest about it. You will not rebuild a serve in three nights, but you will get proper coaching on it and a clear list of what to practise at home.',
        'Nusa Dua is the base because the airport is about twenty-five minutes away and the indoor courts mean the weekend survives a storm.',
        'Popular with players from Singapore, Jakarta and Perth who come more than once a year.',
      ],
      includes: ['12 hours of coached court time', 'Two full days on court', 'Private suite, three nights', 'Airport transfers both ways', 'A written list of what to work on next'],
      photo: T.racket, extras: ['airport'],
    },
  ],

  testimonials: [
    { quote: 'I had been double-faulting at four-all for most of my adult life. Claire changed my toss on the Tuesday and by Friday I was hitting a second serve I actually trusted.', name: 'Simon K.', detail: 'Serve and Return Week, Umalas · plays in Bristol' },
    { quote: 'The Nusa Dua block was harder than any pre-season I have done at home, and better organised. Watching the M15 matches midweek told me more about my movement than any drill.', name: 'Aditya M.', detail: 'The Nusa Dua Block · ranked junior, Jakarta' },
    { quote: 'I had not played since university. Wayan was patient in exactly the right way, and by the last morning I was in a proper rally with a man half my age.', name: 'Caroline B.', detail: 'First Serve, Sanur · plays in Melbourne' },
    { quote: 'We brought ten people from our club, mostly doubles players, and for once the coaching was about doubles. Two of our pairs have won their league since.', name: 'Peter H.', detail: 'Club week, Umalas · club captain, Auckland' },
  ],

  faqs: [
    { question: 'Do I need to be any good?', answer: 'No. We run weeks for people who have never held a racket and weeks for ranked juniors, and they are genuinely different weeks. Tell us where you play and we will tell you which one fits.' },
    { question: 'Is this a booking?', answer: 'Not yet. Everything you build here is an indication, including the price. We come back with the dates we can actually hold — courts, accommodation and coaches — and you confirm in writing before any money moves.' },
    { question: 'How hot does it get on court?', answer: 'An open hard court in Bali is very hot from late morning to mid-afternoon, which is why nothing is scheduled there. Drilling starts at seven and match play at four.' },
    { question: 'What happens when it rains?', answer: 'From November to March most afternoons bring a storm. We book covered or indoor courts for the second session, so the week stays on plan.' },
    { question: 'Is it singles or doubles?', answer: 'Both. Starters mostly rally and play short games; club and competitive weeks alternate singles and doubles in the afternoons, and one week a year is weighted to doubles.' },
    { question: 'Can I come alone?', answer: 'Most people do. Groups are set by level on the first evening and partners rotate through the week, so you will have played with everyone by the end.' },
    { question: 'What about my racket?', answer: 'Bring it, and a spare if you have one — strings go quickly in the heat. The stringing package restrings on arrival and gives you demo frames to try all week.' },
    { question: 'Can we watch professional tennis?', answer: 'In 2026 the national tennis centre in Nusa Dua is hosting ITF M15 events from July to December. If your week falls in a tournament, we can add an afternoon there. The 2027 calendar is not yet published.' },
  ],

  journal: [
    {
      slug: 'fixing-the-second-serve', title: 'Fixing the second serve in a week', category: 'Technique',
      excerpt: 'Why most club second serves are just slower first serves, and the three changes that make one you can trust at four-all.',
      readMinutes: 6, date: '2026-08-21', author: 'Claire Hollis', photo: T.serve,
      body: [
        'Ask a club player what their second serve is and most will describe their first serve, hit softer. That is the problem. A slower flat serve has a smaller margin over the net, not a larger one, and it gets less safe the more nervous you are.',
        'A second serve that works under pressure gets its safety from spin, not from pace. The ball clears the net comfortably and dips into the box. To get there, three things usually change: the toss moves a little to the left and behind, the grip moves towards continental, and the swing goes up and across the ball rather than through it.',
        'None of these feels natural for the first two hundred serves. That is why a week works and a weekly lesson often does not: by Thursday the new motion has been repeated enough times that it stops feeling like someone else’s.',
        'The last step is the one players skip. Practise it in points, at deuce, when you would rather not. A second serve you have only hit in a basket drill is not yet a second serve.',
      ],
    },
    {
      slug: 'tennis-in-bali-2026', title: 'Tennis in Bali: where to play in 2026', category: 'Bali',
      excerpt: 'Resort courts, covered club courts and a professional circuit — what a visiting player will find on the island this year.',
      readMinutes: 5, date: '2026-09-24', author: 'Wayan Sudarsana', photo: T.aerialPlayer,
      body: [
        'When I was growing up, tennis in Bali meant the hotel courts in Nusa Dua. They are still there, and still good, but the island now has club courts across the south, many of them covered and many shared with padel and pickleball.',
        'For a visitor, the useful map is short. Nusa Dua for resort courts and indoor courts at the Hilton, Umalas for covered courts and the most people to play with, Sanur for covered courts and a quiet coast. Trinity Courts opened at The Laguna in July and adds another option in Nusa Dua.',
        'The big change this year is professional tennis. The national tennis centre is hosting seven ITF M15 events between July and December, all on hard courts. Go and watch one. The speed of the ball is not the surprise; the footwork is.',
        'Practical advice: book the first slot of the morning, bring a spare set of strings, and drink more than you think you need.',
      ],
    },
    {
      slug: 'hard-courts-in-the-heat', title: 'Hard courts in the heat, without wasting the week', category: 'Training',
      excerpt: 'Tropical heat changes what a session can be. Here is how the days are built around it, and why the middle of the day is not lost time.',
      readMinutes: 7, date: '2026-07-09', author: 'Priya Raman', photo: T.fromAbove,
      body: [
        'A hard court in the tropics is not a neutral surface. It holds and reflects heat, and with high humidity the body loses the ability to cool itself well before the player notices. Technique is usually the first thing to go.',
        'The answer is not to train less but to train at the ends of the day. At seven in the morning the court is still cool. By four in the afternoon it has dropped enough to play properly again, and in the wet season the second session moves under a roof anyway.',
        'The middle of the day is therefore part of the plan. Sleep, shade, food and enough salt: a hard morning can cost well over a litre of sweat, and thirst lags well behind the loss.',
        'Hard courts are also hard on legs. That is why heavy weeks put footwork and conditioning in the late afternoon on purpose, and why the rest day matters more than people expect.',
      ],
    },
  ],

  planner,

  whatsapp: 'Hello Sports in Paradise, I’d like to talk about a tennis retreat in Bali.',
  cta: {
    heading: 'Tell Us How You Want to Play.',
    lede: 'Where you play now, roughly when you can travel, and what you want out of the week. You will get a real schedule and a real price back — and nothing is held until you say so.',
  },
};
