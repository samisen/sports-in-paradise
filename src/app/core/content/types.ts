import { Photo } from '../media';
import { PlannerSpec } from '../planner/engine';
import { SportId } from '../site/sites';

/**
 * The shape of a sport site.
 *
 * Every sport fills one `SportSite` and the shared templates render it, so
 * adding a sixth sport is a content file and a palette, not new pages.
 *
 * Icons (`icon` fields) must be ng-zorro outline icon names registered in
 * app.config.ts.
 */

export interface Fact {
  value: string;
  label: string;
  /** Where the number comes from. Every hard number on the site has one. */
  source?: string;
}

export interface Pillar {
  eyebrow: string;
  title: string;
  lead: string;
  body: string;
  points: string[];
  photo: Photo;
}

export interface IconPoint {
  icon: string;
  title: string;
  text: string;
}

export interface Profile {
  /** A planner level id. */
  id: string;
  name: string;
  subtitle: string;
  description: string;
  priorities: string[];
  photo: Photo;
}

export interface Venue {
  name: string;
  area: string;
  note: string;
}

export interface SeasonNote {
  label: string;
  months: string;
  text: string;
}

/** Twelve ratings, January first: 0 off, 1 possible, 2 good, 3 best. */
export type SeasonRow = [number, number, number, number, number, number, number, number, number, number, number, number];

/** The state of this sport on the island, as it is today. */
export interface BaliStatus {
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
  numbers: Fact[];
  venues: Venue[];
  season: { ratings: SeasonRow; summary: string; notes: SeasonNote[] };
  practical: IconPoint[];
  sources: { label: string; url: string }[];
  /** Month this was last checked, e.g. "October 2026". */
  checked: string;
}

export interface Base {
  /** A planner base id. */
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  lat: number;
  lon: number;
  /** Up to three short facts: { label: 'Courts', value: '7' }. */
  stats: { label: string; value: string }[];
  driveToAirportMin: number;
  bestFor: string[];
  photo: Photo;
}

export type RetreatStatus = 'open' | 'filling' | 'waitlist';

export interface Retreat {
  id: string;
  slug: string;
  name: string;
  headline: string;
  base: string;
  level: string;
  intensity: string;
  stay: string;
  nights: number;
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
  photo: Photo;
  extras: string[];
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
  category: string;
  excerpt: string;
  readMinutes: number;
  date: string;
  author: string;
  photo: Photo;
  body: string[];
}

export interface DaySlot {
  icon: string;
  time: string;
  title: string;
  text: string;
}

export interface SportSite {
  id: SportId;
  /** "Padel" */
  name: string;
  /** "Padel retreats in Bali" — the browser title and hub card line. */
  descriptor: string;
  /** One line for the footer and hub card. */
  coreIdea: string;
  /** Meta description for search results. */
  description: string;

  hero: { eyebrow: string; headline: string; support: string; photos: Photo[] };
  /** Four figures under the hero. */
  stats: Fact[];

  values: [Pillar, Pillar];
  sport: { eyebrow: string; title: string; lead: string; paragraphs: string[]; drivers: IconPoint[]; facts: Fact[] };
  bali: BaliStatus;
  profiles: Profile[];

  /** How a day runs, for How It Works. */
  dayShape: DaySlot[];
  included: string[];
  notIncluded: string[];

  bases: Base[];
  retreats: Retreat[];
  coaches: Coach[];
  testimonials: Testimonial[];
  faqs: Faq[];
  journal: JournalPost[];

  planner: PlannerSpec;

  /** The prefilled WhatsApp message. */
  whatsapp: string;
  cta: { heading: string; lede: string };
}
