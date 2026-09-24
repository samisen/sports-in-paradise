/**
 * Page copy.
 *
 * Kept out of the templates so the whole voice of the site can be read in one
 * file — and so claims that need a source keep it attached to them.
 */

export interface ValuePillar {
  key: 'padel' | 'island';
  eyebrow: string;
  title: string;
  lead: string;
  body: string;
  points: string[];
  art: number;
}

export interface WeekStep {
  index: string;
  name: string;
  icon: string;
  line: string;
  detail: string;
}

export interface PlayerProfile {
  id: 'newcomer' | 'improver' | 'competitor';
  name: string;
  subtitle: string;
  description: string;
  priorities: string[];
  art: number;
}

export const HERO = {
  headline: 'Play Every Day. Recover Properly. Go Home a Better Player.',
  support:
    'Padel retreats in Bali, built around how you actually want to spend a week — and planned with you before anything is booked.',
};

export const TWO_VALUES: ValuePillar[] = [
  {
    key: 'padel',
    eyebrow: 'The padel',
    title: 'Coaching that changes something',
    lead: 'Small groups, the same coach all week, and a plan that survives contact with a real match.',
    body:
      'Groups of four, set by level rather than by who booked together. Mornings on the shots you avoid, afternoons using them under pressure, and a written list of what to work on when you get home.',
    points: [
      'Four players to a coach, never more.',
      'Sessions at the ends of the day, not in the heat.',
      'You leave with something specific to practise.',
    ],
    art: 1,
  },
  {
    key: 'island',
    eyebrow: 'The island',
    title: 'A week you would want anyway',
    lead: 'Bali is not the backdrop. It is half the reason the week works.',
    body:
      'The middle of every day is yours, because nothing useful happens on a glass court at one in the afternoon. Surf, sleep, eat, or go and find a waterfall — and come back to the court when it is a pleasure again.',
    points: [
      'The hours between sessions are genuinely free.',
      'Recovery that is part of the plan, not an upsell.',
      'Four bases on the island, each for a different week.',
    ],
    art: 2,
  },
];

export const WHY_BALI = {
  eyebrow: 'Why Bali',
  title: 'The Only Place This Week Works',
  lead: 'Courts, climate, cost and recovery — the four things a training week needs, in one place.',
  paragraphs: [
    'Bali got its first padel courts in 2022 and now has fifteen across five clubs, with more going up on the Bukit. That is enough to run a serious week without ever waiting for a court, and few enough that we know every club owner by name.',
    'The rest of it is what makes the week possible at all: a climate that lets you play outdoors in January, physios and massage at a fraction of European prices, food that suits an athlete without trying, and an island small enough that the coach, the court and the villa are fifteen minutes apart.',
  ],
  facets: [
    { icon: 'trophy', title: 'Courts', text: 'Fifteen across five clubs, and an early slot is always available if you book it.' },
    { icon: 'fire', title: 'Climate', text: 'Outdoor padel every month of the year, played at the ends of the day.' },
    { icon: 'heart', title: 'Recovery', text: 'Physio, massage and ice at prices that let them be daily rather than occasional.' },
    { icon: 'coffee', title: 'Food', text: 'An eating culture that happens to suit training, without a sports menu in sight.' },
    { icon: 'compass', title: 'The island', text: 'Surf, volcanoes and reef within an hour of any base we use.' },
    { icon: 'team', title: 'People', text: 'A padel scene that is small, mixed and genuinely welcoming to visitors.' },
  ],
};

export const THE_SPORT = {
  eyebrow: 'The sport',
  title: 'Why Padel, and Why Now',
  lead: 'The fastest-growing racket sport in the world, and the one where a week of coaching still moves you a long way.',
  paragraphs: [
    'Padel is played by around thirty million people in more than a hundred and thirty countries, on a court count that has gone from roughly fourteen thousand in 2018 to over seventy thousand today. It is the fastest-growing racket sport in the world by some distance.',
    'What matters for a retreat is the shape of the learning curve. The floor is unusually low — a beginner sustains a rally in their first hour — and the ceiling is high. The gap between a club player and a good one is enormous, and unlike most sports it is closable with a week of proper coaching.',
  ],
  drivers: [
    { icon: 'rise', title: 'Growth', text: 'Thirty million players, seventy thousand courts, and both still climbing.' },
    { icon: 'thunderbolt', title: 'Learning curve', text: 'Playable in an hour, and a long way from good. That gap is what a week closes.' },
    { icon: 'team', title: 'Doubles', text: 'Four players to a court, which is why a week alone still produces a group.' },
    { icon: 'safety-certificate', title: 'Low impact', text: 'Short court, soft ball. Bodies that cannot take tennis often can take this.' },
  ],
};

export const WEEK_STEPS: WeekStep[] = [
  {
    index: '01',
    name: 'Tell us where you play',
    icon: 'message',
    line: 'A level, a rough set of dates, and what you want out of the week.',
    detail:
      'Two minutes on the planner or one message. The only thing we genuinely need is an honest read on your level — everything else can move.',
  },
  {
    index: '02',
    name: 'We build the week',
    icon: 'schedule',
    line: 'A real schedule and a real price, usually the same day.',
    detail:
      'Day by day, with the sessions, the recovery and the free hours laid out. If something in it does not suit you, say so — it is a draft, not an offer.',
  },
  {
    index: '03',
    name: 'Dates and courts confirmed',
    icon: 'check-circle',
    line: 'We hold the villa, the courts and the coach before you pay anything.',
    detail:
      'Nothing on this site is a booking. We check the three things that actually constrain a week and come back with what we can hold, in writing.',
  },
  {
    index: '04',
    name: 'Groups set before you land',
    icon: 'team',
    line: 'Levels sorted in advance, so the first morning is not a trial.',
    detail:
      'On a club trip we know the standard already. Solo bookings get a short call, which sounds fussy and saves a day of the week.',
  },
  {
    index: '05',
    name: 'The week itself',
    icon: 'trophy',
    line: 'Court at either end of the day, the island in between.',
    detail:
      'Coaching, match play, recovery, and enough unscheduled time that you come home rested as well as better. Load is adjusted per player as the week goes on.',
  },
  {
    index: '06',
    name: 'Something to take home',
    icon: 'file-protect',
    line: 'A written list of what to work on, and the footage to go with it.',
    detail:
      'The week ends with a short, specific plan for the next three months. It is the difference between a good holiday and a change in your game.',
  },
];

export const PLAYER_PROFILES: PlayerProfile[] = [
  {
    id: 'newcomer',
    name: 'Never played',
    subtitle: 'Or played three times on holiday',
    description:
      'One session a day, rackets provided, and a real scored match by the last morning. The pace is deliberately gentle — the habits you build in the first ten hours are the ones you keep.',
    priorities: ['Learn it properly the first time', 'Not be the worst person there', 'Still have a holiday'],
    art: 1,
  },
  {
    id: 'improver',
    name: 'Plays weekly',
    subtitle: 'And has stopped getting better',
    description:
      'The most common player here. Two sessions a day, mornings on the two or three shots you quietly avoid, afternoons proving they hold up when the point matters.',
    priorities: ['Fix a specific shot', 'Understand court position', 'Take something home to practise'],
    art: 2,
  },
  {
    id: 'competitor',
    name: 'Competes',
    subtitle: 'League, circuit or tournament',
    description:
      'A genuine training block: three sessions a day, periodised, with conditioning built around the court load and a taper at the end so you leave sharp.',
    priorities: ['Volume with a plan', 'A partner to practise with', 'Arrive at the season ready'],
    art: 3,
  },
];

export const PROMISE_LINE =
  'Every week here is built around one player’s level, dates and appetite — there is no standard package to fit yourself into.';

export const BELIEF_LINE = 'We believe a week of padel should change something that lasts longer than the tan.';

export const MISSION_LINE =
  'We run small padel retreats in Bali, planned with each guest before anything is booked, and coached by people who live here.';
