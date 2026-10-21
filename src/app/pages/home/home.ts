import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { BRAND } from '../../core/brand';
import { WEEK_STEPS } from '../../core/content/common';
import { SiteService } from '../../core/site/site.service';
import { PhotoComponent } from '../../shared/photo';
import { HeroSlidesComponent } from '../../shared/hero-slides';
import { RetreatCardComponent } from '../../shared/retreat-card';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';
import { SeasonStripComponent } from '../../shared/season-strip';
import { sportPlaces } from '../../shared/places';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, NzButtonModule, NzIconModule, PhotoComponent, HeroSlidesComponent,
    RetreatCardComponent, BaliMapComponent, CtaBandComponent, RevealDirective, SeasonStripComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  private readonly catalog = inject(CatalogService);
  readonly s = this.catalog.sport;
  readonly brand = BRAND;
  readonly steps = WEEK_STEPS;

  readonly places = sportPlaces(this.s);
  readonly mapBase = signal<string | null>(null);

  /** Three weeks on the home page: the ones closest to full read first. */
  readonly featured = [...this.s.retreats].sort((a, b) => a.spotsLeft - b.spotsLeft).slice(0, 3);

  constructor() {
    inject(SiteService).setDescription(this.s.description);
  }

  retreatsAtMapBase() {
    const id = this.mapBase();
    return id ? this.catalog.retreatsAt(id) : [];
  }
}
