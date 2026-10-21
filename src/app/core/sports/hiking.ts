import { SportSite } from '../content/types';
import { PHOTOS } from '../media';
import {
  Block,
  Day,
  PlannerSpec,
  RetreatConfig,
  STAYS,
  block,
  day,
  has,
  restDayIndex,
  unitsIn,
} from '../planner/engine';

const H = PHOTOS.hiking;
const B = PHOTOS.bali;
const L = PHOTOS.life;

/* ------------------------------------------------------------ planner --- */

interface Route {
  name: string;
  sub: string;
  /** Kilometres for a regular hiker; other levels scale from this. */
  km: number;
}

/** The everyday walks from each base, in the order a week uses them. */
const ROUTES: Record<string, Route[]> = {
  ubud: [
    { name: 'Campuhan ridge', sub: 'On to Bangkiang Sidem through the fields', km: 8 },
    { name: 'Tegalalang terraces', sub: 'North through the paddies to Sebatu', km: 10 },
    { name: 'Sayan ridge', sub: 'Down to the Ayung river and back up', km: 9 },
    { name: 'Taro villages', sub: 'Forest lanes and family temples', km: 11 },
  ],
  munduk: [
    { name: 'Tamblingan forest', sub: 'Old trees down to the lake temple', km: 10 },
    { name: 'Munduk waterfalls', sub: 'Three falls on one loop, wet underfoot', km: 8 },
    { name: 'Coffee and clove villages', sub: 'Plantation paths along the ridge', km: 11 },
    { name: 'Buyan lake ridge', sub: 'Above the twin lakes in the cool', km: 12 },
  ],
  sidemen: [
    { name: 'Sidemen valley terraces', sub: 'Field paths with Agung ahead', km: 9 },
    { name: 'Iseh ridge', sub: 'Up out of the valley for the view', km: 10 },
    { name: 'Telaga Waja river', sub: 'Weaving villages along the water', km: 8 },
    { name: 'Upper valley', sub: 'Terraces and forest towards Tabola', km: 11 },
  ],
  kintamani: [
    { name: 'Caldera rim', sub: 'From Penelokan along the edge', km: 10 },
    { name: 'Lava fields', sub: 'Black rock below Batur, no shade', km: 8 },
    { name: 'Lake Batur shore', sub: 'Villages along the water to Songan', km: 11 },
    { name: 'Pinggan ridge', sub: 'Farm tracks on the outer slope', km: 9 },
  ],
};

/** Hours in a car from each base, rounded to the quarter hour. */
const DRIVE: Record<string, { airport: number; batur: number; besakih: number; sekumpul: number; jatiluwih: number; batukaru: number }> = {
  ubud: { airport: 1.25, batur: 1.25, besakih: 1.25, sekumpul: 2, jatiluwih: 1.5, batukaru: 1.5 },
  munduk: { airport: 2.75, batur: 2, besakih: 2.75, sekumpul: 0.75, jatiluwih: 1, batukaru: 1.25 },
  sidemen: { airport: 2, batur: 1.5, besakih: 0.5, sekumpul: 2.5, jatiluwih: 2.5, batukaru: 2.75 },
  kintamani: { airport: 2.25, batur: 0.5, besakih: 1, sekumpul: 1.25, jatiluwih: 2, batukaru: 2 },
};

const LEVEL: Record<string, { scale: number; pace: number }> = {
  walker: { scale: 0.55, pace: 2.4 },
  hiker: { scale: 1, pace: 2.8 },
  summit: { scale: 1.3, pace: 3.1 },
};

const quarter = (h: number) => Math.round(h * 4) / 4;

function drive(c: RetreatConfig) {
  return DRIVE[c.base] ?? DRIVE['ubud'];
}

/** Today's walk: the base's route, stretched or shortened for the walker. */
function walkFor(c: RetreatConfig, n: number): Route & { hours: number } {
  const routes = ROUTES[c.base] ?? ROUTES['ubud'];
  const r = routes[n % routes.length];
  const lv = LEVEL[c.level] ?? LEVEL['hiker'];
  const stretch = c.intensity === 'big' ? 1.2 : 1;
  // nothing longer than five and a half hours: the walk is over before the heat and the cloud
  const km = Math.min(Math.round(r.km * lv.scale * stretch), Math.floor(lv.pace * 5.5));
  return { ...r, km, hours: Math.max(1.5, quarter(km / lv.pace)) };
}

/** Massage on every third day if chosen, then dinner — never overlapping. */
function evening(c: RetreatConfig, i: number, b: Block[], from: number) {
  let dinnerAt = Math.max(19, from + 0.25);
  // a late drive home moves the massage to another night rather than into dinner
  if (has(c, 'massage') && i % 3 === 0 && from <= 18) {
    const start = Math.max(from + 0.25, 16.5);
    b.push(block('massage', 'Sports massage', 'recovery', start, start + 1, 'Calves, quads, lower back'));
    dinnerAt = Math.max(dinnerAt, start + 1.25);
  }
  b.push(block('dinner', 'Dinner together', 'meal', dinnerAt, Math.min(21, dinnerAt + 1.5)));
}

/**
 * An ordinary walking day.
 *
 * Out at first light, back before the heat and the afternoon cloud. The
 * middle of the day is for sleeping, eating and the island; on the bigger
 * weeks a short walk goes out again as the light softens.
 */
/** Agung starts at one in the morning from Besakih, so the group sleeps near the trailhead. */
function summitEve(c: RetreatConfig, b: Block[], from: number) {
  if (from < 15.5) b.push(block('nap', 'Sleep if you can', 'free', from, 15.5, 'Tonight is short'));
  b.push(block('kit', 'Kit check', 'coaching', 15.5, 16.25, 'Layers, headtorch, two litres'));
  b.push(block('dinner', 'Early dinner', 'meal', 16.5, 17.5));
  const d = drive(c).besakih;
  b.push(block('transfer', 'Drive to Besakih', 'travel', 17.75, 17.75 + d, 'A guesthouse below the trailhead'));
}

function walkDay(c: RetreatConfig, i: number, n: number, beforeSummit: boolean, springs: boolean): Day {
  const w = walkFor(c, n);
  const b: Block[] = [block('brief', 'Coffee and briefing', 'coaching', 5.5, 6, 'Route, weather, water')];
  const hikeEnd = 6 + w.hours;
  b.push(block('hike', w.name, 'play', 6, hikeEnd, `${w.sub} · ${w.km} km`, w.km));

  let t = hikeEnd;
  if (has(c, 'stretch')) {
    b.push(block('stretch', 'Yoga and stretching', 'recovery', t + 0.25, t + 0.75, 'While the legs are warm'));
    t += 0.75;
  }
  b.push(block('meal', t + 0.25 < 11 ? 'Late breakfast' : 'Lunch', 'meal', t + 0.25, t + 1.25));
  t += 1.25;

  if (beforeSummit) {
    summitEve(c, b, t);
    return day(i, 'Walking', 'core', true, b);
  }

  if (springs) {
    if (t < 14) b.push(block('midday', 'Open afternoon', 'free', t, 14, 'Pool, sleep, the island'));
    b.push(block('springs', 'Hot springs', 'recovery', 14, 15.5, 'The nearest springs to the base'));
  } else {
    b.push(block('midday', 'Open afternoon', 'free', t, 16, 'Pool, sleep, the island'));
  }
  let cursor = 16;
  if (c.intensity === 'gentle') {
    if (i % 2 === 0) {
      b.push(block('culture', 'Village afternoon', 'experience', 16, 17.5, 'Market, temple or weaving, with a local host'));
      cursor = 17.5;
    }
  } else {
    const km = c.intensity === 'big' ? 4 : 3;
    b.push(block('evening-walk', 'Evening walk', 'play', 16.25, 17.75, 'Field paths as the light goes', km));
    cursor = 17.75;
  }
  evening(c, i, b, cursor);
  return day(i, 'Walking', 'core', true, b);
}

function baturDay(c: RetreatConfig, i: number): Day {
  const d = drive(c).batur;
  const porter = has(c, 'porter') ? ' · porter with your pack' : '';
  const b: Block[] = [
    block('transfer', 'Drive to the trailhead', 'travel', 3.5 - d, 3.5, 'Headtorches on in the car park'),
    block('climb', 'Batur, in the dark', 'play', 3.5, 5.75, `About two hours up, licensed local guide${porter}`, 4),
    block('sunrise', 'Sunrise and breakfast on the rim', 'meal', 5.75, 7, 'Agung and Rinjani, if the cloud allows'),
    block('descent', 'Down through the lava', 'play', 7, 8.75, 'A different way down', 4),
  ];
  let t = 8.75;
  if (has(c, 'hotsprings')) {
    b.push(block('springs', 'Hot springs', 'recovery', 9, 10.5, 'By the lake at Toya Bungkah'));
    t = 10.5;
  }
  b.push(block('back', 'Back to base', 'travel', t + 0.25, t + 0.25 + d));
  b.push(block('sleep', 'The afternoon is free', 'free', t + 0.25 + d, 16, 'Most people sleep'));
  evening(c, i, b, 16);
  return day(i, 'Sunrise', 'peak', true, b);
}

function agungDay(c: RetreatConfig, i: number): Day {
  const d = drive(c).besakih;
  const porter = has(c, 'porter') ? ' · porter with your pack' : '';
  const b: Block[] = [
    block('climb', 'Agung from Besakih', 'play', 1, 7.5, `Pura Pengubengan to the summit, licensed guide${porter}`, 6),
    block('summit', 'The summit', 'experience', 7.5, 8, 'An offering first, then the view'),
    block('descent', 'The long way down', 'play', 8, 13, 'Harder on the knees than the way up', 6),
    block('back', 'Back to base', 'travel', 13.25, 13.25 + d),
  ];
  if (13.25 + d < 16) b.push(block('sleep', 'Sleep', 'free', 13.25 + d, 16));
  if (has(c, 'massage')) b.push(block('massage', 'Sports massage', 'recovery', 16.25, 17.25, 'Legs first'));
  b.push(block('dinner', 'Early dinner', 'meal', 18, 19.5));
  return day(i, 'Summit', 'peak', true, b);
}

/** The day after Agung, which doubles as the week's rest day. */
function recoveryDay(c: RetreatConfig, i: number, springs: boolean): Day {
  const b: Block[] = [block('sleep', 'Sleep in', 'free', 7, 10, 'No alarm'), block('brunch', 'Brunch', 'meal', 10, 11)];
  if (has(c, 'massage')) b.push(block('massage', 'Sports massage', 'recovery', 11.5, 12.5, 'The second one this week'));
  if (springs) b.push(block('springs', 'Hot springs', 'recovery', 13, 15.5, 'The nearest springs to the base'));
  else b.push(block('spa', 'Pool and spa', 'free', 13, 15.5, 'Whatever your legs ask for'));
  b.push(block('temple', 'Temple visit', 'experience', 15.75, 17.25, 'Sarong and sash provided'));
  b.push(block('stroll', 'Loosening walk', 'play', 17.5, 18.25, 'Flat, slow, twenty minutes each way', 2));
  b.push(block('dinner', 'Dinner together', 'meal', 19, 20.5));
  return day(i, 'Recovery', 'rest', false, b);
}

function restDay(c: RetreatConfig, i: number, springs: boolean): Day {
  const b: Block[] = [
    block('slow', 'Slow morning', 'free', 7, 9, 'No alarm'),
    block('cooking', 'Cooking class', 'experience', 9.5, 13, 'The market first, then the kitchen'),
  ];
  if (springs) b.push(block('springs', 'Hot springs', 'recovery', 13.5, 15.25, 'The nearest springs to the base'));
  else if (has(c, 'massage')) b.push(block('massage', 'Sports massage', 'recovery', 14, 15));
  else b.push(block('spa', 'Pool and spa', 'free', 13.25, 15.5));
  b.push(block('temple', 'Temple visit', 'experience', 16, 17.5, 'Sarong and sash provided; our hosts lead'));
  if (springs && has(c, 'massage')) b.push(block('massage', 'Sports massage', 'recovery', 17.75, 18.75));
  b.push(block('dinner', 'Dinner out', 'meal', 19, 20.5));
  return day(i, 'Rest & culture', 'rest', false, b);
}

function sekumpulDay(c: RetreatConfig, i: number): Day {
  const d = drive(c).sekumpul;
  const b: Block[] = [
    block('transfer', 'Drive north to Buleleng', 'travel', 7.5 - d, 7.5),
    block('falls', 'Sekumpul waterfalls', 'play', 7.5, 11.5, 'Steep steps, river crossings, wet feet', 6),
    block('lunch', 'Lunch in the village', 'meal', 11.75, 12.75),
    block('back', 'Back to base', 'travel', 13, 13 + d),
  ];
  b.push(block('rest', 'Open afternoon', 'free', 13 + d, 16.5));
  evening(c, i, b, 16.5);
  return day(i, 'Waterfalls', 'core', true, b);
}

function jatiluwihDay(c: RetreatConfig, i: number, beforeSummit: boolean): Day {
  const d = drive(c).jatiluwih;
  const b: Block[] = [
    block('transfer', 'Drive to Jatiluwih', 'travel', 7 - d, 7),
    block('terraces', 'Jatiluwih terraces', 'play', 7, 10.5, 'Subak paths through a UNESCO landscape', 8),
    block('lunch', 'Lunch above the terraces', 'meal', 10.75, 11.75),
    block('back', 'Back to base', 'travel', 12, 12 + d),
  ];
  if (beforeSummit) {
    // flat and unhurried: the right walk for the day before Agung
    summitEve(c, b, 12 + d);
    return day(i, 'Terraces', 'core', true, b);
  }
  b.push(block('rest', 'Open afternoon', 'free', 12 + d, 16.5));
  evening(c, i, b, 16.5);
  return day(i, 'Terraces', 'core', true, b);
}

function batukaruDay(c: RetreatConfig, i: number, withTerraces: boolean): Day {
  const d = drive(c).batukaru;
  const porter = has(c, 'porter') ? ' · porter with your pack' : '';
  const b: Block[] = [
    block('transfer', 'Drive to Pura Luhur Batukaru', 'travel', 5.5 - d, 5.5),
    block('climb', 'Batukaru, through the rainforest', 'play', 5.5, 10, `Roots, mud and no views until the top${porter}`, 4),
    block('summit', 'Summit shrine', 'experience', 10, 10.5, 'Quietly; it is a holy place'),
    block('descent', 'The way down', 'play', 10.5, 13.5, 'Slippery whatever the season', 4),
    block('lunch', 'Late lunch', 'meal', 13.75, 14.75),
  ];
  // Jatiluwih is on the road home; in a crowded week the terraces ride along
  let leave = 15;
  if (withTerraces) {
    b.push(block('terraces', 'Jatiluwih terraces', 'play', 15, 16.5, 'A short loop on the subak paths', 3));
    leave = 16.75;
  }
  b.push(block('back', 'Back to base', 'travel', leave, leave + d));
  evening(c, i, b, leave + d);
  return day(i, 'Big climb', 'peak', true, b);
}

type Special = 'agung' | 'eve' | 'eve+jatiluwih' | 'recovery' | 'rest' | 'batur' | 'batukaru' | 'batukaru+jatiluwih' | 'sekumpul' | 'jatiluwih';

/**
 * Where the big days go. Agung sits in the middle of the week with a walking
 * day before it and a recovery day after; Batur comes two days earlier as the
 * warm-up. Nothing hard is ever put on the last full day.
 */
function shape(c: RetreatConfig): Map<number, Special> {
  const total = c.nights + 1;
  const last = total - 1;
  const map = new Map<number, Special>();
  const agung = has(c, 'agung') && c.level === 'summit' && c.nights >= 6;

  if (agung) {
    const a = Math.min(last - 1, Math.max(4, Math.ceil(total / 2)));
    map.set(a, 'agung');
    map.set(a + 1, 'recovery');
    map.set(a - 1, 'eve');
    if (has(c, 'batur')) map.set(a - 2, 'batur');
  } else {
    const rest = c.nights >= 6 ? restDayIndex(c.nights, 6) : -1;
    if (rest > 0) map.set(rest, 'rest');
    if (has(c, 'batur')) {
      const b = c.nights >= 4 && rest !== 3 ? 3 : 2;
      map.set(b, 'batur');
    }
  }

  const free = () => Array.from({ length: last - 1 }, (_, k) => k + 2).filter((d) => !map.has(d));
  const hardNear = (d: number) => ['batur', 'agung', 'eve'].includes(map.get(d - 1) ?? '') || ['agung', 'eve', 'batur'].includes(map.get(d + 1) ?? '');

  if (has(c, 'batukaru') && c.level !== 'walker') {
    const options = free().filter((d) => d !== last);
    const slot = options.find((d) => d !== 2 && !hardNear(d)) ?? options.find((d) => !hardNear(d)) ?? options[0];
    if (slot) map.set(slot, 'batukaru');
  }
  for (const id of ['sekumpul', 'jatiluwih'] as const) {
    if (!has(c, id)) continue;
    const options = free();
    const slot = options.find((d) => d !== last) ?? options[0];
    if (slot) map.set(slot, id);
    else if (id === 'jatiluwih') {
      // a crowded summit week: the terraces become the easy walk before Agung, or ride along with Batukaru
      const eve = [...map.entries()].find(([, v]) => v === 'eve');
      const climb = [...map.entries()].find(([, v]) => v === 'batukaru');
      if (eve) map.set(eve[0], 'eve+jatiluwih');
      else if (climb) map.set(climb[0], 'batukaru+jatiluwih');
    }
  }
  return map;
}

function build(c: RetreatConfig): Day[] {
  const days: Day[] = [];
  const total = c.nights + 1;
  const d = drive(c);
  const plan = shape(c);
  let walks = 0;

  // Hot springs follow Batur when there is one; otherwise they go to the quiet day, or the first ordinary walk
  const kinds = [...plan.values()];
  let springsDay = -1;
  if (has(c, 'hotsprings') && !kinds.includes('batur')) {
    const quiet = [...plan.entries()].find(([, v]) => v === 'recovery' || v === 'rest');
    springsDay = quiet ? quiet[0] : (Array.from({ length: total - 2 }, (_, k) => k + 2).find((i) => !plan.has(i)) ?? -1);
  }

  for (let i = 1; i <= total; i++) {
    if (i === 1) {
      const b: Block[] = [];
      let settleFrom = 12;
      if (has(c, 'airport')) {
        b.push(block('transfer', 'Airport pickup', 'travel', 10, 10 + d.airport));
        settleFrom = 10.25 + d.airport;
      }
      b.push(block('settle', 'Check in and settle', 'free', settleFrom, 15.75));
      b.push(block('first-walk', 'First walk', 'play', 16, 17.5, 'Pace, kit, the paths near the villa', 3));
      b.push(block('dinner', 'Welcome dinner', 'meal', 19, 20.5, 'The week, explained'));
      days.push(day(i, 'Arrival', 'arrival', false, b));
    } else if (i === total) {
      const b: Block[] = [
        block('walk', 'Last walk', 'play', 6.5, 8, 'Short, close to home', 3),
        block('breakfast', 'Breakfast', 'meal', 8.25, 9.25),
        block('checkout', 'Check out', 'free', 10, 11),
      ];
      if (has(c, 'airport')) b.push(block('transfer', 'Airport drop-off', 'travel', 11.5, 11.5 + d.airport));
      days.push(day(i, 'Departure', 'departure', false, b));
    } else {
      switch (plan.get(i)) {
        case 'agung':
          days.push(agungDay(c, i));
          break;
        case 'recovery':
          days.push(recoveryDay(c, i, i === springsDay));
          break;
        case 'rest':
          days.push(restDay(c, i, i === springsDay));
          break;
        case 'batur':
          days.push(baturDay(c, i));
          break;
        case 'batukaru':
        case 'batukaru+jatiluwih':
          days.push(batukaruDay(c, i, plan.get(i) === 'batukaru+jatiluwih'));
          break;
        case 'sekumpul':
          days.push(sekumpulDay(c, i));
          break;
        case 'jatiluwih':
        case 'eve+jatiluwih':
          days.push(jatiluwihDay(c, i, plan.get(i) === 'eve+jatiluwih'));
          break;
        default:
          days.push(walkDay(c, i, walks++, plan.get(i) === 'eve', i === springsDay));
      }
    }
  }
  return days;
}

const planner: PlannerSpec = {
  levels: [
    { id: 'walker', name: 'Easy walker', note: 'Two or three hours on good paths' },
    { id: 'hiker', name: 'Regular hiker', note: 'Four to six hours, with real climbs' },
    { id: 'summit', name: 'Mountain-fit', note: 'Night starts and 1,500 m or more of ascent' },
  ],
  intensities: [
    { id: 'gentle', name: 'Gentle', note: 'One walk a day, the island for the rest', sessions: '1 walk/day', perDay: 70 },
    { id: 'steady', name: 'Steady', note: 'A morning hike and an evening walk', sessions: '2 walks/day', perDay: 100 },
    { id: 'big', name: 'Big', note: 'Long mornings, and the summits if you want them', sessions: 'Long days', perDay: 140 },
  ],
  bases: [
    { id: 'ubud', name: 'Ubud', note: 'Ridges, terraces and the most to do after', detail: 'Campuhan on the doorstep', multiplier: 1 },
    { id: 'munduk', name: 'Munduk', note: 'Cool highlands, lakes and waterfalls', detail: 'Twin lakes, coffee forest', multiplier: 0.85 },
    { id: 'sidemen', name: 'Sidemen', note: 'A quiet valley under Agung', detail: 'Closest to Besakih', multiplier: 0.9 },
    { id: 'kintamani', name: 'Kintamani', note: 'On the Batur caldera, for sunrise weeks', detail: 'Batur 30 min away', multiplier: 0.8 },
  ],
  stays: STAYS,
  extras: [
    { id: 'batur', name: 'Batur sunrise trek', note: 'Start at half past three, sunrise on the summit', perPerson: 90, group: 'trail' },
    { id: 'agung', name: 'Mount Agung summit', note: 'From Besakih, about twelve hours, licensed guide', perPerson: 240, group: 'trail', levels: ['summit'], minNights: 6, needs: 'Mountain-fit walkers on six nights or more; dry season only, and closed during Besakih ceremonies' },
    { id: 'batukaru', name: 'Batukaru climb', note: 'Rainforest to Bali’s second-highest summit', perPerson: 120, group: 'trail', levels: ['hiker', 'summit'], minNights: 7, needs: 'Regular hikers and up, seven nights or more, so it never sits beside another climb' },
    { id: 'sekumpul', name: 'Sekumpul waterfalls', note: 'A day in the north, many steps', perPerson: 75, group: 'trail', minNights: 4, needs: 'Needs four nights or more' },
    { id: 'jatiluwih', name: 'Jatiluwih terraces', note: 'A morning on the UNESCO subak paths', perPerson: 60, group: 'trail', minNights: 4, needs: 'Needs four nights or more' },
    { id: 'porter', name: 'Porter', note: 'Carries your day pack on the big climbs', perPerson: 90, group: 'trail' },
    { id: 'hotsprings', name: 'Hot springs', note: 'After the sunrise trek, or on a quiet afternoon', perPerson: 35, group: 'recovery' },
    { id: 'massage', name: 'Sports massage', note: 'One every third night', perPerson: 50, group: 'recovery', everyNights: 3 },
    { id: 'stretch', name: 'Yoga and stretching', note: 'After every walk, while the legs are warm', perPerson: 60, group: 'recovery' },
    { id: 'photo', name: 'Photographer', note: 'One sunrise and one walk, files sent after', perPerson: 150, group: 'island' },
    { id: 'airport', name: 'Airport transfers', note: 'Both ways, however late the flight', perPerson: 55, group: 'logistics' },
  ],
  extraGroups: [
    { key: 'trail', title: 'On the trail' },
    { key: 'recovery', title: 'Recovery' },
    { key: 'island', title: 'The island' },
    { key: 'logistics', title: 'Logistics' },
  ],
  defaultConfig: {
    nights: 7,
    guests: 2,
    level: 'hiker',
    intensity: 'steady',
    stay: 'private',
    base: 'ubud',
    extras: ['batur', 'airport'],
  },
  nightLimits: { min: 3, max: 14 },
  guestLimits: { min: 1, max: 8 },
  dayStart: 1,
  dayEnd: 21,
  words: {
    levelTitle: 'How far you walk now',
    intensityTitle: 'How big the days are',
    baseTitle: 'Base',
    coachingLine: 'Guides, permits and drivers',
    people: 'walkers',
    person: 'walker',
  },
  metric: { label: 'km on foot', measure: (days) => Math.round(unitsIn(days)) },
  logistics: { base: 60, perNight: 15 },
  statusNote: 'Walks start at first light and finish before the heat and the afternoon cloud — and every big day is followed by an easy one.',
  rules: [
    'Walks leave at six and are over by late morning. After that Bali is hot, and the mountains are usually in cloud.',
    'Every mountain is climbed with a licensed local guide, as Bali’s rules require. We do not run unguided summits.',
    'Agung is followed by a recovery day, and no hard climb is put on the last full day.',
    'Agung is only climbed in the dry season and never while Besakih is closed for ceremonies. If the mountain is shut, we change the week.',
    'Six nights or more earns a rest day: a cooking class, a temple visit and nothing uphill.',
  ],
  build,
};

/* ------------------------------------------------------------ content --- */

export const HIKING: SportSite = {
  id: 'hiking',
  name: 'Hiking',
  descriptor: 'Hiking retreats in Bali',
  coreIdea: 'Walk at first light. Rest in the heat. See the island from above.',
  description:
    'Guided walking weeks in Bali — volcano sunrises, rice terraces, rainforest and waterfalls — with licensed local guides. Plan your own week and talk to the team who walks it.',

  hero: {
    eyebrow: 'Hiking retreats in Bali',
    headline: 'Walk at First Light. Rest in the Heat. See the Island from Above.',
    support:
      'Small guided walking weeks across Bali’s ridges, terraces and volcanoes, with licensed local guides and early starts — planned with you before anything is booked.',
    photos: [H.baturClouds, H.terraceWalker, H.ridgeGroup],
  },
  stats: [
    { value: '486', label: 'Walkers guided since 2022' },
    { value: '4', label: 'Guides, three of them born under these mountains' },
    { value: '9.5/10', label: 'Average week rating' },
    { value: '0', label: 'Summits attempted without a licensed guide' },
  ],

  values: [
    {
      eyebrow: 'The walking',
      title: 'Guided properly, from first light',
      lead: 'Small groups, local guides, and days built around the hours when walking here is a pleasure.',
      body: 'Out at six, back before the heat, with a guide who grew up on the mountain you are climbing. The routes change with the base and the level, and the hard days are placed where your legs can take them — never on the day before you fly.',
      points: ['Six walkers to a guide, never more.', 'Every mountain with a licensed local guide.', 'An easy day after every big one.'],
      photo: H.ridgeGroup,
    },
    {
      eyebrow: 'The island',
      title: 'Holy mountains, walked respectfully',
      lead: 'In Bali the mountains are sacred. That changes how you climb them, and it should.',
      body: 'Agung is the holiest place on the island and Batukaru has a temple at its foot and a shrine at its top. Guides make offerings, some days the mountains are closed, and a week here includes a temple visit in a sarong as well as the summits.',
      points: ['Temple dress provided and explained.', 'Ceremony closures respected, not worked around.', 'Afternoons for the island, not the trail.'],
      photo: H.agungTemple,
    },
  ],

  sport: {
    eyebrow: 'The sport',
    title: 'Why Walk Bali',
    lead: 'An island of volcanoes, terraces and forest that most visitors only see from a car window.',
    paragraphs: [
      'Bali is small enough to cross in a morning’s drive and steep enough that almost none of it is flat. In a single week you can stand on an active volcano at sunrise, walk the irrigation channels of a farming system a thousand years old, and climb through rainforest to a summit shrine.',
      'What makes it work as a walking holiday is the shape of the day. The tropical heat and the afternoon cloud are predictable, so the walking happens early and the rest of the day is genuinely free — for sleep, food, temples and the pool. Done that way, a week of long walks feels like a holiday rather than an expedition.',
    ],
    drivers: [
      { icon: 'compass', title: 'Variety', text: 'Volcano, terrace, lake, forest and waterfall, all within a couple of hours of each other.' },
      { icon: 'sun', title: 'Early starts', text: 'First light is cool and clear. By midday the walking is done.' },
      { icon: 'heart', title: 'Any level', text: 'Field paths for easy walkers, night summits for the mountain-fit, the same island for both.' },
      { icon: 'team', title: 'Small groups', text: 'Six walkers to a guide, so the pace is set by the group and not the fastest.' },
    ],
    facts: [
      { value: '2012', label: 'year Bali’s subak rice-terrace landscape, Jatiluwih included, was inscribed by UNESCO', source: 'UNESCO World Heritage Centre' },
      { value: '3,142 m', label: 'Mount Agung, the island’s highest and holiest mountain', source: 'Smithsonian Global Volcanism Program' },
    ],
  },

  bali: {
    eyebrow: 'Hiking in Bali',
    title: 'Sacred mountains, and the rules that come with them',
    lead: 'Bali’s mountains are holy ground first and walking routes second. The climbing is open, but it is guided, seasonal and closed when the temples need it.',
    paragraphs: [
      'Mount Batur, at 1,717 m, is the climb most visitors know: an active volcano inside a vast caldera, climbed in the dark for sunrise. Treks usually set off between three and four in the morning and take about two hours to the top. Climbs run through the local guide association, and a guide is in practice required.',
      'Mount Agung is a different undertaking. It is the island’s highest mountain — 3,142 m by the volcano observatories’ measure, though just over 3,000 m is also often given — and its holiest, with Pura Besakih on its slopes. The route from Besakih to the true summit takes six to seven hours up and five to six down; a shorter route from Pasar Agung reaches the crater rim. A licensed guide is mandatory, and in 2025 foreign visitors who climbed without one were deported.',
      'Agung closes for ceremonies at Besakih — from 6 April to 3 May in 2025, and from 28 March to 24 April in 2026 — and is generally not climbed in the heavy rains of the wet season. In 2023 the provincial government proposed banning climbing on Bali’s mountains altogether; as far as we can establish, that proposal has not become law, and climbing continues under tighter rules. Since March 2025 a governor’s circular has required foreign visitors at cultural and natural sites to be accompanied by a certified guide, and asks for modest dress at temples and that visitors stay out of their inner courtyards.',
      'Beyond the volcanoes the walking is gentler and just as good. Batukaru, at 2,276 m the second-highest mountain, is a rainforest climb from Pura Luhur Batukaru. The Campuhan ridge runs out of Ubud on a paved spine above two rivers. Sekumpul in the north is a group of around seven waterfalls, the tallest roughly 80 m. And the terraces at Jatiluwih are part of the subak landscape UNESCO inscribed in 2012.',
    ],
    numbers: [
      { value: '1,717 m', label: 'Mount Batur, climbed for sunrise most mornings of the year', source: 'Smithsonian Global Volcanism Program' },
      { value: '3,142 m', label: 'Mount Agung — a licensed guide is mandatory', source: 'Smithsonian Global Volcanism Program' },
      { value: '2,276 m', label: 'Mount Batukaru, the island’s second-highest summit', source: 'Published trekking guides; figures vary slightly' },
      { value: '28 Mar – 24 Apr', label: 'Agung closed for Besakih ceremonies in 2026', source: 'Bali provincial announcements, 2026' },
    ],
    venues: [
      { name: 'Mount Batur', area: 'Kintamani · Bangli', note: '1,717 m. The sunrise climb, about two hours up from the trailhead in the dark.' },
      { name: 'Mount Agung', area: 'Besakih · Karangasem', note: 'The holiest mountain. Twelve hours or more to the summit and back, licensed guide only.' },
      { name: 'Mount Batukaru', area: 'Tabanan', note: 'Rainforest from the temple to the top, roughly four to five hours up.' },
      { name: 'Campuhan Ridge', area: 'Ubud · Gianyar', note: 'About two kilometres along a ridge between two rivers; the easiest good walk on the island.' },
      { name: 'Sekumpul', area: 'Buleleng · North Bali', note: 'Around seven waterfalls, the tallest roughly 80 m, reached by steep steps.' },
      { name: 'Jatiluwih', area: 'Tabanan', note: 'Terraces within Bali’s UNESCO-listed subak landscape, walked on the farm paths.' },
    ],
    season: {
      ratings: [1, 1, 1, 2, 3, 3, 3, 3, 3, 2, 1, 1],
      summary: 'Lower walks run all year. The summits are a dry-season undertaking, and the clearest views come between May and September.',
      notes: [
        { label: 'Dry season', months: 'April – October', text: 'Clear early mornings and firm paths. The months for Agung and for sunrise views from Batur.' },
        { label: 'Wet season', months: 'November – March', text: 'Heavy afternoon and evening storms, slippery trails and cloud on the tops. Terrace and ridge walks still work in the mornings.' },
        { label: 'Ceremonies', months: 'Varies (28 Mar – 24 Apr in 2026)', text: 'Agung closes for ceremonies at Besakih. We plan summit weeks around the announced dates.' },
        { label: 'Nyepi', months: 'March (19 March 2026)', text: 'Day of Silence: the island and airport close for 24 hours. No walking, no travel.' },
      ],
    },
    practical: [
      { icon: 'safety-certificate', title: 'Licensed guides', text: 'Required on Agung and, under the 2025 circular, at natural sites generally. Every walk we run has one.' },
      { icon: 'cloud', title: 'Warm layers', text: 'The summits are cold before dawn. Bring a fleece and a light shell; we lend headtorches.' },
      { icon: 'home', title: 'Temple dress', text: 'Shoulders and knees covered, sarong and sash at temples. We provide them and show you how.' },
      { icon: 'wallet', title: 'Tourist levy', text: 'IDR 150,000 per visitor, paid once online before you arrive. Not included.' },
    ],
    sources: [
      { label: 'UNESCO — Cultural Landscape of Bali Province: the Subak System', url: 'https://whc.unesco.org/en/list/1194' },
      { label: 'Global Volcanism Program — Agung', url: 'https://volcano.si.edu/volcano.cfm?vn=264020' },
      { label: 'Global Volcanism Program — Batur', url: 'https://volcano.si.edu/volcano.cfm?vn=264010' },
      { label: 'Love Bali — the Bali tourist levy', url: 'https://lovebali.baliprov.go.id' },
    ],
    checked: 'October 2026',
  },

  profiles: [
    {
      id: 'walker',
      name: 'Easy walker',
      subtitle: 'Happy for a couple of hours',
      description: 'Field paths, ridges and terraces, two or three hours at a time, with long breakfasts and free afternoons. Batur is within reach if you want a sunrise, taken slowly.',
      priorities: ['See the island on foot', 'Nothing that hurts the next day', 'Still have a holiday'],
      photo: H.fieldWalk,
    },
    {
      id: 'hiker',
      name: 'Regular hiker',
      subtitle: 'Walks most weekends',
      description: 'The most common walker here. Four to six hours most mornings, real climbs, Batur for sunrise and Batukaru through the forest, with a shorter walk in the evening light.',
      priorities: ['Proper days on the trail', 'The routes visitors do not find', 'A volcano at sunrise'],
      photo: H.couple,
    },
    {
      id: 'summit',
      name: 'Mountain-fit',
      subtitle: 'Comfortable with a night start',
      description: 'Big days and night starts, built towards Agung from Besakih: twelve hours on the mountain with a licensed guide, a warm-up on Batur first and a full recovery day after.',
      priorities: ['Stand on the highest point', 'A week that builds properly', 'Guides who know the mountain'],
      photo: H.sunriseHiker,
    },
  ],

  dayShape: [
    { icon: 'coffee', time: '05:30', title: 'Coffee and briefing', text: 'The route, the weather and how much water. Ten minutes, then out.' },
    { icon: 'sun', time: '06:00', title: 'First light', text: 'On the trail as it gets light, while the air is cool and the views are clear.' },
    { icon: 'environment', time: '10:30', title: 'Late breakfast', text: 'Back before the heat. Food, a shower, and nothing asked of you.' },
    { icon: 'home', time: '13:00', title: 'The middle', text: 'Yours. Sleep, the pool, a temple or a market. The mountains are in cloud anyway.' },
    { icon: 'compass', time: '16:15', title: 'Evening walk', text: 'On steady and big weeks, an hour and a half through the fields as the light goes.' },
    { icon: 'team', time: '19:00', title: 'Dinner', text: 'Together, most nights, and early. Some mornings start in the dark.' },
  ],
  included: [
    'Licensed local guides on every walk, six walkers to a guide',
    'Trail fees, permits and entry tickets',
    'Drivers to and from every trailhead',
    'Accommodation at the tier you pick',
    'Breakfast daily, and dinner together most nights',
    'Headtorches, walking poles and temple sarongs on loan',
  ],
  notIncluded: [
    'Flights — you will find better ones than we would',
    'Travel insurance that covers trekking, which we ask you to hold',
    'Walking boots; bring your own, worn in',
    'The Bali tourist levy (IDR 150,000, paid once online)',
  ],

  bases: [
    {
      id: 'ubud',
      name: 'Ubud',
      subtitle: 'Gianyar · Central Bali',
      tagline: 'Ridges and terraces from the front door.',
      description: 'The Campuhan ridge starts a few minutes from the villa, Tegalalang and the Sayan valley are close, and Batur is an hour and a quarter by car. The best base for a first walking week, and the one with the most to do in the afternoons.',
      lat: -8.507,
      lon: 115.263,
      stats: [{ label: 'Walks from the door', value: '4' }, { label: 'To Batur', value: '75 min' }],
      driveToAirportMin: 75,
      bestFor: ['First walking weeks', 'Mixed groups', 'Culture with the walking'],
      photo: B.tegalalang,
    },
    {
      id: 'munduk',
      name: 'Munduk',
      subtitle: 'Buleleng · Central highlands',
      tagline: 'Cool air, lakes and waterfalls.',
      description: 'A highland village above the twin lakes of Buyan and Tamblingan, in coffee and clove forest. Nights are properly cool, the waterfalls are within walking distance and Sekumpul is under an hour away. The longest airport run we have.',
      lat: -8.26,
      lon: 115.07,
      stats: [{ label: 'Lakes nearby', value: '2' }, { label: 'To Sekumpul', value: '45 min' }],
      driveToAirportMin: 165,
      bestFor: ['Forest and waterfalls', 'Hot-weather sceptics', 'Longer weeks'],
      photo: B.ulunDanu,
    },
    {
      id: 'sidemen',
      name: 'Sidemen',
      subtitle: 'Karangasem · East Bali',
      tagline: 'A quiet valley under Agung.',
      description: 'Terraced fields, weaving villages and a river along the valley floor, with Agung filling the view to the north. Half an hour from Besakih, which makes it the natural base for a summit week.',
      lat: -8.47,
      lon: 115.44,
      stats: [{ label: 'To Besakih', value: '30 min' }, { label: 'Walks from the door', value: '4' }],
      driveToAirportMin: 120,
      bestFor: ['Agung weeks', 'Quiet', 'Terrace walking'],
      photo: H.terraces,
    },
    {
      id: 'kintamani',
      name: 'Kintamani',
      subtitle: 'Bangli · Batur caldera',
      tagline: 'On the rim, for sunrise weeks.',
      description: 'Up on the edge of the Batur caldera, with the volcano and the lake below. Batur is half an hour from the door, which turns a sunrise climb from a midnight start into a reasonable one, and the hot springs are by the lake.',
      lat: -8.24,
      lon: 115.33,
      stats: [{ label: 'To Batur', value: '30 min' }, { label: 'Hot springs', value: 'By the lake' }],
      driveToAirportMin: 135,
      bestFor: ['Sunrise climbs', 'Volcano walking', 'Short weeks'],
      photo: H.baturClouds,
    },
  ],

  coaches: [
    { id: 'wayan', name: 'Wayan Sukerta', role: 'Head guide', from: 'Kintamani, Bali', level: 'Licensed guide, Batur and Agung', years: 16, bio: 'Grew up in a village on the Batur caldera and first went up the mountain as a porter at fifteen. Wayan sets the routes, chooses the guides and decides, on the morning, whether a climb goes ahead.', speaks: ['Balinese', 'Indonesian', 'English'] },
    { id: 'ketut', name: 'Ketut Darma', role: 'Mountain guide, Agung', from: 'Selat, Karangasem', level: 'Licensed Agung guide', years: 14, bio: 'Leads the summit nights from Besakih. Ketut is unhurried on the way up and strict about turnaround times, and whether the mountain is open is a question he takes to the temple before he takes it to a forecast.', speaks: ['Balinese', 'Indonesian', 'English'] },
    { id: 'komang', name: 'Komang Sari', role: 'Guide, highlands', from: 'Munduk, Bali', level: 'Licensed guide, forest and lakes', years: 9, bio: 'Her family grows coffee and cloves above the lakes, and she knows the forest paths that are not on any map. Komang leads the Munduk weeks and the waterfall days, and knows the name of every plant you stop to ask about.', speaks: ['Balinese', 'Indonesian', 'English', 'Dutch'] },
    { id: 'clare', name: 'Clare Ashworth', role: 'Trip leader and safety', from: 'Kendal, England', level: 'Mountain Leader, wilderness first aid', years: 12, bio: 'Plans the pacing of each week and walks at the back of the group. Clare is the one who notices a blister before it happens, and who will tell you, kindly, that today is not your summit day.', speaks: ['English', 'Indonesian'] },
  ],

  retreats: [
    {
      id: 'h1', slug: 'first-light-ubud', name: 'First Light', headline: 'Five nights of ridges and terraces, at an easy pace.',
      base: 'ubud', level: 'walker', intensity: 'gentle', stay: 'private', nights: 5,
      dates: '10–15 May 2027', month: 'May', priceFromUsd: 1100, spotsTotal: 12, spotsLeft: 7, status: 'open', coachId: 'clare',
      summary: 'The walking week for people who would not call themselves hikers. Two or three hours each morning on good paths, and the rest of the day for Ubud.',
      body: [
        'Ubud is the best place on the island to walk without climbing anything. The Campuhan ridge starts a few minutes away, the terraces run north for miles, and every path ends somewhere you can buy a coffee.',
        'One walk a day, out at six and back by nine or ten, never more than three hours. A morning at Jatiluwih takes you into the subak landscape that UNESCO listed, on the farm paths rather than the viewpoint.',
        'Afternoons are free, with a village visit every other day if you want one. Nothing on this week will leave you sore the next morning.',
      ],
      includes: ['Five guided morning walks', 'A morning at the Jatiluwih terraces', 'Sports massage every third night', 'Private suite, five nights', 'Airport transfers both ways', 'Breakfast daily, dinner together three nights'],
      photo: H.terraceWalker, extras: ['jatiluwih', 'massage', 'airport'],
    },
    {
      id: 'h2', slug: 'two-volcanoes-sidemen', name: 'Two Volcanoes', headline: 'Batur at sunrise, then the summit of Agung.',
      base: 'sidemen', level: 'summit', intensity: 'big', stay: 'private', nights: 8,
      dates: '7–15 August 2027', month: 'August', priceFromUsd: 2330, spotsTotal: 8, spotsLeft: 3, status: 'filling', coachId: 'ketut',
      summary: 'The hardest week we run. A warm-up on Batur, then Agung from Besakih with a licensed guide, a recovery day after, and big walks either side.',
      body: [
        'Agung is about twelve hours on the mountain: a one o’clock start from Besakih, the summit around dawn, and a descent that is harder on the knees than the climb. It is not a mountain to arrive at cold, so the week builds to it — Batur for sunrise two days before, long valley walks around them both.',
        'The week runs in August, in the middle of the dry season and well away from the ceremony closures at Besakih. If the mountain is shut for any reason — a ceremony, the weather, the volcano — we do not look for a way round it. Ketut will have a second plan ready.',
        'The day after the summit is a proper recovery day: sleep, massage, a temple visit in a sarong and a twenty-minute walk to loosen the legs. Nobody is asked to do anything hard on the last full day.',
      ],
      includes: ['Agung summit from Besakih, licensed guide', 'Batur sunrise trek', 'Porters on both climbs', 'Private suite, eight nights in Sidemen', 'Sports massage every third night', 'Airport transfers both ways'],
      photo: H.agungFromBatur, extras: ['batur', 'agung', 'porter', 'massage', 'airport'],
    },
    {
      id: 'h3', slug: 'munduk-highlands', name: 'Munduk Highlands', headline: 'Seven nights of lakes, forest and waterfalls.',
      base: 'munduk', level: 'hiker', intensity: 'steady', stay: 'villa', nights: 7,
      dates: '14–21 June 2027', month: 'June', priceFromUsd: 1990, spotsTotal: 8, spotsLeft: 8, status: 'open', coachId: 'komang',
      summary: 'The cool side of the island. Forest paths above the twin lakes, a day at Sekumpul, and Batukaru through the rainforest.',
      body: [
        'At Munduk the nights are cool enough for a blanket, which surprises almost everyone. The walking is through coffee and clove forest, around the lakes and down to waterfalls, much of it on paths that only people who live here use.',
        'Two days leave the usual pattern. Sekumpul, in the north, is a morning of steep steps and river crossings between some of the finest waterfalls on the island. Batukaru is a real climb: four hours or more up through rainforest to a shrine at the top, where the group goes quietly.',
        'The whole villa is yours, with a cook, and a rest day in the middle has a cooking class and a temple visit in it.',
      ],
      includes: ['Guided walks every morning and evening', 'Sekumpul waterfalls day', 'Batukaru climb with a licensed guide', 'Whole villa, seven nights', 'Sports massage every third night', 'Airport transfers both ways'],
      photo: H.waterfalls, extras: ['sekumpul', 'batukaru', 'massage', 'airport'],
    },
    {
      id: 'h4', slug: 'caldera-week-kintamani', name: 'Caldera Week', headline: 'Six nights on the rim of the Batur caldera.',
      base: 'kintamani', level: 'hiker', intensity: 'steady', stay: 'private', nights: 6,
      dates: '25–31 October 2026', month: 'October', priceFromUsd: 1240, spotsTotal: 10, spotsLeft: 2, status: 'filling', coachId: 'wayan',
      summary: 'A volcano week at the end of the dry season. Batur for sunrise from half an hour away, then the rim, the lava fields and the lake.',
      body: [
        'Most people climb Batur from a hotel two hours away, which means leaving at one in the morning. From Kintamani it is a half-hour drive, and the climb becomes what it should be: two hours in the dark, sunrise on the summit and breakfast on the rim.',
        'The rest of the week walks the caldera itself — the rim from Penelokan, the black lava fields below the cone, the villages along the lake — with hot springs by the water after the sunrise climb.',
        'Wayan grew up on this caldera. Late October is the tail of the dry season, so expect clear mornings and the occasional afternoon shower.',
      ],
      includes: ['Batur sunrise trek', 'Hot springs at Toya Bungkah', 'Yoga and stretching after every walk', 'Private suite, six nights', 'Rest day with cooking class and temple visit', 'Airport transfers both ways'],
      photo: H.cloudPeak, extras: ['batur', 'hotsprings', 'stretch', 'airport'],
    },
    {
      id: 'h5', slug: 'the-long-walk-ubud', name: 'The Long Walk', headline: 'Ten nights, and most of the island on foot.',
      base: 'ubud', level: 'hiker', intensity: 'big', stay: 'shared', nights: 10,
      dates: '5–15 July 2027', month: 'July', priceFromUsd: 2580, spotsTotal: 12, spotsLeft: 9, status: 'open', coachId: 'wayan',
      summary: 'For people who would rather walk than do anything else. Batur, Batukaru, Sekumpul and Jatiluwih, with long ridge walks from Ubud in between.',
      body: [
        'Ten nights is long enough to see the island properly on foot: the volcano at sunrise, the rainforest climb in the west, the waterfalls in the north and the terraces in between, with the Ubud ridges on the ordinary days.',
        'The days are big — five hours or so most mornings, and a walk again in the evening — but they are placed so that no hard day follows another, and the rest day falls in the middle.',
        'Shared rooms in one villa keep the price down and the group together. A photographer joins one sunrise and one walk, and the files arrive after you get home.',
      ],
      includes: ['Batur sunrise trek', 'Batukaru climb with a licensed guide', 'Sekumpul and Jatiluwih days', 'Shared villa room, ten nights', 'Photographer for a sunrise and a walk', 'Airport transfers both ways'],
      photo: H.range, extras: ['batur', 'batukaru', 'sekumpul', 'jatiluwih', 'massage', 'photo', 'airport'],
    },
    {
      id: 'h6', slug: 'long-weekend-ubud', name: 'Long Weekend', headline: 'Three nights and one sunrise.',
      base: 'ubud', level: 'walker', intensity: 'steady', stay: 'private', nights: 3,
      dates: 'Most weekends, April to October', month: 'Flexible', priceFromUsd: 730, spotsTotal: 8, spotsLeft: 6, status: 'open', coachId: 'clare',
      summary: 'For people already in the region. Batur for sunrise, the Campuhan ridge, and an easy flight home.',
      body: [
        'Short, and honest about it. Three nights is enough for a Batur sunrise and two or three good walks around Ubud, and not much more.',
        'Batur comes on the first full day while you are still waking early. The ridge walks fill the rest, with a walk at each end of the day and time in the middle for Ubud itself.',
        'Popular with people living in Singapore, Jakarta and Perth, and run most weekends of the dry season.',
      ],
      includes: ['Batur sunrise trek', 'Guided morning and evening walks', 'Private suite, three nights', 'Airport transfers both ways', 'Breakfast daily, dinner together twice'],
      photo: H.aboveClouds, extras: ['batur', 'airport'],
    },
  ],

  testimonials: [
    { quote: 'I have walked in the Alps and the Lakes for thirty years and nothing prepared me for standing on Agung as the sun came up. Ketut got us there and, just as importantly, back down.', name: 'Graham W.', detail: 'Two Volcanoes, Sidemen · walks in Cumbria' },
    { quote: 'I was worried I would be the slow one. Clare set the pace by the group, and by Thursday I had stopped thinking about it.', name: 'Priya S.', detail: 'First Light, Ubud · walks in Surrey' },
    { quote: 'The Munduk week was cool, green and completely unlike the Bali I thought I knew. Komang knew every path and every plant.', name: 'Femke de V.', detail: 'Munduk Highlands · walks in Utrecht' },
    { quote: 'Being half an hour from Batur instead of two hours made the sunrise climb a pleasure rather than an ordeal. Small detail, whole difference.', name: 'Daniel K.', detail: 'Caldera Week, Kintamani · walks in Melbourne' },
  ],

  faqs: [
    { question: 'How fit do I need to be?', answer: 'Less than you think for most weeks. Easy walkers do two or three hours on good paths; the regular weeks ask for four to six hours with climbs. Agung is different: twelve hours on a steep mountain, and we ask about your recent walking before we put you on it.' },
    { question: 'Is this a booking?', answer: 'Not yet. Everything you build here is an indication, including the price. We come back with the dates we can actually hold — guides, permits, rooms and drivers — and you confirm in writing before any money moves.' },
    { question: 'Why start so early?', answer: 'Because by late morning Bali is hot and the mountains are usually in cloud. At six the air is cool and the views are clear, and by the time it gets uncomfortable you are at breakfast.' },
    { question: 'Can I climb Agung?', answer: 'If you are mountain-fit and staying six nights or more, yes — with a licensed guide, which is mandatory. It closes for ceremonies at Besakih (28 March to 24 April in 2026) and is not climbed in the heavy wet season, so summit weeks run between May and October.' },
    { question: 'Is it safe to walk on an active volcano?', answer: 'Our guides follow the official alert levels for Batur and Agung and the advice of the local guide associations. If a mountain is closed or the level rises, we do not climb it and the week changes.' },
    { question: 'What should I wear at temples?', answer: 'Shoulders and knees covered, and a sarong and sash, which we lend you. Visitors do not go into the inner courtyards. The mountains themselves are sacred, so the guides make offerings and the group is asked to be quiet at the shrines.' },
    { question: 'What happens when it rains?', answer: 'From November to March most afternoons bring a storm, which is one more reason the walks are in the morning. In the wet season we keep to terraces, ridges and forest rather than the summits.' },
    { question: 'Can I come alone?', answer: 'Most people do. Groups are six walkers to a guide, set by pace rather than by who booked together, and dinner is shared most nights.' },
  ],

  journal: [
    {
      slug: 'why-we-start-in-the-dark', title: 'Why we start in the dark', category: 'Walking',
      excerpt: 'The case for a six o’clock start, and what the middle of the day is actually for.',
      readMinutes: 5, date: '2026-08-21', author: 'Clare Ashworth', photo: H.sunriseHiker,
      body: [
        'The first question on every walking week is why the alarm goes off at five. The answer is the shape of a tropical day. At eight degrees south the sun is up by about six, the air is cool for two or three hours, and by eleven the heat has arrived and the cloud has started to build on the mountains.',
        'A walk that starts at six is therefore a different walk from one that starts at nine. The views are clear, the paths are dry, and you are back at breakfast before it becomes hard work. Start late and you spend the best part of the walk in the heat, looking at cloud.',
        'The middle of the day is not a gap in the schedule. It is where the recovery happens — food, sleep, shade and a lot of water — and it is why people can walk well on day six as well as day one.',
        'On the summit days the logic is the same, only earlier. Batur starts at half past three so you are on top for sunrise. Agung starts at one, because the mountain is long and the cloud does not wait.',
      ],
    },
    {
      slug: 'agung-and-when-not-to-climb-it', title: 'Agung, and when not to climb it', category: 'Mountains',
      excerpt: 'The island’s holiest mountain, the route from Besakih, and the days it is closed.',
      readMinutes: 7, date: '2026-09-10', author: 'Ketut Darma', photo: H.agungCloud,
      body: [
        'Agung is the mountain the whole island faces. Pura Besakih sits on its slopes, and for Balinese people it is the holiest place there is. That is the first thing anyone climbing it should understand, before the altitude or the distance.',
        'The route from Besakih goes to the true summit: six or seven hours up through forest and then bare rock, and five or six hours down. There is a shorter route from Pasar Agung to the crater rim. Either way a licensed guide is mandatory, and in 2025 visitors who climbed without one were deported.',
        'The mountain closes for ceremonies at Besakih — this year from 28 March to 24 April — and in the heavy rains it is not climbed. When it is closed, it is closed. We plan summit weeks for the middle of the dry season so that we rarely have to say no on the day.',
        'If you do climb it, go slowly at the top and leave the shrines alone. The view is extraordinary. It is also not really ours.',
      ],
    },
    {
      slug: 'the-rules-on-balis-mountains', title: 'The rules on Bali’s mountains, as they stand', category: 'Bali',
      excerpt: 'Guides, ceremonies, temple dress and a ban that was proposed but, as far as we know, never passed.',
      readMinutes: 5, date: '2026-10-01', author: 'Wayan Sukerta', photo: H.lookout,
      body: [
        'In 2023 the provincial government proposed banning climbing on Bali’s mountains, after a run of incidents involving visitors on sacred ground. As far as we can establish, the proposal never became law, and the mountains are still climbed. What changed is how.',
        'Since March 2025 a governor’s circular has asked foreign visitors to be accompanied by a certified guide at cultural and natural sites, to dress modestly at temples and to stay out of their inner courtyards. On Agung a licensed guide has been mandatory for longer, and it is enforced.',
        'For a walker this changes very little, if the week is run properly. Every route we use has a guide, the summits are booked through the local associations, and the dates are checked against the ceremony calendar before anyone flies.',
        'Rules do change. We check them before every season and say so on this site; if something has moved since you last looked, we will tell you before you book.',
      ],
    },
  ],

  planner,

  whatsapp: 'Hello Sports in Paradise, I’d like to talk about a hiking retreat in Bali.',
  cta: {
    heading: 'Tell Us How You Like to Walk.',
    lede: 'How far you walk now, roughly when you can travel, and whether there is a summit you have in mind. You will get a real schedule and a real price back — and nothing is held until you say so.',
  },
};
