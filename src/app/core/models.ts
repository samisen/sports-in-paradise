import { BaseId, ExtraId, IntensityId, LevelId, StayId } from './retreat-config';

export type RetreatStatus = 'open' | 'filling' | 'waitlist';

export interface Retreat {
  id: string;
  slug: string;
  name: string;
  /** Short line under the name on a card. */
  headline: string;
  base: BaseId;
  level: LevelId;
  intensity: IntensityId;
  stay: StayId;
  nights: number;
  /** Human dates; this site never pretends to hold a place. */
  dates: string;
  month: string;
  priceFromUsd: number;
  spotsTotal: number;
  spotsLeft: number;
  status: RetreatStatus;
  coachId: string;
  summary: string;
  body: string[];
  includes: string[];
  /** Seed for the court artwork, so each retreat looks like itself. */
  art: number;
  extras: ExtraId[];
}

export interface Base {
  id: BaseId;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  courts: number;
  clubs: number;
  driveToAirportMin: number;
  bestFor: string[];
  /** Position on the island map, in the map's own coordinates. */
  art: number;
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  from: string;
  level: string;
  years: number;
  bio: string;
  speaks: string[];
  art: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export interface JournalPost {
  slug: string;
  title: string;
  category: 'Technique' | 'Training' | 'Bali' | 'Recovery' | 'The sport';
  excerpt: string;
  readMinutes: number;
  date: string;
  author: string;
  art: number;
  body: string[];
}
