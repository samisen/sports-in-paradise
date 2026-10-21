import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { PRICE_CLAIM } from '../../core/brand';
import { BELIEF_LINE, PROMISE_LINE, WEEK_STEPS } from '../../core/content/common';
import { DaySlot, Faq } from '../../core/content/types';
import { SiteService } from '../../core/site/site.service';
import { PageHeroComponent } from '../../shared/page-hero';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';
import { SportIconComponent } from '../../shared/sport-icon';
import { HUB } from '../../core/content/hub';

/** Shared by the hub and every sport; the sport sections only show on a sport site. */
@Component({
  selector: 'app-how-it-works',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzCollapseModule, NzIconModule, PageHeroComponent, CtaBandComponent, RevealDirective, SportIconComponent],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css',
})
export class HowItWorksPage {
  private readonly catalog = inject(CatalogService);
  readonly site = inject(SiteService);

  readonly steps = WEEK_STEPS;
  readonly belief = BELIEF_LINE;
  readonly promise = PROMISE_LINE;
  readonly claim = PRICE_CLAIM;
  readonly hub = HUB;

  readonly sport = this.site.isHub ? null : this.catalog.sport;
  readonly dayShape: DaySlot[] = this.sport?.dayShape ?? [];
  readonly coaches = this.sport?.coaches ?? [];
  readonly included = this.sport?.included ?? [];
  readonly notIncluded = this.sport?.notIncluded ?? [];

  /** On the hub, the first two questions from each sport, labelled. */
  readonly faqs: (Faq & { sport?: string })[] = this.sport
    ? this.sport.faqs
    : this.catalog.all.flatMap((s) => s.faqs.slice(2, 4).map((f) => ({ ...f, sport: s.name })));

  readonly sportLinks = this.catalog.all.map((s) => ({ id: s.id, name: s.name, href: this.site.url(s.id, '/how-it-works') }));

  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('');
  }
}
