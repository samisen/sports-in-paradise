import { Photo } from '../media';

/**
 * The shape of the content.
 *
 * Sports in Paradise designs and hosts five small-group tours. Each tour is
 * one `Tour` object in `tours.ts`; the shared templates render it. Copy that
 * is true for every tour (the Recovery Ritual, the journey, the FAQ, the
 * team) lives in `site.ts`.
 *
 * Icons (`icon` fields) must be ng-zorro outline icon names registered in
 * app.config.ts.
 */

export const TOUR_IDS = ['padel', 'golf', 'martial-arts', 'wellness', 'hybrid'] as const;
export type TourId = (typeof TOUR_IDS)[number];

/** A palette: the master brand or one of the tours. */
export type PaletteId = 'paradise' | TourId;

export function isTourId(v: string | null | undefined): v is TourId {
  return !!v && (TOUR_IDS as readonly string[]).includes(v);
}

export interface IconPoint {
  icon: string;
  title: string;
  text: string;
}

export interface Faq {
  question: string;
  answer: string;
  /** Shown with a "to confirm" marker until the company signs it off. */
  toConfirm?: boolean;
}

/** Twelve ratings, January first: 0 avoid, 1 possible, 2 good, 3 best. */
export type SeasonRow = [number, number, number, number, number, number, number, number, number, number, number, number];

export type DayKind = 'arrival' | 'assessment' | 'sport' | 'culture' | 'recovery' | 'off' | 'community' | 'finale' | 'departure';

/** One day (or a run of days) on the tour's timeline. */
export interface JourneyDay {
  /** "Day 1", "Days 3–4". */
  day: string;
  kind: DayKind;
  title: string;
  text: string;
}

/** A row on the tour's fact sheet. */
export interface FactRow {
  label: string;
  value: string;
}

export interface Tour {
  id: TourId;
  /** "Padel in Paradise" */
  name: string;
  /** "Padel" — navigation, chips, the season table. */
  short: string;
  /** "Flagship", "Signature wellness tour", "HYROX-style". */
  badge?: string;
  /** One line for cards. */
  tagline: string;
  /** Meta description. */
  description: string;
  /** Who leads it, by role. */
  ledBy: string;

  days: number;
  nights: number;
  /** "8 to 12 guests" */
  group: string;
  groupMax: number;
  /** List price per person, twin share, excluding flights. */
  priceFromUsd: number;

  thread: { name: string; text: string };
  /** The opening paragraph of the tour page. */
  intro: string;
  /** Rows on the fact sheet beyond duration, group and price. */
  facts: FactRow[];
  journey: JourneyDay[];
  /** Included on this tour beyond the shared list. */
  includedExtra: string[];
  bestFor: string;
  season: { ratings: SeasonRow; note: string };
  faqs: Faq[];

  hero: Photo[];
  gallery: Photo[];

  /** The prefilled WhatsApp message. */
  whatsapp: string;
}

/** A dated departure that individuals can join. None are dated yet. */
export interface Departure {
  tour: TourId;
  /** ISO date of day 1. */
  start: string;
  placesTotal: number;
  placesLeft: number;
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
  tour?: TourId;
}
