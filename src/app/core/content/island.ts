import { Fact, IconPoint } from './types';
import { PHOTOS } from '../media';

/**
 * The island itself, true whichever sport brought you.
 *
 * Shown in full on the hub's Why Bali page and summarised on every sport's.
 * Every hard number carries its source; everything was checked in October
 * 2026 and is worth re-checking before it is relied on.
 */

export const ISLAND = {
  eyebrow: 'Why Bali',
  title: 'One Island, Five Ways to Spend a Week Outdoors',
  lead: 'Warm water, cool highlands, a volcano you can walk up before breakfast and courts you can play on in January. Very few places put all of it within two hours of one airport.',
  photo: PHOTOS.bali.uluwatuCliffs,

  paragraphs: [
    'Bali sits eight degrees south of the equator, which means two seasons rather than four and a temperature at sea level that barely moves through the year. What changes is the rain: a dry season from April to October, and a wet season from November to March when most afternoons end in a storm and the mornings stay clear.',
    'The island is small — about 140 kilometres end to end — but it is steep. From the reef at Amed to the summit of Agung is just over three thousand metres of altitude in a straight line of twenty kilometres. That range is the whole argument for a sports week here: the same island has surf and coral, cool highland golf at 1,200 metres, jungle trails, and a padel and tennis scene that has grown faster than anywhere else in Indonesia.',
    'It is also an island with its own rules and its own calendar. Balinese Hinduism shapes the year: temples need a sarong, mountains are sacred and closed during major ceremonies, and once a year on Nyepi the whole island — airport included — stops for twenty-four hours. A good week here is planned around that, not in spite of it.',
  ],

  numbers: [
    { value: '6.95M', label: 'foreign visitors arriving directly in Bali in 2025, up 9.7% on 2024', source: 'BPS Statistics Indonesia, Bali Province' },
    { value: '8°S', label: 'from the equator: around 27–31°C at sea level all year', source: 'Climate normals, Ngurah Rai' },
    { value: '3,142 m', label: 'summit of Mount Agung, Bali’s highest and most sacred mountain', source: 'Indonesian volcano observatory (PVMBG)' },
    { value: 'IDR 150k', label: 'tourist levy per foreign visitor, paid once per trip since 2024', source: 'Bali Provincial Government — Love Bali' },
  ] as Fact[],

  facets: [
    { icon: 'sun', title: 'Climate', text: 'Sea-level days around thirty degrees all year. Every sport here is played at the ends of the day.' },
    { icon: 'cloud', title: 'Two seasons', text: 'Dry from April to October. Wet from November to March, with clear mornings and stormy afternoons.' },
    { icon: 'rise', title: 'Altitude', text: 'From the reef to 3,142 m on one small island. The highlands are ten degrees cooler than the coast.' },
    { icon: 'heart', title: 'Recovery', text: 'Massage, physio and good food at prices that let them be daily rather than occasional.' },
    { icon: 'car', title: 'Distances', text: 'Most of what you need is under ninety minutes from Ngurah Rai airport — though traffic, not distance, sets the time.' },
    { icon: 'team', title: 'People', text: 'A local culture that is generous with visitors who take it seriously. We work with Balinese guides, caddies and coaches.' },
  ] as IconPoint[],

  /** What every guest should know before they book, whatever the sport. */
  essentials: [
    { icon: 'wallet', title: 'Tourist levy', text: 'IDR 150,000 per foreign visitor per trip, paid online through Love Bali before or on arrival. Indonesian citizens are exempt.' },
    { icon: 'calendar', title: 'Nyepi', text: 'The Day of Silence: the island and the airport close for 24 hours. In 2026 it fell on 19 March; we never schedule a week across it.' },
    { icon: 'safety-certificate', title: 'Guides at natural sites', text: 'Since March 2025 the provincial rules expect foreign visitors at cultural and natural sites to be accompanied by a certified guide. Ours are.' },
    { icon: 'home', title: 'Temples', text: 'Sarong and sash at every temple, modest dress, and no entry to inner courtyards unless you are there to pray.' },
    { icon: 'global', title: 'Getting here', text: 'Ngurah Rai International (DPS), with direct flights from Australia, Asia and the Gulf. Visa rules depend on your passport — check before you fly.' },
    { icon: 'medicine-box', title: 'Insurance', text: 'Travel insurance that covers your sport — and, for divers and hikers, the specific activity — is a condition of joining any week.' },
  ] as IconPoint[],

  sources: [
    { label: 'BPS Bali — foreign arrivals, January–December 2025', url: 'https://bali.bps.go.id/en/news/2026/02/02/347/bali-s-foreign-arrivals-jan-dec-2025-rise--with-australia-remaining-the-largest-contributor-overall-.html' },
    { label: 'Love Bali — tourist levy and Governor’s Circular SE 7/2025', url: 'https://lovebali.baliprov.go.id/' },
    { label: 'Antara — Ngurah Rai airport closure for Nyepi 2026', url: 'https://bali.antaranews.com/berita/401062/24-hour-operational-suspension-during-nyepi-at-bali-airport' },
  ],
  checked: 'October 2026',
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const SEASON_LEGEND = [
  { value: 3, label: 'Best' },
  { value: 2, label: 'Good' },
  { value: 1, label: 'Possible' },
  { value: 0, label: 'Avoid' },
] as const;
