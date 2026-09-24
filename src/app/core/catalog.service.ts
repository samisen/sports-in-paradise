import { Injectable, computed, signal } from '@angular/core';
import { BASES_INFO, COACHES, FAQS, JOURNAL, RETREATS, STATS, TESTIMONIALS } from './data';
import { Base, Coach, JournalPost, Retreat } from './models';
import { BaseId } from './retreat-config';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  readonly retreats = signal<Retreat[]>(RETREATS).asReadonly();
  readonly bases = signal<Base[]>(BASES_INFO).asReadonly();
  readonly coaches = COACHES;
  readonly faqs = FAQS;
  readonly testimonials = TESTIMONIALS;
  readonly journal = JOURNAL;
  readonly stats = STATS;

  readonly openRetreats = computed(() => this.retreats().filter((r) => r.status !== 'waitlist'));

  retreat(slug: string): Retreat | undefined {
    return this.retreats().find((r) => r.slug === slug);
  }

  base(id: BaseId): Base {
    return this.bases().find((b) => b.id === id)!;
  }

  coach(id: string): Coach {
    return this.coaches.find((c) => c.id === id)!;
  }

  post(slug: string): JournalPost | undefined {
    return this.journal.find((p) => p.slug === slug);
  }

  retreatsAt(id: BaseId): Retreat[] {
    return this.retreats().filter((r) => r.base === id);
  }
}
