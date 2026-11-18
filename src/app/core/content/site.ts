import { PHOTOS } from '../media';
import { Departure, Faq, IconPoint, TourId } from './types';

/**
 * Copy that holds for every tour, from the project brief (version 1,
 * November 2026). Anything the brief marks "[to confirm]" carries
 * `toConfirm` and is shown with a marker until the company signs it off.
 */

/* ------------------------------------------------------------ messaging --- */

export const SIGNATURE = 'Train. Play. Discover. Connect.';
export const WELLNESS_LINE = 'Measurable progress. Effective recovery.';

export const MESSAGES = {
  core: 'Come to Bali to play your sport, improve, meet great people and discover the island — and let us organise everything.',
  organisers:
    'A complete trip for your group, designed around your level and goals, with a tour leader and a community tournament. You organise the group; we organise everything else.',
  individuals: 'Join a small group of people at your level, with a tour leader who looks after the details.',
  wellness: 'Train smart, recover well and leave with a personal plan, in a small group, without the retreat atmosphere.',
  couples: 'One plays, the other chooses a wellness programme. Meet for meals, excursions and evenings.',
};

export const PROOF_POINTS = [
  'Small groups matched by level',
  'One tour leader from airport to departure',
  'Local clubs, coaches and community events',
  'Qualified specialists',
  'A personal assessment and take-home plan in the wellness tour',
  'Recovery in every tour',
];

/** What it is not — said plainly, because people will assume otherwise. */
export const NOT_THIS = ['Not a retreat', 'Not a fight camp', 'Not an academy', 'Not a party trip'];

/* --------------------------------------------------- signature elements --- */

export const SIGNATURE_ELEMENTS: IconPoint[] = [
  { icon: 'flag', title: 'A story across the whole trip', text: 'Every tour has a thread — a cup, a path, a challenge — that links the days and gives you a reason to turn up every morning.' },
  { icon: 'team', title: 'Assessed and matched by level', text: 'Everyone is assessed on day 2 and grouped by level, so you always play and train with the right people.' },
  { icon: 'global', title: 'The local community', text: 'Meet Bali’s own players, clubs and trainers in community tournaments, friendly matches and cultural experiences.' },
  { icon: 'user', title: 'One tour leader', text: 'One contact and one group chat from the airport to departure. You focus on your sport and the island.' },
  { icon: 'heart', title: 'Recovery built in', text: 'The Recovery Ritual and wellness sessions are part of every tour, not an extra.' },
  { icon: 'sun', title: 'Balanced days', text: 'Play, discover, recover, connect — with one genuine day off.' },
];

export const RECOVERY_RITUAL = [
  { step: 'Release', text: 'Mobility and soft-tissue work to let go of the session.' },
  { step: 'Restore', text: 'Hydration, nutrition and rest to refill the tank.' },
  { step: 'Reset', text: 'Breathing to bring the body down from training.' },
  { step: 'Recover', text: 'Massage, stretching and recovery treatments.' },
  { step: 'Reflect', text: 'A few quiet minutes on the day: what worked, what is next.' },
];

/* -------------------------------------------------------------- journey --- */

export interface JourneyStage {
  index: string;
  name: string;
  icon: string;
  you: string;
  we: string;
}

/** The customer journey, from first sight to the next trip. */
export const JOURNEY: JourneyStage[] = [
  { index: '01', name: 'Discover', icon: 'compass', you: 'You see our content, a friend’s recommendation or a message from your club.', we: 'We share stories from the pilot trips, partner posts and organiser links.' },
  { index: '02', name: 'Enquire', icon: 'message', you: 'You fill in a short form or message us on WhatsApp.', we: 'We reply within 24 hours and propose a tour, dates and a price.' },
  { index: '03', name: 'Book', icon: 'wallet', you: 'You pay a 30% deposit and confirm names and rooming.', we: 'We confirm your booking and open the group chat.' },
  { index: '04', name: 'Prepare', icon: 'file-protect', you: 'You complete the health and activity questionnaire and pay the 70% balance 60 days before arrival.', we: 'We match levels, brief you on the programme and check your insurance.' },
  { index: '05', name: 'Travel', icon: 'trophy', you: 'You arrive, take part and enjoy it.', we: 'Your tour leader hosts every day, from the airport to departure.' },
  { index: '06', name: 'After', icon: 'smile', you: 'You share feedback and photos, and maybe bring friends next time.', we: 'We send a short survey, and offers for your next trip.' },
];

export const PAYMENT = {
  deposit: '30% deposit at booking',
  balance: '70% balance 60 days before arrival',
  currency: 'In US dollars, by card or bank transfer',
};

/* ------------------------------------------------------------ inclusions --- */

/** Included on every tour unless stated. */
export const INCLUDED = [
  'Airport transfers',
  'Accommodation in a shared (twin) room',
  'Breakfast and selected group meals (all meals on the wellness tour)',
  'Local transport during the tour',
  'Programme sessions: coaching or training, venue, court, gym or green fees as listed',
  'Your tour leader and local coordination',
  'Recovery Ritual sessions and wellness modules',
  'Excursions and cultural experiences listed in the programme',
];

export const NOT_INCLUDED = [
  'International flights',
  'Travel and medical insurance (required)',
  'Visa and entry fees',
  'Personal expenses, extra meals and drinks',
  'Single-room supplement and upgrades',
  'Optional add-ons and merchandise',
];

export const ADD_ONS: (IconPoint & { toConfirm?: boolean })[] = [
  { icon: 'heart', title: 'Recovery Pass', text: 'Extra recovery sessions and treatments, about $180 per person.', toConfirm: true },
  { icon: 'team', title: 'Companion programme', text: 'A parallel wellness programme for partners who do not play, with shared meals, excursions and evenings.' },
  { icon: 'home', title: 'Upgrades', text: 'A private room, a villa or a higher-end resort (priced per group), a single-room supplement, or extra nights before or after.' },
  { icon: 'shop', title: 'Merchandise', text: 'Branded T-shirts, caps, towels, bottles and sport accessories.' },
];

/* ------------------------------------------------------------- audiences --- */

export interface Persona {
  name: string;
  who: string;
  wants: string;
  /** Where on the site they should go. */
  link: string;
  linkLabel: string;
}

export const PERSONAS: Persona[] = [
  { name: 'The group organiser', who: 'A club captain, coach or friend bringing 8 to 12 people', wants: 'An easy, credible trip you can sell to your group — and recognition for organising it.', link: '/plan-your-group-trip', linkLabel: 'Plan your group trip' },
  { name: 'Friends travelling together', who: 'A group that already knows each other', wants: 'A shared adventure with sport and time off: the thread, the community tournament, rooms and meals sorted.', link: '/tours', linkLabel: 'Find your tour' },
  { name: 'The solo player', who: 'You want to meet people at your level', wants: 'To play, improve and make friends, matched by level in a small group.', link: '/departures', linkLabel: 'See departures' },
  { name: 'The active professional', who: 'Busy and health-conscious', wants: 'A reset without a retreat atmosphere: structure, quality, movement and time to switch off.', link: '/wellness', linkLabel: 'Wellness in Paradise' },
  { name: 'The couple', who: 'One of you plays, the other does not', wants: 'Time together and time apart — the companion programme, shared evenings and excursions.', link: '/how-it-works#companion', linkLabel: 'The companion programme' },
  { name: 'The golfer', who: 'Golfers who want a social trip', wants: 'Quality rounds, a pro clinic and good company.', link: '/tours/golf', linkLabel: 'Golf in Paradise' },
  { name: 'The martial arts enthusiast', who: 'Practitioners or curious beginners', wants: 'Serious training in a safe, friendly setting.', link: '/tours/martial-arts', linkLabel: 'Martial Arts in Paradise' },
];

export const ORGANISER_BENEFITS: (IconPoint & { toConfirm?: boolean })[] = [
  { icon: 'schedule', title: 'A trip designed around your group', text: 'Tell us the sport, the level and the dates. We build the programme around your group, with a tour leader and a community tournament.' },
  { icon: 'link', title: 'Your own organiser link', text: 'A unique link or code for your group, so every booking from your people is tracked to you.' },
  { icon: 'trophy', title: 'Recognition for organising', text: 'Organisers who bring a group are rewarded with a free place or a commission.', toConfirm: true },
  { icon: 'check-circle', title: 'Nothing for you to run', text: 'You organise the group; we organise everything else — rooms, transfers, coaches, venues and the days in between.' },
];

/* ------------------------------------------------------------------ FAQ --- */

export const FAQS: Faq[] = [
  { question: 'Do I need to be good at the sport?', answer: 'No. Guests are assessed on day 2 and grouped by level, from beginner to advanced.' },
  { question: 'Can I come alone?', answer: 'Yes. We match solo guests with others at a similar level.' },
  { question: 'Can my partner join if they do not play?', answer: 'Yes. The companion programme gives them a parallel wellness programme and shared evenings and excursions.' },
  { question: 'What is included?', answer: 'Airport transfers, accommodation, listed meals, local transport, programme sessions, the tour leader, recovery sessions and the excursions listed. Flights and insurance are not included.' },
  { question: 'What does a typical day look like?', answer: 'A morning session, free time or discovery in the afternoon, recovery or a social evening — with one day off.' },
  { question: 'Is it a retreat?', answer: 'No. It is an active, social trip with recovery built in, not a retreat or a boot camp.' },
  { question: 'What if I am injured or unwell?', answer: 'We screen before the trip, adapt sessions, and can arrange medical help. Travel and medical insurance is required.' },
  { question: 'When is the best time to go?', answer: 'April to October is the dry season and best for outdoor sports. November to March suits wellness, indoor training and martial arts.' },
  { question: 'How do I pay, and what is the cancellation policy?', answer: 'A 30% deposit at booking and the 70% balance 60 days before arrival. The cancellation policy is being finalised and will be published here.', toConfirm: true },
  { question: 'Can I bring my club or friends as a private group?', answer: 'Yes. Use “Plan your group trip” and we will design the programme around your group.' },
  { question: 'Can I extend my stay?', answer: 'Yes. We can arrange extra nights before or after the tour.' },
];

/* ----------------------------------------------------------------- team --- */

export interface TeamProfile {
  /** Shown until the company confirms names. */
  role: string;
  title: string;
  bio: string[];
  toConfirm?: string;
}

/**
 * Names and photographs are supplied separately by the company and are only
 * published once confirmed, so the profiles are by role for now.
 */
export const TEAM: TeamProfile[] = [
  {
    role: 'Co-founder',
    title: 'Sport, Property and Strategic Development',
    bio: [
      'More than 22 years in property development, with hands-on project delivery and finance experience and a deep knowledge of Bali’s construction industry, legal framework and local culture.',
      'Five years as National Rugby Team Manager and a member of the board that organised major international events such as the Africa Rugby Cup. Former rugby player, international referee and World Rugby educator. Master’s-level degrees in law and in financial strategy for the hotel industry.',
    ],
    toConfirm: 'Name, photograph and event details to confirm',
  },
  {
    role: 'Co-founder · Head of Sports Tours',
    title: 'Sport, Wellness and Business Development',
    bio: [
      'A lifelong sports enthusiast and entrepreneur with competitive tennis experience, sports management, coaching and business leadership.',
      'Former tennis facility manager, certified PadelMBA coach, long-time meditation facilitator and Yin Yoga practitioner. Leads the sports tours and the international partnerships.',
    ],
    toConfirm: 'Name and photograph to confirm',
  },
  {
    role: 'Head of Wellness',
    title: 'Wellness in Paradise',
    bio: [
      'A dual degree in Fitness Economics and Fitness Science, with professional licences in personal training, medical fitness training, coordination training, endurance training, performance and health diagnostics, sports nutrition and prevention.',
      'About eight years in fitness, sport, spa and hospitality operations across Germany, Italy, Spain and Greece, on cruise ships and in Bali. Speaks German, English and Italian, with basic Spanish and Indonesian.',
    ],
    toConfirm: 'Name and photograph to confirm',
  },
];

export const STANDARDS: IconPoint[] = [
  { icon: 'safety-certificate', title: 'Safety first', text: 'Health screening before every tour, adapted sessions, protective gear where the sport needs it, and first-aid protocols.' },
  { icon: 'team', title: 'Qualified specialists', text: 'Certified coaches, instructors and therapists, working to programmes designed by our founders and Head of Wellness.' },
  { icon: 'global', title: 'Local partnerships', text: 'Bali’s clubs, coaches, courses, gyms and venues, and a licensed local tour operator.' },
  { icon: 'home', title: 'Respect for Bali', text: 'Temple dress codes, no staged ceremonies, and local guides at cultural and natural sites.' },
];

export const PARTNER_TYPES: IconPoint[] = [
  { icon: 'trophy', title: 'Padel clubs and coaches', text: 'Host sessions and community tournaments, and meet players from around the world.' },
  { icon: 'flag', title: 'Golf courses', text: 'Welcome small, high-spending groups of social golfers.' },
  { icon: 'fire', title: 'Martial arts gyms', text: 'Run classes in your discipline for small, well-screened groups.' },
  { icon: 'home', title: 'Hotels, resorts and villas', text: 'Host our groups, with space to move and train.' },
  { icon: 'heart', title: 'Wellness practitioners', text: 'Yoga, Pilates, breathwork, nutrition, massage and recovery.' },
  { icon: 'car', title: 'Local operators', text: 'Transport, excursions and cultural experiences, with licensed guides.' },
];

export const PARTNER_BENEFITS = [
  'Regular, pre-booked small groups through the year',
  'Guests matched by level and screened before they arrive',
  'Visibility with players, golfers and wellness travellers in Australia, Europe and Singapore',
  'One point of contact for every group',
];

/* ---------------------------------------------------------- where we stay --- */

export interface Area {
  id: string;
  name: string;
  subtitle: string;
  text: string;
  lat: number;
  lon: number;
  tours: TourId[];
  photo: typeof PHOTOS.bali.tanahLot;
}

export const STAY_TYPES: IconPoint[] = [
  { icon: 'home', title: 'Boutique hotels', text: 'Small, characterful places close to the courts, courses and gyms we use.' },
  { icon: 'star', title: 'Resorts', text: 'Pools, gyms and space to move — the standard for the wellness and hybrid tours.' },
  { icon: 'team', title: 'Villas', text: 'A private villa for the whole group, as an upgrade priced per group.' },
];

export const AREAS: Area[] = [
  { id: 'canggu', name: 'Canggu', subtitle: 'West coast', text: 'The centre of Bali’s padel scene, with cafés, beaches and sunsets.', lat: -8.65, lon: 115.13, tours: ['padel', 'hybrid'], photo: PHOTOS.bali.surferSunset },
  { id: 'bukit', name: 'Uluwatu and the Bukit', subtitle: 'South', text: 'Clifftop golf, limestone coves and the temple at Uluwatu.', lat: -8.81, lon: 115.13, tours: ['golf', 'padel'], photo: PHOTOS.bali.uluwatuCliffs },
  { id: 'nusa-dua', name: 'Nusa Dua', subtitle: 'South-east', text: 'Calm beaches, resort space and golf by the sea.', lat: -8.8, lon: 115.23, tours: ['golf', 'wellness'], photo: PHOTOS.bali.beachAerial },
  { id: 'sanur', name: 'Sanur', subtitle: 'East coast', text: 'Quiet, sunrise beaches and easy travel days.', lat: -8.69, lon: 115.26, tours: ['wellness', 'martial-arts'], photo: PHOTOS.bali.sanurDawn },
  { id: 'ubud', name: 'Ubud', subtitle: 'Central', text: 'Jungle, rice terraces, culture and cooler air.', lat: -8.51, lon: 115.26, tours: ['wellness', 'martial-arts'], photo: PHOTOS.bali.tegalalang },
  { id: 'highlands', name: 'The highlands', subtitle: 'Bedugul', text: 'Crater lakes, temples and golf at altitude.', lat: -8.28, lon: 115.16, tours: ['golf'], photo: PHOTOS.people.ulunDanuGold },
];

/* ----------------------------------------------------------- departures --- */

/**
 * Dated departures that individuals can join. The first season's dates are
 * still to be confirmed, so the list is empty and the page offers a waiting
 * list instead. Add entries here once dates are set.
 */
export const DEPARTURES: Departure[] = [];

/* ----------------------------------------------------------------- legal --- */

export interface LegalDoc {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; text: string }[];
}

const DRAFT = 'This page is a placeholder. The final text is being prepared with legal counsel and will replace it before launch.';

export const LEGAL: LegalDoc[] = [
  {
    slug: 'terms',
    title: 'Terms and conditions',
    summary: 'The terms on which we book and run our tours.',
    sections: [
      { heading: 'Status', text: DRAFT },
      { heading: 'Booking', text: 'A booking is confirmed when we receive your 30% deposit and send you a written confirmation. The 70% balance is due 60 days before arrival.' },
      { heading: 'Prices', text: 'Prices are per person in a shared (twin) room and exclude international flights, insurance, visas and personal expenses. Final prices are confirmed in writing at booking.' },
      { heading: 'Minimum group size', text: 'Each departure has a minimum group size and a go or no-go date. If a departure does not go ahead, we will offer another date or a full refund of what you have paid.' },
    ],
  },
  {
    slug: 'cancellation',
    title: 'Cancellation policy',
    summary: 'What happens if you need to cancel, or we do.',
    sections: [
      { heading: 'Status', text: DRAFT },
      { heading: 'If you cancel', text: 'Cancellation terms are being finalised and will be set out here, including how much of your deposit and balance is refundable at each stage.' },
      { heading: 'If we cancel', text: 'If we cancel a departure, you will be offered another date or a full refund of what you have paid to us.' },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    summary: 'What we collect, why, and your rights.',
    sections: [
      { heading: 'Status', text: DRAFT },
      { heading: 'What we collect', text: 'The details you send us in an enquiry, and — once you book — the information needed to run your tour safely, such as your health and activity questionnaire, dietary needs and emergency contacts.' },
      { heading: 'Why', text: 'Only to reply to you, to plan and run your tour, and to meet our legal obligations. We do not sell your data.' },
      { heading: 'Where you are', text: 'Our policy is written to suit guests in Australia, Europe (GDPR) and Indonesia. You can ask to see, correct or delete your data at any time.' },
    ],
  },
  {
    slug: 'cookies',
    title: 'Cookie policy',
    summary: 'What this site stores on your device.',
    sections: [
      { heading: 'What we store', text: 'This site stores only what it needs to work: an organiser code if you arrived through an organiser’s link. It sets no advertising or tracking cookies.' },
      { heading: 'Analytics', text: 'If we add analytics or advertising tools later, they will only run after you agree to them, and this page will list them.' },
    ],
  },
  {
    slug: 'safety',
    title: 'Safety and waiver',
    summary: 'How we keep you safe, and what we ask of you.',
    sections: [
      { heading: 'Status', text: DRAFT },
      { heading: 'Before the tour', text: 'Every guest completes a health and activity questionnaire, and signs a consent and waiver. Travel and medical insurance that covers your sport is required.' },
      { heading: 'During the tour', text: 'Qualified coaches and specialists, sessions adapted to you, protective gear where the sport needs it, supervised partner drills only in martial arts, and first-aid and concussion protocols.' },
      { heading: 'If something happens', text: 'Your tour leader is with the group from airport to departure and can arrange medical help at any time.' },
    ],
  },
];

/* --------------------------------------------------------------- photos --- */

export const SITE_PHOTOS = {
  /** The home hero, shown while there is no hero video (and as its poster). */
  hero: [PHOTOS.bali.tanahLot, PHOTOS.people.padelPair, PHOTOS.golf.palmsOcean, PHOTOS.wellness.beachMeditation, PHOTOS.hybrid.beachRun],
  lifestyle: PHOTOS.bali.tegalalang,
  host: PHOTOS.people.dinner,
  community: PHOTOS.people.dinner,
  leader: PHOTOS.people.courtyard,
  recovery: PHOTOS.wellness.herbal,
  island: PHOTOS.bali.tanahLot,
  organiser: PHOTOS.people.golfToast,
};

/* ------------------------------------------------------- home page copy --- */

/**
 * The home hero video. The team will supply cinematic footage; until then
 * this is null and the hero shows the photographs in SITE_PHOTOS.hero. Keep
 * the file light (around 3 to 6 MB, 1080p, no sound): the first photograph
 * is its poster, so the page never waits for it.
 */
export const HERO_VIDEO: { mp4: string; webm?: string } | null = null;

export const HERO_HEADLINE = ['Your sport.', 'Your people.', 'Your paradise.'] as const;

/** "What makes us different", in the team's four points. */
export const DIFFERENTIATORS = [
  { title: 'Your host', text: 'One person looks after everything, from the airport to your last dinner. One chat, one contact.' },
  { title: 'The thread', text: 'Every trip has a story — a cup, a path, a finale — and a reason to show up every day.' },
  { title: 'Matched by level', text: 'Small groups, assessed on day two, so you always play with the right people.' },
  { title: 'Local clubs and players', text: 'Bali’s own clubs, coaches and players, on court and at the table.' },
] as const;

/** "A glimpse of the Bali lifestyle". */
export const LIFESTYLE = [
  { time: 'Morning', text: 'Training, sunrise mobility, an ocean swim' },
  { time: 'Afternoon', text: 'Temples, rice terraces, the coastline' },
  { time: 'Evening', text: 'Massage, sunset, dinner with local players' },
] as const;

/** "Meet your host". Names and photographs follow once the team confirms them. */
export const HOST = {
  heading: 'One host, from arrival to farewell.',
  text: [
    'Every trip has one host. They meet you at the airport, know every coach and venue, and are with the group every day.',
    'One chat, one contact, one person who knows your name.',
  ],
};
