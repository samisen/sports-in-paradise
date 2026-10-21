import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { BRAND, PRICE_CLAIM, whatsappLink } from '../../core/brand';
import { usd } from '../../core/format';
import { PhotoComponent } from '../../shared/photo';
import { RetreatCardComponent } from '../../shared/retreat-card';
import { CtaBandComponent } from '../../shared/cta-band';

@Component({
  selector: 'app-retreat-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzButtonModule, NzIconModule, PhotoComponent, RetreatCardComponent, CtaBandComponent],
  templateUrl: './retreat-detail.html',
  styleUrl: './retreat-detail.css',
})
export class RetreatDetailPage {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);

  readonly brand = BRAND;
  readonly claim = PRICE_CLAIM;
  readonly sport = this.catalog.sport;
  readonly spec = this.sport.planner;
  readonly slug = input<string>('');

  readonly retreat = computed(() => {
    const found = this.catalog.retreat(this.slug());
    // an unknown slug should not leave the visitor on an empty page
    if (!found) queueMicrotask(() => void this.router.navigate(['/retreats']));
    return found;
  });

  readonly base = computed(() => {
    const r = this.retreat();
    return r ? this.catalog.base(r.base) : undefined;
  });

  readonly coach = computed(() => {
    const r = this.retreat();
    return r ? this.catalog.coach(r.coachId) : undefined;
  });

  readonly levelName = computed(() => this.catalog.levelName(this.retreat()?.level ?? ''));
  readonly intensity = computed(() => this.spec.intensities.find((i) => i.id === this.retreat()?.intensity));
  readonly stayName = computed(() => this.spec.stays.find((s) => s.id === this.retreat()?.stay)?.name ?? '');

  readonly extras = computed(() => {
    const r = this.retreat();
    return r ? this.spec.extras.filter((e) => r.extras.includes(e.id)) : [];
  });

  /** A sample week, built by the same rules the planner uses. */
  readonly sample = computed(() => {
    const r = this.retreat();
    if (!r) return [];
    return this.spec.build({
      nights: r.nights,
      guests: 2,
      level: r.level,
      intensity: r.intensity,
      stay: r.stay,
      base: r.base,
      extras: [...r.extras],
    });
  });

  readonly metric = computed(() => this.spec.metric.measure(this.sample()));

  readonly others = computed(() => this.sport.retreats.filter((r) => r.slug !== this.slug()).slice(0, 3));

  readonly whatsappHref = computed(() => {
    const r = this.retreat();
    return whatsappLink(`Hello ${BRAND.name}, I'm interested in ${r?.name ?? 'a retreat'} (${this.sport.name}, ${r?.dates ?? ''}).`);
  });

  constructor() {
    const title = inject(Title);
    effect(() => {
      const r = this.retreat();
      if (r) title.setTitle(`${r.name} — ${this.sport.name} · ${BRAND.name}`);
    });
  }

  money(v: number): string { return usd(v); }
}
