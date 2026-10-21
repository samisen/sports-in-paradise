import { SportSite } from '../../core/content/types';
import { SiteService } from '../../core/site/site.service';
import { MapPlace } from '../../shared/bali-map';
import { SeasonLine } from '../../shared/season-strip';

/** What the hub shows about each sport, derived from the sport's own content. */
export interface SportCard {
  site: SportSite;
  href: string;
  whyHref: string;
  planHref: string;
  /** The cheapest open week. */
  fromUsd: number;
  fromNights: number;
  retreatCount: number;
}

export function sportCards(all: SportSite[], site: SiteService): SportCard[] {
  return all.map((s) => {
    return {
      site: s,
      href: site.url(s.id),
      whyHref: site.url(s.id, '/why-bali'),
      planHref: site.url(s.id, '/plan'),
      fromUsd: Math.min(...s.retreats.map((r) => r.priceFromUsd)),
      fromNights: s.planner.defaultConfig.nights,
      retreatCount: s.retreats.length,
    };
  });
}

export function seasonLines(all: SportSite[], site: SiteService): SeasonLine[] {
  return all.map((s) => ({ label: s.name, sport: s.id, ratings: s.bali.season.ratings, href: site.url(s.id, '/why-bali') }));
}

/** Every base of every sport, coloured by sport, each linking to its site. */
export function allPlaces(all: SportSite[], site: SiteService): MapPlace[] {
  return all.flatMap((s) =>
    s.bases.map((b) => ({
      id: `${s.id}:${b.id}`,
      name: b.name,
      subtitle: `${s.name} · ${b.subtitle}`,
      tagline: b.tagline,
      description: b.description,
      lat: b.lat,
      lon: b.lon,
      stats: [...b.stats.slice(0, 2), { label: 'Airport', value: `${b.driveToAirportMin} min` }],
      count: s.retreats.filter((r) => r.base === b.id).length,
      sport: s.id,
      photo: b.photo,
      href: site.url(s.id, '/why-bali'),
      hrefLabel: `${s.name} in ${b.name}`,
    })),
  );
}
