import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SITE_COLOR, SiteId, SportId, isSportId } from './sites';

const STORAGE_KEY = 'sip-site';

/**
 * Domains where every sport can have its own subdomain. Anywhere else (a
 * preview deploy, an IP address) cannot wildcard, so sites are told apart by
 * `?site=` instead and the choice is remembered for the tab.
 *
 * `*.localhost` resolves to the loopback address in every current browser, so
 * http://golf.localhost:4300 works in development with no hosts-file edits.
 */
const WILDCARD_ROOTS = ['sportsinparadise.com', 'localhost'];

type Mode = 'host' | 'query';

/**
 * Which site is this, and how do we link to the others.
 *
 * Resolved once, before the first render: the site never changes without a
 * full page load, because a different site is a different origin.
 */
@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly doc = inject(DOCUMENT);
  private readonly meta = inject(Meta);

  readonly id: SiteId;
  readonly isHub: boolean;
  private readonly mode: Mode;
  /** The hostname without any sport label, e.g. `sportsinparadise.com`. */
  private readonly root: string;

  constructor() {
    const loc = this.doc.location;
    const host = loc.hostname.toLowerCase();
    const labels = host.split('.');
    const fromHost = isSportId(labels[0]) && labels.length > 1 ? labels[0] : null;
    this.root = fromHost ? labels.slice(1).join('.') : host;
    this.mode = WILDCARD_ROOTS.some((r) => this.root === r || this.root.endsWith('.' + r)) ? 'host' : 'query';

    const fromQuery = new URLSearchParams(loc.search).get('site');
    let id: SiteId = fromHost ?? 'hub';
    if (fromQuery === 'hub' || isSportId(fromQuery)) {
      id = fromQuery;
      this.remember(fromQuery);
    } else if (!fromHost) {
      const stored = this.recall();
      if (stored) id = stored;
    }

    this.id = id;
    this.isHub = id === 'hub';
    this.paint();
  }

  /** The sport, or null on the hub. */
  get sport(): SportId | null {
    return this.isHub ? null : (this.id as SportId);
  }

  /** An absolute link to a page on another site (or this one). */
  url(site: SiteId, path = '/'): string {
    const loc = this.doc.location;
    const clean = path.startsWith('/') ? path : `/${path}`;
    if (this.mode === 'host') {
      const host = site === 'hub' ? this.root : `${site}.${this.root}`;
      const port = loc.port ? `:${loc.port}` : '';
      return `${loc.protocol}//${host}${port}${clean}`;
    }
    const base = (this.doc.querySelector('base')?.getAttribute('href') ?? '/').replace(/\/$/, '');
    return `${loc.origin}${base}${clean}?site=${site}`;
  }

  /** The palette is CSS; this only tells the document which one applies. */
  private paint(): void {
    const html = this.doc.documentElement;
    html.setAttribute('data-sport', this.id);
  }

  /** Browser chrome colour for the current site and theme. */
  themeColor(dark: boolean): string {
    const c = SITE_COLOR[this.id];
    return dark ? c.dark : c.light;
  }

  setDescription(text: string): void {
    this.meta.updateTag({ name: 'description', content: text });
    this.meta.updateTag({ property: 'og:description', content: text });
  }

  private remember(id: SiteId): void {
    try {
      if (id === 'hub') this.doc.defaultView?.sessionStorage.removeItem(STORAGE_KEY);
      else this.doc.defaultView?.sessionStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* storage blocked — the query string still works */
    }
  }

  private recall(): SportId | null {
    try {
      const v = this.doc.defaultView?.sessionStorage.getItem(STORAGE_KEY);
      return isSportId(v) ? v : null;
    } catch {
      return null;
    }
  }
}
