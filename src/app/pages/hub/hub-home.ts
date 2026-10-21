import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { HUB } from '../../core/content/hub';
import { WEEK_STEPS } from '../../core/content/common';
import { usd } from '../../core/format';
import { SiteService } from '../../core/site/site.service';
import { SITE_LABEL } from '../../core/site/sites';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { HeroSlidesComponent } from '../../shared/hero-slides';
import { PhotoComponent } from '../../shared/photo';
import { RevealDirective } from '../../shared/reveal.directive';
import { SeasonStripComponent } from '../../shared/season-strip';
import { SportIconComponent } from '../../shared/sport-icon';
import { allPlaces, seasonLines, sportCards } from './hub-data';

@Component({
  selector: 'app-hub-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, NzButtonModule, NzIconModule, BaliMapComponent, CtaBandComponent, HeroSlidesComponent,
    PhotoComponent, RevealDirective, SeasonStripComponent, SportIconComponent,
  ],
  templateUrl: './hub-home.html',
  styleUrl: './hub.css',
})
export class HubHomePage {
  private readonly catalog = inject(CatalogService);
  private readonly site = inject(SiteService);

  readonly hub = HUB;
  readonly steps = WEEK_STEPS.slice(0, 3);
  readonly cards = sportCards(this.catalog.all, this.site);
  readonly seasons = seasonLines(this.catalog.all, this.site);
  readonly places = allPlaces(this.catalog.all, this.site);
  /** The brightest, widest frame from each sport, starting with the most Bali-looking. */
  readonly heroPhotos = ['golf', 'diving', 'hiking', 'tennis', 'padel']
    .map((id) => this.catalog.all.find((s) => s.id === id)!)
    .map((s) => s.hero.photos[0]);
  readonly voices = this.catalog.all.map((s) => ({ ...s.testimonials[0], sport: s.id, sportName: s.name }));
  readonly combos = HUB.combos.map((c) => ({ ...c, labels: c.sports.map((id) => SITE_LABEL[id]) }));

  /** The base count is counted, not typed. */
  readonly stats = HUB.stats.map((st) => (st.label.startsWith('Bases') ? { ...st, value: String(this.places.length) } : st));

  readonly selected = signal<string | null>(null);

  constructor() {
    this.site.setDescription(HUB.description);
  }

  money(v: number): string { return usd(v); }
}
