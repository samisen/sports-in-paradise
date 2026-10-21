import { PHOTOS } from '../media';
import { SportId } from '../site/sites';

/** Copy for sportsinparadise.com, the hub that leads to each sport's site. */
export const HUB = {
  descriptor: 'Sports retreats in Bali',
  description:
    'Coached padel, tennis, golf, diving and hiking weeks in Bali. Pick a sport, build the week you want, and talk to the people who run it.',
  hero: {
    eyebrow: 'Sports retreats in Bali',
    headline: 'Five Sports. One Island. A Week Built Around You.',
    support:
      'Padel, tennis, golf, diving and hiking — each with its own coaches, its own bases and its own site. Choose yours, plan the week, and send it to the team before anything is booked.',
  },
  stats: [
    { value: '5', label: 'Sports, each with its own team' },
    { value: '18', label: 'Bases across the island' },
    { value: '1,140', label: 'Guests hosted since 2023' },
    { value: '9.4/10', label: 'Average week rating' },
  ],
  combos: [
    {
      sports: ['padel', 'diving'] as SportId[],
      name: 'Court and reef',
      text: 'Four days of padel in Canggu, then three on the east coast diving the Liberty wreck. The transfer day doubles as the rest day.',
    },
    {
      sports: ['golf', 'hiking'] as SportId[],
      name: 'Fairway and summit',
      text: 'Rounds at New Kuta, a night in the highlands at Handara, and a sunrise on Batur before you fly.',
    },
    {
      sports: ['tennis', 'padel'] as SportId[],
      name: 'Both rackets',
      text: 'Tennis in the morning, padel in the evening, at clubs that have both. The fastest way to find out which one you prefer.',
    },
  ],
  why: {
    title: 'Why one team for five sports',
    points: [
      { icon: 'team', title: 'Specialists, not generalists', text: 'Each sport has its own coaches and guides who do only that. The hub just makes sure they talk to each other.' },
      { icon: 'schedule', title: 'One planner logic', text: 'Every week is built the same honest way: the sport at the ends of the day, recovery in the middle, a price you can read.' },
      { icon: 'swap', title: 'Easy to combine', text: 'Two sports in one trip is one conversation, one set of transfers and one invoice.' },
    ],
  },
  photo: PHOTOS.bali.tanahLot,
};
