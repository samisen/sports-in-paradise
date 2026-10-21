import { SportSite } from '../core/content/types';
import { MapPlace } from './bali-map';

/** A sport's bases as map places, sized by how many of its retreats run there. */
export function sportPlaces(sport: SportSite): MapPlace[] {
  return sport.bases.map((b) => ({
    id: b.id,
    name: b.name,
    subtitle: b.subtitle,
    tagline: b.tagline,
    description: b.description,
    lat: b.lat,
    lon: b.lon,
    stats: [...b.stats.slice(0, 2), { label: 'Airport', value: `${b.driveToAirportMin} min` }],
    count: sport.retreats.filter((r) => r.base === b.id).length,
    photo: b.photo,
  }));
}
