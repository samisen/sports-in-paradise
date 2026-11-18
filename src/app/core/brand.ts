/**
 * Single source of truth for the brand.
 *
 * Every brand reference on the site reads from here, so changing these values
 * changes the name, wordmark, contact details and legal footer everywhere at
 * once. The logo, colours, domain and social handles are still to be supplied
 * by the company (project brief, section 15).
 */
export const BRAND = {
  name: 'Sports in Paradise',
  wordmarkLead: 'Sports',
  wordmarkTail: 'IN PARADISE',
  /** True until the company supplies the logo and confirms the domain. */
  isPlaceholder: true,

  signature: 'Train. Play. Discover. Connect.',
  descriptor: 'Hosted sports and wellness tours in Bali',

  email: 'hello@sportsinparadise.com',
  whatsapp: '+90 533 399 46 48',
  /** Digits only, international, no leading zero — the form wa.me accepts. */
  whatsappDigits: '905333994648',
  location: 'Bali, Indonesia',
  hours: 'Mon–Sat, 08:00–19:00 WITA (UTC+8)',
  /** The brief's promise: every enquiry answered within a day. */
  replyWithin: 'We reply within 24 hours',

  cta: {
    group: 'Plan your group trip',
    departures: 'See departures',
    tours: 'Find your tour',
    whatsapp: 'Talk to us on WhatsApp',
  },
} as const;

/** Builds a wa.me link with a prefilled message. */
export function whatsappLink(text: string): string {
  return `https://wa.me/${BRAND.whatsappDigits}?text=${encodeURIComponent(text)}`;
}

export const DEFAULT_WHATSAPP = `Hello ${BRAND.name}, I would like to know more about your tours in Bali.`;

/**
 * How a price on this site is always written (brief, section 12): "from",
 * "per person" and "excluding flights".
 */
export const PRICE_CLAIM = {
  short: 'per person, excluding flights',
  footnote:
    'Prices are list prices from, per person, in a shared (twin) room, excluding flights. Final prices and upgrade tiers are confirmed in writing at booking.',
} as const;
