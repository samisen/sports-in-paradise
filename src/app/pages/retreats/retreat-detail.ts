import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { PRICE_CLAIM, whatsappLink, BRAND } from '../../core/brand';
import { usd } from '../../core/format';
import { EXTRAS, INTENSITIES, LEVELS, STAYS, buildSchedule } from '../../core/retreat-config';
import { CourtArtComponent } from '../../shared/court-art';
import { RetreatCardComponent } from '../../shared/retreat-card';
import { CtaBandComponent } from '../../shared/cta-band';

@Component({
  selector: 'app-retreat-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzButtonModule, NzIconModule, CourtArtComponent, RetreatCardComponent, CtaBandComponent],
  templateUrl: './retreat-detail.html',
  styleUrl: './retreat-detail.css',
})
export class RetreatDetailPage {
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);

  readonly brand = BRAND;
  readonly claim = PRICE_CLAIM;
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

  readonly levelName = computed(() => LEVELS.find((l) => l.id === this.retreat()?.level)?.name ?? '');
  readonly intensity = computed(() => INTENSITIES.find((i) => i.id === this.retreat()?.intensity));
  readonly stayName = computed(() => STAYS.find((s) => s.id === this.retreat()?.stay)?.name ?? '');

  readonly extras = computed(() => {
    const r = this.retreat();
    return r ? EXTRAS.filter((e) => r.extras.includes(e.id)) : [];
  });

  /** A sample week, built from the same rules the planner uses. */
  readonly sample = computed(() => {
    const r = this.retreat();
    if (!r) return [];
    return buildSchedule({
      nights: r.nights,
      guests: 2,
      level: r.level,
      intensity: r.intensity,
      stay: r.stay,
      base: r.base,
      extras: [...r.extras],
    });
  });

  readonly others = computed(() =>
    this.catalog.retreats().filter((r) => r.slug !== this.slug()).slice(0, 3),
  );

  readonly whatsappHref = computed(() => {
    const r = this.retreat();
    return whatsappLink(
      `Hello ${BRAND.name}, I'm interested in ${r?.name ?? 'a retreat'} (${r?.dates ?? ''}).`,
    );
  });

  money(v: number): string { return usd(v); }

  blockCount(kind: string): number {
    return this.sample().flatMap((d) => d.blocks).filter((b) => b.kind === kind).length;
  }
}
