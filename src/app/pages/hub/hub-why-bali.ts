import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { ISLAND } from '../../core/content/island';
import { SiteService } from '../../core/site/site.service';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { PageHeroComponent } from '../../shared/page-hero';
import { PhotoComponent } from '../../shared/photo';
import { RevealDirective } from '../../shared/reveal.directive';
import { SeasonStripComponent } from '../../shared/season-strip';
import { SportIconComponent } from '../../shared/sport-icon';
import { allPlaces, seasonLines, sportCards } from './hub-data';

/** The island in full, then every sport's state on it, each linking to its own site. */
@Component({
  selector: 'app-hub-why-bali',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzIconModule, BaliMapComponent, CtaBandComponent, PageHeroComponent, PhotoComponent,
    RevealDirective, SeasonStripComponent, SportIconComponent,
  ],
  templateUrl: './hub-why-bali.html',
  styleUrl: './hub.css',
})
export class HubWhyBaliPage {
  private readonly catalog = inject(CatalogService);
  private readonly site = inject(SiteService);

  readonly island = ISLAND;
  readonly cards = sportCards(this.catalog.all, this.site);
  readonly seasons = seasonLines(this.catalog.all, this.site);
  readonly places = allPlaces(this.catalog.all, this.site);
  readonly sources = [
    ...ISLAND.sources,
    ...this.catalog.all.flatMap((s) => s.bali.sources.map((src) => ({ ...src, label: `${s.name} — ${src.label}` }))),
  ];
  readonly selected = signal<string | null>(null);
}
