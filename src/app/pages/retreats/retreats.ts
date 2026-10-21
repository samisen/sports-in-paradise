import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../core/catalog.service';
import { PageHeroComponent } from '../../shared/page-hero';
import { RetreatCardComponent } from '../../shared/retreat-card';
import { CtaBandComponent } from '../../shared/cta-band';
import { RevealDirective } from '../../shared/reveal.directive';

type Sort = 'soonest' | 'price' | 'length';

@Component({
  selector: 'app-retreats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, FormsModule, NzButtonModule, NzIconModule, NzSelectModule,
    PageHeroComponent, RetreatCardComponent, CtaBandComponent, RevealDirective,
  ],
  templateUrl: './retreats.html',
  styleUrl: './retreats.css',
})
export class RetreatsPage {
  private readonly catalog = inject(CatalogService);

  readonly sport = this.catalog.sport;
  readonly bases = this.sport.bases;
  readonly levels = this.sport.planner.levels;

  readonly base = signal<string>('all');
  readonly level = signal<string>('all');
  readonly sort = signal<Sort>('soonest');

  readonly sortOptions: { value: Sort; label: string }[] = [
    { value: 'soonest', label: 'Soonest first' },
    { value: 'price', label: 'Lowest price' },
    { value: 'length', label: 'Longest week' },
  ];

  readonly filtered = computed(() => {
    const base = this.base();
    const level = this.level();
    const list = this.sport.retreats
      .filter((r) => (base === 'all' ? true : r.base === base))
      .filter((r) => (level === 'all' ? true : r.level === level));

    const sorted = [...list];
    switch (this.sort()) {
      case 'price':
        sorted.sort((a, b) => a.priceFromUsd - b.priceFromUsd);
        break;
      case 'length':
        sorted.sort((a, b) => b.nights - a.nights);
        break;
      default:
        // places left first, so what is nearly gone reads first
        sorted.sort((a, b) => a.spotsLeft - b.spotsLeft);
    }
    return sorted;
  });

  readonly hasFilters = computed(() => this.base() !== 'all' || this.level() !== 'all');

  reset(): void {
    this.base.set('all');
    this.level.set('all');
  }
}
