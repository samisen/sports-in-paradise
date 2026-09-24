import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../../core/catalog.service';
import { SPORT_FACTS } from '../../core/brand';
import { WHY_BALI } from '../../core/content';
import { BaseId } from '../../core/retreat-config';
import { PageHeroComponent } from '../../shared/page-hero';
import { BaliMapComponent } from '../../shared/bali-map';
import { RetreatCardComponent } from '../../shared/retreat-card';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-why-bali',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, NzIconModule, PageHeroComponent, BaliMapComponent,
    RetreatCardComponent, CtaBandComponent, RevealDirective,
  ],
  templateUrl: './why-bali.html',
  styleUrl: './why-bali.css',
})
export class WhyBaliPage {
  private readonly catalog = inject(CatalogService);

  readonly copy = WHY_BALI;
  readonly facts = SPORT_FACTS;
  readonly bases = this.catalog.bases;
  readonly journal = this.catalog.journal.slice(0, 3);

  readonly selected = signal<BaseId | null>(null);

  onSelectBase(id: BaseId | null): void { this.selected.set(id); }

  retreatsHere() {
    const id = this.selected();
    return id ? this.catalog.retreatsAt(id) : [];
  }
}
