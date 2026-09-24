/**
 * Single source of truth for the brand.
 *
 * "Sports in Paradise" is a working name: every brand reference on the site
 * reads from here, so changing these values changes the name, wordmark,
 * contact details and legal footer everywhere at once.
 */
const BRAND_BASE = {
  name: 'Sports in Paradise',
  wordmarkLead: 'Sports',
  wordmarkTail: 'IN PARADISE',
  isPlaceholder: true,

  coreIdea: 'Play every day. Recover properly. Come home a better player.',
  descriptor: 'Padel retreats in Bali',

  email: 'hello@sportsinparadise.com',
  phone: '+62 361 000 000',
  phoneHref: 'tel:+62361000000',
  whatsapp: '+90 533 399 46 48',
  /** Digits only, international, no leading zero — the form wa.me accepts. */
  whatsappDigits: '905333994648',
  address: ['Jl. Pantai Berawa No. 24', 'Canggu, Badung, Bali 80361', 'Indonesia'],
  hours: 'Mon–Sat, 08:00–19:00 WITA (UTC+8)',

  cta: {
    primary: 'Plan Your Retreat',
    secondary: 'Talk to the Team',
    retreats: 'See the Retreats',
    process: 'How a Week Works',
    coaching: 'Meet the Coaches',
    island: 'Why Bali',
    journal: 'Read the Journal',
    send: 'Send it to the team',
  },
} as const;

/** Builds a wa.me link with a prefilled message, from the one number above. */
export function whatsappLink(text: string): string {
  return `https://wa.me/${BRAND_BASE.whatsappDigits}?text=${encodeURIComponent(text)}`;
}

export const BRAND = {
  ...BRAND_BASE,
  /** Derived, never authored — see whatsappLink above. */
  whatsappUrl: whatsappLink(
    `Hello ${BRAND_BASE.name}, I'd like to talk about a padel retreat in Bali.`,
  ),
} as const;

/**
 * What a price on this site is, and is not.
 *
 * Nothing here is a booking and nothing is held. Courts, villas and coach
 * time are confirmed with the guest before any money changes hands, so every
 * figure is shown as an indication with this qualifier beside it.
 */
export const PRICE_CLAIM = {
  headline: 'Indicative, per person',
  subline: 'Based on the week you build. We confirm dates, courts and rooms with you before anything is booked.',
  footnote:
    '*Indicative pricing, not a quote and not a booking. Final cost depends on travel dates, court and villa availability, group size and the season. Flights are not included unless stated. We confirm everything in writing before taking a deposit.',
} as const;

/**
 * Padel's growth is the reason this market exists, so the figures that carry
 * that argument live here with their sources attached.
 */
export const SPORT_FACTS = {
  players: '30 million',
  playersNote: 'people playing padel worldwide, across more than 130 countries',
  playersSource: 'International Padel Federation (FIP), 2025',
  courts: '70,000+',
  courtsNote: 'courts built worldwide, up from roughly 14,000 in 2018',
  courtsSource: 'Playtomic / FIP market reporting, 2025',
  baliArrivals: '6,948,754',
  baliArrivalsNote: 'direct foreign arrivals to Bali in 2025, up 9.72% on 2024',
  baliArrivalsSource: 'BPS Statistics Indonesia — Bali Province, 2025',
} as const;
