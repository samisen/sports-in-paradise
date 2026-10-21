/**
 * Copy shared by every site: how a week gets from a message to the island.
 * Sport-specific wording lives in each sport's content file.
 */

export interface WeekStep {
  index: string;
  name: string;
  icon: string;
  line: string;
  detail: string;
}

export const WEEK_STEPS: WeekStep[] = [
  {
    index: '01',
    name: 'Tell us where you are',
    icon: 'message',
    line: 'A level, a rough set of dates, and what you want out of the week.',
    detail: 'Two minutes on the planner or one message. The only thing we genuinely need is an honest read on your level — everything else can move.',
  },
  {
    index: '02',
    name: 'We build the week',
    icon: 'schedule',
    line: 'A real schedule and a real price, usually the same day.',
    detail: 'Day by day, with the sessions, the recovery and the free hours laid out. If something in it does not suit you, say so — it is a draft, not an offer.',
  },
  {
    index: '03',
    name: 'Dates confirmed',
    icon: 'check-circle',
    line: 'We hold the rooms, the venues and the people before you pay anything.',
    detail: 'Nothing on this site is a booking. We check the things that actually constrain a week — and on Bali that includes ceremonies and seasons — and come back in writing.',
  },
  {
    index: '04',
    name: 'Groups set before you land',
    icon: 'team',
    line: 'Levels sorted in advance, so the first morning is not a trial.',
    detail: 'Solo bookings get a short call, which sounds fussy and saves a day of the week.',
  },
  {
    index: '05',
    name: 'The week itself',
    icon: 'trophy',
    line: 'The sport at the ends of the day, the island in between.',
    detail: 'Coaching or guiding, real time doing the thing, recovery, and enough unscheduled time that you come home rested as well as better.',
  },
  {
    index: '06',
    name: 'Something to take home',
    icon: 'file-protect',
    line: 'A written plan for what comes next.',
    detail: 'The week ends with a short, specific plan for the next three months. It is the difference between a good holiday and a lasting change.',
  },
];

export const PROMISE_LINE =
  'Every week here is built around one guest’s level, dates and appetite — there is no standard package to fit yourself into.';

export const BELIEF_LINE = 'We believe a week of sport should change something that lasts longer than the tan.';
