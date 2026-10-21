import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { ISLAND } from '../../core/content/island';
import { SiteService } from '../../core/site/site.service';
import { SITE_LABEL, SPORT_IDS } from '../../core/site/sites';
import { PageHeroComponent } from '../../shared/page-hero';
import { BaliMapComponent } from '../../shared/bali-map';
import { RetreatCardComponent } from '../../shared/retreat-card';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';
import { SeasonStripComponent } from '../../shared/season-strip';
import { SportIconComponent } from '../../shared/sport-icon';
import { PhotoComponent } from '../../shared/photo';
import { sportPlaces } from '../../shared/places';

@Component({
  selector: 'app-why-bali',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, NzIconModule, PageHeroComponent, BaliMapComponent, RetreatCardComponent,
    CtaBandComponent, RevealDirective, SeasonStripComponent, SportIconComponent, PhotoComponent,
  ],
  templateUrl: './why-bali.html',
  styleUrl: './why-bali.css',
})
export class WhyBaliPage {
  private readonly catalog = inject(CatalogService);
  private readonly site = inject(SiteService);

  readonly s = this.catalog.sport;
  readonly b = this.s.bali;
  readonly island = ISLAND;
  readonly places = sportPlaces(this.s);
  readonly selected = signal<string | null>(null);

  readonly others = SPORT_IDS.filter((id) => id !== this.s.id).map((id) => ({
    id,
    label: SITE_LABEL[id],
    href: this.site.url(id, '/why-bali'),
  }));
  readonly hubWhy = this.site.url('hub', '/why-bali');

  retreatsHere() {
    const id = this.selected();
    return id ? this.catalog.retreatsAt(id) : [];
  }
}
