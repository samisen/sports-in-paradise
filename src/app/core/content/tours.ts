import { PHOTOS } from '../media';
import { Tour, TourId } from './types';

/**
 * The five tours, from the project brief (version 1, November 2026).
 *
 * Prices are list prices per person in a shared (twin) room, excluding
 * flights; the brief marks final prices and upgrade tiers as still to be
 * confirmed. Day-by-day programmes follow each tour's "journey at a glance"
 * and are shown as samples: the final programme is confirmed per departure.
 */

const P = PHOTOS;

export const PADEL: Tour = {
  id: 'padel',
  name: 'Padel in Paradise',
  short: 'Padel',
  badge: 'Flagship',
  tagline: 'Coached padel, a team cup and Bali’s own players.',
  description:
    'Padel in Paradise: a 10-day hosted padel tour in Bali for 8 to 12 guests of every level. Coaching, the Paradise Cup, a community tournament with local players, recovery and the island. From $2,200 per person, excluding flights.',
  ledBy: 'Head of Sports Tours',

  days: 10,
  nights: 9,
  group: '8 to 12 guests',
  groupMax: 12,
  priceFromUsd: 2200,

  thread: {
    name: 'The Paradise Cup',
    text: 'Mixed-level teams are drawn on day 2. Points come from matches, challenges and the community tournament, and it all ends in the Cup finals and an awards dinner.',
  },
  intro:
    'Our flagship tour. You are assessed on day 2 and matched with players at your level, coached in small groups, and drawn into a team for the Paradise Cup. In between there is the island, a genuine day off, and a tournament with Bali’s local padel community.',
  facts: [
    { label: 'Level', value: 'All levels, matched by level' },
    { label: 'Coaching', value: 'Six sessions: an assessment plus five coached sessions, one coach for each court of four players' },
    { label: 'Method', value: 'Club and freelance coaches working to a method designed by our certified founder-coach' },
  ],
  journey: [
    { day: 'Day 1', kind: 'arrival', title: 'Arrival and welcome dinner', text: 'Your tour leader meets you at the airport. Settle in, meet the group, dinner together.' },
    { day: 'Day 2', kind: 'assessment', title: 'Level assessment and team draw', text: 'An on-court assessment with the coaches, then the Paradise Cup teams are drawn.' },
    { day: 'Days 3–4', kind: 'sport', title: 'Coaching, culture and an excursion', text: 'Coached sessions in groups of four, a culture half-day and an excursion on the island.' },
    { day: 'Day 5', kind: 'off', title: 'Day off', text: 'A genuine free day. Rest, explore, or ask your tour leader to arrange something.' },
    { day: 'Day 6', kind: 'community', title: 'Mobility, coaching and a friendly match', text: 'A mobility session, coaching, then a friendly match against a local club.' },
    { day: 'Day 7', kind: 'recovery', title: 'Coaching and the Recovery Ritual', text: 'A coached session, then the full Recovery Ritual: release, restore, reset, recover, reflect.' },
    { day: 'Day 8', kind: 'community', title: 'Community tournament', text: 'A tournament with local players. Every match counts towards the Cup.' },
    { day: 'Day 9', kind: 'finale', title: 'Cup finals and awards dinner', text: 'A last coached session, the Paradise Cup finals, and the awards dinner.' },
    { day: 'Day 10', kind: 'departure', title: 'Departure', text: 'Breakfast, goodbyes and your transfer to the airport.' },
  ],
  includedExtra: ['Six padel sessions with court fees', 'Paradise Cup, community tournament and awards dinner'],
  bestFor: 'Club groups, friends, couples and solo players',
  season: {
    ratings: [1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 2, 1],
    note: 'Best in the dry season, April to October. Covered courts keep a wet-season tour possible.',
  },
  faqs: [
    { question: 'I have only played a few times. Is this for me?', answer: 'Yes. The day 2 assessment puts you on court with players at your level, and the Cup teams mix levels so every team has a chance.' },
    { question: 'How many players are on each court?', answer: 'Four players and one coach per court during coached sessions.' },
    { question: 'Do I need to bring a racket?', answer: 'Bring yours if you have one. If not, tell us when you book and we will arrange one.' },
  ],

  hero: [P.people.padelPair, P.padel.courtsOutdoor, P.padel.smash],
  gallery: [P.padel.pair, P.padel.lunge, P.people.padelOverhead, P.padel.courtGlass, P.people.dinner, P.people.trophy],

  whatsapp: 'Hello Sports in Paradise, I would like to know more about Padel in Paradise.',
};

export const GOLF: Tour = {
  id: 'golf',
  name: 'Golf in Paradise',
  short: 'Golf',
  tagline: 'Five courses, a pro clinic and the Bali Links Cup.',
  description:
    'Golf in Paradise: a 10-day hosted golf tour in Bali for 6 guests. Five rounds on different courses, a clinic with a pro, the Bali Links Cup stableford series, recovery and culture. From $3,250 per person, excluding flights.',
  ledBy: 'Head of Sports Tours',

  days: 10,
  nights: 9,
  group: '6 guests',
  groupMax: 6,
  priceFromUsd: 3250,

  thread: {
    name: 'The Bali Links Cup',
    text: 'A stableford series over five rounds on different courses. The leaderboard moves every round, and the Cup is presented on the last night.',
  },
  intro:
    'A social golf trip with good courses and good company. Five rounds on different courses — clifftops, the coast and the cool highlands — with a clinic from a pro, golf-specific mobility and recovery, two days of culture and nature, and one free day.',
  facts: [
    { label: 'Courses', value: 'Five rounds on different courses, for example New Kuta, Bukit Pandawa, Bali National and Handara' },
    { label: 'Coaching', value: 'One clinic with a pro' },
    { label: 'Recovery', value: 'Golf-specific mobility and the Recovery Ritual' },
  ],
  journey: [
    { day: 'Day 1', kind: 'arrival', title: 'Arrival and welcome dinner', text: 'Airport pickup by your tour leader, check in, and dinner with the group.' },
    { day: 'Day 2', kind: 'assessment', title: 'Round 1 and a clinic with the pro', text: 'The opening round sets the Cup leaderboard; the afternoon clinic works on what it showed.' },
    { day: 'Day 3', kind: 'sport', title: 'Round 2', text: 'A clifftop course on the Bukit, then golf-specific mobility.' },
    { day: 'Day 4', kind: 'culture', title: 'Culture day', text: 'Temples, villages and Balinese food, with a licensed local guide.' },
    { day: 'Day 5', kind: 'sport', title: 'Round 3 and the Recovery Ritual', text: 'A morning round, then the Recovery Ritual in the afternoon.' },
    { day: 'Day 6', kind: 'off', title: 'Day off', text: 'A free day. The pool, the beach, a spa, or nothing at all.' },
    { day: 'Day 7', kind: 'culture', title: 'Nature day in the highlands', text: 'Rice terraces and the crater lakes, and a night in the cool air of the highlands.' },
    { day: 'Day 8', kind: 'sport', title: 'Round 4 in the highlands', text: 'A round at altitude, then back to the coast.' },
    { day: 'Day 9', kind: 'finale', title: 'Round 5 and the Cup dinner', text: 'The final round decides the Bali Links Cup, presented at the closing dinner.' },
    { day: 'Day 10', kind: 'departure', title: 'Departure', text: 'Breakfast and your transfer to the airport.' },
  ],
  includedExtra: ['Green fees for five rounds', 'One clinic with a pro', 'Bali Links Cup and closing dinner'],
  bestFor: 'Golf friends and couples; social golfers who want quality rounds and good company',
  season: {
    ratings: [1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 2, 1],
    note: 'The dry season, April to October, gives the firmest fairways and the clearest mornings.',
  },
  faqs: [
    { question: 'Do I need a handicap?', answer: 'It helps for the stableford scoring, but it is not required. The first round and the clinic tell us where you are.' },
    { question: 'Can I bring my own clubs?', answer: 'Yes. Rental sets can also be arranged — tell us when you book.' },
    { question: 'My partner does not play golf. Can they come?', answer: 'Yes. The companion programme gives them a parallel wellness programme, with shared meals, excursions and evenings.' },
  ],

  hero: [P.golf.oceanCliff, P.people.golfThree, P.golf.palmsOcean],
  gallery: [P.golf.sunsetSwing, P.people.golfToast, P.golf.bunkers, P.golf.byTheSea, P.people.ulunDanuGold, P.golf.flag],

  whatsapp: 'Hello Sports in Paradise, I would like to know more about Golf in Paradise.',
};

export const MARTIAL_ARTS: Tour = {
  id: 'martial-arts',
  name: 'Martial Arts in Paradise',
  short: 'Martial Arts',
  tagline: 'Serious, friendly training, ending in a showcase day.',
  description:
    'Martial Arts in Paradise: a 10-day hosted martial arts tour in Bali for up to 8 guests. Muay Thai, boxing, Kung Fu or Taekwondo, a Pencak Silat workshop, the Warrior’s Path skill passport and a showcase day. From $2,500 per person, excluding flights.',
  ledBy: 'Head of Sports Tours',

  days: 10,
  nights: 9,
  group: 'Up to 8 guests',
  groupMax: 8,
  priceFromUsd: 2500,

  thread: {
    name: 'The Warrior’s Path',
    text: 'Each guest picks a main discipline and samples a second. A skill passport tracks your progress through the tour, up to a showcase day with demonstrations and awards.',
  },
  intro:
    'Serious training in a safe, friendly setting — for beginners and experienced practitioners alike. Daily classes in your main and second disciplines, conditioning and mobility, a Pencak Silat workshop with a local master, and one day off. Not a fight camp: no sparring for its own sake, just good coaching.',
  facts: [
    { label: 'Disciplines', value: 'Muay Thai, boxing, Kung Fu and Taekwondo, plus a Pencak Silat (Indonesian martial art) workshop with a local master' },
    { label: 'Level', value: 'Beginners and experienced practitioners' },
    { label: 'Safety', value: 'Medical screening and waivers, supervised partner drills only, protective gear, one coach for every four guests, first-aid and concussion protocol' },
  ],
  journey: [
    { day: 'Day 1', kind: 'arrival', title: 'Arrival and welcome dinner', text: 'Airport pickup, check in, and dinner with the group.' },
    { day: 'Day 2', kind: 'assessment', title: 'Assessment and introduction', text: 'A movement and skills assessment. You choose your main discipline and your second, and get your skill passport.' },
    { day: 'Days 3–4', kind: 'sport', title: 'Main and second discipline', text: 'Daily classes in both disciplines, with conditioning and mobility.' },
    { day: 'Day 5', kind: 'culture', title: 'Pencak Silat and culture day', text: 'A workshop with a local Pencak Silat master, then an afternoon of Balinese culture.' },
    { day: 'Day 6', kind: 'off', title: 'Day off', text: 'A genuine free day to rest and explore.' },
    { day: 'Day 7', kind: 'sport', title: 'Pad work and technical drills', text: 'Pad work and controlled technical drills, then the Recovery Ritual.' },
    { day: 'Day 8', kind: 'sport', title: 'Preparing the showcase', text: 'Classes in both disciplines and a passport review with your coach.' },
    { day: 'Day 9', kind: 'finale', title: 'Showcase day', text: 'Demonstrations of what you have learned, awards, and a closing dinner.' },
    { day: 'Day 10', kind: 'departure', title: 'Departure', text: 'Breakfast and your transfer to the airport.' },
  ],
  includedExtra: ['Daily classes in two disciplines', 'Pencak Silat workshop with a local master', 'Protective training gear', 'Skill passport, showcase day and awards'],
  bestFor: 'Beginners and experienced practitioners who want serious but friendly training',
  season: {
    ratings: [3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3],
    note: 'Training is indoors, so it works all year — and it is our recommendation for the wet season, November to March.',
  },
  faqs: [
    { question: 'Is there sparring?', answer: 'Only supervised partner drills. There is no uncontrolled sparring, and protective gear is provided.' },
    { question: 'I have never trained. Can I join?', answer: 'Yes. The day 2 assessment sets your starting point, and coaching is one coach for every four guests.' },
    { question: 'Do I need a medical check?', answer: 'Every guest completes a medical screening and a waiver before the tour.' },
  ],

  hero: [P.martial.gymKick, P.martial.padWoman, P.martial.belt],
  gallery: [P.martial.drill, P.martial.boxingWoman, P.martial.gloves, P.martial.silhouette, P.bali.uluwatuTemple, P.bali.lempuyang],

  whatsapp: 'Hello Sports in Paradise, I would like to know more about Martial Arts in Paradise.',
};

export const WELLNESS: Tour = {
  id: 'wellness',
  name: 'Wellness in Paradise',
  short: 'Wellness',
  badge: 'Signature wellness tour',
  tagline: 'Train smart, recover well, leave with a plan.',
  description:
    'Wellness in Paradise: a 10-day hosted wellness tour in Bali for up to 10 guests. Strength and conditioning, Pilates and mobility, breathing, nutrition and sleep, a personal baseline and a take-home plan. From $2,750 per person, excluding flights.',
  ledBy: 'Head of Wellness',

  days: 10,
  nights: 9,
  group: 'Up to 10 guests',
  groupMax: 10,
  priceFromUsd: 2750,

  thread: {
    name: 'The Reset journey',
    text: 'A personal baseline on arrival, a progress review at the end, and a take-home plan for the next four to six weeks.',
  },
  intro:
    'Leave stronger, move better, recover smarter, feel connected — and discover Bali. A premium small-group experience combining performance, movement, mindset and recovery, designed by our Head of Wellness. Active and social, not a retreat.',
  facts: [
    { label: 'Four dimensions', value: 'Performance and Conditioning; Movement and Mobility; Recovery and Well-being; Mind and Balance' },
    { label: 'Progress', value: 'A personal baseline on arrival, a progress review at the end and a take-home plan for the next four to six weeks' },
    { label: 'Specialists', value: 'Yoga and Pilates instructors, breathwork and meditation specialists, strength and conditioning coaches, nutrition specialists, massage and recovery therapists' },
    { label: 'Venues', value: 'Boutique hotels, resorts or villas with a pool, movement space, gym or training area, healthy food and access to nature' },
  ],
  journey: [
    { day: 'Day 1', kind: 'arrival', title: 'Arrival', text: 'Airport pickup by your tour leader, check in, and a welcome dinner.' },
    { day: 'Day 2', kind: 'assessment', title: 'Consultation and assessment', text: 'A one-to-one consultation, health screening, and a fitness and movement assessment: your personal baseline.' },
    { day: 'Day 3', kind: 'sport', title: 'Strength, Pilates and mobility', text: 'Strength and conditioning in the morning, Pilates and mobility later in the day.' },
    { day: 'Day 4', kind: 'culture', title: 'Sunrise hike and breathing workshop', text: 'An early hike for the sunrise, then a breathing and recovery workshop.' },
    { day: 'Day 5', kind: 'culture', title: 'Nutrition, sleep and a culture half-day', text: 'A nutrition and sleep session, then an afternoon of Balinese culture.' },
    { day: 'Day 6', kind: 'off', title: 'Day off', text: 'A free day. Your tour leader can suggest a spa, a beach or a walk.' },
    { day: 'Day 7', kind: 'community', title: 'Team challenge', text: 'A team challenge with the group, then a recovery workshop.' },
    { day: 'Day 8', kind: 'recovery', title: 'Training and the Recovery Ritual', text: 'Strength and mobility, then the full Recovery Ritual.' },
    { day: 'Day 9', kind: 'finale', title: 'Reassessment and closing dinner', text: 'Your progress review, personal feedback, your take-home plan, and the closing dinner.' },
    { day: 'Day 10', kind: 'departure', title: 'Departure', text: 'Breakfast and your transfer to the airport.' },
  ],
  includedExtra: ['All meals', 'Consultation, health screening and movement assessment', 'Progress review and a take-home plan'],
  bestFor: 'Friends, women’s and mixed groups, professionals seeking an active reset, and partners of sports travellers',
  season: {
    ratings: [3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3],
    note: 'Good all year, and our recommendation for the wet season, November to March.',
  },
  faqs: [
    { question: 'Is this a retreat?', answer: 'No. It is an active, social programme with recovery built in. You train, you move, you explore — and you rest properly.' },
    { question: 'What does the take-home plan cover?', answer: 'Training, movement and recovery for the next four to six weeks, built from your baseline and progress review.' },
    { question: 'Are meals included?', answer: 'Yes. All meals are included on the wellness tour.' },
  ],

  hero: [P.wellness.studio, P.life.yogaDeck, P.wellness.reformer],
  gallery: [P.wellness.beachMeditation, P.wellness.herbal, P.wellness.bowls, P.wellness.ridge, P.wellness.stretch, P.bali.tegalalang],

  whatsapp: 'Hello Sports in Paradise, I would like to know more about Wellness in Paradise.',
};

export const HYBRID: Tour = {
  id: 'hybrid',
  name: 'Hybrid in Paradise',
  short: 'Hybrid',
  badge: 'HYROX-style',
  tagline: 'Two training blocks and a timed race, with medals.',
  description:
    'Hybrid in Paradise: a 12-day hosted HYROX-style hybrid fitness tour in Bali for 6 guests. A baseline test, two coached training blocks and the Bali Hybrid Challenge with timing and medals. From $3,050 per person, excluding flights.',
  ledBy: 'Head of Wellness',

  days: 12,
  nights: 11,
  group: '6 guests',
  groupMax: 6,
  priceFromUsd: 3050,

  thread: {
    name: 'The Bali Hybrid Challenge',
    text: 'A baseline test, two training blocks, and a simulated race on day 11 with timing and medals.',
  },
  intro:
    'For functional-fitness and running enthusiasts who like a challenge and a group. Two coached training blocks build towards a simulated HYROX-style race, with a rest and discovery day, race-specific work and a taper before the challenge.',
  facts: [
    { label: 'Format', value: 'Baseline test, two coached training blocks and a simulated race with timing and medals' },
    { label: 'Level', value: 'Functional-fitness and running enthusiasts' },
    { label: 'Please note', value: 'HYROX-style: inspired by the format. Not affiliated with or endorsed by HYROX.' },
  ],
  journey: [
    { day: 'Day 1', kind: 'arrival', title: 'Arrival and welcome dinner', text: 'Airport pickup, check in and dinner with the group.' },
    { day: 'Day 2', kind: 'assessment', title: 'Baseline test', text: 'A timed baseline across running and the functional stations.' },
    { day: 'Days 3–5', kind: 'sport', title: 'Training block one', text: 'Coached sessions on running, strength and the stations, with mobility and recovery.' },
    { day: 'Day 6', kind: 'off', title: 'Rest and discovery day', text: 'A day off training to rest and explore the island.' },
    { day: 'Days 7–9', kind: 'sport', title: 'Training block two', text: 'Race-specific work: pacing, transitions and the stations under fatigue.' },
    { day: 'Day 10', kind: 'culture', title: 'Taper and culture day', text: 'Light movement, the Recovery Ritual and an afternoon of Balinese culture.' },
    { day: 'Day 11', kind: 'finale', title: 'The Bali Hybrid Challenge', text: 'The simulated race, with timing, medals and a celebration dinner.' },
    { day: 'Day 12', kind: 'departure', title: 'Departure', text: 'Breakfast and your transfer to the airport.' },
  ],
  includedExtra: ['Two coached training blocks', 'Baseline test and timed challenge with medals'],
  bestFor: 'Functional-fitness and running enthusiasts who like a challenge and a group',
  season: {
    ratings: [2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2],
    note: 'Training is mostly indoors, so it runs all year. The dry season, April to October, is best for the running.',
  },
  faqs: [
    { question: 'Is this an official HYROX event?', answer: 'No. It is HYROX-style — inspired by the format — and is not affiliated with or endorsed by HYROX.' },
    { question: 'Do I need to have raced before?', answer: 'No. The baseline test on day 2 sets your starting point and the blocks are coached at your level.' },
    { question: 'How many people are in the group?', answer: 'Six guests, so the coaching stays personal.' },
  ],

  hero: [P.hybrid.ropes, P.hybrid.kettlebells, P.hybrid.beachRun],
  gallery: [P.hybrid.rower, P.hybrid.barbell, P.hybrid.highFives, P.hybrid.pair, P.people.medals, P.bali.uluwatuCliffs],

  whatsapp: 'Hello Sports in Paradise, I would like to know more about Hybrid in Paradise.',
};

/** In the order the brief presents them. */
export const TOURS: Tour[] = [PADEL, GOLF, MARTIAL_ARTS, WELLNESS, HYBRID];

export function tourById(id: string | null | undefined): Tour | undefined {
  return TOURS.find((t) => t.id === id);
}

/** The tour pages' paths, e.g. /tours/martial-arts. */
export function tourPath(id: TourId): string {
  return `/tours/${id}`;
}
