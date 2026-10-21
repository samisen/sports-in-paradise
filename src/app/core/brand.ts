/**
 * Single source of truth for the brand.
 *
 * "Sports in Paradise" is a working name: every brand reference on every site
 * reads from here, so changing these values changes the name, wordmark,
 * contact details and legal footer everywhere at once. What differs per sport
 * (descriptor, colours, copy) lives in that sport's content file.
 */
export const BRAND = {
  name: 'Sports in Paradise',
  wordmarkLead: 'Sports',
  wordmarkTail: 'IN PARADISE',
  isPlaceholder: true,

  coreIdea: 'Five sports, one island, and a week built around how you want to spend it.',

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
    send: 'Send it to the team',
  },
} as const;

/** Builds a wa.me link with a prefilled message. */
export function whatsappLink(text: string): string {
  return `https://wa.me/${BRAND.whatsappDigits}?text=${encodeURIComponent(text)}`;
}

/**
 * What a price on this site is, and is not.
 *
 * Nothing here is a booking and nothing is held. Venues, rooms and people are
 * confirmed with the guest before any money changes hands, so every figure is
 * shown as an indication with this qualifier beside it.
 */
export const PRICE_CLAIM = {
  headline: 'Indicative, per person',
  footnote:
    '*Indicative pricing, not a quote and not a booking. Final cost depends on travel dates, venue and room availability, group size and the season. Flights and the Bali tourist levy are not included. We confirm everything in writing before taking a deposit.',
} as const;
