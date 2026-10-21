/**
 * The sites this one codebase serves.
 *
 * sportsinparadise.com is the hub; each sport lives on its own subdomain
 * (padel.sportsinparadise.com and so on). One build, one deploy: the site is
 * chosen at runtime from the hostname, and everything that differs between
 * sites — palette, copy, photography, the planner's rules — hangs off the id.
 *
 * Keep the ids in step with the inline script in index.html, which reads the
 * hostname before Angular loads so the right palette is painted first.
 */

export const SPORT_IDS = ['padel', 'tennis', 'golf', 'diving', 'hiking'] as const;
export type SportId = (typeof SPORT_IDS)[number];
export type SiteId = 'hub' | SportId;

export function isSportId(v: string | null | undefined): v is SportId {
  return !!v && (SPORT_IDS as readonly string[]).includes(v);
}

export interface Palette {
  brand: string;
  brandStrong: string;
  accent: string;
}

/**
 * Light-theme primaries, also used where TypeScript needs a colour (the
 * browser chrome, map markers on the hub). The full light and dark token sets
 * live in styles.css under `[data-sport]`.
 */
export const SITE_COLOR: Record<SiteId, { light: string; dark: string }> = {
  hub: { light: '#d4405f', dark: '#0d0a10' },
  padel: { light: '#1668c4', dark: '#0b1017' },
  tennis: { light: '#6b3fd4', dark: '#0e0b17' },
  golf: { light: '#1d7a4c', dark: '#08120d' },
  diving: { light: '#00808f', dark: '#061215' },
  hiking: { light: '#c2520f', dark: '#140d08' },
};

/** Short names for navigation, in the order the hub presents them. */
export const SITE_LABEL: Record<SiteId, string> = {
  hub: 'All sports',
  padel: 'Padel',
  tennis: 'Tennis',
  golf: 'Golf',
  diving: 'Diving',
  hiking: 'Hiking',
};
