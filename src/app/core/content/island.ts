import { IconPoint } from './types';

/**
 * Facts about Bali that every guest should know, whatever the tour.
 * Checked in October 2026; rules on the island change, so re-check before
 * relying on them.
 */
export const ESSENTIALS: IconPoint[] = [
  { icon: 'cloud', title: 'Two seasons', text: 'Dry from April to October, best for outdoor sports. Wet from November to March, with clear mornings and stormy afternoons — good for wellness, indoor training and martial arts.' },
  { icon: 'wallet', title: 'Tourist levy', text: 'IDR 150,000 per foreign visitor per trip, paid online through Love Bali before or on arrival.' },
  { icon: 'calendar', title: 'Nyepi', text: 'On the Day of Silence the island and the airport close for 24 hours. We never schedule a tour across it.' },
  { icon: 'home', title: 'Temples', text: 'Sarong and sash at every temple, modest dress, and respect for ceremonies — we never stage one.' },
  { icon: 'global', title: 'Getting here', text: 'Ngurah Rai International (DPS), with direct flights from Australia, Asia and the Gulf. Visa rules depend on your passport — check before you fly.' },
  { icon: 'medicine-box', title: 'Insurance', text: 'Travel and medical insurance that covers your sport is a condition of joining every tour.' },
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const SEASON_LEGEND = [
  { value: 3, label: 'Best' },
  { value: 2, label: 'Good' },
  { value: 1, label: 'Possible' },
  { value: 0, label: 'Avoid' },
] as const;
