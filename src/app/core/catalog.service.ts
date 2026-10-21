import { Injectable, inject } from '@angular/core';
import { Base, Coach, JournalPost, Retreat, SportSite } from './content/types';
import { SiteService } from './site/site.service';
import { SPORT_IDS } from './site/sites';
import { SPORT_LOADERS } from './sports/registry';

/**
 * The content of the current site.
 *
 * Loaded once by an app initializer before the first render, so pages can
 * read it synchronously. On a sport site `sport` is that sport; on the hub it
 * is null and `all` holds every sport, in hub order.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly site = inject(SiteService);

  private current: SportSite | null = null;
  private everything: SportSite[] = [];

  async load(): Promise<void> {
    if (this.site.sport) {
      this.current = await SPORT_LOADERS[this.site.sport]();
      this.everything = [this.current];
    } else {
      this.everything = await Promise.all(SPORT_IDS.map((id) => SPORT_LOADERS[id]()));
    }
  }

  /** The sport this site is about. Only call on a sport site. */
  get sport(): SportSite {
    if (!this.current) throw new Error('CatalogService.sport read on the hub');
    return this.current;
  }

  get all(): SportSite[] {
    return this.everything;
  }

  retreat(slug: string): Retreat | undefined {
    return this.sport.retreats.find((r) => r.slug === slug);
  }

  base(id: string): Base {
    return this.sport.bases.find((b) => b.id === id) ?? this.sport.bases[0];
  }

  coach(id: string): Coach | undefined {
    return this.sport.coaches.find((c) => c.id === id);
  }

  post(slug: string): JournalPost | undefined {
    return this.sport.journal.find((p) => p.slug === slug);
  }

  retreatsAt(id: string): Retreat[] {
    return this.sport.retreats.filter((r) => r.base === id);
  }

  levelName(id: string): string {
    return this.sport.planner.levels.find((l) => l.id === id)?.name ?? id;
  }
}
