import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { BRAND, SPORT_FACTS } from '../../core/brand';
import { HERO, PLAYER_PROFILES, THE_SPORT, TWO_VALUES, WEEK_STEPS } from '../../core/content';
import { BaseId } from '../../core/retreat-config';
import { CourtArtComponent } from '../../shared/court-art';
import { RetreatCardComponent } from '../../shared/retreat-card';
import { BaliMapComponent } from '../../shared/bali-map';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, NzButtonModule, NzIconModule,
    CourtArtComponent, RetreatCardComponent, BaliMapComponent, CtaBandComponent, RevealDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage {
  private readonly catalog = inject(CatalogService);

  readonly brand = BRAND;
  readonly hero = HERO;
  readonly values = TWO_VALUES;
  readonly sport = THE_SPORT;
  readonly steps = WEEK_STEPS;
  readonly profiles = PLAYER_PROFILES;
  readonly facts = SPORT_FACTS;

  readonly stats = this.catalog.stats;
  readonly testimonials = this.catalog.testimonials;

  readonly mapBase = signal<BaseId | null>(null);

  /** Four weeks on the home page: the ones closest to full read first. */
  readonly featured = [...this.catalog.retreats()].sort((a, b) => a.spotsLeft - b.spotsLeft).slice(0, 3);

  onSelectBase(id: BaseId | null): void {
    this.mapBase.set(id);
  }

  basesWithRetreats() {
    const id = this.mapBase();
    return id ? this.catalog.retreatsAt(id) : [];
  }
}
