import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CatalogService } from '../core/catalog.service';
import { Retreat } from '../core/models';
import { usd } from '../core/format';
import { inject } from '@angular/core';
import { CourtArtComponent } from './court-art';

@Component({
  selector: 'app-retreat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NzIconModule, CourtArtComponent],
  template: `
    @let r = retreat();
    <a class="card" [routerLink]="['/retreats', r.slug]">
      <span class="art">
        <app-court-art [seed]="r.art" [label]="r.name + ' — ' + base().name" />
        <span class="tag" [class.is-filling]="r.status === 'filling'" [class.is-wait]="r.status === 'waitlist'">
          {{ statusLabel() }}
        </span>
      </span>

      <span class="body">
        <span class="meta">
          <nz-icon nzType="environment" />{{ base().name }}
          <span class="dot"></span>{{ r.nights }} nights
          <span class="dot"></span>{{ levelLabel() }}
        </span>

        <span class="name">{{ r.name }}</span>
        <span class="headline">{{ r.headline }}</span>

        <span class="foot">
          <span class="price">
            <span class="k">From</span>
            <strong>{{ price() }}</strong>
            <span class="k">per person</span>
          </span>
          <span class="dates">{{ r.dates }}</span>
        </span>
      </span>
    </a>
  `,
  styleUrl: './retreat-card.css',
})
export class RetreatCardComponent {
  private readonly catalog = inject(CatalogService);
  readonly retreat = input.required<Retreat>();

  protected readonly base = computed(() => this.catalog.base(this.retreat().base));
  protected readonly price = computed(() => usd(this.retreat().priceFromUsd));

  protected readonly levelLabel = computed(() => {
    switch (this.retreat().level) {
      case 'newcomer': return 'New to padel';
      case 'improver': return 'Improver';
      default: return 'Competitor';
    }
  });

  protected readonly statusLabel = computed(() => {
    const r = this.retreat();
    switch (r.status) {
      case 'waitlist': return 'Waitlist';
      case 'filling': return `${r.spotsLeft} places left`;
      default: return 'Open';
    }
  });
}
