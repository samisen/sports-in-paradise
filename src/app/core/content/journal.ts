import { PHOTOS } from '../media';
import { JournalPost } from './types';

/**
 * The journal: guides that answer what people search for (brief, section 10:
 * "padel holiday Bali", "wellness holiday Bali" and so on). Guest stories
 * and partner spotlights join them after the first departures.
 */
export const JOURNAL: JournalPost[] = [
  {
    slug: 'best-time-for-a-sports-holiday-in-bali',
    title: 'When to go: the best time for a sports holiday in Bali',
    category: 'Guide',
    excerpt: 'Two seasons, five tours. Which months suit padel and golf, and why the wet season is a good time for wellness and martial arts.',
    readMinutes: 4,
    date: '2026-11-10',
    author: 'Sports in Paradise',
    photo: PHOTOS.bali.agungDusk,
    body: [
      'Bali sits eight degrees south of the equator, so it has two seasons rather than four, and a temperature at sea level that barely moves through the year. What changes is the rain.',
      'The dry season runs from April to October. It is the best time for outdoor sports: padel on open courts, golf on firm fairways, and running on the beach. It is also the busiest time on the island, so departures fill earlier.',
      'The wet season runs from November to March. Most mornings stay clear, and the rain tends to come as a storm in the afternoon. That suits a programme built around morning sessions — and it is a very good time for wellness, indoor training and martial arts, which are not affected by the weather at all.',
      'Whatever the month, every tour puts the main session in the cool of the morning, leaves the afternoon for the island, and keeps one genuine day off.',
    ],
  },
  {
    slug: 'what-is-the-recovery-ritual',
    title: 'The Recovery Ritual: five steps in every tour',
    category: 'Recovery',
    excerpt: 'Release, Restore, Reset, Recover, Reflect. What the Recovery Ritual is, and why it is part of every tour rather than an extra.',
    readMinutes: 3,
    date: '2026-11-05',
    author: 'Wellness in Paradise',
    photo: PHOTOS.wellness.herbal,
    body: [
      'A week of sport in the heat is hard on the body. The difference between finishing the week tired and finishing it strong is usually recovery — so we built it into every tour.',
      'Release: mobility and soft-tissue work to let go of the session. Restore: hydration, food and rest to refill the tank. Reset: breathing to bring the body down from training. Recover: massage, stretching and recovery treatments. Reflect: a few quiet minutes on the day.',
      'The Recovery Ritual was designed by our Head of Wellness. It is not a medical treatment and it makes no promises about your body; it is a routine that helps you enjoy every day of the tour, and that you can take home.',
    ],
  },
  {
    slug: 'how-level-matching-works',
    title: 'Never good enough? How level matching works',
    category: 'How it works',
    excerpt: 'The most common worry before a sports trip is the level. Here is how the day 2 assessment puts everyone with the right people.',
    readMinutes: 3,
    date: '2026-10-28',
    author: 'Sports in Paradise',
    photo: PHOTOS.padel.pair,
    body: [
      'The question we are asked most is whether you need to be good at the sport. You do not.',
      'On day 2 of every tour, everyone is assessed: on court for padel, in a round and a clinic for golf, in a movement and skills session for martial arts, and with a baseline test for the wellness and hybrid tours. Then we group people by level.',
      'That means beginners play and train with beginners, and experienced players with experienced players. Where a tour has a team competition — the Paradise Cup, for example — teams mix levels, so every team has a chance.',
    ],
  },
  {
    slug: 'bringing-your-club-to-bali',
    title: 'Bringing your club to Bali: a guide for organisers',
    category: 'Organisers',
    excerpt: 'You organise the group; we organise everything else. What a club captain or coach needs to know before planning a group trip.',
    readMinutes: 4,
    date: '2026-10-20',
    author: 'Sports in Paradise',
    photo: PHOTOS.people.golfToast,
    body: [
      'Most of our groups start with one person: a club captain, a coach, or a friend who says "we should do this". If that is you, this is what to expect.',
      'Tell us the sport, the size of the group, roughly when, the level and the budget. We reply within 24 hours with a programme, dates and a price per person.',
      'You get your own organiser link. Everyone in your group books through it, pays their own 30% deposit, and is tracked to you. Organisers are recognised for bringing a group.',
      'From the airport onwards, your tour leader takes over. You get to play.',
    ],
  },
];
